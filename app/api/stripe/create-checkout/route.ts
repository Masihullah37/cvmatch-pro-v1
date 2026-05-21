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
    const { analysisId, locale = "fr", returnPath } = await req.json();
    let appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://127.0.0.1:3000").trim();
    if (returnPath) {
      try {
        const parsedReturnUrl = new URL(returnPath);
        const requestOrigin = req.headers.get("origin");
        if (
          (parsedReturnUrl.protocol === "http:" || parsedReturnUrl.protocol === "https:") &&
          requestOrigin &&
          parsedReturnUrl.origin === requestOrigin
        ) {
          appUrl = parsedReturnUrl.origin;
        }
      } catch {
        // Relative paths keep the configured app URL.
      }
    }
    const fallbackPath = `/${locale}/templates/${analysisId}`;
    const appOrigin = new URL(appUrl).origin;
    let targetPath = fallbackPath;

    if (returnPath) {
      try {
        const parsed = new URL(returnPath, appOrigin);
        if (parsed.origin === appOrigin) {
          targetPath = `${parsed.pathname}${parsed.search}${parsed.hash}`;
        }
      } catch {
        targetPath = fallbackPath;
      }
    }

    const successUrl = new URL(targetPath, appUrl);
    successUrl.searchParams.set("payment", "success");
    successUrl.searchParams.set("session_id", "{CHECKOUT_SESSION_ID}");
    const bridgeTarget = encodeURIComponent(
      `${successUrl.pathname}${successUrl.search}${successUrl.hash}`
    );

    const cancelUrl = new URL(targetPath, appUrl);
    cancelUrl.searchParams.set("payment", "canceled");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Pack 5 CV optimises",
              description: "5 credits valables 30 jours, utilises ou non.",
            },
            unit_amount: 390,
          },
          quantity: 1,
        },
      ],

      success_url: `${appUrl}/${locale}/payment/bridge?target=${bridgeTarget}`,
      cancel_url: cancelUrl.toString(),
      metadata: {
        analysisId,
        userId: userId, // No longer 'guest'
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Stripe checkout failed";
    console.error("Stripe one-time checkout error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
