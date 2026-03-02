import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

const PLAN_CREDITS: Record<string, number> = {
  PRO: 30,
  ULTRA: 999,
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Webhook signature invalid" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, plan } = session.metadata ?? {};

    if (userId && plan) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: plan as "PRO" | "ULTRA",
          credits: PLAN_CREDITS[plan] ?? 30,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
        },
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    await prisma.user.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        plan: "FREE",
        credits: 3,
        stripeSubscriptionId: null,
      },
    });
  }

  return NextResponse.json({ received: true });
}
