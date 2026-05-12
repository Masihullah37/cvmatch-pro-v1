// "use client";

// import { motion } from "framer-motion";

// interface ATSScoreCardProps {
//   score: number;
// }

// export default function ATSScoreCard({ score }: ATSScoreCardProps) {
//   // Determine color based on score
//   let color = "text-red-500";
//   let bgCircle = "text-red-500/20";
//   let statusText = "Critique";

//   if (score >= 80) {
//     color = "text-green-500";
//     bgCircle = "text-green-500/20";
//     statusText = "Excellent";
//   } else if (score >= 50) {
//     color = "text-yellow-500";
//     bgCircle = "text-yellow-500/20";
//     statusText = "Moyen";
//   }

//   const radius = 60;
//   const circumference = 2 * Math.PI * radius;
//   const strokeDashoffset = circumference - (score / 100) * circumference;

//   return (
//     <div className="bg-card border rounded-xl p-8 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
//       <h2 className="text-xl font-bold mb-6 w-full text-left">Score ATS Global</h2>
      
//       <div className="relative w-40 h-40 flex items-center justify-center">
//         {/* Background circle */}
//         <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
//           <circle
//             cx="70"
//             cy="70"
//             r={radius}
//             stroke="currentColor"
//             strokeWidth="12"
//             fill="transparent"
//             className={bgCircle}
//           />
//           {/* Progress circle */}
//           <motion.circle
//             initial={{ strokeDashoffset: circumference }}
//             animate={{ strokeDashoffset }}
//             transition={{ duration: 1.5, ease: "easeOut" }}
//             cx="70"
//             cy="70"
//             r={radius}
//             stroke="currentColor"
//             strokeWidth="12"
//             fill="transparent"
//             strokeDasharray={circumference}
//             strokeLinecap="round"
//             className={color}
//           />
//         </svg>

//         {/* Text inside circle */}
//         <div className="absolute flex flex-col items-center justify-center">
//           <motion.span 
//             initial={{ opacity: 0, scale: 0.5 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: 1, duration: 0.5 }}
//             className="text-4xl font-extrabold"
//           >
//             {score}
//           </motion.span>
//           <span className="text-sm text-muted-foreground font-medium">/ 100</span>
//         </div>
//       </div>
      
//       <motion.div 
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 1.2 }}
//         className="mt-6 text-center"
//       >
//         <p className="text-sm text-muted-foreground">Statut</p>
//         <p className={`font-semibold text-lg ${color}`}>{statusText}</p>
//       </motion.div>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';

export default function ATSScoreCard({ score }: { score: number }) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const step = () => {
        start += 2;
        setAnimated(Math.min(start, score));
        if (start < score) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
  const label = score >= 70 ? 'Excellent' : score >= 40 ? 'Moyen' : 'Critique';
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (animated / 100) * circumference;

  return (
    <div className="text-center space-y-4">
      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Score ATS Global</p>
      <div className="relative w-36 h-36 mx-auto">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#f1f5f9" strokeWidth="10" />
          <circle
            cx="60" cy="60" r="54" fill="none"
            stroke={color} strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-slate-900" style={{ color }}>{animated}</span>
          <span className="text-xs text-slate-400 font-bold">/ 100</span>
        </div>
      </div>
      <div
        className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
        style={{ background: `${color}15`, color }}
      >
        {label}
      </div>
    </div>
  );
}