import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { analysisId, locale = "fr", templateNumber } = await req.json();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://127.0.0.1:3000";
    const successPath = templateNumber
      ? `/${locale}/templates/${analysisId}?template=${templateNumber}&payment=success`
      : `/${locale}/templates/${analysisId}?payment=success`;
    const bridgeTarget = encodeURIComponent(
      `${successPath}&session_id={CHECKOUT_SESSION_ID}`
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/${locale}/payment/bridge?target=${bridgeTarget}`,
      cancel_url: `${appUrl}/${locale}/templates/${analysisId}`,
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe subscription checkout error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
