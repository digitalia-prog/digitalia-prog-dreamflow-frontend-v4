"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Lang = "fr" | "en" | "ar" | "es" | "zh";

type Dict = Record<
  Lang,
  {
    navFeatures: string;
    navPricing: string;
    navFAQ: string;
    navFeedback: string;
    navTerms: string;

    badge: string;
    heroTitle: string;
    heroSubtitle: string;

    ctaDashboard: string;
    ctaOffers: string;
    ctaTerms: string;

    featuresTitle: string;
    featuresSubtitle: string;

    f1Title: string;
    f1Desc: string;
    f2Title: string;
    f2Desc: string;
    f3Title: string;
    f3Desc: string;
    f4Title: string;
    f4Desc: string;
    f5Title: string;
    f5Desc: string;
    f6Title: string;
    f6Desc: string;

    pricingTitle: string;
    pricingSubtitle: string;

    footer: string;
  }
>;

const dict: Dict = {
  fr: {
    navFeatures: "Fonctionnalités",
    navPricing: "Prix bêta",
    navFAQ: "FAQ",
    navFeedback: "Feedback",
    navTerms: "CGU",

    badge:
      "Bêta — Analyse par intelligence artificielle • Score viral • Script Engine • Workflow agence",

    heroTitle:
      "Analyse les publicités gagnantes. Génère des scripts avec intelligence artificielle.",

    heroSubtitle:
      "UGC Growth est une plateforme tout-en-un avec intelligence artificielle pour analyser les publicités performantes, générer des scripts, calculer le potentiel viral et organiser la production pour créateurs et agences.",

    ctaDashboard: "Accéder au dashboard",
    ctaOffers: "Voir les offres",
    ctaTerms: "Conditions",

    featuresTitle: "Fonctionnalités principales",
    featuresSubtitle:
      "Analyse publicitaire, génération de scripts et workflow complet.",

    f1Title: "Analyse publicitaire",
    f1Desc:
      "Analyse les publicités performantes et détecte ce qui fonctionne.",

    f2Title: "Script Engine",
    f2Desc:
      "Génère des scripts performants avec intelligence artificielle.",

    f3Title: "Score viral",
    f3Desc:
      "Mesure le potentiel viral des publicités avant de tester.",

    f4Title: "Workflow agence",
    f4Desc:
      "Gère clients, campagnes et créateurs dans un seul espace.",

    f5Title: "Multi-plateformes",
    f5Desc:
      "TikTok, Instagram, Meta Ads et YouTube Shorts.",

    f6Title: "Créateurs & agences",
    f6Desc:
      "Pensé pour créateurs, agences et marques.",

    pricingTitle: "Offres",
    pricingSubtitle: "Choisis ton plan.",

    footer: "© UGC GROWTH",
  },

  en: {
    navFeatures: "Features",
    navPricing: "Pricing",
    navFAQ: "FAQ",
    navFeedback: "Feedback",
    navTerms: "Terms",

    badge:
      "Beta — Artificial intelligence analysis • Viral score • Script engine",

    heroTitle:
      "Analyze winning ads. Generate scripts with artificial intelligence.",

    heroSubtitle:
      "All-in-one platform to analyze ads, generate scripts and scale campaigns.",

    ctaDashboard: "Dashboard",
    ctaOffers: "Pricing",
    ctaTerms: "Terms",

    featuresTitle: "Features",
    featuresSubtitle: "Complete workflow",

    f1Title: "Ad analysis",
    f1Desc: "Analyze winning ads",

    f2Title: "Script engine",
    f2Desc: "Generate scripts",

    f3Title: "Viral score",
    f3Desc: "Measure potential",

    f4Title: "Agency workflow",
    f4Desc: "Manage clients",

    f5Title: "Multi platform",
    f5Desc: "TikTok Meta",

    f6Title: "Creators",
    f6Desc: "Creators agencies",

    pricingTitle: "Pricing",
    pricingSubtitle: "Choose plan",

    footer: "© UGC GROWTH",
  },

  ar: {} as any,
  es: {} as any,
  zh: {} as any,
};

export default function Landing() {
  const [lang, setLang] = useState<Lang>("fr");

  const t = useMemo(() => dict[lang], [lang]);

  return (
    <main className="min-h-screen bg-black text-white">

      <section className="mx-auto max-w-6xl px-6 py-16">

        <div className="rounded-3xl border border-white/10 bg-white/5 p-10">

          <div className="text-sm text-purple-400">{t.badge}</div>

          <h1 className="text-5xl font-bold mt-4">
            {t.heroTitle}
          </h1>

          <p className="mt-4 text-white/70 max-w-2xl">
            {t.heroSubtitle}
          </p>

        </div>

      </section>

    </main>
  );
}
