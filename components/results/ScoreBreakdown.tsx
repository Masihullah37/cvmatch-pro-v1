// import { Progress } from "@/components/ui/progress"; // Assuming shadcn progress is setup

// interface ScoreBreakdownProps {
//   breakdown: any;
// }

// export default function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
//   if (!breakdown) return null;

//   const categories = [
//     { key: 'keywordMatch', label: 'Correspondance Mots-clés' },
//     { key: 'format', label: 'Format & Structure' },
//     { key: 'experience', label: 'Pertinence Expérience' },
//     { key: 'education', label: 'Correspondance Éducation' },
//     { key: 'skills', label: 'Alignement Compétences' },
//     { key: 'readability', label: 'Lisibilité' },
//   ];

//   return (
//     <div className="bg-card border rounded-xl p-6 shadow-sm">
//       <h3 className="text-lg font-bold mb-6">Détail du Score</h3>
//       <div className="space-y-6">
//         {categories.map(({ key, label }) => {
//           const data = breakdown[key];
//           if (!data) return null;
          
//           const percentage = (data.score / data.max) * 100;
//           let colorClass = "bg-green-500";
//           if (percentage < 50) colorClass = "bg-red-500";
//           else if (percentage < 80) colorClass = "bg-yellow-500";

//           return (
//             <div key={key} className="space-y-2">
//               <div className="flex justify-between items-center text-sm font-medium">
//                 <span>{label}</span>
//                 <span className="text-muted-foreground">{data.score} / {data.max}</span>
//               </div>
//               <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
//                 <div 
//                   className={`h-full ${colorClass} transition-all duration-1000 ease-out`} 
//                   style={{ width: `${percentage}%` }}
//                 />
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';

const CATEGORIES = [
  { key: 'keywordMatch', label: 'Mots-clés' },
  { key: 'format', label: 'Format & Structure' },
  { key: 'experience', label: 'Expérience' },
  { key: 'education', label: 'Formation' },
  { key: 'skills', label: 'Compétences' },
  { key: 'readability', label: 'Lisibilité' },
];

export default function ScoreBreakdown({ breakdown }: { breakdown: any }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 200); }, []);

  if (!breakdown) return null;

  return (
    <div className="space-y-4">
      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Détail du score</p>
      <div className="space-y-4">
        {CATEGORIES.map(({ key, label }) => {
          const data = breakdown[key];
          if (!data) return null;
          const pct = Math.round((data.score / data.max) * 100);
          const color = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444';
          return (
            <div key={key}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-bold text-slate-700">{label}</span>
                <span className="text-xs font-black" style={{ color }}>
                  {data.score}<span className="text-slate-300 font-normal">/{data.max}</span>
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: mounted ? `${pct}%` : '0%',
                    background: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}