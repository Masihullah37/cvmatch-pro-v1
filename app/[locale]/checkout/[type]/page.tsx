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
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
      <div className="bg-white p-10 rounded-[32px] shadow-xl border border-[#E5E0D4] max-w-md w-full text-center space-y-6">
        <div className="bg-[#EFECE3] w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2F583D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold">Paiement Réussi !</h1>
        <p className="text-muted-foreground">
          Merci pour votre achat. Vous allez être redirigé vers vos CV optimisés.
        </p>
        <div className="pt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
        <p className="text-xs text-muted-foreground pt-4">Finalisation de la transaction...</p>
      </div>
    </div>
  );
}