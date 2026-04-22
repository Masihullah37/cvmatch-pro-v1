import { db } from "@/lib/db";
import { cvAnalyses, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "@/i18n/routing";
import { FileText, ArrowRight, Settings, CheckCircle2 } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  // Find user in DB
  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, userId)
  });

  const analyses = await db.query.cvAnalyses.findMany({
    where: eq(cvAnalyses.userId, dbUser?.id || ''), // Use user's internal uuid if linked
    orderBy: [desc(cvAnalyses.createdAt)],
    limit: 10
  });

  const isPro = dbUser?.plan === 'monthly' && dbUser?.subscriptionStatus === 'active';

  return (
    <div className="flex min-h-screen flex-col bg-muted/10">
      <Header />
      
      <main className="flex-1 container mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Bonjour, {user.firstName || 'Utilisateur'}</h1>
            <p className="text-muted-foreground mt-1">Gérez vos analyses de CV et vos modèles générés.</p>
          </div>
          <div className="flex items-center gap-3 bg-card px-4 py-2 rounded-lg shadow-sm border border-border">
            <span className="font-medium text-sm">Plan actuel :</span>
            {isPro ? (
              <span className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold uppercase">
                <CheckCircle2 size={14} /> Pro
              </span>
            ) : (
              <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs font-bold uppercase">
                Gratuit
              </span>
            )}
            {!isPro && (
               <Link href="/pricing" className="text-sm font-semibold text-primary hover:underline ml-2">
                 Passer Pro
               </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="text-primary" />
              Historique des analyses
            </h2>
            
            {analyses.length === 0 ? (
              <div className="bg-card border rounded-xl p-10 text-center shadow-sm">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  <FileText size={32} />
                </div>
                <h3 className="text-lg font-bold mb-2">Aucune analyse trouvée</h3>
                <p className="text-muted-foreground mb-6">Commencez par analyser votre premier CV pour débloquer des modèles optimisés.</p>
                <Link href="/" className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium inline-block">
                  Nouvelle Analyse
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {analyses.map((analysis) => (
                  <div key={analysis.id} className="bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-lg">{analysis.jobUrl || 'Description manuelle'}</h4>
                      <p className="text-sm text-muted-foreground">{new Date(analysis.createdAt!).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Score ATS</span>
                        <span className={`text-xl font-extrabold ${analysis.atsScore! >= 80 ? 'text-green-500' : analysis.atsScore! >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                          {analysis.atsScore || 0}
                        </span>
                      </div>
                      <Link 
                        href={`/results/${analysis.id}`} 
                        className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                      >
                        Voir <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
             <div className="bg-card border rounded-xl p-6 shadow-sm">
               <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <Settings size={20} className="text-muted-foreground" />
                 Mon Compte
               </h3>
               <div className="space-y-4">
                 <div>
                   <p className="text-sm text-muted-foreground">Email</p>
                   <p className="font-medium truncate">{user.emailAddresses[0]?.emailAddress}</p>
                 </div>
                 {isPro && (
                   <div>
                     <p className="text-sm text-muted-foreground mb-2">Gérer l'abonnement</p>
                     <a href="#" className="text-sm text-blue-600 hover:underline">Accéder au portail Stripe</a>
                   </div>
                 )}
               </div>
             </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
