import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users, payments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Verify Admin status
    const [dbUser] = await db.select().from(users).where(eq(users.clerkId, clerkId));
    if (!dbUser || !dbUser.isAdmin) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const { stripePaymentIntentId } = await req.json();
    if (!stripePaymentIntentId) {
      return new NextResponse('Missing stripePaymentIntentId', { status: 400 });
    }

    // Execute Stripe Refund
    try {
      await stripe.refunds.create({
        payment_intent: stripePaymentIntentId,
      });
    } catch (stripeError: any) {
      console.error('Stripe Refund Error:', stripeError);
      return new NextResponse(stripeError.message || 'Stripe Refund Failed', { status: 400 });
    }

    // Database Transaction
    await db.transaction(async (tx) => {
      // 1. Update Payment Status
      const [payment] = await tx.update(payments)
        .set({ status: 'refunded' })
        .where(eq(payments.stripePaymentIntentId, stripePaymentIntentId))
        .returning();

      if (payment && payment.userId) {
        // 2. Reset User Plan and Credits
        await tx.update(users)
          .set({
            plan: 'free',
            credits: 0,
            updatedAt: new Date()
          })
          .where(eq(users.id, payment.userId));
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Refund API Error:', error);
    return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
  }
}
