// import { db } from "@/lib/db";
// import { cvAnalyses, cvTemplates } from "@/lib/db/schema";
// import { eq } from "drizzle-orm";
// import { notFound } from "next/navigation";
// import TemplateGrid from "@/components/templates/TemplateGrid";
// import { auth } from "@clerk/nextjs/server";
// import { AlertCircle } from "lucide-react";
// import { Link } from "@/i18n/routing";

// /**
//  * Background function to generate templates if they are missing
//  */
// async function generateTemplatesForAnalysis(analysisId: string): Promise<boolean> {
//   const analysis = await db.query.cvAnalyses.findFirst({
//     where: eq(cvAnalyses.id, analysisId),
//   });

//   if (!analysis || !analysis.optimizedData) {
//     console.error("generateTemplates failed — data missing:", analysisId);
//     return false;
//   }

//   const existing = await db.query.cvTemplates.findMany({
//     where: eq(cvTemplates.analysisId, analysisId),
//   });

//   if (existing.length > 0) return true;

//   let optimizedContent = analysis.optimizedData;
//   if (typeof optimizedContent === 'string') {
//     optimizedContent = JSON.parse(optimizedContent);
//   }

//   const styles = ["Galaxy", "Eclipse", "Aether", "Hyperion", "Lunar", "Stellar", "Solar", "Nebula", "Cosmos", "Astra", "Horizon", "Europass"];

//   await Promise.all(
//     styles.map((style, i) =>
//       db.insert(cvTemplates).values({
//         analysisId: analysis.id,
//         templateNumber: i + 1,
//         templateStyle: style,
//         templateData: {
//           ...(optimizedContent as any || {}),
//           contact: (optimizedContent as any)?.contact || {
//             email: "contact@exemple.com",
//             phone: "+33 6 00 00 00 00",
//             location: "Ville, Pays",
//           },
//         } as any,
//         isPaid: true,
//       })
//     )
//   );

//   return true;
// }

// export default async function TemplatesPage({
//   params,
// }: {
//   params: Promise<{ analysisId: string }>;
// }) {
//   const { analysisId } = await params;

//   // 1. Fetch Analysis from DB
//   const analysis = await db.query.cvAnalyses.findFirst({
//     where: eq(cvAnalyses.id, analysisId),
//   });

//   if (!analysis) notFound();

//   // 2. Fetch templates
//   let templates = await db.query.cvTemplates.findMany({
//     where: eq(cvTemplates.analysisId, analysisId),
//   });

//   const isPaid = templates.length > 0 && templates.some(t => t.isPaid);

//   if (analysis.status === "processing") {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//           <p>L'analyse de votre CV est en cours...</p>
//         </div>
//       </div>
//     );
//   }

//   // 3. Authorization Check
//   if (!isPaid) {
//      return (
//        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-muted/10">
//          <div className="text-center space-y-6 max-w-md p-10 bg-white rounded-[2.5rem] shadow-xl border border-slate-100">
//            <AlertCircle className="h-16 w-16 text-primary mx-auto" />
//            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Accès restreint</h2>
//            <p className="text-slate-500 font-medium">Vous devez débloquer l'analyse pour voir et télécharger vos modèles de CV optimisés.</p>
//            <Link href={`/results/${analysisId}`} className="inline-block bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:scale-105 transition-all">
//              Retour aux résultats
//            </Link>
//          </div>
//        </div>
//      );
//   }

//   // 4. Final Render
//   return (
//     <div className="flex min-h-screen flex-col bg-muted/10">
//       <main className="flex-1 container mx-auto py-10 px-4">
//         <div className="mb-10 text-center max-w-3xl mx-auto">
//           <h1 className="text-4xl font-extrabold mb-4 text-slate-900 tracking-tight">Vos Modèles Optimisés</h1>
//           <p className="text-slate-500 font-medium">Choisissez votre style préféré et téléchargez votre CV prêt pour le recrutement.</p>
//         </div>
//         <TemplateGrid
//           templates={templates as any}
//           isPaid={isPaid}
//           analysisId={analysisId}
//           analysisData={analysis}
//         />
//       </main>
//     </div>
//   )
// }

// //2nd version//

// import { db } from "@/lib/db";
// import { cvAnalyses, cvTemplates } from "@/lib/db/schema";
// import { eq } from "drizzle-orm";
// import { notFound } from "next/navigation";
// import TemplateGrid from "@/components/templates/TemplateGrid";
// import { AlertCircle } from "lucide-react";
// import { Link } from "@/i18n/routing";

// /**
//  * Background function to generate templates if they are missing
//  */
// async function generateTemplatesForAnalysis(
//   analysisId: string,
// ): Promise<boolean> {
//   const analysis = await db.query.cvAnalyses.findFirst({
//     where: eq(cvAnalyses.id, analysisId),
//   });

//   if (!analysis || !analysis.optimizedData) {
//     console.error("generateTemplates failed — data missing:", analysisId);
//     return false;
//   }

//   const existing = await db.query.cvTemplates.findMany({
//     where: eq(cvTemplates.analysisId, analysisId),
//   });

//   if (existing.length > 0) return true;

//   let optimizedContent = analysis.optimizedData;
//   if (typeof optimizedContent === "string") {
//     optimizedContent = JSON.parse(optimizedContent);
//   }

//   const styles = [
//     "Galaxy",
//     "Eclipse",
//     "Aether",
//     "Hyperion",
//     "Lunar",
//     "Stellar",
//     "Solar",
//     "Nebula",
//     "Cosmos",
//     "Astra",
//     "Horizon",
//     "Europass",
//   ];

//   await Promise.all(
//     styles.map((style, i) =>
//       db.insert(cvTemplates).values({
//         analysisId: analysis.id,
//         templateNumber: i + 1,
//         templateStyle: style,
//         templateData: {
//           ...((optimizedContent as any) || {}),
//           contact: (optimizedContent as any)?.contact || {
//             email: "contact@exemple.com",
//             phone: "+33 6 00 00 00 00",
//             location: "Ville, Pays",
//           },
//         } as any,
//         isPaid: true,
//       }),
//     ),
//   );

//   return true;
// }

// export default async function TemplatesPage({
//   params,
// }: {
//   params: Promise<{ analysisId: string }>;
// }) {
//   const { analysisId } = await params;

//   // 1. Fetch Analysis from DB
//   const analysis = await db.query.cvAnalyses.findFirst({
//     where: eq(cvAnalyses.id, analysisId),
//   });

//   if (!analysis) notFound();

//   // 2. Generate templates if they don't exist
//   await generateTemplatesForAnalysis(analysisId);

//   // 3. Fetch templates
//   let templates = await db.query.cvTemplates.findMany({
//     where: eq(cvTemplates.analysisId, analysisId),
//   });

//   const isPaid = templates.length > 0 && templates.some((t) => t.isPaid);

//   if (analysis.status === "processing") {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//           <p>L'analyse de votre CV est en cours...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!isPaid) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-muted/10">
//         <div className="text-center space-y-6 max-w-md p-10 bg-white rounded-[2.5rem] shadow-xl border border-slate-100">
//           <AlertCircle className="h-16 w-16 text-primary mx-auto" />
//           <h2 className="text-2xl font-black text-slate-900 tracking-tight">
//             Accès restreint
//           </h2>
//           <p className="text-slate-500 font-medium">
//             Vous devez débloquer l'analyse pour voir et télécharger vos modèles
//             de CV optimisés.
//           </p>
//           <Link
//             href={`/results/${analysisId}`}
//             className="inline-block bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:scale-105 transition-all"
//           >
//             Retour aux résultats
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen flex-col bg-muted/10">
//       <main className="flex-1 container mx-auto py-10 px-4">
//         <div className="mb-10 text-center max-w-3xl mx-auto">
//           <h1 className="text-4xl font-extrabold mb-4 text-slate-900 tracking-tight">
//             Vos Modèles Optimisés
//           </h1>
//           <p className="text-slate-500 font-medium">
//             Choisissez votre style préféré et téléchargez votre CV prêt pour le
//             recrutement.
//           </p>
//         </div>
//         <TemplateGrid
//           templates={templates as any}
//           isPaid={isPaid}
//           analysisId={analysisId}
//           analysisData={analysis}
//         />
//       </main>
//     </div>
//   );
// }



import { db } from "@/lib/db";
import { cvAnalyses, cvTemplates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import TemplateGrid from "@/components/templates/TemplateGrid";
import { auth } from "@clerk/nextjs/server";
import { AlertCircle, Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";

export default async function TemplatesPage({
  params,
}: {
  params: Promise<{ locale: string; analysisId: string }>;
}) {
  const { locale, analysisId } = await params;

  const analysis = await db.query.cvAnalyses.findFirst({
    where: eq(cvAnalyses.id, analysisId),
  });
  if (!analysis) notFound();

  let templates = await db.query.cvTemplates.findMany({
    where: eq(cvTemplates.analysisId, analysisId),
  });

  const isPaid = templates.length > 0 && templates.some(t => t.isPaid);

  if (analysis.status === "processing") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4 p-8">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-slate-700 font-bold text-lg">Analyse en cours...</p>
        </div>
      </div>
    );
  }

  if (!isPaid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
        <div className="text-center space-y-6 max-w-sm w-full bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="text-red-500" size={32} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Accès restreint</h2>
            <p className="text-slate-400 text-sm">Débloquez l'analyse pour voir et télécharger vos modèles de CV optimisés.</p>
          </div>
          <Link
            href={`/results/${analysisId}`}
            locale={locale}
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            Retour aux résultats
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center gap-4">
          <Link
            href={`/results/${analysisId}`}
            locale={locale}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <ArrowLeft size={16} className="text-slate-600" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              Vos Modèles Optimisés
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5 hidden sm:block">
              {analysis.jobTitle || "CV Optimisé"} · {templates.length} modèles disponibles
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <TemplateGrid
          templates={templates as any}
          isPaid={isPaid}
          analysisId={analysisId}
          analysisData={analysis}
        />
      </div>
    </div>
  );
}