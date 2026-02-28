import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getToken } from "@/lib/auth-server";
import { decodeJwt } from "jose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const PLANS = {
  starter: {
    name: "Starter",
    credits: 5,
    price: 499, // in cents
  },
  popular: {
    name: "Creator",
    credits: 12,
    price: 899,
  },
  pro: {
    name: "Pro",
    credits: 30,
    price: 1999,
  },
} as const;

type PlanId = keyof typeof PLANS;

export async function POST(request: NextRequest) {
  try {
    // Verify authentication and get userId from session token
    const token = await getToken();
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const claims = decodeJwt(token);
    const userId = claims.sub;
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    const { plan, userEmail } = await request.json();

    if (!plan) {
      return NextResponse.json(
        { error: "Missing plan" },
        { status: 400 }
      );
    }

    if (!(plan in PLANS)) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    const selectedPlan = PLANS[plan as PlanId];
    const siteUrl = process.env.SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${selectedPlan.name} — ${selectedPlan.credits} Infographic Credits`,
              description: `Generate ${selectedPlan.credits} AI-powered infographics from YouTube videos`,
            },
            unit_amount: selectedPlan.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${siteUrl}/dashboard?payment=success&plan=${plan}`,
      cancel_url: `${siteUrl}/dashboard?payment=cancelled`,
      customer_email: userEmail || undefined,
      metadata: {
        userId,
        plan,
        credits: selectedPlan.credits.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
