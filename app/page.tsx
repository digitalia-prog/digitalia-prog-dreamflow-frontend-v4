"use client";

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

    pricingTitle: string;

    faqTitle: string;
    faqQ1: string;
    faqA1: string;
    faqQ2: string;
    faqA2: string;

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

    badge: "Bêta — 7 jours gratuit",
    heroTitle: "Le dashboard UGC qui génère et organise",
    heroSubtitle:
      "Centralise campagnes, créateurs, briefs et scripts IA dans un seul outil.",

    ctaDashboard: "Accéder au dashboard",
    ctaOffers: "Voir les offres",
    ctaTerms: "Conditions",

    featuresTitle: "Fonctionnalités clés",
    featuresSubtitle: "Une démo simple du dashboard UGC.",

    f1Title: "Scripts IA",
    f1Desc: "Génère des scripts UGC structurés automatiquement.",

    f2Title: "Gestion créateurs",
    f2Desc: "Organise tes créateurs et leurs performances.",

    f3Title: "Campagnes",
    f3Desc: "Gère tes campagnes UGC facilement.",

    pricingTitle: "Offres",

    faqTitle: "FAQ",
    faqQ1: "À quoi sert UGCGrowth ?",
    faqA1: "Un dashboard pour gérer campagnes UGC et créateurs.",
    faqQ2: "Est-ce une bêta ?",
    faqA2: "Oui, la plateforme est actuellement en test.",

    footer: "© UGCGrowth",
  },

  en: {
    navFeatures: "Features",
    navPricing: "Pricing",
    navFAQ: "FAQ",
    navFeedback: "Feedback",
    navTerms: "Terms",

    badge: "Beta — 7 days free",
    heroTitle: "The UGC dashboard that generates and organizes",
    heroSubtitle:
      "Manage campaigns, creators, briefs and AI scripts in one place.",

    ctaDashboard: "Open dashboard",
    ctaOffers: "View plans",
    ctaTerms: "Terms",

    featuresTitle: "Core Features",
    featuresSubtitle: "Simple demo of the UGC dashboard.",

    f1Title: "AI Scripts",
    f1Desc: "Generate structured UGC scripts automatically.",

    f2Title: "Creator Management",
    f2Desc: "Organize creators and track performance.",

    f3Title: "Campaigns",
    f3Desc: "Manage UGC campaigns easily.",

    pricingTitle: "Plans",

    faqTitle: "FAQ",
    faqQ1: "What is UGCGrowth?",
    faqA1: "A dashboard for managing UGC campaigns and creators.",
    faqQ2: "Is the platform in beta?",
    faqA2: "Yes, the platform is currently in testing.",

    footer: "© UGCGrowth",
  },

  ar: {
    navFeatures: "الميزات",
    navPricing: "الأسعار",
    navFAQ: "الأسئلة",
    navFeedback: "ملاحظات",
    navTerms: "الشروط",

    badge: "بيتا — تجربة 7 أيام",
    heroTitle: "لوحة تحكم UGC",
    heroSubtitle: "إدارة الحملات وصناع المحتوى بسهولة",

    ctaDashboard: "الدخول",
    ctaOffers: "العروض",
    ctaTerms: "الشروط",

    featuresTitle: "الميزات",
    featuresSubtitle: "عرض بسيط للمنصة",

    f1Title: "سكريبتات AI",
    f1Desc: "إنشاء سكريبتات UGC تلقائياً",

    f2Title: "إدارة صناع المحتوى",
    f2Desc: "تنظيم صناع المحتوى",

    f3Title: "الحملات",
    f3Desc: "إدارة الحملات بسهولة",

    pricingTitle: "العروض",

    faqTitle: "الأسئلة",
    faqQ1: "ما هو UGCGrowth؟",
    faqA1: "لوحة تحكم لإدارة حملات UGC.",
    faqQ2: "هل المنصة في بيتا؟",
    faqA2: "نعم حالياً.",

    footer: "© UGCGrowth",
  },

  es: {
    navFeatures: "Funciones",
    navPricing: "Precios",
    navFAQ: "FAQ",
    navFeedback: "Feedback",
    navTerms: "Condiciones",

    badge: "Beta — 7 días gratis",
    heroTitle: "Dashboard UGC",
    heroSubtitle: "Gestiona campañas y creadores",

    ctaDashboard: "Entrar",
    ctaOffers: "Ver planes",
    ctaTerms: "Condiciones",

    featuresTitle: "Funciones",
    featuresSubtitle: "Demo simple",

    f1Title: "Scripts AI",
    f1Desc: "Genera scripts UGC",

    f2Title: "Creadores",
    f2Desc: "Gestiona creadores",

    f3Title: "Campañas",
    f3Desc: "Organiza campañas",

    pricingTitle: "Planes",

    faqTitle: "FAQ",
    faqQ1: "¿Qué es UGCGrowth?",
    faqA1: "Dashboard para campañas UGC.",
    faqQ2: "¿Está en beta?",
    faqA2: "Sí.",

    footer: "© UGCGrowth",
  },

  zh: {
    navFeatures: "功能",
    navPricing: "价格",
    navFAQ: "FAQ",
    navFeedback: "反馈",
    navTerms: "条款",

    badge: "测试版",
    heroTitle: "UGC 控制台",
    heroSubtitle: "管理创作者和活动",

    ctaDashboard: "进入",
    ctaOffers: "查看",
    ctaTerms: "条款",

    featuresTitle: "功能",
    featuresSubtitle: "简单演示",

    f1Title: "AI脚本",
    f1Desc: "自动生成UGC脚本",

    f2Title: "创作者管理",
    f2Desc: "管理创作者",

    f3Title: "活动",
    f3Desc: "管理活动",

    pricingTitle: "价格",

    faqTitle: "FAQ",
    faqQ1: "什么是UGCGrowth？",
    faqA1: "UGC管理平台。",
    faqQ2: "是否测试版？",
    faqA2: "是的。",

    footer: "© UGCGrowth",
  },
};

export default function Page() {
  const [lang] = useState<Lang>("fr");
  const t = useMemo(() => dict[lang], [lang]);

  return (
    <main className="min-h-screen bg-black text-white">

      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold">{t.heroTitle}</h1>

        <p className="mt-6 text-white/70">{t.heroSubtitle}</p>

        <div className="mt-10">
          <a
            href="/dashboard"
            className="rounded-xl bg-white text-black px-6 py-3 font-semibold"
          >
            {t.ctaDashboard}
          </a>
        </div>
      </section>

      <footer className="border-t border-white/10 text-center py-6 text-white/50 text-sm">
        {t.footer}
      </footer>

    </main>
  );
}
