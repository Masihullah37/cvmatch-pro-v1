"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Stripe success_url lands here first so we can send ngrok-skip-browser-warning
 * before the final redirect (avoids the ngrok interstitial on free tunnels).
 */
function PaymentBridgeContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const target = searchParams.get("target");
    if (!target) {
      setError("Lien de retour invalide.");
      return;
    }

    let destination: string;
    try {
      destination = decodeURIComponent(target);
    } catch {
      setError("Lien de retour invalide.");
      return;
    }

    if (!destination.startsWith("/")) {
      setError("Lien de retour invalide.");
      return;
    }

    const fullUrl = `${window.location.origin}${destination}`;

    const goToDestination = () => window.location.replace(fullUrl);

    if (destination.includes("payment=success")) {
      fetch("/api/user/refresh-rate-limits", {
        method: "POST",
        credentials: "include",
      }).catch(() => {});
    }

    fetch(fullUrl, {
      method: "GET",
      headers: { "ngrok-skip-browser-warning": "true" },
      credentials: "include",
      redirect: "follow",
    })
      .catch(() => {
        /* still redirect — fetch is best-effort to set ngrok cookie */
      })
      .finally(goToDestination);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4 p-8">
      {error ? (
        <>
          <p className="text-red-600 font-bold">{error}</p>
          <a href="/" className="text-primary font-bold underline">
            Retour à l&apos;accueil
          </a>
        </>
      ) : (
        <>
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-700 font-bold">Paiement confirmé — redirection en cours…</p>
        </>
      )}
    </div>
  );
}

export default function PaymentBridgePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentBridgeContent />
    </Suspense>
  );
}
