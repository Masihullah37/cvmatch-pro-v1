'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { unlockOptimizedCV } from '@/app/actions/analysis';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import PaywallModal from '@/components/templates/PaywallModal';

export default function UnlockButton({ analysisId, credits }: { analysisId: string, credits: number }) {
  const [loading, setLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const router = useRouter();

  const handleUnlock = async () => {
    if (credits < 1) {
      setShowPaywall(true);
      return;
    }

    setLoading(true);
    try {
      const result = await unlockOptimizedCV(analysisId);
      if (result.success) {
        toast.success("CV Optimisés générés avec succès !");
        router.push(`/fr/templates/${analysisId}`);
      }
    } catch (e: any) {
      toast.error(e.message || "Une erreur est survenue");
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
            <Sparkles className="group-hover:rotate-12 transition-transform text-white/90" size={24} />
          )}
          Générer mes 12 CV Optimisés
        </button>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl">
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Votre Solde Actuel :</span>
           <span className="text-sm font-black text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200">{credits} Crédits</span>
        </div>
      </div>

      <PaywallModal 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)} 
        analysisId={analysisId} 
      />
    </>
  );
}


