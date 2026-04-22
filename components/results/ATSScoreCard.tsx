"use client";

import { motion } from "framer-motion";

interface ATSScoreCardProps {
  score: number;
}

export default function ATSScoreCard({ score }: ATSScoreCardProps) {
  // Determine color based on score
  let color = "text-red-500";
  let bgCircle = "text-red-500/20";
  let statusText = "Critique";

  if (score >= 80) {
    color = "text-green-500";
    bgCircle = "text-green-500/20";
    statusText = "Excellent";
  } else if (score >= 50) {
    color = "text-yellow-500";
    bgCircle = "text-yellow-500/20";
    statusText = "Moyen";
  }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-card border rounded-xl p-8 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
      <h2 className="text-xl font-bold mb-6 w-full text-left">Score ATS Global</h2>
      
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className={bgCircle}
          />
          {/* Progress circle */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="70"
            cy="70"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
            className={color}
          />
        </svg>

        {/* Text inside circle */}
        <div className="absolute flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-4xl font-extrabold"
          >
            {score}
          </motion.span>
          <span className="text-sm text-muted-foreground font-medium">/ 100</span>
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-muted-foreground">Statut</p>
        <p className={`font-semibold text-lg ${color}`}>{statusText}</p>
      </motion.div>
    </div>
  );
}
