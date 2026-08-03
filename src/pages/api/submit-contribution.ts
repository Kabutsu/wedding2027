import type { APIRoute } from "astro";
import { supabaseAdmin } from "@/lib/supabase";

export const prerender = false;

const MIN_AMOUNT = 1;
const MAX_AMOUNT = 5000;

export const POST: APIRoute = async (context) => {
  try {
    if (!supabaseAdmin) {
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

    const { error: insertError } = await supabaseAdmin.from("contributions").insert({
      item_id: itemId,
      item_title: itemTitle,
      name,
      message,
      amount,
      currency: "gbp",
      source: "monzo",
      status: "self_reported",
    });

    if (insertError) {
      console.error("Contribution insert error:", insertError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to save contribution" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Submit contribution error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "An unexpected error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
