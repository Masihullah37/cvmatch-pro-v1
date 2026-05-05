'use client';

import React, { useEffect, useState } from 'react';

export default function AnimatedBackground() {
  const [bubbles, setBubbles] = useState<{ id: number; left: string; size: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    // Generate random bubbles on mount
    const newBubbles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 100 + 50}px`,
      delay: `${Math.random() * 10}s`,
      duration: `${Math.random() * 20 + 15}s`,
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none bg-slate-50">
      <div className="aura-glow" />
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bubble"
          style={{
            left: bubble.left,
            width: bubble.size,
            height: bubble.size,
            animationDelay: bubble.delay,
            animationDuration: bubble.duration,
          }}
        />
      ))}
      <div 
        className="fixed bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white to-transparent opacity-60" 
      />
    </div>
  );
}
