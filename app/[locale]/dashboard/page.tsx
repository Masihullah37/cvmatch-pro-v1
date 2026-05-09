import { db } from "@/lib/db";
import { cvAnalyses, users, cvTemplates } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AnimatedBackground from "@/components/layout/AnimatedBackground";
import { Link } from "@/i18n/routing";
import { cancelMonthlySubscription } from "@/app/actions/stripe";
import {
  FileText,
  ArrowRight,
  Sparkles,
  TrendingUp,
  CreditCard,
  Clock,
  Zap,
  LayoutDashboard,
  History,
} from "lucide-react";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  // Find user in DB
  let dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, userId),
  });

  // Fallback: If user is logged in but not in our DB, create them
  if (!dbUser && user) {
    const [newUser] = await db
      .insert(users)
      .values({
        clerkId: userId,
        email: user.emailAddresses[0]?.emailAddress || "",
        name:
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          user.username ||
          "Utilisateur",
        plan: "free",
        credits: 0,
      })
      .returning();
    dbUser = newUser;
  }

  if (!dbUser) return null;

  async function handleCancelSubscription() {
    "use server";
    await cancelMonthlySubscription();
    redirect("/dashboard");
  }

  let analyses: any[] = [];
  let generatedCvs: any[] = [];

  if (dbUser) {
    // 1. Fetch Analyses
    analyses = await db.query.cvAnalyses.findMany({
      where: eq(cvAnalyses.userId, dbUser.id),
      orderBy: [desc(cvAnalyses.createdAt)],
      limit: 10,
    });

    // 2. Query cvTemplates through the user's analyses
    if (analyses.length > 0) {
      const { inArray } = await import("drizzle-orm");
      const analysisIds = analyses.map((a) => a.id);

      generatedCvs = await db.query.cvTemplates.findMany({
        where: inArray(cvTemplates.analysisId, analysisIds),
        orderBy: [desc(cvTemplates.createdAt)],
        limit: 20,
      });
    }
  }

  const credits = dbUser?.credits ?? 0;

  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden bg-slate-50">
      <AnimatedBackground />

      <main className="flex-1 container mx-auto py-12 px-4 relative z-10">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/10">
                <LayoutDashboard size={12} /> Tableau de bord
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Bonjour,{" "}
                <span className="text-primary">
                  {user.firstName || "Candidat"}
                </span>
              </h1>
              <p className="text-slate-500 font-medium text-lg">
                Prêt à décrocher votre prochain job ?
              </p>
            </div>

            <Link
              href="/"
              className="group bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-3"
            >
              <Zap size={18} className="fill-white" />
              Nouvelle Analyse
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 flex flex-col justify-between group hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <CreditCard size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Crédits
              </span>
            </div>
            <div>
              <div className="text-5xl font-black text-slate-900 tracking-tighter mb-2">
                {credits}
              </div>
              <p className="text-slate-500 text-sm font-bold">
                Générations restantes
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 flex flex-col justify-between group hover:border-accent/20 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Meilleur Score
              </span>
            </div>
            <div>
              <div className="text-5xl font-black text-slate-900 tracking-tighter mb-2">
                {analyses.length > 0
                  ? Math.max(...analyses.map((a) => a.atsScore || 0))
                  : 0}
                %
              </div>
              <p className="text-slate-500 text-sm font-bold">
                Compatibilité Maximale
              </p>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 flex flex-col justify-between text-white group relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Sparkles size={24} className="fill-primary" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Status
              </span>
            </div>
            <div className="relative z-10">
              <div className="text-3xl font-black tracking-tight mb-2 uppercase italic">
                {dbUser.plan === "monthly"
                  ? "Abonné PRO"
                  : dbUser.plan === "one_time"
                    ? "Plan Starter"
                    : "Utilisateur Free"}
              </div>
              <Link
                href={
                  dbUser.plan === "free"
                    ? "/#pricing"
                    : "/dashboard#manage-plan"
                }
                className="text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform"
              >
                {dbUser.plan === "free" ? "Passer en PRO" : "Gérer mon plan"}{" "}
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {dbUser.plan !== "free" && (
          <div
            id="manage-plan"
            className="mb-12 bg-white/90 border border-slate-200 rounded-[2rem] p-8 shadow-sm"
          >
            <h3 className="text-xl font-black text-slate-900 mb-2">
              Gérer mon plan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Plan
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {dbUser.plan === "monthly"
                    ? "Abonnement Pro"
                    : "Pack Starter"}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Statut
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {dbUser.subscriptionStatus || "active"}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Fin de période
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {dbUser.subscriptionEndsAt
                    ? new Date(dbUser.subscriptionEndsAt).toLocaleDateString(
                        "fr-FR",
                      )
                    : "Non définie"}
                </p>
              </div>
            </div>

            {dbUser.plan === "monthly" && (
              <p className="text-sm text-slate-600 mb-5">
                Votre abonnement sera renouvelé automatiquement chaque mois.
                Vous pouvez annuler votre abonnement à tout moment depuis la
                section ‘Gérer mon plan’. L’annulation prendra effet à la fin de
                la période de facturation en cours.
              </p>
            )}

            {dbUser.plan === "monthly" &&
              dbUser.subscriptionStatus !== "canceled" && (
                <form action={handleCancelSubscription}>
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all"
                  >
                    Cancel Subscription
                  </button>
                </form>
              )}
            {dbUser.plan === "one_time" && (
              <p className="text-sm font-semibold text-slate-700">
                Le Pack Starter n&apos;est pas un abonnement mensuel. Aucun
                renouvellement automatique n&apos;est appliqué.
              </p>
            )}
            {dbUser.subscriptionStatus === "canceled" && (
              <p className="mt-4 text-sm font-semibold text-slate-700">
                Votre abonnement a été annulé. Il restera actif jusqu’à la fin
                de la période en cours. Aucun renouvellement ne sera effectué.
              </p>
            )}
          </div>
        )}

        {/* Historique des CVs (Refactored to group by analysis) */}
        <div className="mb-12">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3 mb-8">
            <History className="text-primary" />
            Historique de vos CVs générés
          </h2>

          {generatedCvs.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-12 text-center shadow-sm">
              <p className="text-slate-400 font-bold">
                Vous n'avez pas encore généré de CV.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Group by analysisId — show one card per analysis */}
              {Array.from(
                new Map(generatedCvs.map((cv) => [cv.analysisId, cv])).values(),
              ).map((cv) => {
                const parentAnalysis = analyses.find(
                  (a) => a.id === cv.analysisId,
                );
                return (
                  <div
                    key={cv.analysisId}
                    className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all group"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                        <FileText className="text-indigo-500" />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-sm line-clamp-1">
                          {parentAnalysis?.jobTitle || "Analyse CV"}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          {new Date(cv.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/templates/${cv.analysisId}`}
                      className="w-full block bg-slate-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-center hover:bg-slate-800 transition-all"
                    >
                      Voir mes CVs
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Analyses Section */}
        <div className="space-y-8">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
            <Clock className="text-primary" />
            Analyses Récentes
          </h2>

          {analyses.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-md border-2 border-dashed border-slate-200 rounded-[3rem] p-16 text-center">
              <div className="bg-slate-100 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-400">
                <FileText size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                Pas encore d'analyses
              </h3>
              <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">
                Analysez votre premier CV pour voir vos scores et générer des
                modèles professionnels.
              </p>
              <Link
                href="/"
                className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest inline-block shadow-lg shadow-primary/20"
              >
                Lancer ma première analyse
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="bg-white hover:bg-slate-50/50 border border-slate-100 rounded-[2rem] p-6 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group shadow-sm hover:shadow-xl hover:shadow-slate-200/40"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-primary font-black text-xl border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all">
                      {analysis.atsScore || 0}%
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-lg group-hover:text-primary transition-colors line-clamp-1">
                        {analysis.jobTitle || analysis.jobUrl || "Analyse CV"}
                      </h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Clock size={12} />{" "}
                          {new Date(analysis.createdAt!).toLocaleDateString(
                            "fr-FR",
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/results/${analysis.id}`}
                      className="bg-slate-100 text-slate-900 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all"
                    >
                      Résultats
                    </Link>
                    <Link
                      href={`/templates/${analysis.id}`}
                      className="bg-primary text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/10 hover:scale-105 transition-all"
                    >
                      Accéder aux CVs
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
