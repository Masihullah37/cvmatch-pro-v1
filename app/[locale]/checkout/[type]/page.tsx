// import { redirect } from 'next/navigation';

// export default async function CheckoutPage({ 
//   params, 
//   searchParams 
// }: { 
//   params: Promise<{ locale: string; type: string }>;
//   searchParams: Promise<{ analysisId: string }>;
// }) {
//   const { type, locale } = await params;
//   const { analysisId } = await searchParams;

//   // In a real app, this would integrate with Stripe Checkout
//   // For now, we simulate a successful payment and redirect back
//   console.log(`Starting ${type} checkout for analysis ${analysisId}`);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
//       <div className="bg-white p-10 rounded-[32px] shadow-xl border border-[#E5E0D4] max-w-md w-full text-center space-y-6">
//         <div className="bg-[#EFECE3] w-20 h-20 rounded-full flex items-center justify-center mx-auto">
//           <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2F583D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
//         </div>
//         <h1 className="text-2xl font-extrabold">Paiement Réussi !</h1>
//         <p className="text-muted-foreground">
//           Merci pour votre achat. Vous allez être redirigé vers vos CV optimisés.
//         </p>
//         <div className="pt-4">
//            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
//         </div>
//         <p className="text-xs text-muted-foreground pt-4">Simulation de Stripe Checkout...</p>
//       </div>
//     </div>
//   );
// }



'use client'; // Switch to client component for the simulation redirect

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import AnimatedBackground from '@/components/layout/AnimatedBackground';

export default function CheckoutPage({ params, searchParams }: any) {
  const router = useRouter();

  useEffect(() => {
    // Simulate a 3-second delay for "processing payment"
    const timer = setTimeout(() => {
      // Redirect back to the templates page for that specific analysis
      router.push(`/${params.locale}/templates/${searchParams.analysisId}?payment=success`);
    }, 3000);

    return () => clearTimeout(timer);
  }, [params, searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl border border-white max-w-md w-full text-center space-y-8 relative z-10">
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
          <div className="bg-emerald-500 w-24 h-24 rounded-full flex items-center justify-center relative shadow-xl shadow-emerald-500/20">
            <CheckCircle2 size={48} className="text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
            <Sparkles size={12} />
            Transaction Sécurisée
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Paiement Réussi !</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            Merci pour votre achat. Nous préparons vos CV optimisés par l'intelligence artificielle.
          </p>
        </div>

        <div className="pt-4 flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] animate-pulse">
            Finalisation de la transaction...
          </p>
        </div>
      </div>
    </div>
  );
}