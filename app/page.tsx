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

    planBetaTitle: string;
    planBetaPrice: string;
    planBetaNote: string;
    planBetaB1: string;
    planBetaB2: string;
    planBetaB3: string;

    planCreatorTitle: string;
    planCreatorPrice: string;
    planCreatorNote: string;
    planCreatorB1: string;
    planCreatorB2: string;
    planCreatorB3: string;

    planAgencyTitle: string;
    planAgencyPrice: string;
    planAgencyNote: string;
    planAgencyB1: string;
    planAgencyB2: string;
    planAgencyB3: string;

    pricingFootnote: string;

    whoTitle: string;
    whoSubtitle: string;
    whoA: string;
    whoB: string;
    whoC: string;
    whoD: string;

    premiumTitle: string;
    premiumSubtitle: string;
    premiumA: string;
    premiumB: string;
    premiumC: string;

    faqTitle: string;
    faqQ1: string;
    faqA1: string;
    faqQ2: string;
    faqA2: string;
    faqQ3: string;
    faqA3: string;

    feedbackTitle: string;
    feedbackSubtitle: string;
    feedbackCTA: string;

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

    badge: "Bêta — Analyse vidéo Bêta — 7 jours gratuits pour tester le Script Engine et l’analyse publicitaire audio • Score viral • Script Engine",
    heroTitle: "Analyse les publicités gagnantes. Génère des scripts avec intelligence artificielle en quelques secondes.",
    heroSubtitle:
      "UGC Growth aide les créateurs, agences et marques à analyser des publicités performantes en vidéo et audio, extraire les hooks gagnants et générer des scripts publicitaires prêts à tester.",

    ctaDashboard: "Accéder au dashboard",
    ctaOffers: "Voir les offres",
    ctaTerms: "Conditions (CGU)",

    featuresTitle: "Ce que la plateforme fait concrètement",
    featuresSubtitle:
      "Analyse publicitaire, génération de scripts et organisation UGC dans un seul workflow.",

    f1Title: "Analyse publicitaire",
    f1Desc:
      "Uploade un audio et détecte le hook, la structure, l’angle et les idées à reproduire.",
    f2Title: "Script Engine",
    f2Desc:
      "Génère rapidement des hooks, scripts, CTA et structures prêtes à tourner.",
    f3Title: "Hooks & angles marketing",
    f3Desc:
      "Trouve plus vite quoi dire, comment le dire et sous quel angle le tester.",
    f4Title: "Organisation agence / créateur",
    f4Desc:
      "Centralise briefs, campagnes, créateurs et contenus dans un espace propre.",
    f5Title: "Bêta simple à tester",
    f5Desc:
      "7 jours gratuits pour tester la valeur du produit avant déploiement complet.",
    f6Title: "Multi-langue",
    f6Desc:
      "FR / EN / AR / ES / 中文 — pratique pour les équipes et clients internationaux.",

    pricingTitle: "Offres bêta",
    pricingSubtitle:
      "Commence gratuitement, puis passe sur un plan conçu pour ton volume de production créative.",

    planBetaTitle: "Test bêta",
    planBetaPrice: "0€ / 7 jours",
    planBetaNote: "Accès limité — idéal pour démonstration",
    planBetaB1: "Accès dashboard",
    planBetaB2: "Script Engine (générations limitées)",
    planBetaB3: "Feedback prioritaire",

    planCreatorTitle: "Creator",
    planCreatorPrice: "À partir de 99€",
    planCreatorNote: "Pour créateurs qui postent beaucoup",
    planCreatorB1: "Plus de générations / mois",
    planCreatorB2: "Templates scripts",
    planCreatorB3: "Export facile",

    planAgencyTitle: "Agency",
    planAgencyPrice: "À partir de 299€",
    planAgencyNote: "Pour équipes & gestion multi-clients",
    planAgencyB1: "Workspace agence",
    planAgencyB2: "Pipeline UGC + scripts",
    planAgencyB3: "Support prioritaire",

    pricingFootnote:
      "Note : tu peux ajuster les prix après tests (selon coûts & valeur perçue).",

    whoTitle: "Pour qui ?",
    whoSubtitle: "Quand c’est utile (et rentable) :",
    whoA: "Agences UGC (gestion multi-clients)",
    whoB: "Créateurs UGC (scripts rapides + constance)",
    whoC: "Marques e-commerce (briefs + validation + organisation)",
    whoD: "Teams social media (process & qualité)",

    premiumTitle: "Ce qui rend une publicité forte",
    premiumSubtitle:
      "Les meilleures créatives combinent structure, émotion et positionnement.",
    premiumA: "Hooks psychologiques",
    premiumB: "Émotions et désir",
    premiumC: "Positionnement et branding",

    faqTitle: "FAQ",
    faqQ1: "La bêta est gratuite ?",
    faqA1:
      "Oui : 7 jours de test avec restrictions anti-abus, pour garder une expérience stable.",
    faqQ2: "Je dois expliquer comment ça fonctionne ?",
    faqA2:
      "Non. Tu vends un résultat : analyse publicitaire, scripts et organisation. Les détails techniques ne sont pas nécessaires.",
    faqQ3: "Puis-je demander une feature ?",
    faqA3: "Oui. Le feedback est prioritaire en bêta : on itère vite.",

    feedbackTitle: "Feedback (bêta)",
    feedbackSubtitle:
      "Aide-nous à améliorer la plateforme : 1 minute, ultra précieux.",
    feedbackCTA: "Donner mon feedback",

    footer: "© UGC GROWTH — Bêta",
  },

  en: {
    navFeatures: "Features",
    navPricing: "Beta pricing",
    navFAQ: "FAQ",
    navFeedback: "Feedback",
    navTerms: "Terms",

    badge: "Beta — 7 days free for testing (anti-abuse limits)",
    heroTitle: "Analyze winning ads. Generate high-performing scripts in seconds.",
    heroSubtitle:
      "UGC Growth helps creators, agencies and brands analyze winning ads, extract strong hooks and generate ad scripts ready to test.",

    ctaDashboard: "Open dashboard",
    ctaOffers: "See offers",
    ctaTerms: "Terms",

    featuresTitle: "What the platform actually does",
    featuresSubtitle:
      "Ad analysis, script generation and UGC organization in one workflow.",

    f1Title: "Ad analysis",
    f1Desc:
      "Upload audio and detect the hook, structure, angle and ideas worth reproducing.",
    f2Title: "Script Engine",
    f2Desc:
      "Generate hooks, scripts, CTAs and structures ready to record.",
    f3Title: "Hooks & marketing angles",
    f3Desc:
      "Find what to say, how to say it and which angle to test faster.",
    f4Title: "Agency / creator organization",
    f4Desc:
      "Centralize briefs, campaigns, creators and content in one clean space.",
    f5Title: "Simple beta access",
    f5Desc:
      "7 free days to test the product before full rollout.",
    f6Title: "Multi-language",
    f6Desc:
      "FR / EN / AR / ES / 中文 — ready for international teams.",

    pricingTitle: "Beta offers",
    pricingSubtitle:
      "Start free, then move to a plan built for your creative production volume.",

    planBetaTitle: "Beta test",
    planBetaPrice: "€0 / 7 days",
    planBetaNote: "Limited access — great for demo",
    planBetaB1: "Dashboard access",
    planBetaB2: "Script Engine (limited generations)",
    planBetaB3: "Priority feedback",

    planCreatorTitle: "Creator",
    planCreatorPrice: "From €99",
    planCreatorNote: "For creators who post a lot",
    planCreatorB1: "More generations / month",
    planCreatorB2: "Script templates",
    planCreatorB3: "Easy export",

    planAgencyTitle: "Agency",
    planAgencyPrice: "From €299",
    planAgencyNote: "For teams & multi-client management",
    planAgencyB1: "Agency workspace",
    planAgencyB2: "UGC pipeline + scripts",
    planAgencyB3: "Priority support",

    pricingFootnote:
      "Note: you can adjust pricing after tests (costs & perceived value).",

    whoTitle: "Who is it for?",
    whoSubtitle: "Best use cases:",
    whoA: "UGC agencies (multi-client)",
    whoB: "UGC creators (fast scripts + consistency)",
    whoC: "E-commerce brands (briefs + validation + organization)",
    whoD: "Social media teams (process & quality)",

    premiumTitle: "What makes a strong ad",
    premiumSubtitle:
      "The best creatives combine structure, emotion and positioning.",
    premiumA: "Psychological hooks",
    premiumB: "Emotion and desire",
    premiumC: "Positioning and branding",

    faqTitle: "FAQ",
    faqQ1: "Is the beta free?",
    faqA1:
      "Yes: 7 days with anti-abuse limits to keep the experience stable.",
    faqQ2: "Do I need to explain how it works?",
    faqA2:
      "No. Sell outcomes: ad analysis, scripts and organization. Technical details aren’t needed.",
    faqQ3: "Can I request a feature?",
    faqA3: "Yes. Beta feedback is priority: we iterate fast.",

    feedbackTitle: "Feedback (beta)",
    feedbackSubtitle: "Help us improve: 1 minute, super valuable.",
    feedbackCTA: "Give feedback",

    footer: "© UGC GROWTH — Beta",
  },

  ar: {
    navFeatures: "الميزات",
    navPricing: "سعر البيتا",
    navFAQ: "الأسئلة",
    navFeedback: "ملاحظات",
    navTerms: "الشروط",

    badge: "بيتا — 7 أيام مجانًا للتجربة (قيود ضد الإساءة)",
    heroTitle: "حلّل الإعلانات التي تنجح. وأنشئ سكربتات قوية خلال ثوانٍ.",
    heroSubtitle:
      "يساعد UGC Growth المبدعين والوكالات والعلامات التجارية على تحليل الإعلانات الناجحة، استخراج الهوكات القوية، وإنشاء سكربتات إعلانية جاهزة للاختبار.",

    ctaDashboard: "الدخول للوحة التحكم",
    ctaOffers: "عرض الباقات",
    ctaTerms: "الشروط",

    featuresTitle: "ماذا تفعل المنصة فعليًا",
    featuresSubtitle:
      "تحليل الإعلانات، توليد السكربتات، وتنظيم إنتاج UGC في نفس المكان.",

    f1Title: "تحليل الإعلانات",
    f1Desc:
      "ارفع ملفًا صوتيًا واكتشف الهوك والبنية والزاوية والأفكار التي تستحق إعادة الاستخدام.",
    f2Title: "Script Engine",
    f2Desc:
      "أنشئ هوكات وسكربتات وCTA وبُنى جاهزة للتصوير بسرعة.",
    f3Title: "هوكات وزوايا تسويقية",
    f3Desc:
      "اعرف ماذا تقول، وكيف تقوله، وتحت أي زاوية تختبره أسرع.",
    f4Title: "تنظيم الوكالة / المبدع",
    f4Desc:
      "نظّم الـ briefs والحملات والمبدعين والمحتوى في مساحة واحدة مرتبة.",
    f5Title: "بيتا سهلة للتجربة",
    f5Desc:
      "7 أيام مجانية لاختبار قيمة المنتج قبل الإطلاق الكامل.",
    f6Title: "تعدد اللغات",
    f6Desc: "FR / EN / AR / ES / 中文 — مناسب للفرق والعملاء الدوليين.",

    pricingTitle: "عروض البيتا",
    pricingSubtitle:
      "ابدأ مجانًا ثم انتقل إلى خطة تناسب حجم إنتاجك الإبداعي.",

    planBetaTitle: "تجربة البيتا",
    planBetaPrice: "0€ / 7 أيام",
    planBetaNote: "وصول محدود — مناسب للديمو",
    planBetaB1: "دخول للوحة التحكم",
    planBetaB2: "Script Engine (توليدات محدودة)",
    planBetaB3: "ملاحظات أولوية",

    planCreatorTitle: "Creator",
    planCreatorPrice: "من 99€",
    planCreatorNote: "لصنّاع المحتوى النشطين",
    planCreatorB1: "توليدات أكثر / شهر",
    planCreatorB2: "قوالب سكربت",
    planCreatorB3: "تصدير سهل",

    planAgencyTitle: "Agency",
    planAgencyPrice: "من 299€",
    planAgencyNote: "للشركات وإدارة عدة عملاء",
    planAgencyB1: "مساحة عمل للوكالة",
    planAgencyB2: "Pipeline UGC + سكربتات",
    planAgencyB3: "دعم أولوية",

    pricingFootnote:
      "ملاحظة: يمكنك تعديل السعر بعد الاختبار حسب التكلفة والقيمة.",

    whoTitle: "لمن؟",
    whoSubtitle: "أفضل الاستخدامات:",
    whoA: "وكالات UGC (عدة عملاء)",
    whoB: "صنّاع UGC (سكربتات سريعة + ثبات)",
    whoC: "متاجر إلكترونية (briefs + مراجعة + تنظيم)",
    whoD: "فرق السوشيال ميديا (جودة + نظام)",

    premiumTitle: "ما الذي يجعل الإعلان قويًا",
    premiumSubtitle:
      "أفضل الإبداعات تجمع بين البنية، العاطفة، والتموضع.",
    premiumA: "هوكات نفسية",
    premiumB: "العاطفة والرغبة",
    premiumC: "التموضع والبراند",

    faqTitle: "الأسئلة الشائعة",
    faqQ1: "هل البيتا مجانية؟",
    faqA1:
      "نعم: 7 أيام مع قيود ضد الإساءة للحفاظ على الاستقرار.",
    faqQ2: "هل أشرح كيف تعمل؟",
    faqA2:
      "لا. بع النتيجة: تحليل الإعلانات، السكربتات، والتنظيم.",
    faqQ3: "هل أستطيع طلب ميزة؟",
    faqA3: "نعم. ملاحظات البيتا أولوية: نطوّر بسرعة.",

    feedbackTitle: "ملاحظات (بيتا)",
    feedbackSubtitle: "ساعدنا نتحسن: دقيقة واحدة فقط.",
    feedbackCTA: "إرسال ملاحظة",

    footer: "© UGC GROWTH — بيتا",
  },

  es: {
    navFeatures: "Funciones",
    navPricing: "Precio beta",
    navFAQ: "FAQ",
    navFeedback: "Feedback",
    navTerms: "Términos",

    badge: "Beta — 7 días gratis para pruebas (límites anti-abuso)",
    heroTitle: "Analiza los anuncios que funcionan. Genera scripts potentes en segundos.",
    heroSubtitle:
      "UGC Growth ayuda a creadores, agencias y marcas a analizar anuncios ganadores, extraer hooks potentes y generar scripts publicitarios listos para probar.",

    ctaDashboard: "Entrar al dashboard",
    ctaOffers: "Ver ofertas",
    ctaTerms: "Términos",

    featuresTitle: "Lo que hace realmente la plataforma",
    featuresSubtitle:
      "Análisis publicitario, generación de scripts y organización UGC en un solo flujo.",

    f1Title: "Análisis publicitario",
    f1Desc:
      "Sube audio y detecta el hook, la estructura, el ángulo y las ideas a reproducir.",
    f2Title: "Script Engine",
    f2Desc:
      "Genera hooks, scripts, CTA y estructuras listas para grabar.",
    f3Title: "Hooks y ángulos de marketing",
    f3Desc:
      "Encuentra más rápido qué decir, cómo decirlo y qué ángulo probar.",
    f4Title: "Organización agencia / creador",
    f4Desc:
      "Centraliza briefs, campañas, creadores y contenido en un espacio limpio.",
    f5Title: "Beta simple de probar",
    f5Desc:
      "7 días gratis para probar el valor del producto antes del despliegue completo.",
    f6Title: "Multi-idioma",
    f6Desc:
      "FR / EN / AR / ES / 中文 — útil para equipos y clientes internacionales.",

    pricingTitle: "Ofertas beta",
    pricingSubtitle:
      "Empieza gratis y luego pasa a un plan adaptado a tu volumen creativo.",

    planBetaTitle: "Test beta",
    planBetaPrice: "0€ / 7 días",
    planBetaNote: "Acceso limitado — ideal para demo",
    planBetaB1: "Acceso al dashboard",
    planBetaB2: "Script Engine (generaciones limitadas)",
    planBetaB3: "Feedback prioritario",

    planCreatorTitle: "Creator",
    planCreatorPrice: "Desde 99€",
    planCreatorNote: "Para creadores que publican mucho",
    planCreatorB1: "Más generaciones / mes",
    planCreatorB2: "Plantillas de guion",
    planCreatorB3: "Exportación fácil",

    planAgencyTitle: "Agency",
    planAgencyPrice: "Desde 299€",
    planAgencyNote: "Para equipos y multi-clientes",
    planAgencyB1: "Workspace agencia",
    planAgencyB2: "Pipeline UGC + guiones",
    planAgencyB3: "Soporte prioritario",

    pricingFootnote:
      "Nota: puedes ajustar precios tras pruebas (coste y valor percibido).",

    whoTitle: "¿Para quién?",
    whoSubtitle: "Casos ideales:",
    whoA: "Agencias UGC (multi-cliente)",
    whoB: "Creadores UGC (guiones rápidos + constancia)",
    whoC: "Marcas e-commerce (briefs + validación + organización)",
    whoD: "Equipos social media (proceso + calidad)",

    premiumTitle: "Qué hace fuerte a un anuncio",
    premiumSubtitle:
      "Las mejores creatividades combinan estructura, emoción y posicionamiento.",
    premiumA: "Hooks psicológicos",
    premiumB: "Emoción y deseo",
    premiumC: "Posicionamiento y branding",

    faqTitle: "FAQ",
    faqQ1: "¿La beta es gratis?",
    faqA1:
      "Sí: 7 días con límites anti-abuso para mantener estabilidad.",
    faqQ2: "¿Debo explicar cómo funciona?",
    faqA2:
      "No. Vendes resultado: análisis publicitario, guiones y organización.",
    faqQ3: "¿Puedo pedir una función?",
    faqA3: "Sí. Feedback prioritario en beta: iteramos rápido.",

    feedbackTitle: "Feedback (beta)",
    feedbackSubtitle: "Ayúdanos a mejorar: 1 minuto.",
    feedbackCTA: "Dar feedback",

    footer: "© UGC GROWTH — Beta",
  },

  zh: {
    navFeatures: "功能",
    navPricing: "测试版价格",
    navFAQ: "常见问题",
    navFeedback: "反馈",
    navTerms: "条款",

    badge: "测试版 — 免费 7 天（防滥用限制）",
    heroTitle: "分析有效广告。几秒内生成高表现脚本。",
    heroSubtitle:
      "UGC Growth 帮助创作者、机构和品牌分析有效广告，提取强势 hooks，并生成可直接测试的广告脚本。",

    ctaDashboard: "进入仪表盘",
    ctaOffers: "查看套餐",
    ctaTerms: "条款",

    featuresTitle: "平台真正能做什么",
    featuresSubtitle:
      "广告分析、脚本生成和 UGC 组织管理，集中在一个工作流中。",

    f1Title: "广告分析",
    f1Desc:
      "上传音频，识别 hook、结构、角度以及值得复用的创意。",
    f2Title: "Script Engine",
    f2Desc:
      "快速生成可直接拍摄的 hooks、scripts、CTA 和结构。",
    f3Title: "Hooks 与营销角度",
    f3Desc:
      "更快找到该说什么、怎么说、以及测试哪个角度。",
    f4Title: "机构 / 创作者组织",
    f4Desc:
      "把 briefs、campaigns、creators 和内容放进一个干净空间里。",
    f5Title: "简单易测的测试版",
    f5Desc:
      "免费 7 天测试产品价值，再决定是否全面使用。",
    f6Title: "多语言",
    f6Desc:
      "FR / EN / AR / ES / 中文 — 适合国际团队和客户。",

    pricingTitle: "测试版方案",
    pricingSubtitle:
      "先免费开始，再升级到适合你创意产能的方案。",

    planBetaTitle: "测试体验",
    planBetaPrice: "€0 / 7 天",
    planBetaNote: "限制访问 — 适合演示",
    planBetaB1: "仪表盘访问",
    planBetaB2: "Script Engine（生成次数限制）",
    planBetaB3: "优先反馈",

    planCreatorTitle: "Creator",
    planCreatorPrice: "€99 起",
    planCreatorNote: "适合高频发布创作者",
    planCreatorB1: "更多生成次数 / 月",
    planCreatorB2: "脚本模板",
    planCreatorB3: "便捷导出",

    planAgencyTitle: "Agency",
    planAgencyPrice: "€299 起",
    planAgencyNote: "适合团队与多客户管理",
    planAgencyB1: "机构工作区",
    planAgencyB2: "UGC 流程 + 脚本",
    planAgencyB3: "优先支持",

    pricingFootnote:
      "备注：可根据测试成本与价值感知调整价格。",

    whoTitle: "适合谁？",
    whoSubtitle: "最佳使用场景：",
    whoA: "UGC 机构（多客户）",
    whoB: "UGC 创作者（快速脚本 + 稳定产出）",
    whoC: "电商品牌（需求说明 + 审核 + 组织）",
    whoD: "社媒团队（流程 + 质量）",

    premiumTitle: "什么让广告更强",
    premiumSubtitle:
      "最好的创意结合了结构、情绪和定位。",
    premiumA: "心理型 hooks",
    premiumB: "情绪与欲望",
    premiumC: "定位与品牌感",

    faqTitle: "常见问题",
    faqQ1: "测试版免费吗？",
    faqA1:
      "是的：免费 7 天并带防滥用限制，保证稳定体验。",
    faqQ2: "需要解释怎么实现的吗？",
    faqA2:
      "不需要。你卖的是结果：广告分析、脚本和组织管理。",
    faqQ3: "可以提需求吗？",
    faqA3: "可以。测试版优先处理反馈，迭代很快。",

    feedbackTitle: "反馈（测试版）",
    feedbackSubtitle: "帮我们变更好：只需 1 分钟。",
    feedbackCTA: "提交反馈",

    footer: "© UGC GROWTH — 测试版",
  },
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Card({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-3 text-white/70">{desc}</div>
    </div>
  );
}

function PlanCard({
  title,
  price,
  note,
  bullets,
  highlight,
}: {
  title: string;
  price: string;
  note: string;
  bullets: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={cx(
        "rounded-3xl border border-white/10 bg-white/5 p-7",
        highlight && "border-purple-500/30 bg-purple-500/10"
      )}
    >
      <div className="flex items-baseline justify-between gap-4">
        <div className="text-lg font-semibold">{title}</div>
        <div className="font-semibold text-purple-300">{price}</div>
      </div>
      <div className="mt-2 text-sm text-white/60">{note}</div>
      <ul className="mt-5 space-y-2 text-white/80 list-disc pl-5">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

function LangButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "rounded-full border px-3 py-1 text-xs transition",
        active
          ? "border-purple-500/40 bg-purple-500/20 text-white"
          : "border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-white/20"
      )}
    >
      {label}
    </button>
  );
}

export default function Landing() {
  const [lang, setLang] = useState<Lang>("fr");
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [betaEmail, setBetaEmail] = useState("");
  const [betaLoading, setBetaLoading] = useState(false);
  const [betaError, setBetaError] = useState("");

  const t = useMemo(() => dict[lang], [lang]);

  const isRTL = lang === "ar";
  const langLabel: Record<Lang, string> = {
    fr: "FR",
    en: "EN",
    ar: "AR",
    es: "ES",
    zh: "中文",
  };

  async function submitBetaAccess() {
    setBetaError("");

    if (!betaEmail.trim() || !betaEmail.includes("@")) {
      setBetaError("Entre un email valide.");
      return;
    }

    try {
      setBetaLoading(true);

      const r = await fetch("/api/welcome", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: betaEmail.trim() }),
      });

      const data = await r.json();

      if (!r.ok || !data?.ok) {
        throw new Error(data?.error || "Impossible d'envoyer l'email.");
      }

      window.location.href = "/dashboard";
    } catch (e: any) {
      setBetaError(e?.message || "Erreur inconnue.");
    } finally {
      setBetaLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen bg-black text-white"
      dir={isRTL ? "rtl" : "ltr"}
      lang={lang}
    >
      <header className="mx-auto max-w-6xl px-6 py-10 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-600/80" />
          <div className="leading-tight">
            <div className="font-semibold">UGC GROWTH</div>
            <div className="text-xs text-white/60">Beta</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-4 text-sm">
          <a href="#features" className="text-white/70 hover:text-white">
            {t.navFeatures}
          </a>
          <a href="#pricing" className="text-white/70 hover:text-white">
            {t.navPricing}
          </a>
          <a href="#faq" className="text-white/70 hover:text-white">
            {t.navFAQ}
          </a>
          <Link href="/feedback" className="text-white/70 hover:text-white">
            {t.navFeedback}
          </Link>
          <Link href="/terms" className="text-white/70 hover:text-white">
            {t.navTerms}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {(Object.keys(langLabel) as Lang[]).map((l) => (
            <LangButton
              key={l}
              active={l === lang}
              label={langLabel[l]}
              onClick={() => setLang(l)}
            />
          ))}
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-6 md:py-12">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 md:p-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs text-white/80">
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            {t.badge}
          </div>

          <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">
            {t.heroTitle}
          </h1>

          <p className="mt-4 max-w-2xl text-white/70 md:text-lg">
            {t.heroSubtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => setShowEmailGate(true)}
              className="rounded-xl bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700"
            >
              {t.ctaDashboard}
            </button>

            <a
              href="#pricing"
              className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white/90 hover:border-white/25"
            >
              {t.ctaOffers}
            </a>

            <Link
              href="/terms"
              className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white/90 hover:border-white/25"
            >
              {t.ctaTerms}
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="font-semibold">Scripts prêts à tester</div>
              <div className="mt-2 text-sm text-white/70">
                Génère des hooks, scripts, angles marketing et CTA structurés pour lancer plus vite.
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="font-semibold">Analyse des pubs qui performent</div>
              <div className="mt-2 text-sm text-white/70">
                Upload un audio, détecte ce qui fonctionne et génère des scripts prêts à tester.
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="font-semibold">Pensé pour créateurs et agences</div>
              <div className="mt-2 text-sm text-white/70">
                Un seul espace pour organiser, générer, analyser et accélérer la production UGC.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold">{t.featuresTitle}</h2>
        <p className="mt-3 text-white/70">{t.featuresSubtitle}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card title={t.f1Title} desc={t.f1Desc} />
          <Card title={t.f2Title} desc={t.f2Desc} />
          <Card title={t.f3Title} desc={t.f3Desc} />
          <Card title={t.f4Title} desc={t.f4Desc} />
          <Card title={t.f5Title} desc={t.f5Desc} />
          <Card title={t.f6Title} desc={t.f6Desc} />
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold">{t.pricingTitle}</h2>
        <p className="mt-3 text-white/70">{t.pricingSubtitle}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <PlanCard
            title={t.planBetaTitle}
            price={t.planBetaPrice}
            note={t.planBetaNote}
            bullets={[t.planBetaB1, t.planBetaB2, t.planBetaB3]}
            highlight
          />
          <PlanCard
            title={t.planCreatorTitle}
            price={t.planCreatorPrice}
            note={t.planCreatorNote}
            bullets={[t.planCreatorB1, t.planCreatorB2, t.planCreatorB3]}
          />
          <PlanCard
            title={t.planAgencyTitle}
            price={t.planAgencyPrice}
            note={t.planAgencyNote}
            bullets={[t.planAgencyB1, t.planAgencyB2, t.planAgencyB3]}
          />
        </div>

        <div className="mt-6 text-sm text-white/60">{t.pricingFootnote}</div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10">
          <h2 className="text-3xl font-bold">{t.whoTitle}</h2>
          <p className="mt-3 text-white/70">{t.whoSubtitle}</p>
          <ul className="mt-6 grid gap-3 md:grid-cols-2 text-white/80 list-disc pl-5">
            <li>{t.whoA}</li>
            <li>{t.whoB}</li>
            <li>{t.whoC}</li>
            <li>{t.whoD}</li>
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-10">
          <h2 className="text-3xl font-bold">{t.premiumTitle}</h2>
          <p className="mt-3 text-white/70">{t.premiumSubtitle}</p>
          <ul className="mt-6 grid gap-3 md:grid-cols-3 text-white/90 list-disc pl-5">
            <li>{t.premiumA}</li>
            <li>{t.premiumB}</li>
            <li>{t.premiumC}</li>
          </ul>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold">{t.faqTitle}</h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="font-semibold">{t.faqQ1}</div>
            <div className="mt-3 text-white/70">{t.faqA1}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="font-semibold">{t.faqQ2}</div>
            <div className="mt-3 text-white/70">{t.faqA2}</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="font-semibold">{t.faqQ3}</div>
            <div className="mt-3 text-white/70">{t.faqA3}</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">{t.feedbackTitle}</h3>
            <p className="mt-2 text-white/70">{t.feedbackSubtitle}</p>
          </div>
          <Link
            href="/feedback"
            className="inline-flex justify-center rounded-xl bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700"
          >
            {t.feedbackCTA}
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-white/60 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div>{t.footer}</div>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-white">
              {t.navTerms}
            </Link>
            <Link href="/feedback" className="hover:text-white">
              {t.navFeedback}
            </Link>
          </div>
        </div>
      </footer>

      {showEmailGate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111118] p-6 text-white shadow-2xl">
            <h3 className="text-2xl font-bold">Accès bêta</h3>
            <p className="mt-2 text-white/70">
              Entre ton email pour recevoir le message de bienvenue puis accéder au dashboard.
            </p>

            <div className="mt-5 space-y-3">
              <input
                type="email"
                placeholder="ton@email.com"
                value={betaEmail}
                onChange={(e) => setBetaEmail(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 outline-none focus:border-white/40"
              />

              {betaError ? (
                <div className="text-sm text-red-400">{betaError}</div>
              ) : null}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowEmailGate(false);
                    setBetaError("");
                    setBetaEmail("");
                  }}
                  className="flex-1 rounded-xl border border-white/15 px-4 py-3 text-white/80 hover:border-white/30 hover:text-white"
                >
                  Annuler
                </button>

                <button
                  onClick={submitBetaAccess}
                  disabled={betaLoading}
                  className="flex-1 rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
                >
                  {betaLoading ? "Envoi..." : "Continuer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
