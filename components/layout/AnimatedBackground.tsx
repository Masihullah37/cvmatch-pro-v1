'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * AMBIENT ANIMATION EFFECT
 * A modern, slow-moving abstract background animation layer.
 * Smooth green and blue gradients drifting through space.
 */
export default function AnimatedBackground() {
  // Define colors for the gradients
  const colors = {
    green: 'rgba(16, 185, 129, 0.15)', // emerald-500 with low opacity
    blue: 'rgba(59, 130, 246, 0.15)',  // blue-500 with low opacity
    cyan: 'rgba(6, 182, 212, 0.15)',  // cyan-500 with low opacity
  };

  // Configuration for drifting shapes
  const shapes = [
    {
      id: 1,
      size: '800px',
      duration: 35,
      xPattern: [0, 400, -200, 300, 0],
      yPattern: [0, 200, 400, 100, 0],
      colorPattern: [colors.green, colors.blue, colors.cyan, colors.green],
      left: '-10%',
      top: '10%',
    },
    {
      id: 2,
      size: '700px',
      duration: 40,
      xPattern: [0, -300, 200, -400, 0],
      yPattern: [0, 300, 100, 500, 0],
      colorPattern: [colors.blue, colors.cyan, colors.green, colors.blue],
      left: '60%',
      top: '20%',
    },
    {
      id: 3,
      size: '900px',
      duration: 45,
      xPattern: [0, 200, -300, 400, 0],
      yPattern: [0, -200, 150, -100, 0],
      colorPattern: [colors.cyan, colors.green, colors.blue, colors.cyan],
      left: '20%',
      top: '50%',
    },
    {
      id: 4,
      size: '600px',
      duration: 50,
      xPattern: [0, -200, 150, -300, 0],
      yPattern: [0, -300, -100, -400, 0],
      colorPattern: [colors.green, colors.cyan, colors.blue, colors.green],
      left: '70%',
      top: '70%',
    },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden z-[-10] pointer-events-none bg-white">
      {/* Drifting Organic Shapes */}
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full"
          style={{
            width: shape.size,
            height: shape.size,
            filter: 'blur(120px)',
            opacity: 0.5,
            left: shape.left,
            top: shape.top,
          }}
          animate={{
            x: shape.xPattern,
            y: shape.yPattern,
            backgroundColor: shape.colorPattern,
            scale: [1, 1.2, 0.8, 1.1, 1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Subtle Grain Overlay for texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Bottom fade to ensure content clarity at the very end of long pages */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" 
      />
    </div>
  );
}
