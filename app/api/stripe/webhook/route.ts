import { stripe } from '@/lib/stripe/client';
import { db } from '@/lib/db';
import { users, payments, cvTemplates } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error: any) {
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  const session = event.data.object as any;

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        if (session.mode === 'payment') {
          // Handle one-time payment success
          const analysisId = session.metadata?.analysisId;
          
          await db.insert(payments).values({
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent as string,
            amount: session.amount_total,
            paymentType: 'one_time',
            status: 'completed',
          });

          // Mark templates as paid
          if (analysisId) {
             await db.update(cvTemplates)
               .set({ isPaid: true })
               .where(eq(cvTemplates.analysisId, analysisId));
          }
        }
        break;

      case 'customer.subscription.created':
        // Handle subscription created
        const customerId = session.customer as string;
        const subscriptionId = session.id as string;
        const userId = session.metadata?.userId;

        if (userId) {
          await db.update(users).set({
            plan: 'monthly',
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            subscriptionStatus: 'active',
          }).where(eq(users.clerkId, userId));
        }
        break;

      case 'customer.subscription.deleted':
        // Handle subscription cancelled
        const delSubscriptionId = session.id as string;
        await db.update(users).set({
          plan: 'free',
          subscriptionStatus: 'cancelled',
        }).where(eq(users.stripeSubscriptionId, delSubscriptionId));
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
