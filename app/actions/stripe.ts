'use server';

import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function createCheckoutSession(type: 'one-time' | 'subscription', analysisId: string, locale: string) {
  const { userId } = await auth();
  
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  let session;

  if (type === 'one-time') {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Pack 10 CV Optimisés (Paiement Unique)',
              description: 'Débloquez vos 10 modèles de CV parfaitement adaptés pour l\'offre d\'emploi.',
            },
            unit_amount: 290, // 2.90 EUR
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/${locale}/templates/${analysisId}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/${locale}/templates/${analysisId}?canceled=true`,
      metadata: {
        userId: userId || 'guest',
        analysisId,
        type: 'one-time',
      },
    });
  } else {
    // Subscription logic
    session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Abonnement CVMatch Pro',
              description: 'Accès illimité à l\'optimisation de CV (10 CV / mois).',
            },
            unit_amount: 1390, // 13.90 EUR
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${appUrl}/${locale}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/${locale}/templates/${analysisId}?canceled=true`,
      metadata: {
        userId: userId || 'guest',
        analysisId,
        type: 'subscription',
      },
    });
  }

  if (session.url) {
    return session.url;
  }
  
  throw new Error("Failed to create checkout session");
}
