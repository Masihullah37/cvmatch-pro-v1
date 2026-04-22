import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { analysisId } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price: process.env.STRIPE_ONE_TIME_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/fr/results/${analysisId}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/fr/templates/${analysisId}`,
      metadata: {
        analysisId,
        userId: userId || 'guest',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe one-time checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
