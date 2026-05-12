"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowDown, Sparkles, Zap, CheckCircle2 } from "lucide-react";

const FLIP_WORDS = ["recrutements", "CV", "candidatures", "carrière"];
const FLIP_COLORS = ["#34d399", "#fb923c", "#34d399", "#fb923c"];

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [flipping, setFlipping] = useState(false);

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
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border"
              style={{
                background: "rgba(99,102,241,0.1)",
                borderColor: "rgba(99,102,241,0.3)",
                color: "#818cf8",
              }}
            >
              <Sparkles size={12} />
              IA Optimisation ATS
            </div>

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
                className="group inline-flex items-center gap-3 font-black text-sm uppercase tracking-widest transition-all duration-200 hover:scale-105"
                style={{
                  background: "hsl(221, 100%, 50%)",
                  color: "white",
                  padding: "16px 32px",
                  borderRadius: 16,
                  boxShadow: "0 20px 40px rgba(59,130,246,0.3)",
                  textDecoration: "none",
                }}
              >
                <Zap size={18} />
                Analyser mon CV
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center gap-3 font-bold text-sm uppercase tracking-widest transition-all duration-200 hover:scale-105"
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

            {/* Social proof */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex" style={{ marginLeft: 0 }}>
                {["#10b981", "#3b82f6", "#f97316", "#a855f7"].map(
                  (color, i) => (
                    <div
                      key={i}
                      style={{
                        width: 32,
                        height: 32,
                        background: color,
                        borderRadius: "50%",
                        border: "2px solid #020617",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: 12,
                        fontWeight: 900,
                        marginLeft: i > 0 ? -8 : 0,
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ),
                )}
              </div>
              <p className="text-sm" style={{ color: "#94a3b8" }}>
                <span style={{ color: "white", fontWeight: 700 }}>+500</span>{" "}
                candidats optimisés cette semaine
              </p>
            </div>
          </div>

          {/* Right — Character image */}
          <div className="relative hidden lg:flex items-center justify-center">
            {/* Floating ATS card */}
            <div
              className="absolute z-20"
              style={{
                left: -20,
                top: 40,
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 16,
                padding: 16,
                animation: "heroFloat 3s ease-in-out infinite",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: 40,
                    height: 40,
                    background: "rgba(52,211,153,0.2)",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircle2 size={20} style={{ color: "#34d399" }} />
                </div>
                <div>
                  <p style={{ color: "white", fontSize: 11, fontWeight: 900 }}>
                    Score ATS
                  </p>
                  <p
                    style={{
                      color: "#34d399",
                      fontSize: 20,
                      fontWeight: 900,
                      lineHeight: 1.2,
                    }}
                  >
                    87%
                  </p>
                </div>
              </div>
            </div>

            {/* Floating CV card */}
            <div
              className="absolute z-20"
              style={{
                right: -10,
                bottom: 60,
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 16,
                padding: 16,
                animation: "heroFloat 4s ease-in-out infinite",
                animationDelay: "1s",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  style={{
                    width: 40,
                    height: 40,
                    background: "rgba(251,146,60,0.2)",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Sparkles size={18} style={{ color: "#fb923c" }} />
                </div>
                <div>
                  <p style={{ color: "white", fontSize: 11, fontWeight: 900 }}>
                    CVs Générés
                  </p>
                  <p
                    style={{
                      color: "#fb923c",
                      fontSize: 20,
                      fontWeight: 900,
                      lineHeight: 1.2,
                    }}
                  >
                    12 styles
                  </p>
                </div>
              </div>
            </div>

            {/* Character image */}
            <div style={{ position: "relative", width: 420, height: 480 }}>
              {/* Glow effect background */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom, rgba(99,102,241,0.2), transparent)",
                  borderRadius: 48,
                  filter: "blur(40px)",
                }}
              />

              <Image
                src="/hero.png"
                alt="CVBoost AI Character"
                fill
                className="object-contain"
                // Removed position: 'relative' to resolve the conflict with 'fill'
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

      {/* Scroll indicator */}
      <div
        className="absolute flex flex-col items-center gap-2 animate-bounce"
        style={{
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          color: "#475569",
        }}
      >
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
          }}
        >
          Commencer
        </p>
        <ArrowDown size={16} />
      </div>

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
