import { db } from "@/lib/db";
import { cvTemplates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import CVPrintView from "@/components/templates/CVPrintView";

export default async function PrintTemplatePage({
  params,
}: {
  params: Promise<{ analysisId: string; templateId: string }>;
}) {
  const { templateId } = await params;

  // IMPORTANT: If templateId is still "[templateId]", 
  // it means the page is being pre-rendered without data.
  if (!templateId || templateId.includes('[') || templateId.includes('%')) {
    return <div>Chargement...</div>;
  }

  const template = await db.query.cvTemplates.findFirst({
    where: eq(cvTemplates.id, templateId),
  });

  if (!template) return <div>Template non trouvé</div>;

  // return <CVRenderer template={template} isPaid={true} />;

  // if (!template) {
  //   notFound();
  // }

  return <CVPrintView template={template as any} />;
}
