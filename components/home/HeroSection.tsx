"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowDown, Sparkles, Zap, CheckCircle2, Upload, Cpu, BarChart3, Download } from "lucide-react";

const FLIP_WORDS = ["recrutements", "CV", "candidatures", "carrière"];
const FLIP_COLORS = ["#34d399", "#fb923c", "#34d399", "#fb923c"];

const STEPS = [
  { icon: Upload, title: "Importez CV", color: "#3b82f6" },
  { icon: Cpu, title: "L'Offre", color: "#8b5cf6" },
  { icon: BarChart3, title: "Score ATS", color: "#f97316" },
  { icon: Download, title: "Boostez", color: "#10b981" },
];

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((s) => (s + 1) % STEPS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlipping(true);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % FLIP_WORDS.length);
        setFlipping(false);
      }, 350);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)",
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.15,
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "20%",
          width: 400,
          height: 400,
          background: "rgba(99,102,241,0.15)",
          borderRadius: "50%",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "20%",
          width: 320,
          height: 320,
          background: "rgba(52,211,153,0.1)",
          borderRadius: "50%",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "30%",
          width: 250,
          height: 250,
          background: "rgba(251,146,60,0.08)",
          borderRadius: "50%",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 1280,
          margin: "0 auto",
          padding: "80px 24px",
          width: "100%",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <div className="space-y-8">


            {/* Headline */}
            <div>
              <h1
                className="font-black text-white leading-tight tracking-tighter"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                  lineHeight: 1.05,
                }}
              >
                Élevez la précision de vos
              </h1>
              <div style={{ minHeight: "1.1em", marginTop: 8 }}>
                <span
                  className="font-black tracking-tighter"
                  style={{
                    fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                    lineHeight: 1.05,
                    color: FLIP_COLORS[wordIndex],
                    display: "inline-block",
                    minWidth: 220,
                    opacity: flipping ? 0 : 1,
                    transform: flipping
                      ? "translateY(-12px) scale(0.95)"
                      : "translateY(0) scale(1)",
                    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  {FLIP_WORDS[wordIndex]}
                </span>
              </div>
            </div>

            {/* Subtext */}
            <p
              className="text-lg leading-relaxed max-w-lg font-medium"
              style={{ color: "#94a3b8" }}
            >
              Analysez votre CV par rapport à n'importe quelle offre d'emploi.
              Obtenez un score ATS, des suggestions précises et générez 12
              modèles optimisés en quelques secondes.
            </p>

            {/* Trust points */}
            <div className="flex flex-wrap gap-6">
              {[
                "Score ATS instantané",
                "Mots-clés manquants",
                "12 CVs optimisés",
              ].map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-2 text-sm font-medium"
                  style={{ color: "#cbd5e1" }}
                >
                  <CheckCircle2
                    size={16}
                    style={{ color: "#34d399", flexShrink: 0 }}
                  />
                  {point}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <a
                href="#analyze"
                className="group inline-flex items-center gap-3 font-black text-sm uppercase tracking-widest transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-emerald-600"
                style={{
                  background: "#10b981",
                  color: "white",
                  padding: "16px 32px",
                  borderRadius: 16,
                  boxShadow: "0 20px 40px rgba(16,185,129,0.3)",
                  textDecoration: "none",
                }}
              >
                <Zap size={18} />
                Analyser mon CV
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center gap-3 font-bold text-sm uppercase tracking-widest transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-white/10 hover:border-emerald-500/50"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "white",
                  padding: "16px 32px",
                  borderRadius: 16,
                  textDecoration: "none",
                }}
              >
                Voir les tarifs
              </a>
            </div>

            <div className="flex items-center gap-3 pt-2">
               <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Disponible 24/7</span>
               </div>
               <p className="text-sm text-slate-500 font-medium italic">
                 "Optimisez votre avenir dès aujourd'hui"
               </p>
            </div>
          </div>

          {/* Right — Character image & Animation */}
          <div className="relative hidden lg:flex items-center justify-center">
            {/* Steps circular animation */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              {STEPS.map((step, i) => {
                const angle = (i * 90) - 45; // Start from top-leftish
                const radius = 240;
                const isActive = i === activeStep;
                const Icon = step.icon;
                
                return (
                  <div
                    key={i}
                    className="absolute transition-all duration-700 ease-in-out"
                    style={{
                      left: `calc(50% + ${radius * Math.cos((angle * Math.PI) / 180)}px)`,
                      top: `calc(50% + ${radius * Math.sin((angle * Math.PI) / 180)}px)`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div 
                      className={`flex flex-col items-center gap-2 transition-all duration-500 ${isActive ? 'scale-110' : 'scale-90 opacity-40 blur-[1px]'}`}
                    >
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500"
                        style={{
                          background: isActive ? step.color : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${isActive ? 'white' : 'rgba(255,255,255,0.1)'}`,
                          boxShadow: isActive ? `0 0 40px ${step.color}60` : 'none',
                        }}
                      >
                        <Icon size={24} color={isActive ? 'white' : '#94a3b8'} />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap px-2 py-1 rounded-lg ${isActive ? 'bg-white text-slate-900' : 'text-slate-500'}`}>
                        {step.title}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              {/* Rotating orbit ring */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] border border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-dashed border-primary/10 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
            </div>

            {/* Character image */}
            <div style={{ position: "relative", width: 420, height: 480 }}>
              {/* Glow effect background */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
                  borderRadius: "50%",
                  filter: "blur(40px)",
                  animation: "pulse 4s ease-in-out infinite",
                }}
              />

              <Image
                src="/hero.png"
                alt="OuiCV AI Character"
                fill
                className="object-contain"
                style={{
                  zIndex: 10,
                  filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.5))",
                }}
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional styles for pulse */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>



      {/* Float animation */}
      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </section>
  );
}
