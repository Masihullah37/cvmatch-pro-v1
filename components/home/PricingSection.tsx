"use client";

import { CheckCircle2, Zap, Sparkles } from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";

const plans = [
  {
    name: "Gratuit",
    price: "0€",
    period: "",
    desc: "Testez sans engagement",
    color: "border-slate-200",
    badge: null,
    features: [
      "Score ATS complet",
      "Suggestions d'amélioration",
      "Mots-clés manquants",
      "Analyses illimitées",
      "Aucune carte requise",
    ],
    cta: "Commencer gratuitement",
    ctaStyle: "bg-slate-900 text-white hover:bg-slate-800",
    href: "/#analyze",
  },
  {
    name: "Pack Starter",
    price: "2,90€",
    period: "paiement unique",
    desc: "5 CVs optimisés, sans abonnement",
    color: "border-primary",
    badge: "Populaire",
    features: [
      "Tout du plan Gratuit",
      "5 CVs professionnels générés",
      "12 modèles de styles différents",
      "Éditeur de CV intégré",
      "Téléchargement PDF illimité",
      "Valable 6 mois",
    ],
    cta: "Obtenir le Pack",
    ctaStyle:
      "bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/30",
    href: "/#analyze",
  },
  {
    name: "Pro Mensuel",
    price: "13,90€",
    period: "/ mois",
    desc: "Pour les candidats actifs",
    color: "border-slate-200",
    badge: null,
    features: [
      "Tout du Pack Starter",
      "30 CVs par mois",
      "Renouvellement automatique",
      "Support prioritaire",
      "Accès aux nouvelles fonctionnalités",
    ],
    cta: "Démarrer l'abonnement",
    ctaStyle: "bg-slate-900 text-white hover:bg-slate-800",
    href: "/#analyze",
  },
];

export default function PricingSection() {
  const locale = useLocale();

  return (
    <section id="pricing" className="py-24 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">
            ✦ Tarifs
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Simple, transparent,
            <br />
            <span className="text-primary">sans surprise</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Commencez gratuitement. Payez uniquement quand vous voulez générer
            vos CVs optimisés.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-[2rem] border-2 ${plan.color} p-8 flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-primary/30">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-8">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black text-slate-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-slate-400 text-sm font-medium">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-sm">{plan.desc}</p>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-slate-600"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-emerald-500 shrink-0 mt-0.5"
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={plan.href}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-center transition-all duration-200 hover:scale-[1.02] ${plan.ctaStyle}`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-400 text-sm mt-10">
          Paiement sécurisé par Stripe · SSL 256-bit · Remboursement sous 14
          jours
        </p>
      </div>
    </section>
  );
}
