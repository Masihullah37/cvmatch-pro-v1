"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentSync({ analysisId }: { analysisId?: string }) {
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

      try {
        const queryParams = analysisId ? `?analysisId=${analysisId}` : '';
        const [statusRes, creditsRes] = await Promise.all([
          fetch(`/api/check-payment-status${queryParams}`, { cache: "no-store" }),
          fetch(`/api/user/credits`, { cache: "no-store" })
        ]);
        
        const statusData = await statusRes.json();
        const creditsData = await creditsRes.json();

        const hasCreditsNow = creditsData.credits > 0;
        const hasPaidPlan = creditsData.plan !== 'free';

        // Stop when any success indicator is found OR after timeout
        if (statusData.isPaid || hasCreditsNow || hasPaidPlan || attempts > 15) {
          // Hit the rate limit reset endpoint to be sure
          await fetch("/api/user/refresh-rate-limits", { method: "POST" }).catch(() => {});
          
          clearInterval(interval);
          setSyncing(false);
          
          if (attempts <= 15) {
            // Remove payment params from URL
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete("payment");
            newUrl.searchParams.delete("session_id");
            window.history.replaceState({}, "", newUrl.toString());
            
            router.refresh();
          }
        }
      } catch (e) {
        console.error("Sync error:", e);
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
