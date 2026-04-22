import { db } from "@/lib/db";
import { cvAnalyses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ATSScoreCard from "@/components/results/ATSScoreCard";
import ScoreBreakdown from "@/components/results/ScoreBreakdown";
import FlawsList from "@/components/results/FlawsList";
import ImprovementSuggestions from "@/components/results/ImprovementSuggestions";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";

export default async function ResultsPage({ params }: { params: Promise<{ analysisId: string }> }) {
  const { analysisId } = await params;

  let analysis;
  try {
    analysis = await db.query.cvAnalyses.findFirst({
      where: eq(cvAnalyses.id, analysisId)
    });
  } catch (error) {
    notFound();
  }

  if (!analysis) {
    notFound();
  }

  if (analysis.status === 'processing') {
    // In a real app we might poll or show a loading state
    // For now, redirect to dashboard or show processing UI
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p>L'analyse de votre CV est en cours...</p>
          <p className="text-sm text-muted-foreground">Veuillez rafraîchir la page dans quelques secondes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/10">
      <Header />
      
      <main className="flex-1 container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Résultats de l'Analyse ATS</h1>
            <p className="text-muted-foreground mt-1">Découvrez comment les recruteurs voient votre CV</p>
          </div>
          <Link 
            href={`/templates/${analysisId}`}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all"
          >
            Voir mes 10 CV générés <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <ATSScoreCard score={analysis.atsScore || 0} />
            <ScoreBreakdown breakdown={analysis.scoreBreakdown} />
          </div>

          <div className="lg:col-span-2 space-y-8">
            <FlawsList flaws={analysis.flaws as string[]} />
            <ImprovementSuggestions suggestions={analysis.suggestions as string[]} />
            
            <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
               <h3 className="text-lg font-bold">Analyse des Mots-clés</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <h4 className="font-semibold text-green-600 mb-3 text-sm">Mots-clés trouvés</h4>
                   <div className="flex flex-wrap gap-2">
                     {(analysis.keywordsFound as string[])?.map((kw, i) => (
                       <span key={i} className="bg-green-500/10 text-green-700 px-2 py-1 rounded-md text-xs font-medium border border-green-500/20">{kw}</span>
                     ))}
                   </div>
                 </div>
                 <div>
                   <h4 className="font-semibold text-destructive mb-3 text-sm">Mots-clés manquants</h4>
                   <div className="flex flex-wrap gap-2">
                     {(analysis.keywordsMissing as string[])?.map((kw, i) => (
                       <span key={i} className="bg-destructive/10 text-destructive px-2 py-1 rounded-md text-xs font-medium border border-destructive/20">{kw}</span>
                     ))}
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
