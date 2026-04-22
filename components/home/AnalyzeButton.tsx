import { performCVAnalysis } from '@/app/actions/analysis';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Settings } from 'lucide-react';

interface AnalyzeButtonProps {
  cvFile: File | null;
  cvUrl: string;
  jobTitle: string;
  jobDescription: string;
}

export default function AnalyzeButton({ cvFile, cvUrl, jobTitle, jobDescription }: AnalyzeButtonProps) {
  const router = useRouter();
  const locale = useLocale();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const handleAnalyze = async () => {
    if (!cvFile && !cvUrl) return;
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      if (cvFile) formData.append('cvFile', cvFile);
      formData.append('jobTitle', jobTitle);
      formData.append('jobDescription', jobDescription);

      const analysisId = await performCVAnalysis(formData);
      router.push(`/${locale}/results/${analysisId}`);
    } catch (error) {
      console.error("Analysis failed", error);
      setIsAnalyzing(false);
    }
  };

  const isDisabled = isAnalyzing || ((!cvFile && !cvUrl) && !jobTitle && !jobDescription);

  return (
    <button 
      onClick={handleAnalyze}
      disabled={isDisabled}
      className={`flex items-center justify-center gap-3 w-full max-w-[400px] py-4 rounded-xl text-lg font-bold shadow-lg transition-all ${
        isDisabled 
          ? 'bg-[#EFECE3] text-muted-foreground cursor-not-allowed opacity-70' 
          : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] cursor-pointer'
      }`}
    >
      <Settings size={22} className={isAnalyzing ? 'animate-spin' : ''} />
      {isAnalyzing ? 'Analyse en cours...' : 'Analyser la correspondance'}
    </button>
  );
}
