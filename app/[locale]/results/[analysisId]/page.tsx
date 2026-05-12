// export const dynamic = "force-dynamic";
// export const revalidate = 0;
// import { auth } from "@clerk/nextjs/server";
// import { db } from "@/lib/db";
// import { cvAnalyses, cvTemplates, users } from "@/lib/db/schema";
// import { eq } from "drizzle-orm";
// import { notFound } from "next/navigation";
// import ATSScoreCard from "@/components/results/ATSScoreCard";
// import ScoreBreakdown from "@/components/results/ScoreBreakdown";
// import FlawsList from "@/components/results/FlawsList";
// import ImprovementSuggestions from "@/components/results/ImprovementSuggestions";
// import UnlockButton from "@/components/results/UnlockButton";
// import { Link } from "@/i18n/routing";
// import { ArrowRight, Lock } from "lucide-react";
// import PaymentSync from "@/components/results/PaymentSync";

// export default async function ResultsPage({

//   params,
//   searchParams,
// }: {
//   params: Promise<{ locale: string; analysisId: string }>;
//   searchParams: Promise<{ payment?: string }>;
// }) {
//   const { locale, analysisId } = await params;
//   const { payment } = await searchParams; // ✅ await searchParams here

//   const { userId } = await auth();
//   const isGuest = !userId;

//   const analysis = await db.query.cvAnalyses.findFirst({
//     where: eq(cvAnalyses.id, analysisId),
//   });

//   if (!analysis) notFound();

//   const dbUser = userId
//     ? await db.query.users.findFirst({
//         where: eq(users.clerkId, userId),
//       })
//     : null;

//   const userCredits = dbUser?.credits || 0;

//   const existingTemplates = await db.query.cvTemplates.findMany({
//     where: eq(cvTemplates.analysisId, analysisId),
//   });

//   const isPaid = existingTemplates.length > 0;
//   // const isTeaser = !isPaid && (isGuest || userCredits < 1);
//   const isTeaser = false; // Full results visible — paid value is CV generation

//   if (analysis.status === "processing") {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//           <p>L'analyse de votre CV est en cours...</p>
//           <p className="text-sm text-muted-foreground">
//             Veuillez rafraîchir la page dans quelques secondes.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const redirectToParam = encodeURIComponent(
//     `/${locale}/results/${analysisId}`,
//   );

//   return (
//     <div className="flex min-h-screen flex-col bg-muted/10">
//       {/* ✅ Now userId and isGuest are in scope */}
//       {payment === "success" && !isPaid && (
//         <PaymentSync analysisId={analysisId} />
//       )}
//       <main className="flex-1 container mx-auto py-10 px-4">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold">Résultats de l'Analyse ATS</h1>
//             <p className="text-muted-foreground mt-1">
//               Découvrez comment les recruteurs voient votre CV
//             </p>
//           </div>

//           {isPaid ? (
//             <Link
//               href={{ pathname: "/templates/" + analysisId }}
//               locale={locale}
//               className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all"
//             >
//               Voir mes 12 CV générés <ArrowRight size={18} />
//             </Link>
//           ) : !isGuest ? (
//             <UnlockButton
//               analysisId={analysisId}
//               credits={userCredits}
//               isGuest={isGuest}
//             />
//           ) : (
//             <Link
//               href={{
//                 pathname: "/sign-in",
//                 query: { redirectTo: redirectToParam },
//               }}
//               locale={locale}
//               className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all"
//             >
//               Se connecter pour optimiser <ArrowRight size={18} />
//             </Link>
//           )}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
//           <div className="lg:col-span-1 space-y-8">
//             <ATSScoreCard score={analysis.atsScore || 0} />
//             <ScoreBreakdown breakdown={analysis.scoreBreakdown} />
//           </div>

//           <div className="lg:col-span-2 space-y-8">
//             {/* FLAWS */}
//             <div className="relative group">
//               <FlawsList
//                 flaws={(analysis.flaws as string[]) || []}
//                 isGated={isTeaser}
//               />
//             </div>

//             {/* SUGGESTIONS */}
//             <div className="relative">
//               <ImprovementSuggestions
//                 suggestions={(analysis.suggestions as string[]) || []}
//                 isGated={isTeaser}
//               />

//               {isTeaser && (
//                 <div className="mt-4 p-8 rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center text-center gap-4">
//                   <div className="bg-white p-3 rounded-full shadow-md">
//                     <Lock className="text-primary" size={24} />
//                   </div>

//                   <div>
//                     <h4 className="font-bold text-slate-900">
//                       {isGuest
//                         ? "Analyse complète verrouillée"
//                         : "Optimisation complète verrouillée"}
//                     </h4>

//                     <p className="text-sm text-slate-500 max-w-[300px]">
//                       {isGuest
//                         ? "Connectez-vous gratuitement pour voir toutes les suggestions d'amélioration et débloquer vos 12 modèles de CV."
//                         : "Utilisez 1 crédit pour débloquer l'analyse complète des mots-clés et générer vos 12 CV professionnels optimisés."}
//                     </p>
//                   </div>

//                   {isGuest ? (
//                     <Link
//                       href={{
//                         pathname: "/sign-in",
//                         query: { redirectTo: redirectToParam },
//                       }}
//                       locale={locale}
//                       className="bg-primary text-white px-8 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20"
//                     >
//                       S'inscrire / Se connecter
//                     </Link>
//                   ) : (
//                     <UnlockButton
//                       analysisId={analysisId}
//                       credits={userCredits}
//                       isGuest={isGuest}
//                     />
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* KEYWORDS */}
//             <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
//               <h3 className="text-lg font-bold">Analyse des Mots-clés</h3>

//               <div>
//                 <h4 className="text-green-600 font-semibold mb-3 text-sm">
//                   Mots-clés trouvés
//                 </h4>
//                 <div className="flex flex-wrap gap-2">
//                   {(analysis.keywordsFound as string[])
//                     ?.slice(0, isTeaser ? 4 : undefined)
//                     .map((kw, i) => (
//                       <span
//                         key={i}
//                         className="bg-green-500/10 text-green-700 px-2 py-1 rounded-md text-xs font-medium border border-green-500/20"
//                       >
//                         {kw}
//                       </span>
//                     ))}
//                   {isTeaser &&
//                     (analysis.keywordsFound as string[])?.length > 4 && (
//                       <span className="text-muted-foreground text-xs italic ml-1">
//                         +{(analysis.keywordsFound as string[]).length - 4}{" "}
//                         autres...
//                       </span>
//                     )}
//                 </div>
//               </div>

//               <div>
//                 <h4 className="text-destructive font-semibold mb-3 text-sm">
//                   Mots-clés manquants
//                 </h4>

//                 {isTeaser ? (
//                   <div className="flex flex-wrap gap-2 blur-[4px] opacity-40 select-none">
//                     {[1, 2, 3, 4, 5].map((i) => (
//                       <span
//                         key={i}
//                         className="bg-destructive/10 text-destructive px-3 py-1 rounded-md text-xs font-medium border border-destructive/20"
//                       >
//                         Mot-clé masqué
//                       </span>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="flex flex-wrap gap-2">
//                     {(analysis.keywordsMissing as string[])?.map((kw, i) => (
//                       <span
//                         key={i}
//                         className="bg-destructive/10 text-destructive px-2 py-1 rounded-md text-xs font-medium border border-destructive/20"
//                       >
//                         {kw}
//                       </span>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }



export const dynamic = "force-dynamic";
export const revalidate = 0;
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { cvAnalyses, cvTemplates, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ATSScoreCard from "@/components/results/ATSScoreCard";
import ScoreBreakdown from "@/components/results/ScoreBreakdown";
import FlawsList from "@/components/results/FlawsList";
import ImprovementSuggestions from "@/components/results/ImprovementSuggestions";
import UnlockButton from "@/components/results/UnlockButton";
import { Link } from "@/i18n/routing";
import { ArrowRight, Sparkles, Target, TrendingUp } from "lucide-react";
import PaymentSync from "@/components/results/PaymentSync";
import CVCarousel from "@/components/home/CVCarousel";
import OuiCVLoader from "@/components/common/OuiCVLoader";

export default async function ResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; analysisId: string }>;
  searchParams: Promise<{ payment?: string }>;
}) {
  const { locale, analysisId } = await params;
  const { payment } = await searchParams;

  const { userId } = await auth();
  const isGuest = !userId;

  const analysis = await db.query.cvAnalyses.findFirst({
    where: eq(cvAnalyses.id, analysisId),
  });
  if (!analysis) notFound();

  const dbUser = userId
    ? await db.query.users.findFirst({ where: eq(users.clerkId, userId) })
    : null;

  const userCredits = dbUser?.credits || 0;

  const existingTemplates = await db.query.cvTemplates.findMany({
    where: eq(cvTemplates.analysisId, analysisId),
  });

  const isPaid = existingTemplates.some(t => t.isPaid);
  const isTeaser = false; // Full results always visible

  if (analysis.status === "processing") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-8 p-8">
          <OuiCVLoader size="lg" />
          <p className="text-slate-400 text-sm mt-4">Rafraîchissez dans quelques secondes.</p>
        </div>
      </div>
    );
  }

  const redirectToParam = encodeURIComponent(`/${locale}/results/${analysisId}`);
  const score = analysis.atsScore || 0;
  const scoreColor = score >= 70 ? 'text-emerald-500' : score >= 40 ? 'text-amber-500' : 'text-red-500';
  const scoreBg = score >= 70 ? 'bg-emerald-500/10 border-emerald-500/20' : score >= 40 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-red-500/10 border-red-500/20';

  return (
    <div className="min-h-screen bg-slate-50">
      {payment === "success" && !isPaid && <PaymentSync analysisId={analysisId} />}

      {/* Header bar */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg md:text-xl font-black text-slate-900">Résultats de l'Analyse ATS</h1>
            <p className="text-slate-400 text-xs font-medium mt-0.5 hidden sm:block">
              {analysis.jobTitle || "Analyse CV"}
            </p>
          </div>
          {isPaid ? (
            <Link
              href={{ pathname: "/templates/" + analysisId }}
              locale={locale}
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all shrink-0"
            >
              <Sparkles size={14} className="fill-white" />
              Voir mes CVs
              <ArrowRight size={14} />
            </Link>
          ) : !isGuest ? (
            <UnlockButton analysisId={analysisId} credits={userCredits} isGuest={isGuest} />
          ) : (
            <Link
              href={{ pathname: "/sign-in", query: { redirectTo: redirectToParam } }}
              locale={locale}
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all shrink-0"
            >
              Se connecter <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">

        {/* Score hero banner */}
        <div className={`rounded-3xl border p-6 md:p-8 ${scoreBg} flex flex-col md:flex-row items-center gap-6`}>
          <div className="text-center md:text-left">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Score ATS Global</p>
            <div className={`text-7xl md:text-8xl font-black ${scoreColor} leading-none`}>{score}</div>
            <div className={`text-2xl font-black ${scoreColor}`}>/ 100</div>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            {[
              { label: 'Mots-clés', icon: Target, value: `${(analysis.keywordsFound as string[])?.length || 0} trouvés` },
              { label: 'Manquants', icon: TrendingUp, value: `${(analysis.keywordsMissing as string[])?.length || 0} keywords` },
              { label: 'Suggestions', icon: Sparkles, value: `${(analysis.suggestions as string[])?.length || 0} points` },
            ].map(stat => (
              <div key={stat.label} className="bg-white/60 backdrop-blur rounded-2xl p-4 text-center border border-white/80">
                <stat.icon size={18} className="mx-auto mb-2 text-slate-400" />
                <p className="text-lg font-black text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <ATSScoreCard score={score} />
            </div>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <ScoreBreakdown breakdown={analysis.scoreBreakdown} />
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Flaws */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <FlawsList flaws={(analysis.flaws as string[]) || []} isGated={isTeaser} />
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <ImprovementSuggestions suggestions={(analysis.suggestions as string[]) || []} isGated={isTeaser} />
            </div>

            {/* Keywords */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Target size={18} className="text-primary" />
                Analyse des Mots-clés
              </h3>

              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  Mots-clés trouvés ({(analysis.keywordsFound as string[])?.length || 0})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(analysis.keywordsFound as string[])?.map((kw, i) => (
                    <span key={i} className="bg-emerald-500/10 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-500/20">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-red-500 mb-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  Mots-clés manquants ({(analysis.keywordsMissing as string[])?.length || 0})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(analysis.keywordsMissing as string[])?.map((kw, i) => (
                    <span key={i} className="bg-red-500/10 text-red-600 px-3 py-1.5 rounded-xl text-xs font-bold border border-red-500/20">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA if not paid */}
            {!isPaid && (
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 rounded-3xl p-8 text-center space-y-4">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                  <Sparkles size={28} className="text-primary" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900 mb-2">
                    Prêt à optimiser votre CV ?
                  </h4>
                  <p className="text-slate-500 text-sm max-w-md mx-auto">
                    {isGuest
                      ? "Connectez-vous gratuitement pour débloquer 5 modèles de CV optimisés pour ce poste."
                      : "Utilisez 1 crédit pour générer 5 CV professionnels optimisés pour cette offre."}
                  </p>
                </div>
                {isGuest ? (
                  <Link
                    href={{ pathname: "/sign-in", query: { redirectTo: redirectToParam } }}
                    locale={locale}
                    className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                  >
                    S'inscrire gratuitement <ArrowRight size={16} />
                  </Link>
                ) : (
                  <UnlockButton analysisId={analysisId} credits={userCredits} isGuest={isGuest} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Templates Carousel */}
      <div className="mt-20 border-t border-slate-200">
        <CVCarousel theme="light" />
      </div>
    </div>
  );
}