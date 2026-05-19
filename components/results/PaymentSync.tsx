"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentSync({ analysisId }: { analysisId: string }) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const isSuccess = url.searchParams.get("payment") === "success";

    if (!isSuccess) return;

    setSyncing(true);
    let attempts = 0;

    const interval = setInterval(async () => {
      attempts++;

      const res = await fetch(
        `/api/check-payment-status?analysisId=${analysisId}`,
        { cache: "no-store" }
      );
      const data = await res.json();

      // Stop when templates exist (webhook done) OR after 20s timeout
      if (data.isPaid || attempts > 10) {
        await fetch("/api/user/refresh-rate-limits", { method: "POST" }).catch(
          () => {}
        );
        clearInterval(interval);
        setSyncing(false);
        router.refresh();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [analysisId, router]);

  if (!syncing) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-white border shadow-lg rounded-xl px-5 py-3 flex items-center gap-3 z-50">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
      <p className="text-sm font-medium">Activation de votre accès en cours...</p>
    </div>
  );
}
