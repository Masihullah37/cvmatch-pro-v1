import { db } from "@/lib/db";
import { cvAnalyses, cvTemplates, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import TemplateGrid from "@/components/templates/TemplateGrid";
import { auth } from "@clerk/nextjs/server";
import { Loader2 } from "lucide-react";
import LoadingPolling from "@/components/templates/LoadingPolling";
import { revalidatePath } from "next/cache";

/**
 * Background function to generate templates if they are missing
 * ONLY ONE DEFINITION ALLOWED
 */
async function generateTemplatesForAnalysis(analysisId: string): Promise<boolean> {
  const analysis = await db.query.cvAnalyses.findFirst({
    where: eq(cvAnalyses.id, analysisId),
  });

  if (!analysis || !analysis.optimizedData) {
    console.error("generateTemplates failed — data missing:", analysisId);
    return false;
  }

  const existing = await db.query.cvTemplates.findMany({
    where: eq(cvTemplates.analysisId, analysisId),
  });

  if (existing.length > 0) return true;

  let optimizedContent = analysis.optimizedData;
  if (typeof optimizedContent === 'string') {
    optimizedContent = JSON.parse(optimizedContent);
  }

  const styles = ["Galaxy", "Eclipse", "Aether", "Hyperion", "Lunar", "Stellar", "Solar", "Nebula", "Cosmos", "Astra"];

  await Promise.all(
    styles.map((style, i) =>
      db.insert(cvTemplates).values({
        analysisId: analysis.id,
        templateNumber: i + 1,
        templateStyle: style,
        templateData: {
          ...(optimizedContent as any || {}),
          contact: (optimizedContent as any)?.contact || {
            email: "contact@exemple.com",
            phone: "+33 6 00 00 00 00",
            location: "Ville, Pays",
          },
        } as any,
        isPaid: true,
      })
    )
  );

  return true;
}

export default async function TemplatesPage({
  params,
  searchParams,
}: {
  params: Promise<{ analysisId: string }>;
  searchParams: Promise<{ session_id?: string; success?: string; payment?: string }>;
}) {
  const { analysisId } = await params;
  const { success, payment, session_id } = await searchParams;
  const { userId } = await auth();

  // 1. Fetch User and Analysis from DB
  let dbUser = userId
    ? await db.query.users.findFirst({ where: eq(users.clerkId, userId) })
    : null;

  const analysis = await db.query.cvAnalyses.findFirst({
    where: eq(cvAnalyses.id, analysisId),
  });

  if (!analysis) notFound();

  // 2. Check if user is paid
  let isPaid = dbUser?.plan === "monthly" || dbUser?.plan === "one_time";

  // 3. Load templates
  let templates = await db.query.cvTemplates.findMany({
    where: eq(cvTemplates.analysisId, analysisId),
  });

  // 4. HANDLING RACE CONDITION & CREDIT DEDUCTION
  const justPaid = (success === "true" || payment === "success") && session_id;
  console.log("[PDF_GEN] Debug:", { justPaid, isPaid, userId, session_id });

  // FALLBACK: If redirected from Stripe but DB hasn't updated yet, verify session manually
  if (justPaid && !isPaid && userId) {
    try {
      console.log("[PDF_GEN] Manual sync started for session", session_id);
      const { stripe } = await import("@/lib/stripe/client");
      const session = await stripe.checkout.sessions.retrieve(session_id as string);
      console.log("[PDF_GEN] Stripe session status:", session.payment_status);

      if (session.payment_status === "paid") {
        console.log("[PDF_GEN] Manual sync: Session verified for user", userId);
        const isSub = session.mode === "subscription";
        const oneMonth = new Date();
        oneMonth.setMonth(oneMonth.getMonth() + 1);

        // Update user in DB immediately
        await db.update(users).set({
          plan: isSub ? 'monthly' : 'one_time',
          credits: (dbUser?.credits || 0) + (isSub ? 30 : 5),
          subscriptionEndsAt: oneMonth,
          creditsExpiry: oneMonth,
        }).where(eq(users.clerkId, userId));

        // Mark templates for this analysis as paid
        await db.update(cvTemplates).set({ isPaid: true }).where(eq(cvTemplates.analysisId, analysisId));

        // Re-fetch dbUser and templates to reflect changes
        dbUser = await db.query.users.findFirst({ where: eq(users.clerkId, userId) });
        templates = await db.query.cvTemplates.findMany({ where: eq(cvTemplates.analysisId, analysisId) });

        // Update local flags
        isPaid = true;
        revalidatePath('/[locale]', 'layout');
      }
    } catch (e) {
      console.error("[PDF_GEN] Manual Stripe sync failed:", e);
    }
  }

  // Use a local "paid" flag that trusts the URL redirect during the transition
  const effectiveIsPaid = isPaid || !!justPaid;

  // 4b. CREDIT DEDUCTION FOR GENERATION
  // We only deduct if it's a new payment redirect AND we haven't already marked these templates as paid
  const alreadyDeducted = templates.length > 0 && templates.every(t => t.isPaid);

  if (justPaid && effectiveIsPaid && dbUser && !alreadyDeducted) {
    const canDeduct = (dbUser.credits ?? 0) > 0;
    console.log("[PDF_GEN] Sync deduction check:", { canDeduct, credits: dbUser.credits });

    if (canDeduct) {
      const newCredits = (dbUser.credits ?? 1) - 1;
      await db.update(users)
        .set({ credits: newCredits })
        .where(eq(users.clerkId, userId));

      // Update analysis status to track that we've already deducted for this generation
      await db.update(cvAnalyses)
        .set({ status: 'completed' as any }) // We use 'completed' as a proxy if we don't have a dedicated field
        .where(eq(cvAnalyses.id, analysisId));

      dbUser.credits = newCredits;
      console.log("[PDF_GEN] Manual credit deduction success. New balance:", newCredits);
      revalidatePath('/[locale]', 'layout');
    }
  }

  // CRITICAL: If templates are missing and we have payment proof, generate them
  if (templates.length === 0 && effectiveIsPaid) {
    if (analysis.optimizedData) {
      console.log("[PDF_GEN] Generating templates for", analysisId);
      await generateTemplatesForAnalysis(analysisId);

      // Re-fetch templates to reflect changes
      templates = await db.query.cvTemplates.findMany({ where: eq(cvTemplates.analysisId, analysisId) });
    }
  }

  // Only return loading state if templates are STILL missing after generation attempt
  if (templates.length === 0 && effectiveIsPaid) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/10 p-6">
        <LoadingPolling />
        <div className="text-center space-y-6 max-w-md p-10 bg-white rounded-[2.5rem] shadow-xl border border-slate-100">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
          <h2 className="text-2xl font-black text-slate-900">Préparation de vos modèles...</h2>
          <p className="text-slate-500">L'IA finalise vos CV personnalisés. La page s'actualisera seule.</p>
        </div>
      </div>
    );
  }


  // 5. Final Render
  return (
    <div className="flex min-h-screen flex-col bg-muted/10">
      <main className="flex-1 container mx-auto py-10 px-4">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-4 text-slate-900">Vos Modèles Optimisés</h1>
        </div>
        <TemplateGrid
          templates={templates as any}
          isPaid={effectiveIsPaid}
          analysisId={analysisId}
          analysisData={analysis}
        />
      </main>
      <Footer />
    </div>
  )
}