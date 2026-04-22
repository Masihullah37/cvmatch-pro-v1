'use client';

import { Lock, Download, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { createCheckoutSession } from '@/app/actions/stripe';
import { useState } from 'react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisId: string;
}

export default function PaywallModal({ isOpen, onClose, analysisId }: PaywallModalProps) {
  const router = useRouter();
  const locale = useLocale();
  const [loading, setLoading] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckout = async (type: 'one-time' | 'subscription') => {
    setLoading(type);
    try {
      const checkoutUrl = await createCheckoutSession(type, analysisId, locale);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Checkout failed", error);
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
      <div className="bg-white rounded-[40px] max-w-[850px] w-full shadow-2xl relative overflow-hidden border border-white/20">
        
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-blue-500 to-primary"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>

        <div className="p-8 md:p-14 relative z-10">
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Prêt pour le téléchargement
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              Débloquez votre <span className="text-primary italic">Potentiel</span>
            </h2>
            <p className="text-gray-500 max-w-[550px] text-lg leading-relaxed">
              Vos CV optimisés par IA sont prêts. Choisissez la formule qui vous convient le mieux pour propulser votre carrière.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {/* One-time Option */}
            <div className="flex flex-col h-full rounded-[32px] border-2 border-gray-100 bg-gray-50/50 p-8 hover:border-gray-200 transition-all group relative">
               <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">Accès Unique</h3>
                    <p className="text-sm text-gray-500">Idéal pour une candidature urgente et ciblée.</p>
                  </div>
                  
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-gray-900">2,90€</span>
                    <span className="text-gray-400 text-sm font-medium">/ cv</span>
                  </div>

                  <ul className="space-y-4 pt-2">
                    {['1 Modèle au choix', 'Optimisation ATS incluse', 'Format PDF Haute Qualité', 'Support 24/7'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
               </div>

               <button 
                onClick={() => handleCheckout('one-time')}
                disabled={!!loading}
                className="w-full mt-8 py-4 px-6 rounded-2xl bg-white border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-900 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
               >
                {loading === 'one-time' ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" /> : 'Choisir cette offre'}
               </button>
            </div>

            {/* Subscription Option */}
            <div className="flex flex-col h-full rounded-[32px] border-2 border-primary bg-primary/[0.02] p-8 shadow-xl shadow-primary/5 transition-all relative group">
               <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-primary/20">
                 Le Choix des Pros
               </div>

               <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900">Abonnement Pro</h3>
                    <p className="text-sm text-gray-500">Pour ceux qui veulent le meilleur de l'IA.</p>
                  </div>
                  
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-primary">13,90€</span>
                    <span className="text-gray-400 text-sm font-medium">/ mois</span>
                  </div>

                  <ul className="space-y-4 pt-2">
                    {['Accès ILLIMITÉ', 'Tous les 10 modèles', 'Analyses ATS illimitées', 'Lettres de motivation IA', 'Annulation à tout moment'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-gray-800 font-medium">
                        <svg className="w-5 h-5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
               </div>

               <button 
                onClick={() => handleCheckout('subscription')}
                disabled={!!loading}
                className="w-full mt-8 py-4 px-6 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
               >
                {loading === 'subscription' ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : (
                  <>
                    <CreditCard size={18} />
                    S'abonner maintenant
                  </>
                )}
               </button>
            </div>
          </div>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />)}
              </div>
              <p className="text-xs text-gray-500 font-medium">+1,200 candidats ont déjà trouvé un job</p>
            </div>
            <div className="flex items-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5" />
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                SECURED
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
