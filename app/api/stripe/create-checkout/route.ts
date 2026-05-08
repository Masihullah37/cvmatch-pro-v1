import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    // Safety check: Don't allow session creation if not logged in
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { analysisId } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price: process.env.STRIPE_ONE_TIME_PRICE_ID,
          quantity: 1,
        },
      ],

      // Use the analysisId in the URL to ensure the user lands on the specific result
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://127.0.0.1:3000"}/fr/templates/${analysisId}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://127.0.0.1:3000"}/fr/templates/${analysisId}?payment=canceled`,
      metadata: {
        analysisId,
        userId: userId, // No longer 'guest'
      },
      // success_url: `${process.env.NEXT_PUBLIC_APP_URL}/fr/templates/${analysisId}?payment=success`,
      // cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/fr/templates/${analysisId}`,
      // success_url: `${process.env.NEXT_PUBLIC_APP_URL}/fr/dashboard/templates?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      // cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/fr/dashboard/templates?payment=canceled`,
      // metadata: {
      //     analysisId,
      //     userId: userId || 'guest',
      //   },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe one-time checkout error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
