"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { unlockOptimizedCV } from "@/app/actions/analysis";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import PaywallModal from "@/components/templates/PaywallModal";
import { useLocale } from "next-intl";

export default function UnlockButton({
  analysisId,
  credits,
  isGuest,
}: {
  analysisId: string;
  credits: number;
  isGuest: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  const handleUnlock = async () => {
    // 1. Guest → redirect to sign-in with correct return URL
    if (isGuest) {
      const redirectTo = encodeURIComponent(`/${locale}/results/${analysisId}`);
      router.push(`/${locale}/sign-in?redirectTo=${redirectTo}`);
      return;
    }

    // 2. Logged-in but no credits → open paywall
    if (credits < 1) {
      setShowPaywall(true);
      return;
    }

    // 3. Logged-in + credits → unlock
    setLoading(true);
    try {
      const result = await unlockOptimizedCV(analysisId);
      if (result.success) {
        toast.success("CV Optimisés générés avec succès !");
        router.push(`/${locale}/templates/${analysisId}`);
      }
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Une erreur est survenue";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleUnlock}
          disabled={loading}
          className="bg-primary text-primary-foreground px-10 py-6 rounded-full font-black shadow-2xl hover:shadow-primary/40 hover:scale-105 transition-all group flex items-center gap-3 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <Sparkles
              className="group-hover:rotate-12 transition-transform text-white/90"
              size={24}
            />
          )}
          Générer mes 12 CV Optimisés
        </button>
      </div>

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        analysisId={analysisId}
      />
    </>
  );
}
