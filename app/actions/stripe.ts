"use server";

import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

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
              name: "Pack 10 CV Optimisés (Paiement Unique)",
              description:
                "Débloquez vos 10 modèles de CV parfaitement adaptés pour l'offre d'emploi.",
            },
            unit_amount: 290, // 2.90 EUR
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/${locale}/templates/${analysisId}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/${locale}/templates/${analysisId}?canceled=true`,
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
      success_url: `${appUrl}/${locale}/templates/${analysisId}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/${locale}/templates/${analysisId}?canceled=true`,
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
