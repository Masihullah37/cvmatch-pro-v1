"use client";

import { useState, useEffect } from "react";
import { Lock, CreditCard, Download, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface BlurOverlayProps {
  isPaid: boolean;
  analysisId: string;
}

export default function BlurOverlay({ isPaid, analysisId }: BlurOverlayProps) {
  const [countdown, setCountdown] = useState(5);
  const [showBlur, setShowBlur] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isPaid) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowBlur(true);
    }
  }, [countdown, isPaid]);

  const handlePayment = async (type: "one_time" | "subscription") => {
    // Navigate to checkout
    router.push(
      `/checkout/${type === "one_time" ? "one-time" : "subscription"}?analysisId=${analysisId}`,
    );
  };

  if (isPaid) return null;

  return (
    <>
      {/* Countdown Timer overlay during the first 5 seconds */}
      {!showBlur && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-xl font-medium animate-pulse z-40 border border-primary-foreground/20">
          Floutage dans {countdown}s...
        </div>
      )}

      {/* Blur Overlay after 5 seconds */}
      {showBlur && (
        <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-background/40">
          <div className="bg-card border border-border/50 p-8 rounded-2xl shadow-2xl max-w-xl w-full mx-4 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-primary"></div>

            <div className="text-center mb-8">
              <div className="mx-auto bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full mb-4">
                <Lock className="text-primary" size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Débloquez vos CV optimisés
              </h2>
              <p className="text-muted-foreground">
                Sélectionnez une option pour télécharger vos modèles générés par
                IA et parfaitement adaptés à l'ATS.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* One Time */}
              <button
                onClick={() => handlePayment("one_time")}
                className="flex flex-col items-center justify-center p-6 border-2 border-transparent hover:border-primary bg-muted/50 rounded-xl transition-all hover:shadow-md group"
              >
                <Download
                  className="mb-3 text-muted-foreground group-hover:text-primary transition-colors"
                  size={28}
                />
                <span className="font-bold text-lg">3.90€</span>
                <span className="text-sm font-medium">Paiement unique</span>
                <span className="text-xs text-muted-foreground mt-2 text-center">
                  Téléchargez un seul modèle au choix
                </span>
              </button>

              {/* Subscription */}
              <button
                onClick={() => handlePayment("subscription")}
                className="flex flex-col items-center justify-center p-6 border-2 border-primary bg-primary/5 rounded-xl transition-all hover:shadow-lg relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] uppercase font-bold px-2 py-0.5 rounded-bl-lg">
                  Populaire
                </div>
                <CreditCard className="mb-3 text-primary" size={28} />
                <span className="font-bold text-lg text-primary">
                  13€ / mois
                </span>
                <span className="text-sm font-medium">Abonnement pro</span>
                <span className="text-xs text-muted-foreground mt-2 text-center">
                  Accès illimité (30 CV / mois)
                </span>
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck size={14} className="text-green-500" />
              Paiement sécurisé via Stripe
            </div>
          </div>
        </div>
      )}
    </>
  );
}
