'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface OuiCVLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export default function OuiCVLoader({ size = 'md', className = '', showText = false }: OuiCVLoaderProps) {
  const dimensions = {
    sm: { width: 140, height: 46 },
    md: { width: 260, height: 86 },
    lg: { width: 380, height: 126 },
    xl: { width: 480, height: 160 },
  }[size];

  return (
    <div className={`relative flex flex-col items-center justify-center gap-10 ${className}`}>
      {/* Container for the logo mask */}
      <motion.div 
        className="relative"
        animate={{ 
          scale: [1, 1.02, 1],
          filter: [
            'drop-shadow(0 0 0px rgba(16, 185, 129, 0))',
            'drop-shadow(0 0 20px rgba(16, 185, 129, 0.4))',
            'drop-shadow(0 0 0px rgba(16, 185, 129, 0))'
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <div 
          className="absolute inset-0 z-10" 
          style={{ 
            maskImage: 'url(/ouicvlogo.png)',
            WebkitMaskImage: 'url(/ouicvlogo.png)',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center'
          }}
        >
          {/* Base Color (Dimmed/Rejuvenated Background) */}
          <div className="absolute inset-0 bg-slate-900/5" />

          {/* Animated Glow Reveal (Flowing through letters) */}
          <motion.div
            className="absolute inset-0"
            initial={{ x: '-100%' }}
            animate={{ x: ['-100%', '0%', '100%'] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.5, 1]
            }}
            style={{
              background: 'linear-gradient(90deg, transparent, #10b981 40%, #3b82f6 60%, transparent)',
              width: '100%',
              opacity: 0.9
            }}
          />

          {/* Secondary Shimmer (White/Bright Highlight) */}
          <motion.div
            className="absolute inset-0"
            initial={{ x: '-150%' }}
            animate={{ x: '150%' }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: 0.4 }}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)',
              width: '60%',
              skewX: '-25deg'
            }}
          />
        </div>

        {/* Pulse Aura (Subtle glow behind the letters) */}
        <motion.div 
          className="absolute inset-0 blur-2xl opacity-20"
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            background: 'radial-gradient(circle, #10b981 0%, transparent 70%)',
          }}
        />
      </motion.div>

      {showText && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-56 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              className="h-full bg-gradient-to-right from-emerald-500 to-blue-500"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
              style={{ width: '100%' }}
            />
          </div>
          <span className="text-[13px] font-black uppercase tracking-[0.5em] text-slate-950 animate-pulse drop-shadow-sm">
            Optimisation en cours
          </span>
        </div>
      )}
    </div>
  );
}
