'use client';

import { CheckCircle2, Clock, CreditCard, X, ShieldAlert } from "lucide-react";

interface ActivePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  credits: number;
  expiryDate: string | null;
}

export default function ActivePlanModal({ isOpen, onClose, credits, expiryDate }: ActivePlanModalProps) {
  if (!isOpen) return null;

  const daysLeft = expiryDate 
    ? Math.max(0, Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] max-w-md w-full p-8 shadow-2xl relative border border-slate-100">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-all p-2 rounded-xl bg-slate-50"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 shadow-inner">
            <ShieldAlert size={40} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Plan déjà actif</h2>
            <p className="text-slate-500 font-medium">
              Vous avez déjà un pack ou un abonnement en cours d'utilisation.
            </p>
          </div>

          <div className="w-full grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center">
              <CreditCard size={20} className="text-primary mb-2" />
              <span className="text-2xl font-black text-slate-900">{credits}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Crédits restants</span>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center">
              <Clock size={20} className="text-emerald-500 mb-2" />
              <span className="text-2xl font-black text-slate-900">{daysLeft}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Jours restants</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-xs text-amber-700 font-medium leading-relaxed">
            Vous ne pouvez renouveler votre plan ou en choisir un nouveau que lorsque vos crédits sont épuisés ou que votre période de validité a expiré.
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  );
}
