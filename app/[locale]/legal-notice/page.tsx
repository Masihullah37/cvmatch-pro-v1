export default function LegalNoticePage() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-6 font-sans text-slate-700 leading-relaxed">
      <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">Mentions Légales</h1>
      
      <p className="text-sm text-slate-500 mb-12 italic">En vigueur au {new Date().toLocaleDateString('fr-FR')}</p>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-black text-slate-900 border-l-4 border-primary pl-4 uppercase tracking-tighter">1. Édition du Site</h2>
        <p>
          Le site <strong>CVMatch Pro</strong> est édité par la société <strong>RushAI</strong>.
        </p>
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-2">
          <p><strong>Siège social :</strong> 2 Claude Chappe, 37300, Joué-lès-Tours, France</p>
          <p><strong>SIRET :</strong> (A renseigner)</p>
          <p><strong>Email :</strong> contact@rushai.pro</p>
        </div>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-black text-slate-900 border-l-4 border-primary pl-4 uppercase tracking-tighter">2. Hébergement</h2>
        <p>Le site est hébergé par les prestataires suivants :</p>
        <ul className="list-disc pl-6 space-y-4 font-medium">
          <li>
            <strong>Application & Frontend :</strong> Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
          </li>
          <li>
            <strong>Base de données :</strong> Neon Database (Neon, Inc.), 1250 Borregas Ave, Sunnyvale, CA 94089, USA.
          </li>
          <li>
            <strong>Gestion des utilisateurs :</strong> Clerk, Inc., 10 Almaden Blvd, Suite 1150, San Jose, CA 95113, USA.
          </li>
        </ul>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-black text-slate-900 border-l-4 border-primary pl-4 uppercase tracking-tighter">3. Propriété Intellectuelle</h2>
        <p>
          L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. 
          Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
        </p>
        <p>
          La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
        </p>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-black text-slate-900 border-l-4 border-primary pl-4 uppercase tracking-tighter">4. Contact</h2>
        <p>
          Pour toute question ou demande d'information concernant le site, ou toute notification de contenu inapproprié ou illégal, 
          l'Utilisateur peut contacter l'Éditeur à l'adresse suivante : <strong>contact@rushai.pro</strong>.
        </p>
      </section>
    </div>
  );
}
