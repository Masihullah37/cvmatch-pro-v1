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

  const template = await db.query.cvTemplates.findFirst({
    where: eq(cvTemplates.id, templateId),
  });

  if (!template) {
    notFound();
  }

  return <CVPrintView template={template as any} />;
}
