// import { Zap, Target, FileText, BarChart3, Shield, Clock } from 'lucide-react';

// const features = [
//   {
//     icon: BarChart3,
//     title: 'Score ATS Instantané',
//     desc: 'Obtenez un score précis de compatibilité entre votre CV et l\'offre d\'emploi en quelques secondes.',
//     color: 'bg-blue-500/10 text-blue-400',
//   },
//   {
//     icon: Target,
//     title: 'Mots-clés Manquants',
//     desc: 'Identifiez exactement les mots-clés que les recruteurs recherchent et qui manquent dans votre CV.',
//     color: 'bg-orange-500/10 text-orange-400',
//   },
//   {
//     icon: FileText,
//     title: '5 CV Optimisés',
//     desc: 'Générez 5 modèles de CV professionnels, tous optimisés avec votre contenu et adaptés au poste.',
//     color: 'bg-emerald-500/10 text-emerald-400',
//   },
//   {
//     icon: Zap,
//     title: 'Analyse IA Avancée',
//     desc: 'Notre IA analyse la structure, le style, et la pertinence de chaque section de votre CV.',
//     color: 'bg-purple-500/10 text-purple-400',
//   },
//   {
//     icon: Shield,
//     title: 'Données Sécurisées',
//     desc: 'Vos données sont chiffrées et conformes au RGPD. Nous ne vendons jamais vos informations.',
//     color: 'bg-slate-500/10 text-slate-400',
//   },
//   {
//     icon: Clock,
//     title: 'Résultats en 30s',
//     desc: 'L\'analyse complète et la génération de CVs se font en moins de 30 secondes.',
//     color: 'bg-rose-500/10 text-rose-400',
//   },
// ];

// export default function FeaturesSection() {
//   return (
//     <section className="py-24 px-6 bg-white">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">
//             ✦ Fonctionnalités
//           </div>
//           <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
//             Tout ce dont vous avez besoin<br />
//             <span className="text-primary">pour décrocher le poste</span>
//           </h2>
//           <p className="text-slate-500 text-lg max-w-xl mx-auto">
//             CVBoost combine l'IA et l'expertise RH pour maximiser vos chances de passer les filtres ATS.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {features.map((feature) => (
//             <div
//               key={feature.title}
//               className="group bg-slate-50 hover:bg-white border border-slate-100 hover:border-slate-200 rounded-3xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
//             >
//               <div className={`w-12 h-12 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
//                 <feature.icon size={24} />
//               </div>
//               <h3 className="text-lg font-black text-slate-900 mb-3">{feature.title}</h3>
//               <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }