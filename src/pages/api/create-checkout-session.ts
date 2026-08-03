import type { APIRoute } from "astro";
import { supabaseAdmin } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";

export const prerender = false;

const MIN_AMOUNT = 1;
const MAX_AMOUNT = 5000;

export const POST: APIRoute = async (context) => {
  try {
    if (!supabaseAdmin || !stripe) {
      return new Response(
        JSON.stringify({ success: false, error: "Server not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await context.request.json();
    const itemId = body.itemId as string;
    const itemTitle = body.itemTitle as string;
    const amount = Number(body.amount);
    const name = (body.name as string | undefined)?.trim() || null;
    const message = (body.message as string | undefined)?.trim() || null;

    if (!itemId || !itemTitle) {
      return new Response(
        JSON.stringify({ success: false, error: "itemId and itemTitle are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!Number.isFinite(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
      return new Response(
        JSON.stringify({ success: false, error: "Please enter a valid amount" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data: contribution, error: insertError } = await supabaseAdmin
      .from("contributions")
      .insert({
        item_id: itemId,
        item_title: itemTitle,
        name,
        message,
        amount,
        currency: "gbp",
        source: "stripe",
        status: "pending",
      })
      .select()
      .single();

    if (insertError || !contribution) {
      console.error("Contribution insert error:", insertError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to start contribution" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const origin = context.url.origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: itemTitle,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        contributionId: contribution.id,
      },
      success_url: `${origin}/registry?success=1`,
      cancel_url: `${origin}/registry?canceled=1`,
    });

    const { error: updateError } = await supabaseAdmin
      .from("contributions")
      .update({ stripe_session_id: session.id })
      .eq("id", contribution.id);

    if (updateError) {
      console.error("Contribution update error:", updateError);
    }

    return new Response(
      JSON.stringify({ success: true, url: session.url }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Create checkout session error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "An unexpected error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
