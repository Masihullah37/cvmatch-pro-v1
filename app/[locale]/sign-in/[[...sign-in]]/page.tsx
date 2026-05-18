"use client";

import { SignIn, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import AnimatedBackground from "@/components/layout/AnimatedBackground";
import { Link } from "@/i18n/routing";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect } from "react";

export default function CustomSignInPage() {
  const searchParams = useSearchParams();
  const locale = useLocale();

  const redirectToParam = searchParams.get("redirectTo");

  // ✅ Same cookie setter as sign-up — survives Clerk's flow
  useEffect(() => {
    if (redirectToParam) {
      fetch("/api/set-redirect-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ redirectTo: redirectToParam }),
      });
    }
  }, [redirectToParam]);

  const redirectTo =
    typeof window !== "undefined"
      ? redirectToParam
        ? `${window.location.origin}${decodeURIComponent(redirectToParam)}`
        : `${window.location.origin}/${locale}/dashboard`
      : `/${locale}/dashboard`;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-8">
        <div className="text-center space-y-2">
          <p className="text-slate-500 font-medium">
            Connectez-vous pour débloquer votre plein potentiel
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white shadow-2xl rounded-[2.5rem] p-2 overflow-hidden min-h-[400px] flex flex-col items-center justify-center relative">
          <ClerkLoading>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/50 z-20">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                Chargement...
              </p>
            </div>
          </ClerkLoading>

          <ClerkLoaded>
            <SignIn
              forceRedirectUrl={redirectTo}
              fallbackRedirectUrl={`/${locale}/dashboard`}
              signUpUrl={
                redirectToParam
                  ? `/${locale}/sign-up?redirectTo=${redirectToParam}`
                  : `/${locale}/sign-up`
              }
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none w-full border-none p-6",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "rounded-2xl border-slate-100 hover:bg-slate-50 transition-all font-bold text-slate-600",
                  formButtonPrimary:
                    "bg-primary hover:bg-primary/90 rounded-2xl py-3 font-bold shadow-lg shadow-primary/20 transition-all",
                  formFieldInput:
                    "rounded-xl border-slate-100 bg-slate-50/50 focus:ring-primary focus:border-primary",
                  footerActionLink:
                    "text-primary font-bold hover:text-primary/80",
                  identityPreviewText: "text-slate-600",
                  formFieldLabel:
                    "text-slate-500 font-bold text-xs uppercase tracking-widest",
                },
              }}
            />
          </ClerkLoaded>
        </div>

        <p className="text-center text-xs text-slate-400 font-medium">
          En vous connectant, vous acceptez nos{" "}
          <Link href="/terms" className="underline">
            Conditions d'utilisation
          </Link>
        </p>
      </div>
    </div>
  );
}
