"use server";

import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function createCheckoutSession(
  type: "one-time" | "subscription",
  analysisId: string,
  locale: string,
) {
  const { userId } = await auth();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://127.0.0.1:3000";

  let session;

  if (type === "one-time") {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Pack 5 CV Optimisés (Paiement Unique)",
              description:
                "Débloquez vos 12 modèles de CV parfaitement adaptés pour l'offre d'emploi.",
            },
            unit_amount: 290, // 2.90 EUR
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/${locale}/results/${analysisId}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/${locale}/results/${analysisId}?canceled=true`,
      metadata: {
        userId: userId || "guest",
        analysisId,
        type: "one-time",
      },
    });
  } else {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${appUrl}/${locale}/results/${analysisId}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/${locale}/results/${analysisId}?canceled=true`,
      metadata: {
        userId: userId || "guest",
        analysisId,
        type: "subscription",
      },
    });
  }

  if (session.url) {
    return session.url;
  }

  throw new Error("Failed to create checkout session");
}

export async function cancelMonthlySubscription(): Promise<{
  success: boolean;
  message: string;
}> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  if (!dbUser?.stripeSubscriptionId) {
    throw new Error("Aucun abonnement actif à annuler.");
  }

  const subscription = await stripe.subscriptions.update(
    dbUser.stripeSubscriptionId,
    {
      cancel_at_period_end: true,
    },
  );

  const periodEnd = new Date(subscription.current_period_end * 1000);
  await db
    .update(users)
    .set({
      subscriptionStatus: "canceled",
      subscriptionEndsAt: periodEnd,
      creditsExpiry: periodEnd,
    })
    .where(eq(users.id, dbUser.id));

  return {
    success: true,
    message:
      "Votre abonnement a été annulé.\nIl restera actif jusqu’à la fin de la période en cours.\nAucun renouvellement ne sera effectué.",
  };
}
