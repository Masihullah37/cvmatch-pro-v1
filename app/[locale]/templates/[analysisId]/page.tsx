export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { cvAnalyses, cvTemplates, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getEffectiveCredits, isUserExpired } from "@/lib/utils/subscription";
import { getUserPlan } from "@/lib/billing/get-user-plan";
import { notFound } from "next/navigation";
import TemplateGrid from "@/components/templates/TemplateGrid";
import { auth } from "@clerk/nextjs/server";
import { syncUserWithClerk } from "@/lib/auth/sync";
import { Sparkles } from "lucide-react";
import { Link } from "@/i18n/routing";

import { CV_TEMPLATE_STYLES } from "@/lib/cv-template-styles";

const STYLES = [...CV_TEMPLATE_STYLES];

const DEMO_FALLBACK = {
  userName: "Votre Nom",
  jobTitle: "Votre Titre",
  summary: "Ajoutez votre profil professionnel ici.",
  contact: { email: "", phone: "", location: "" },
  experience: [{ title: "Poste", company: "Entreprise", period: "2020–2024", description: "Description de vos responsabilités." }],
  education: [{ degree: "Diplôme", school: "Établissement", year: "2020", details: "" }],
  skills: ["Compétence 1", "Compétence 2"],
  languages: [{ language: "Français", level: "Natif" }],
  projects: []
};

function getTemplateContent(analysisData: any) {
  let content = { ...(analysisData?.optimizedData || DEMO_FALLBACK) };
  if (typeof content === "string") {
    try { content = JSON.parse(content); } catch { content = DEMO_FALLBACK; }
  }
  if ((content as any)._originalCvText) delete (content as any)._originalCvText;
  return {
    ...content,
    contact: content.contact || DEMO_FALLBACK.contact,
  };
}

async function ensureTemplatesExist(analysisId: string, analysisData: any) {
  const existing = await db.query.cvTemplates.findMany({
    where: eq(cvTemplates.analysisId, analysisId),
  });

  const content = getTemplateContent(analysisData);

  if (existing.length === 0) {
    await Promise.all(
      STYLES.map((style, i) =>
        db.insert(cvTemplates).values({
          analysisId,
          templateNumber: i + 1,
          templateStyle: style,
          templateData: content as any,
          isPaid: false,
        })
      )
    );
  } else {
    const existingStyles = new Set(existing.map((t) => t.templateStyle));
    const missing = STYLES.filter((style) => !existingStyles.has(style));
    if (missing.length > 0) {
      const maxNumber = Math.max(...existing.map((t) => t.templateNumber ?? 0));
      await Promise.all(
        missing.map((style, i) =>
          db.insert(cvTemplates).values({
            analysisId,
            templateNumber: maxNumber + i + 1,
            templateStyle: style,
            templateData: content as any,
            isPaid: false,
          })
        )
      );
    }
  }

  return await db.query.cvTemplates.findMany({
    where: eq(cvTemplates.analysisId, analysisId),
  });
}

export default async function TemplatesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; analysisId: string }>;
  searchParams: Promise<{ template?: string; payment?: string }>;
}) {
  const { locale, analysisId } = await params;
  const { template: templateParam } = await searchParams;

  const { userId } = await auth();

  // Ensure user is synced with DB
  const dbUser = await syncUserWithClerk();

  const analysis = await db.query.cvAnalyses.findFirst({
    where: eq(cvAnalyses.id, analysisId),
  });
  if (!analysis) notFound();

  const userCredits = dbUser ? getEffectiveCredits(dbUser) : 0;
  const isExpired = dbUser ? isUserExpired(dbUser) : false;
  const plan = getUserPlan(dbUser);

  const analysisIsPaid = analysis.optimizedData && (
    await db.query.cvTemplates.findFirst({
      where: and(eq(cvTemplates.analysisId, analysisId), eq(cvTemplates.isPaid, true))
    })
  );

  const isPaid = !!analysisIsPaid;

  // Ensure all 12 templates exist (creates them if missing)
  const templates = await ensureTemplatesExist(analysisId, analysis);

  // If unpaid, mask the optimized content if it exists
  const safeTemplates = templates.map(t => {
    if (t.isPaid || isPaid) return t;

    // Fallback to raw data if available, else a simplified version
    const data = (analysis as any).optimizedData || DEMO_FALLBACK;
    return {
      ...t,
      templateData: data
    };
  });

  const initialTemplate = templateParam ? parseInt(templateParam, 10) : 1;

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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center gap-4">
          <Link
            href={`/results/${analysisId}`}
            locale={locale}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles size={18} className="text-primary shrink-0" />
              Vos Modèles Optimisés
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5 hidden sm:block truncate">
              {analysis.jobTitle || "CV Optimisé"} · {templates.length} modèles disponibles
            </p>
          </div>
          {!isPaid && (
            <div className="shrink-0 hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-xl text-xs font-black">
              🔒 Filigrane actif — débloquez pour télécharger
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <TemplateGrid
          templates={templates as any}
          isPaid={isPaid}
          userCredits={userCredits}
          isExpired={isExpired}
          analysisId={analysisId}
          analysisData={analysis}
          initialTemplate={initialTemplate}
          plan={plan}
        />
      </div>
    </div>
  );
}