'use client';

import { performCVAnalysis } from '@/app/actions/analysis';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Sparkles, AlertCircle, X } from 'lucide-react';
import OuiCVLoader from '@/components/common/OuiCVLoader';

interface AnalyzeButtonProps {
  cvFile: File | null;
  cvUrl: string;
  jobTitle: string;
  jobDescription: string;
  profileDescription?: string;
}

export default function AnalyzeButton({ 
  cvFile, 
  cvUrl, 
  jobTitle, 
  jobDescription,
  profileDescription 
}: AnalyzeButtonProps) {
  const router = useRouter();
  const locale = useLocale();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-clear error after 8 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleAnalyze = async () => {
    setError(null);
    
    // Validation: We need either a CV file or a Profile Description
    if (!cvFile && !cvUrl && (!profileDescription || profileDescription.trim().length < 50)) {
      setError("Veuillez importer un CV ou décrire votre profil avec plus de détails (min. 50 caractères).");
      return;
    }

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      if (cvFile) formData.append('cvFile', cvFile);
      if (cvUrl) formData.append('cvUrl', cvUrl);
      if (profileDescription) formData.append('profileDescription', profileDescription);
      
      formData.append('jobTitle', jobTitle);
      formData.append('jobDescription', jobDescription);

      const analysisId = await performCVAnalysis(formData);
      router.push(`/${locale}/results/${analysisId}`);
    } catch (err: any) {
      console.error("Analysis failed", err);
      setError(err.message || "Une erreur inattendue est survenue. Veuillez réessayer.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 relative">
      {/* Beautiful Error UI */}
      {error && (
        <div className="absolute -top-32 w-full max-w-[500px] animate-in fade-in slide-in-from-bottom-4 duration-500 z-50">
          <div className="bg-red-50 border-2 border-red-100 p-5 rounded-[2rem] shadow-2xl shadow-red-200/50 flex items-start gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <button onClick={() => setError(null)} className="p-2 hover:bg-red-100 rounded-full text-red-400 transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-3 bg-red-100 rounded-2xl text-red-500 shrink-0">
              <AlertCircle size={24} />
            </div>
            <div className="space-y-1 pr-6">
              <p className="font-black text-red-900 text-sm tracking-tight uppercase">Oups ! Action requise</p>
              <p className="text-red-700/80 text-sm font-medium leading-relaxed">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={handleAnalyze}
        disabled={isAnalyzing}
        className={`group flex items-center justify-center gap-4 w-full max-w-[500px] py-6 rounded-[2.5rem] text-xl font-black shadow-2xl transition-all ${
          isAnalyzing 
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed scale-[0.98]' 
            : 'bg-primary text-white hover:bg-emerald-600 hover:scale-[1.03] hover:shadow-emerald-500/30 active:scale-95 transition-all duration-200 shadow-emerald-500/20'
        }`}
      >
        {isAnalyzing ? (
          <OuiCVLoader size="lg" />
        ) : (
          <Sparkles size={24} className="group-hover:animate-pulse" />
        )}
        {isAnalyzing ? '' : 'Optimiser mon CV maintenant'}
      </button>
      
      {isAnalyzing && (
        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] animate-pulse">
          Analyse ATS et optimisation sémantique en cours
        </p>
      )}
    </div>
  );
}
