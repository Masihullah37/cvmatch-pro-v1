'use client';

import { performCVAnalysis } from '@/app/actions/analysis';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Sparkles, Loader2 } from 'lucide-react';

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

  const handleAnalyze = async () => {
    // Validation: We need either a CV file or a Profile Description
    if (!cvFile && !cvUrl && (!profileDescription || profileDescription.trim().length < 50)) {
      alert("Veuillez importer un CV ou décrire votre profil (min. 50 caractères).");
      return;
    }
    if (!jobTitle || !jobDescription) {
      alert("Veuillez renseigner l'intitulé et la description du poste.");
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
    } catch (error) {
      console.error("Analysis failed", error);
      alert("Une erreur est survenue lors de l'analyse.");
      setIsAnalyzing(false);
    }
  };

  const isDisabled = isAnalyzing;

  return (
    <button 
      onClick={handleAnalyze}
      disabled={isDisabled}
      className={`group flex items-center justify-center gap-4 w-full max-w-[500px] py-6 rounded-[2rem] text-xl font-black shadow-2xl transition-all ${
        isDisabled 
          ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
          : 'bg-primary text-white hover:bg-primary/90 hover:scale-[1.03] hover:shadow-primary/30 active:scale-95'
      }`}
    >
      {isAnalyzing ? (
        <Loader2 size={24} className="animate-spin" />
      ) : (
        <Sparkles size={24} className="group-hover:animate-pulse" />
      )}
      {isAnalyzing ? 'Analyse par IA en cours...' : 'Générer mon CV Optimisé'}
    </button>
  );
}
