// import { AlertTriangle } from "lucide-react";

// interface FlawsListProps {
//   flaws: string[];
//   isGated?: boolean;
// }

// export default function FlawsList({ flaws, isGated = false }: FlawsListProps) {
//   if (!flaws || flaws.length === 0) {
//     return (
//       <div className="bg-card border rounded-xl p-6 shadow-sm">
//         <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-600">
//           Points Faibles Détectés
//         </h3>
//         <p className="text-muted-foreground">Aucun problème majeur détecté sur votre CV.</p>
//       </div>
//     );
//   }

//   const visibleFlaws = isGated ? flaws.slice(0, 2) : flaws;
//   const hiddenCount = isGated ? Math.max(0, flaws.length - 2) : 0;

//   return (
//     <div className="bg-card border border-destructive/20 rounded-xl p-6 shadow-sm">
//       <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-destructive">
//         <AlertTriangle size={20} />
//         Points Faibles Détectés
//       </h3>
//       <ul className="space-y-3">
//         {visibleFlaws.map((flaw, idx) => (
//           <li key={idx} className="flex items-start gap-3 bg-destructive/5 p-3 rounded-lg border border-destructive/10">
//             <span className="text-destructive mt-0.5">•</span>
//             <span className="text-sm font-medium">{flaw}</span>
//           </li>
//         ))}
//         {isGated && hiddenCount > 0 && (
//           <li className="flex items-start gap-3 bg-destructive/5 p-3 rounded-lg border border-destructive/10 blur-[3px] opacity-40 select-none">
//             <span className="text-destructive mt-0.5">•</span>
//             <span className="text-sm font-medium">Contenu verrouillé pour les invités...</span>
//           </li>
//         )}
//       </ul>
//     </div>
//   );
// }

import { AlertTriangle, CheckCircle2 } from "lucide-react";

export default function FlawsList({
  flaws,
  isGated = false,
}: {
  flaws: string[];
  isGated?: boolean;
}) {
  if (!flaws || flaws.length === 0) {
    return (
      <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
        <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
        <p className="text-sm font-bold text-emerald-700">
          Aucun problème majeur détecté.
        </p>
      </div>
    );
  }

  const visible = isGated ? flaws.slice(0, 2) : flaws;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-black uppercase tracking-widest text-slate-700 flex items-center gap-2">
        <AlertTriangle size={16} className="text-red-500" />
        Points faibles détectés ({flaws.length})
      </h3>
      <ul className="space-y-2">
        {visible.map((flaw, i) => (
          <li
            key={i}
            className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-3"
          >
            <span className="text-red-400 mt-0.5 shrink-0 font-black text-xs">
              ✕
            </span>
            <span className="text-sm text-red-800 font-medium leading-relaxed">
              {flaw}
            </span>
          </li>
        ))}
        {isGated && flaws.length > 2 && (
          <li className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 blur-sm select-none">
            <span className="text-red-400 mt-0.5 shrink-0 text-xs font-black">
              ✕
            </span>
            <span className="text-sm text-red-800 font-medium">
              Contenu verrouillé...
            </span>
          </li>
        )}
      </ul>
    </div>
  );
}
