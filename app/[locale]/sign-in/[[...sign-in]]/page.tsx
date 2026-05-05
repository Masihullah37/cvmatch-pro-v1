// 'use client';

// import { SignIn } from "@clerk/nextjs";
// import AnimatedBackground from "@/components/layout/AnimatedBackground";
// import { Link } from "@/i18n/routing";
// import { ArrowLeft, Sparkles } from "lucide-react";

// export default function CustomSignInPage() {
//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
//       <AnimatedBackground />

//       {/* Decorative Aura */}
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

//       <div className="w-full max-w-md relative z-10 space-y-8">
//         <div className="text-center space-y-2">
//           <Link 
//             href="/" 
//             className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-sm font-bold mb-8 group"
//           >
//             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
//             Retour à l'accueil
//           </Link>

//           <div className="flex items-center justify-center gap-3 mb-4">
//             <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
//                <Sparkles className="text-white" size={24} />
//             </div>
//             <h1 className="text-3xl font-black text-slate-900 tracking-tight">CVMatch <span className="text-primary text-xl">PRO</span></h1>
//           </div>
//           <p className="text-slate-500 font-medium">Connectez-vous pour débloquer votre plein potentiel</p>
//         </div>

//         <div className="bg-white/70 backdrop-blur-xl border border-white shadow-2xl rounded-[2.5rem] p-2 overflow-hidden">
//           <SignIn 
//             appearance={{
//               elements: {
//                 rootBox: "w-full",
//                 card: "bg-transparent shadow-none w-full border-none p-6",
//                 headerTitle: "hidden",
//                 headerSubtitle: "hidden",
//                 socialButtonsBlockButton: "rounded-2xl border-slate-100 hover:bg-slate-50 transition-all font-bold text-slate-600",
//                 formButtonPrimary: "bg-primary hover:bg-primary/90 rounded-2xl py-3 font-bold shadow-lg shadow-primary/20 transition-all",
//                 formFieldInput: "rounded-xl border-slate-100 bg-slate-50/50 focus:ring-primary focus:border-primary",
//                 footerActionLink: "text-primary font-bold hover:text-primary/80",
//                 identityPreviewText: "text-slate-600",
//                 formFieldLabel: "text-slate-500 font-bold text-xs uppercase tracking-widest"
//               }
//             }}
//             signUpUrl="/fr/sign-up"
//           />
//         </div>

//         <p className="text-center text-xs text-slate-400 font-medium">
//           En vous connectant, vous acceptez nos <Link href="/terms" className="underline">Conditions d'utilisation</Link>
//         </p>
//       </div>
//     </div>
//   );
// }



'use client';

import { SignIn, ClerkLoading, ClerkLoaded } from "@clerk/nextjs"; // Add these imports
import AnimatedBackground from "@/components/layout/AnimatedBackground";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";

export default function CustomSignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-8">
        <div className="text-center space-y-2">
          {/* ... existing Link and logo code ... */}
          <p className="text-slate-500 font-medium">Connectez-vous pour débloquer votre plein potentiel</p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white shadow-2xl rounded-[2.5rem] p-2 overflow-hidden min-h-[400px] flex items-center justify-center">

          {/* 1. Show this while Clerk is initializing */}
          <ClerkLoading>
            <div className="flex flex-col items-center gap-3 py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
              <p className="text-sm font-bold text-slate-400">Sécurisation de la connexion...</p>
            </div>
          </ClerkLoading>

          {/* 2. Only show the card when it's fully ready */}
          <ClerkLoaded>
            <SignIn
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-transparent shadow-none w-full border-none p-6",
                  // ... your other appearance settings ...
                  headerTitle: "hidden",

                  headerSubtitle: "hidden",

                  socialButtonsBlockButton: "rounded-2xl border-slate-100 hover:bg-slate-50 transition-all font-bold text-slate-600",

                  formButtonPrimary: "bg-primary hover:bg-primary/90 rounded-2xl py-3 font-bold shadow-lg shadow-primary/20 transition-all",

                  formFieldInput: "rounded-xl border-slate-100 bg-slate-50/50 focus:ring-primary focus:border-primary",

                  footerActionLink: "text-primary font-bold hover:text-primary/80",

                  identityPreviewText: "text-slate-600",

                  formFieldLabel: "text-slate-500 font-bold text-xs uppercase tracking-widest"
                }
              }}
              signUpUrl="/fr/sign-up"
            />
          </ClerkLoaded>
        </div>

        <p className="text-center text-xs text-slate-400 font-medium">
          En vous connectant, vous acceptez nos <Link href="/terms" className="underline">Conditions d'utilisation</Link>
        </p>
      </div>
    </div>
  );
}
