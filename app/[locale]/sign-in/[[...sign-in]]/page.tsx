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

  const redirectToParam =
    searchParams.get("redirectTo") || searchParams.get("redirect_url");
  const getSafeRedirectPath = () => {
    if (typeof window === "undefined" || !redirectToParam) return null;

    try {
      const decoded = decodeURIComponent(redirectToParam);
      const parsed = new URL(decoded, window.location.origin);
      if (parsed.origin !== window.location.origin) return null;
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
      return null;
    }
  };
  const safeRedirectPath = getSafeRedirectPath();
  const encodedSafeRedirectPath = safeRedirectPath
    ? encodeURIComponent(safeRedirectPath)
    : null;

  // ✅ Same cookie setter as sign-up — survives Clerk's flow
  useEffect(() => {
    if (encodedSafeRedirectPath) {
      fetch("/api/set-redirect-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ redirectTo: encodedSafeRedirectPath }),
      });
    }
  }, [encodedSafeRedirectPath]);

  const redirectTo =
    typeof window !== "undefined"
      ? safeRedirectPath
        ? `${window.location.origin}${safeRedirectPath}`
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
                encodedSafeRedirectPath
                  ? `/${locale}/sign-up?redirectTo=${encodedSafeRedirectPath}`
                  : `/${locale}/sign-up`
              }
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none w-full border-none p-6",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "rounded-2xl border-slate-100 hover:bg-slate-50 transition-all font-bold text-slate-600 h-12",
                  formButtonPrimary:
                    "bg-slate-900 hover:bg-slate-800 rounded-2xl py-4 font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-200 transition-all",
                  formFieldInput:
                    "rounded-2xl border-slate-100 bg-slate-50/50 focus:ring-primary focus:border-primary h-12 px-4 font-medium",
                  footerActionLink:
                    "text-primary font-bold hover:text-primary/80",
                  identityPreviewText: "text-slate-600 font-bold",
                  formFieldLabel:
                    "text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-1.5",
                  dividerLine: "bg-slate-100",
                  dividerText: "text-slate-300 font-bold text-[10px] uppercase",
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
