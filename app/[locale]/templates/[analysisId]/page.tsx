import { db } from "@/lib/db";
import { cvAnalyses, cvTemplates, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TemplateGrid from "@/components/templates/TemplateGrid";
import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe/client";
import { revalidatePath } from "next/cache";

export default async function TemplatesPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ analysisId: string }>,
  searchParams: Promise<{ session_id?: string, success?: string }>
}) {
  const { analysisId } = await params;
  const { session_id, success } = await searchParams;
  const { userId } = await auth();

  // If we have a session_id and success flag, verify with Stripe directly
  // This helps when webhooks are slow or failing
  let sessionVerified = false;
  if (success === 'true' && session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status === 'paid') {
        sessionVerified = true;
        
        // If it's a one-time payment for this analysis, update DB immediately
        if (session.metadata?.analysisId === analysisId) {
          await db.update(cvTemplates)
            .set({ isPaid: true })
            .where(eq(cvTemplates.analysisId, analysisId));
        }
      }
    } catch (e) {
      console.error("Session verification failed", e);
    }
  }

  const analysis = await db.query.cvAnalyses.findFirst({
    where: eq(cvAnalyses.id, analysisId)
  });

  if (!analysis) {
    notFound();
  }

  // Fetch templates (re-fetch to get updated isPaid if we just updated it above)
  let templates = await db.query.cvTemplates.findMany({
    where: eq(cvTemplates.analysisId, analysisId)
  });

  // Check if paid (either through subscription, one-time payment for this analysis, or just verified session)
  let isPaid = sessionVerified || templates.some(t => t.isPaid);
  
  if (!isPaid && userId) {
      const user = await db.query.users.findFirst({
        where: eq(users.clerkId, userId)
      });
      
      if (user?.plan === 'monthly' && user?.subscriptionStatus === 'active') {
        isPaid = true;
      }
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/10">
      <Header />
      
      <main className="flex-1 container mx-auto py-10 px-4">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Vos 10 Modèles Optimisés</h1>
          <p className="text-lg text-muted-foreground">
            L'IA a généré ces modèles en ciblant les mots-clés et le format exigés par l'ATS pour cette offre spécifique.
          </p>
        </div>

        <TemplateGrid 
          templates={templates as any} 
          isPaid={isPaid} 
          analysisId={analysisId} 
          analysisData={analysis}
        />
      </main>

      <Footer />
    </div>
  );
}
