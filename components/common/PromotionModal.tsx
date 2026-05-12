'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Gift, Zap, ArrowRight, Clock } from 'lucide-react';
import { Link } from '@/i18n/routing';

interface PromotionModalProps {
  offer: {
    discount: number;
    description: string;
    expiresAt?: string;
  } | null;
}

export default function PromotionModal({ offer }: PromotionModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!offer) return;
    
    const hasSeen = localStorage.getItem(`offer-seen-${offer.discount}`);
    if (!hasSeen) {
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [offer]);

  const close = () => {
    if (offer) {
      localStorage.setItem(`offer-seen-${offer.discount}`, 'true');
    }
    setShow(false);
  };

  if (!offer || !show) return null;

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_32px_80px_rgba(0,0,0,0.15)] overflow-hidden"
          >
            {/* Design elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <button 
              onClick={close}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors z-20"
            >
              <X size={20} />
            </button>

            <div className="relative p-10 flex flex-col items-center text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-8"
              >
                <Gift className="text-white" size={40} />
              </motion.div>

              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                <Sparkles size={12} />
                Offre Exceptionnelle
              </div>

              <h2 className="text-4xl font-bold text-slate-950 leading-tight mb-4">
                Profitez de <span className="text-emerald-500">-{offer.discount}%</span> sur tous nos plans !
              </h2>

              <p className="text-slate-500 font-medium text-lg mb-10 max-w-sm">
                {offer.description || "Boostez votre carrière dès aujourd'hui avec nos analyses IA de haute précision."}
              </p>

              <div className="w-full space-y-4">
                <Link
                  href="/#pricing"
                  onClick={close}
                  className="w-full bg-emerald-600 text-white px-10 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-2xl shadow-emerald-500/30 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  Débloquer maintenant
                  <ArrowRight size={18} />
                </Link>
                
                {offer.expiresAt && (
                  <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <Clock size={14} />
                    Expire bientôt
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Accent */}
            <div className="h-2 bg-gradient-to-r from-emerald-500 to-blue-500" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
