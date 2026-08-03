import type { APIRoute } from "astro";
import { supabaseAdmin } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;

  if (!supabaseAdmin || !stripe || !webhookSecret) {
    return new Response("Server not configured", { status: 500 });
  }

  const signature = context.request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const payload = await context.request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const contributionId = session.metadata?.contributionId;

    if (contributionId) {
      const { error } = await supabaseAdmin
        .from("contributions")
        .update({ status: "confirmed" })
        .eq("id", contributionId);

      if (error) {
        console.error("Failed to confirm contribution:", error);
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
