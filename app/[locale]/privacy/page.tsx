export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 font-sans text-slate-700 leading-relaxed">
      <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">Politique de Confidentialité (RGPD)</h1>
      
      <p className="text-sm text-slate-500 mb-12 italic">Mise à jour le {new Date().toLocaleDateString('fr-FR')}</p>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-black text-slate-900 border-l-4 border-primary pl-4 uppercase tracking-tighter">1. Introduction</h2>
        <p>
          La présente Politique de Confidentialité décrit comment <strong>RushAI</strong> ("nous", "notre", "nos") collecte, utilise et 
          protège vos données personnelles lorsque vous utilisez la plateforme <strong>CVMatch Pro</strong>.
        </p>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-black text-slate-900 border-l-4 border-primary pl-4 uppercase tracking-tighter">2. Données Collectées</h2>
        <p>Nous collectons les données suivantes nécessaires à la fourniture de nos services :</p>
        <ul className="list-disc pl-6 space-y-4">
          <li><strong>Informations de compte :</strong> Nom, adresse email via Clerk.</li>
          <li><strong>Contenu du CV :</strong> Le texte et les fichiers que vous importez pour analyse.</li>
          <li><strong>Informations de paiement :</strong> Gérées de manière sécurisée par Stripe (nous ne stockons pas vos coordonnées bancaires).</li>
          <li><strong>Données de navigation :</strong> Cookies techniques nécessaires au fonctionnement du site.</li>
        </ul>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-black text-slate-900 border-l-4 border-primary pl-4 uppercase tracking-tighter">3. Utilisation de l'Intelligence Artificielle</h2>
        <p>
          Vos données de CV sont traitées par nos modèles d'IA pour générer des optimisations. Ces données ne sont pas utilisées 
          pour entraîner des modèles tiers de manière publique. Elles sont traitées de manière éphémère pour produire votre analyse.
        </p>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-black text-slate-900 border-l-4 border-primary pl-4 uppercase tracking-tighter">4. Conservation et Suppression</h2>
        <p>
          Conformément au RGPD, vous avez un contrôle total sur vos données :
        </p>
        <ul className="list-disc pl-6 space-y-4 font-medium">
          <li>Vos analyses et CV sont conservés tant que votre compte est actif.</li>
          <li>
            <strong>Droit à l'oubli :</strong> Vous pouvez supprimer votre compte à tout moment depuis les paramètres. 
            Cette action supprime instantanément et définitivement toutes vos données personnelles de nos bases de données Neon.
          </li>
        </ul>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-black text-slate-900 border-l-4 border-primary pl-4 uppercase tracking-tighter">5. Partage des Données</h2>
        <p>
          Nous ne vendons jamais vos données à des tiers. Vos données sont partagées uniquement avec nos sous-traitants techniques 
          essentiels (Vercel, Neon, Clerk, Stripe) dans le cadre strict du fonctionnement du service.
        </p>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-black text-slate-900 border-l-4 border-primary pl-4 uppercase tracking-tighter">6. Vos Droits</h2>
        <p>
          Vous disposez d'un droit d'accès, de rectification, de portabilité et d'opposition au traitement de vos données. 
          Pour toute demande, contactez-nous à : <strong>contact@rushai.pro</strong>.
        </p>
      </section>
    </div>
  );
}
