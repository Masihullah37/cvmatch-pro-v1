export default function RefundPage() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 font-sans text-slate-700 leading-relaxed">
      <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">Politique de Remboursement</h1>
      
      <p className="text-sm text-slate-500 mb-12 italic">Mise à jour le {new Date().toLocaleDateString('fr-FR')}</p>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-black text-slate-900 border-l-4 border-primary pl-4 uppercase tracking-tighter">Nature du Service</h2>
        <p>
          CVMatch Pro fournit des services numériques de génération et d'optimisation de CV basés sur l'intelligence artificielle. 
          En raison de la nature instantanée et numérique de nos services (consommation immédiate de crédits lors de l'analyse et du téléchargement), 
          des règles spécifiques s'appliquent conformément à la législation européenne sur le contenu numérique.
        </p>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-black text-slate-900 border-l-4 border-primary pl-4 uppercase tracking-tighter">Absence de Remboursement</h2>
        <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 space-y-4">
          <p className="font-bold text-amber-900">
            Une fois qu'un crédit a été utilisé pour effectuer une analyse ou générer un document, aucun remboursement ne peut être accordé.
          </p>
          <p>
            En acceptant nos CGVU lors de l'achat de crédits ou de la souscription à un abonnement, vous reconnaissez expressément 
            renoncer à votre droit de rétractation dès lors que l'exécution du service a commencé (c'est-à-dire dès que vous accédez 
            à l'outil d'analyse ou que vous téléchargez un CV).
          </p>
        </div>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-black text-slate-900 border-l-4 border-primary pl-4 uppercase tracking-tighter">Abonnements</h2>
        <p>
          Vous pouvez annuler votre abonnement mensuel à tout moment depuis votre espace "Paramètres". 
          L'annulation prendra effet à la fin de la période de facturation en cours. 
          Aucun remboursement partiel ou prorata n'est accordé pour les jours restants d'un mois déjà facturé.
        </p>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-black text-slate-900 border-l-4 border-primary pl-4 uppercase tracking-tighter">Cas Exceptionnels</h2>
        <p>
          Si vous rencontrez un problème technique majeur (par exemple, un paiement effectué mais aucun crédit reçu, ou une impossibilité 
          technique de télécharger un document malgré plusieurs tentatives), veuillez nous contacter sous 48 heures à : 
          <span className="font-black text-slate-900"> contact@rushai.pro</span>.
        </p>
        <p>
          Après vérification par notre équipe technique, si le défaut est confirmé et non imputable à une mauvaise utilisation, 
          nous procéderons soit au crédit manuel des jetons manquants, soit, à notre discrétion, à un remboursement via Stripe.
        </p>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-black text-slate-900 border-l-4 border-primary pl-4 uppercase tracking-tighter">Contact Support</h2>
        <p>
          Pour toute réclamation, merci d'inclure votre adresse email de compte ainsi que la référence de transaction Stripe.
        </p>
      </section>
    </div>
  );
}
