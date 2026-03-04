import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const PLANS: Record<string, number> = {
  starter: 5,
  popular: 12,
  pro: 30,
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;
    const creditsStr = session.metadata?.credits;

    if (!userId || !plan || !creditsStr) {
      console.error("Missing metadata in checkout session:", session.id);
      return NextResponse.json({ received: true });
    }

    const credits = parseInt(creditsStr, 10);
    const amountPaid = session.amount_total ?? 0;

    try {
      await convex.action(api.credits.addCreditsFromWebhook, {
        webhookSecret: process.env.WEBHOOK_SECRET!,
        userId,
        amount: credits,
        stripeSessionId: session.id,
        plan,
        amountPaid: amountPaid / 100, // Convert from cents to dollars
      });

      console.log(
        `Credits added: ${credits} for user ${userId} (plan: ${plan})`,
      );
    } catch (err) {
      console.error("Failed to add credits:", err);
      return NextResponse.json(
        { error: "Failed to process credit addition" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true });
}
