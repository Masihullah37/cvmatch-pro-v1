export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { stripe } from "@/lib/stripe/client";
import { db } from "@/lib/db";
import { users, payments, cvTemplates, cvAnalyses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 },
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error("❌ Stripe signature verification failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const session = event.data.object as any;
  const paymentIntentId = session.payment_intent as string | null;
  const sessionId = session.id as string;

  try {
    console.log(`🔔 Stripe Webhook Received: ${event.type}`);

    const existingPayment = paymentIntentId
      ? await db.query.payments.findFirst({
          where: eq(payments.stripePaymentIntentId, paymentIntentId),
        })
      : await db.query.payments.findFirst({
          where: eq(payments.stripeSessionId, sessionId),
        });

    if (existingPayment) {
      console.log(`Skipping duplicate Stripe event for session ${sessionId}`);
      return NextResponse.json({ received: true });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const userId = session.metadata?.userId;
        const analysisId = session.metadata?.analysisId;

        console.log(
          `📦 Checkout completed. Mode: ${session.mode}, UserId: ${userId}, AnalysisId: ${analysisId}`,
        );

        const now = new Date();
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

        if (session.mode === "payment") {
          // One-time payment
          await db.insert(payments).values({
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent as string,
            amount: session.amount_total,
            paymentType: "one_time",
            status: "completed",
          });

          if (analysisId) {
            // Mark templates as paid
            await db
              .update(cvTemplates)
              .set({ isPaid: true })
              .where(eq(cvTemplates.analysisId, analysisId));

            // Link analysis to user if they are logged in
            if (userId && userId !== "guest") {
              const userRec = await db.query.users.findFirst({
                where: eq(users.clerkId, userId),
              });
              if (userRec) {
                await db
                  .update(cvAnalyses)
                  .set({ userId: userRec.id })
                  .where(eq(cvAnalyses.id, analysisId));
              }
            }
          }

          if (userId && userId !== "guest") {
            const userRecord = await db.query.users.findFirst({
              where: eq(users.clerkId, userId),
            });

            if (userRecord) {
              await db
                .update(users)
                .set({
                  plan: "one_time",
                  credits: (userRecord.credits || 0) + 5,
                  subscriptionEndsAt: sixMonthsFromNow,
                  creditsExpiry: sixMonthsFromNow, // 6 months for one-time
                })
                .where(eq(users.clerkId, userId));
            } else {
              await db.insert(users).values({
                clerkId: userId,
                email: session.customer_details?.email,
                name: session.customer_details?.name,
                plan: "one_time",
                credits: 5,
                subscriptionEndsAt: sixMonthsFromNow,
                creditsExpiry: sixMonthsFromNow,
              });
            }
          }
        } else if (session.mode === "subscription") {
          // Subscription
          const customerId = session.customer as string;
          const subscriptionId = session.subscription as string;

          if (userId && userId !== "guest") {
            const userRecord = await db.query.users.findFirst({
              where: eq(users.clerkId, userId),
            });

            if (userRecord) {
              await db
                .update(users)
                .set({
                  plan: "monthly",
                  credits: (userRecord?.credits || 0) + 30,
                  stripeCustomerId: customerId,
                  stripeSubscriptionId: subscriptionId,
                  subscriptionStatus: "active",
                  subscriptionEndsAt: oneMonthFromNow,
                  creditsExpiry: oneMonthFromNow, // 1 month for subscriptions
                })
                .where(eq(users.clerkId, userId));
            } else {
              await db.insert(users).values({
                clerkId: userId,
                email: session.customer_details?.email,
                name: session.customer_details?.name,
                plan: "monthly",
                credits: 30,
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
                subscriptionStatus: "active",
                subscriptionEndsAt: oneMonthFromNow,
                creditsExpiry: oneMonthFromNow,
              });
            }
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscriptionId = session.id as string;
        console.log(`❌ Subscription deleted: ${subscriptionId}`);

        await db
          .update(users)
          .set({
            plan: "free",
            subscriptionStatus: "cancelled",
          })
          .where(eq(users.stripeSubscriptionId, subscriptionId));

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("❌ Webhook handler error:", error.message);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}
