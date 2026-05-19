export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { stripe } from "@/lib/stripe/client";
import { db } from "@/lib/db";
import { users, payments, cvTemplates, cvAnalyses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { resetAnalysisRateLimitsForUser } from "@/lib/rate-limit/reset-user-limits";

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

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error("❌ Signature verification failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  try {
    console.log(`🔔 Webhook Received: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const paymentIntentId = session.payment_intent as string | null;
        const sessionId = session.id;

        const existingPayment = paymentIntentId
          ? await db.query.payments.findFirst({
            where: eq(payments.stripePaymentIntentId, paymentIntentId),
          })
          : await db.query.payments.findFirst({
            where: eq(payments.stripeSessionId, sessionId),
          });

        if (existingPayment) {
          console.log(`Skipping duplicate event for ${sessionId}`);
          return NextResponse.json({ received: true });
        }

        const userId = session.metadata?.userId;
        const analysisId = session.metadata?.analysisId;

        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        if (session.mode === "payment") {
          await db.insert(payments).values({
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent as string,
            amount: session.amount_total,
            paymentType: "one_time",
            status: "completed",
          });

          if (analysisId) {
            await db
              .update(cvTemplates)
              .set({ isPaid: true })
              .where(eq(cvTemplates.analysisId, analysisId));

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
                  subscriptionEndsAt: thirtyDaysFromNow,
                  creditsExpiry: thirtyDaysFromNow,
                })
                .where(eq(users.clerkId, userId));
            } else {
              await db.insert(users).values({
                clerkId: userId,
                email: session.customer_details?.email ?? undefined,
                name: session.customer_details?.name ?? undefined,
                plan: "one_time",
                credits: 5,
                subscriptionEndsAt: thirtyDaysFromNow,
                creditsExpiry: thirtyDaysFromNow,
              });
            }
            await resetAnalysisRateLimitsForUser(userId);
          }
        }

        if (session.mode === "subscription") {
          const customerId = session.customer as string;
          const subscriptionId = session.subscription as string;

          // FORCE CAST — Stripe future API returns weird types
          const subscription = (await stripe.subscriptions.retrieve(
            subscriptionId,
          )) as any;

          const periodEnd = new Date(subscription.current_period_end * 1000);

          if (userId && userId !== "guest") {
            const userRecord = await db.query.users.findFirst({
              where: eq(users.clerkId, userId),
            });

            if (userRecord) {
              await db
                .update(users)
                .set({
                  plan: "monthly",
                  credits: 30,
                  stripeCustomerId: customerId,
                  stripeSubscriptionId: subscriptionId,
                  subscriptionStatus: "active",
                  subscriptionEndsAt: periodEnd,
                  creditsExpiry: periodEnd,
                })
                .where(eq(users.clerkId, userId));
            } else {
              await db.insert(users).values({
                clerkId: userId,
                email:
                  session.customer_details?.email ??
                  session.customer_email ??
                  undefined,
                name:
                  session.customer_details?.name ??
                  session.customer_details?.email?.split("@")[0] ??
                  "User",
                plan: "monthly",
                credits: 30,
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
                subscriptionStatus: "active",
                subscriptionEndsAt: periodEnd,
                creditsExpiry: periodEnd,
              });
            }
            await resetAnalysisRateLimitsForUser(userId);
          }
        }

        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription as string | null;
        if (!subscriptionId) break;

        const billingReason = invoice.billing_reason;
        if (billingReason !== "subscription_cycle") break;

        const subscription = (await stripe.subscriptions.retrieve(
          subscriptionId,
        )) as any;

        const periodEnd = new Date(subscription.current_period_end * 1000);

        const [renewedUser] = await db
          .update(users)
          .set({
            plan: "monthly",
            credits: 30,
            subscriptionStatus: "active",
            subscriptionEndsAt: periodEnd,
            creditsExpiry: periodEnd,
          })
          .where(eq(users.stripeSubscriptionId, subscriptionId))
          .returning({ clerkId: users.clerkId });

        if (renewedUser?.clerkId) {
          await resetAnalysisRateLimitsForUser(renewedUser.clerkId);
        }

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        const subscriptionId = subscription.id;

        const periodEnd = new Date(subscription.current_period_end * 1000);

        const status =
          subscription.cancel_at_period_end ||
            subscription.status === "canceled"
            ? "canceled"
            : subscription.status === "past_due"
              ? "past_due"
              : "active";

        await db
          .update(users)
          .set({
            subscriptionStatus: status,
            subscriptionEndsAt: periodEnd,
            creditsExpiry: periodEnd,
          })
          .where(eq(users.stripeSubscriptionId, subscriptionId));

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        const subscriptionId = subscription.id;

        await db
          .update(users)
          .set({
            plan: "free",
            credits: 0,
            subscriptionStatus: "canceled",
            subscriptionEndsAt: new Date(),
            creditsExpiry: new Date(),
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
