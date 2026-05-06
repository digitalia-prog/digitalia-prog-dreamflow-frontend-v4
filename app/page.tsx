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
    navPricing: "Accès bêta",
    navFAQ: "FAQ",
    navFeedback: "Feedback",
    navTerms: "CGU",

    badge:
      "Accès bêta privé — 7 jours gratuits • Analyse créative • Scripts • Campagnes",
    heroTitle:
      "Analyse les vidéos qui performent. Transforme les meilleurs angles en campagnes prêtes à tester.",
    heroSubtitle:
      "UGC Growth aide les créateurs, agences et marques e-commerce à comprendre pourquoi une vidéo fonctionne, identifier les hooks, angles, émotions et structures gagnantes, puis générer des scripts et idées de campagnes exploitables rapidement.",

    ctaDashboard: "Tester gratuitement",
    ctaOffers: "Voir le workflow",
    ctaTerms: "Conditions",

    featuresTitle: "Un workflow complet pour créer plus vite",
    featuresSubtitle:
      "Analyse créative, scripts, angles marketing et organisation campagne dans un seul espace.",

    f1Title: "Analyse vidéo & audio",
    f1Desc:
      "Analyse une vidéo TikTok, YouTube ou un fichier uploadé pour détecter hook, structure, angle, psychologie et score viral.",
    f2Title: "Script Engine",
    f2Desc:
      "Génère des hooks, scripts AIDA, CTA, shotlist et variantes prêtes à tourner.",
    f3Title: "Angles marketing",
    f3Desc:
      "Trouve plus vite quoi dire, comment le dire et sous quel angle tester ta créa.",
    f4Title: "Workflow campagnes",
    f4Desc:
      "Passe de l’analyse à l’idée de campagne, avec un brief plus clair et des scripts exploitables.",
    f5Title: "Accès bêta privé",
    f5Desc:
      "7 jours gratuits pour tester le produit, donner ton retour et accéder au workflow en avant-première.",
    f6Title: "Multi-langue",
    f6Desc:
      "FR / EN / AR / ES / 中文 — pratique pour les équipes, créateurs et clients internationaux.",

    pricingTitle: "Accès bêta",
    pricingSubtitle:
      "Commence gratuitement, puis choisis un plan adapté à ton volume de création.",

    planBetaTitle: "Bêta privée",
    planBetaPrice: "0€ / 7 jours",
    planBetaNote: "Accès limité — idéal pour tester le workflow",
    planBetaB1: "Accès dashboard",
    planBetaB2: "Analyse vidéo + Script Engine limité",
    planBetaB3: "Feedback prioritaire",

    planCreatorTitle: "Creator",
    planCreatorPrice: "Bientôt disponible",
    planCreatorNote: "Pour créateurs qui veulent produire régulièrement",
    planCreatorB1: "Scripts Creator",
    planCreatorB2: "Templates de hooks",
    planCreatorB3: "Workflow simple",

    planAgencyTitle: "Agency",
    planAgencyPrice: "Bientôt disponible",
    planAgencyNote: "Pour agences, freelances et gestion multi-clients",
    planAgencyB1: "10 scripts Agency",
    planAgencyB2: "Pipeline campagnes",
    planAgencyB3: "Workflow avancé",

    pricingFootnote:
      "Les offres évolueront selon les retours bêta et les usages réels.",

    whoTitle: "Pour qui ?",
    whoSubtitle: "UGC Growth est pensé pour :",
    whoA: "Agences UGC et social media",
    whoB: "Créateurs UGC et créateurs TikTok",
    whoC: "Marques e-commerce",
    whoD: "Freelances marketing et media buyers",

    premiumTitle: "Ce qui rend une créa performante",
    premiumSubtitle:
      "Les meilleures vidéos combinent structure, émotion, timing et angle marketing.",
    premiumA: "Hooks psychologiques",
    premiumB: "Émotion et désir",
    premiumC: "Positionnement clair",

    faqTitle: "FAQ",
    faqQ1: "La bêta est gratuite ?",
    faqA1:
      "Oui : 7 jours de test avec limites d’usage pour garder une expérience stable.",
    faqQ2: "Est-ce que je dois comprendre la technique ?",
    faqA2:
      "Non. Le but est simple : analyser, comprendre, générer et tester plus vite.",
    faqQ3: "Puis-je proposer une amélioration ?",
    faqA3:
      "Oui. Les retours bêta sont prioritaires pour améliorer le produit rapidement.",

    feedbackTitle: "Feedback bêta",
    feedbackSubtitle:
      "Aide-nous à améliorer UGC Growth : ton retour compte énormément.",
    feedbackCTA: "Donner mon feedback",

    footer: "© UGC GROWTH — Bêta privée",
  },

  en: {
    navFeatures: "Features",
    navPricing: "Beta access",
    navFAQ: "FAQ",
    navFeedback: "Feedback",
    navTerms: "Terms",

    badge:
      "Private beta — 7 days free • Creative analysis • Scripts • Campaign workflow",
    heroTitle:
      "Analyze videos that perform. Turn winning angles into campaigns ready to test.",
    heroSubtitle:
      "UGC Growth helps creators, agencies and e-commerce brands understand why a video works, identify hooks, angles, emotions and structures, then generate scripts and campaign ideas faster.",

    ctaDashboard: "Start free",
    ctaOffers: "See workflow",
    ctaTerms: "Terms",

    featuresTitle: "A complete workflow to create faster",
    featuresSubtitle:
      "Creative analysis, scripts, marketing angles and campaign organization in one workspace.",

    f1Title: "Video & audio analysis",
    f1Desc:
      "Analyze TikTok, YouTube or uploaded files to detect hooks, structure, angle, psychology and viral score.",
    f2Title: "Script Engine",
    f2Desc:
      "Generate hooks, AIDA scripts, CTAs, shotlists and variants ready to film.",
    f3Title: "Marketing angles",
    f3Desc:
      "Find what to say, how to say it and which angle to test faster.",
    f4Title: "Campaign workflow",
    f4Desc:
      "Move from analysis to campaign idea with clearer briefs and usable scripts.",
    f5Title: "Private beta access",
    f5Desc:
      "7 free days to test the product, share feedback and access the workflow early.",
    f6Title: "Multi-language",
    f6Desc: "FR / EN / AR / ES / 中文 — built for international teams.",

    pricingTitle: "Beta access",
    pricingSubtitle:
      "Start free, then choose a plan adapted to your creative volume.",

    planBetaTitle: "Private beta",
    planBetaPrice: "€0 / 7 days",
    planBetaNote: "Limited access — ideal to test the workflow",
    planBetaB1: "Dashboard access",
    planBetaB2: "Video analysis + limited Script Engine",
    planBetaB3: "Priority feedback",

    planCreatorTitle: "Creator",
    planCreatorPrice: "Coming soon",
    planCreatorNote: "For creators who publish regularly",
    planCreatorB1: "Creator scripts",
    planCreatorB2: "Hook templates",
    planCreatorB3: "Simple workflow",

    planAgencyTitle: "Agency",
    planAgencyPrice: "Coming soon",
    planAgencyNote: "For agencies, freelancers and multi-client work",
    planAgencyB1: "10 Agency scripts",
    planAgencyB2: "Campaign pipeline",
    planAgencyB3: "Advanced workflow",

    pricingFootnote:
      "Plans will evolve based on beta feedback and real usage.",

    whoTitle: "Who is it for?",
    whoSubtitle: "UGC Growth is built for:",
    whoA: "UGC and social media agencies",
    whoB: "UGC creators and TikTok creators",
    whoC: "E-commerce brands",
    whoD: "Marketing freelancers and media buyers",

    premiumTitle: "What makes a creative perform",
    premiumSubtitle:
      "The best videos combine structure, emotion, timing and marketing angle.",
    premiumA: "Psychological hooks",
    premiumB: "Emotion and desire",
    premiumC: "Clear positioning",

    faqTitle: "FAQ",
    faqQ1: "Is the beta free?",
    faqA1:
      "Yes: 7 days with usage limits to keep the experience stable.",
    faqQ2: "Do I need to understand the technical side?",
    faqA2:
      "No. The goal is simple: analyze, understand, generate and test faster.",
    faqQ3: "Can I request an improvement?",
    faqA3:
      "Yes. Beta feedback is prioritized to improve the product quickly.",

    feedbackTitle: "Beta feedback",
    feedbackSubtitle:
      "Help us improve UGC Growth: your feedback matters.",
    feedbackCTA: "Give feedback",

    footer: "© UGC GROWTH — Private beta",
  },

  ar: {
    navFeatures: "الميزات",
    navPricing: "دخول البيتا",
    navFAQ: "الأسئلة",
    navFeedback: "ملاحظات",
    navTerms: "الشروط",

    badge: "بيتا خاصة — 7 أيام مجانًا • تحليل إبداعي • سكربتات • حملات",
    heroTitle:
      "حلّل الفيديوهات التي تنجح. وحوّل الزوايا القوية إلى حملات جاهزة للاختبار.",
    heroSubtitle:
      "UGC Growth يساعد المبدعين والوكالات والمتاجر على فهم لماذا ينجح المحتوى، واستخراج الهوكات والزوايا والمشاعر ثم إنشاء سكربتات وأفكار حملات بسرعة.",

    ctaDashboard: "ابدأ مجانًا",
    ctaOffers: "شاهد workflow",
    ctaTerms: "الشروط",

    featuresTitle: "Workflow كامل للإنتاج أسرع",
    featuresSubtitle:
      "تحليل إبداعي، سكربتات، زوايا تسويقية وتنظيم الحملات في مكان واحد.",

    f1Title: "تحليل فيديو وصوت",
    f1Desc:
      "حلّل TikTok أو YouTube أو الملفات المرفوعة لاستخراج الهوك والبنية والزاوية.",
    f2Title: "Script Engine",
    f2Desc: "أنشئ هوكات وسكربتات وCTA وshotlist جاهزة للتصوير.",
    f3Title: "زوايا تسويقية",
    f3Desc: "اعرف ماذا تقول وكيف تقوله وأي زاوية تختبرها.",
    f4Title: "Workflow الحملات",
    f4Desc: "حوّل التحليل إلى فكرة حملة وbrief واضح وسكربتات قابلة للتنفيذ.",
    f5Title: "دخول بيتا خاص",
    f5Desc: "7 أيام مجانية لتجربة المنتج وإرسال الملاحظات.",
    f6Title: "متعدد اللغات",
    f6Desc: "FR / EN / AR / ES / 中文 — مناسب للفرق الدولية.",

    pricingTitle: "دخول البيتا",
    pricingSubtitle: "ابدأ مجانًا ثم اختر الخطة المناسبة لحجم إنتاجك.",

    planBetaTitle: "بيتا خاصة",
    planBetaPrice: "0€ / 7 أيام",
    planBetaNote: "دخول محدود — مناسب لتجربة workflow",
    planBetaB1: "دخول dashboard",
    planBetaB2: "تحليل فيديو + Script Engine محدود",
    planBetaB3: "ملاحظات أولوية",

    planCreatorTitle: "Creator",
    planCreatorPrice: "قريبًا",
    planCreatorNote: "للمبدعين الذين ينشرون بانتظام",
    planCreatorB1: "سكربتات Creator",
    planCreatorB2: "قوالب hooks",
    planCreatorB3: "Workflow بسيط",

    planAgencyTitle: "Agency",
    planAgencyPrice: "قريبًا",
    planAgencyNote: "للوكالات والفريلانسرز والعملاء المتعددين",
    planAgencyB1: "10 سكربتات Agency",
    planAgencyB2: "Pipeline حملات",
    planAgencyB3: "Workflow متقدم",

    pricingFootnote: "العروض ستتطور حسب ملاحظات البيتا والاستخدام الفعلي.",

    whoTitle: "لمن؟",
    whoSubtitle: "UGC Growth مناسب لـ:",
    whoA: "وكالات UGC والسوشيال ميديا",
    whoB: "صنّاع المحتوى وTikTok creators",
    whoC: "علامات التجارة الإلكترونية",
    whoD: "فريلانسرز التسويق وmedia buyers",

    premiumTitle: "ما الذي يجعل الإبداع قويًا",
    premiumSubtitle: "أفضل الفيديوهات تجمع بين البنية والعاطفة والتوقيت والزاوية.",
    premiumA: "هوكات نفسية",
    premiumB: "العاطفة والرغبة",
    premiumC: "تموضع واضح",

    faqTitle: "الأسئلة الشائعة",
    faqQ1: "هل البيتا مجانية؟",
    faqA1: "نعم: 7 أيام مع حدود استخدام للحفاظ على الاستقرار.",
    faqQ2: "هل أحتاج لفهم التقنية؟",
    faqA2: "لا. الهدف بسيط: تحليل، فهم، إنشاء واختبار أسرع.",
    faqQ3: "هل أستطيع طلب تحسين؟",
    faqA3: "نعم. ملاحظات البيتا أولوية.",

    feedbackTitle: "ملاحظات البيتا",
    feedbackSubtitle: "ساعدنا على تحسين UGC Growth.",
    feedbackCTA: "إرسال feedback",

    footer: "© UGC GROWTH — بيتا خاصة",
  },

  es: {
    navFeatures: "Funciones",
    navPricing: "Acceso beta",
    navFAQ: "FAQ",
    navFeedback: "Feedback",
    navTerms: "Términos",

    badge:
      "Beta privada — 7 días gratis • Análisis creativo • Scripts • Campañas",
    heroTitle:
      "Analiza videos que funcionan. Convierte los mejores ángulos en campañas listas para probar.",
    heroSubtitle:
      "UGC Growth ayuda a creadores, agencias y marcas e-commerce a entender por qué un video funciona, identificar hooks, ángulos y emociones, y generar scripts e ideas de campaña rápidamente.",

    ctaDashboard: "Probar gratis",
    ctaOffers: "Ver workflow",
    ctaTerms: "Términos",

    featuresTitle: "Un workflow completo para crear más rápido",
    featuresSubtitle:
      "Análisis creativo, scripts, ángulos de marketing y organización de campañas en un solo espacio.",

    f1Title: "Análisis video y audio",
    f1Desc:
      "Analiza TikTok, YouTube o archivos subidos para detectar hook, estructura, ángulo y score viral.",
    f2Title: "Script Engine",
    f2Desc:
      "Genera hooks, scripts AIDA, CTA, shotlist y variantes listas para grabar.",
    f3Title: "Ángulos de marketing",
    f3Desc:
      "Encuentra qué decir, cómo decirlo y qué ángulo probar más rápido.",
    f4Title: "Workflow campañas",
    f4Desc:
      "Pasa del análisis a una idea de campaña con briefs claros y scripts accionables.",
    f5Title: "Acceso beta privado",
    f5Desc:
      "7 días gratis para probar el producto, compartir feedback y acceder antes.",
    f6Title: "Multi-idioma",
    f6Desc:
      "FR / EN / AR / ES / 中文 — útil para equipos internacionales.",

    pricingTitle: "Acceso beta",
    pricingSubtitle:
      "Empieza gratis y luego elige un plan adaptado a tu volumen creativo.",

    planBetaTitle: "Beta privada",
    planBetaPrice: "0€ / 7 días",
    planBetaNote: "Acceso limitado — ideal para probar el workflow",
    planBetaB1: "Acceso dashboard",
    planBetaB2: "Análisis video + Script Engine limitado",
    planBetaB3: "Feedback prioritario",

    planCreatorTitle: "Creator",
    planCreatorPrice: "Próximamente",
    planCreatorNote: "Para creadores que publican regularmente",
    planCreatorB1: "Scripts Creator",
    planCreatorB2: "Templates de hooks",
    planCreatorB3: "Workflow simple",

    planAgencyTitle: "Agency",
    planAgencyPrice: "Próximamente",
    planAgencyNote: "Para agencias, freelancers y multi-clientes",
    planAgencyB1: "10 scripts Agency",
    planAgencyB2: "Pipeline campañas",
    planAgencyB3: "Workflow avanzado",

    pricingFootnote:
      "Las ofertas evolucionarán según el feedback beta y el uso real.",

    whoTitle: "¿Para quién?",
    whoSubtitle: "UGC Growth está pensado para:",
    whoA: "Agencias UGC y social media",
    whoB: "Creadores UGC y TikTok creators",
    whoC: "Marcas e-commerce",
    whoD: "Freelancers marketing y media buyers",

    premiumTitle: "Qué hace que una creatividad funcione",
    premiumSubtitle:
      "Los mejores videos combinan estructura, emoción, timing y ángulo.",
    premiumA: "Hooks psicológicos",
    premiumB: "Emoción y deseo",
    premiumC: "Posicionamiento claro",

    faqTitle: "FAQ",
    faqQ1: "¿La beta es gratis?",
    faqA1: "Sí: 7 días con límites de uso para mantener estabilidad.",
    faqQ2: "¿Necesito entender la parte técnica?",
    faqA2:
      "No. El objetivo es simple: analizar, entender, generar y probar más rápido.",
    faqQ3: "¿Puedo pedir una mejora?",
    faqA3: "Sí. El feedback beta es prioritario.",

    feedbackTitle: "Feedback beta",
    feedbackSubtitle: "Ayúdanos a mejorar UGC Growth.",
    feedbackCTA: "Dar feedback",

    footer: "© UGC GROWTH — Beta privada",
  },

  zh: {
    navFeatures: "功能",
    navPricing: "测试访问",
    navFAQ: "常见问题",
    navFeedback: "反馈",
    navTerms: "条款",

    badge: "私人测试版 — 免费 7 天 • 创意分析 • 脚本 • Campaign workflow",
    heroTitle: "分析有效视频。把优秀角度转化为可测试的 Campaign。",
    heroSubtitle:
      "UGC Growth 帮助创作者、机构和电商品牌理解视频为什么有效，识别 hooks、角度、情绪和结构，并快速生成脚本和 Campaign 想法。",

    ctaDashboard: "免费开始",
    ctaOffers: "查看 workflow",
    ctaTerms: "条款",

    featuresTitle: "更快创作的完整 workflow",
    featuresSubtitle:
      "创意分析、脚本、营销角度和 Campaign 组织集中在一个空间。",

    f1Title: "视频和音频分析",
    f1Desc: "分析 TikTok、YouTube 或上传文件，识别 hook、结构和角度。",
    f2Title: "Script Engine",
    f2Desc: "生成 hooks、AIDA scripts、CTA、shotlist 和变体。",
    f3Title: "营销角度",
    f3Desc: "更快找到说什么、怎么说、测试哪个角度。",
    f4Title: "Campaign workflow",
    f4Desc: "从分析到 Campaign 想法、brief 和可执行脚本。",
    f5Title: "私人测试访问",
    f5Desc: "免费 7 天测试产品并提交反馈。",
    f6Title: "多语言",
    f6Desc: "FR / EN / AR / ES / 中文 — 适合国际团队。",

    pricingTitle: "测试版访问",
    pricingSubtitle: "先免费开始，再选择适合创作量的方案。",

    planBetaTitle: "私人测试版",
    planBetaPrice: "€0 / 7 天",
    planBetaNote: "限制访问 — 适合测试 workflow",
    planBetaB1: "Dashboard access",
    planBetaB2: "视频分析 + 限制版 Script Engine",
    planBetaB3: "优先反馈",

    planCreatorTitle: "Creator",
    planCreatorPrice: "即将推出",
    planCreatorNote: "适合稳定发布的创作者",
    planCreatorB1: "Creator scripts",
    planCreatorB2: "Hook templates",
    planCreatorB3: "Simple workflow",

    planAgencyTitle: "Agency",
    planAgencyPrice: "即将推出",
    planAgencyNote: "适合机构、自由职业者和多客户管理",
    planAgencyB1: "10 Agency scripts",
    planAgencyB2: "Campaign pipeline",
    planAgencyB3: "Advanced workflow",

    pricingFootnote: "方案会根据测试反馈和真实使用情况调整。",

    whoTitle: "适合谁？",
    whoSubtitle: "UGC Growth 适合：",
    whoA: "UGC 和社媒机构",
    whoB: "UGC creators 和 TikTok creators",
    whoC: "电商品牌",
    whoD: "营销自由职业者和 media buyers",

    premiumTitle: "什么让创意表现更好",
    premiumSubtitle: "最好的视频结合结构、情绪、时机和营销角度。",
    premiumA: "心理 hooks",
    premiumB: "情绪与欲望",
    premiumC: "清晰定位",

    faqTitle: "常见问题",
    faqQ1: "测试版免费吗？",
    faqA1: "是的：免费 7 天，并带有使用限制以保证稳定。",
    faqQ2: "需要懂技术吗？",
    faqA2: "不需要。目标很简单：分析、理解、生成并更快测试。",
    faqQ3: "可以提出改进建议吗？",
    faqA3: "可以。测试反馈会优先处理。",

    feedbackTitle: "测试反馈",
    feedbackSubtitle: "帮助我们改进 UGC Growth。",
    feedbackCTA: "提交反馈",

    footer: "© UGC GROWTH — 私人测试版",
  },
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Card({ title, desc }: { title: string; desc: string }) {
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
      <ul className="mt-5 list-disc space-y-2 pl-5 text-white/80">
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
          : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white"
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
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-600/80" />
          <div className="leading-tight">
            <div className="font-semibold">UGC GROWTH</div>
            <div className="text-xs text-white/60">Private beta</div>
          </div>
        </div>

        <nav className="hidden items-center gap-4 text-sm md:flex">
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

          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            {t.heroTitle}
          </h1>

          <p className="mt-4 max-w-3xl text-white/70 md:text-lg">
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
              href="#features"
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
              <div className="font-semibold">Analyse → Scripts</div>
              <div className="mt-2 text-sm text-white/70">
                Détecte ce qui fonctionne dans une vidéo et transforme l’insight
                en scripts prêts à tourner.
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="font-semibold">Hooks → Angles</div>
              <div className="mt-2 text-sm text-white/70">
                Identifie les accroches, émotions et angles qui peuvent guider
                tes prochains tests.
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="font-semibold">Scripts → Campagnes</div>
              <div className="mt-2 text-sm text-white/70">
                Organise tes idées, briefs et campagnes pour produire avec plus
                de clarté.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold md:text-4xl">{t.featuresTitle}</h2>
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
        <h2 className="text-3xl font-bold md:text-4xl">{t.pricingTitle}</h2>
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
          <ul className="mt-6 grid list-disc gap-3 pl-5 text-white/80 md:grid-cols-2">
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
          <ul className="mt-6 grid list-disc gap-3 pl-5 text-white/90 md:grid-cols-3">
            <li>{t.premiumA}</li>
            <li>{t.premiumB}</li>
            <li>{t.premiumC}</li>
          </ul>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold md:text-4xl">{t.faqTitle}</h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card title={t.faqQ1} desc={t.faqA1} />
          <Card title={t.faqQ2} desc={t.faqA2} />
          <Card title={t.faqQ3} desc={t.faqA3} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-10 md:flex-row md:items-center md:justify-between">
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
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
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
              Entre ton email pour activer ton accès et ouvrir le dashboard.
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
                  {betaLoading ? "Activation..." : "Activer mon accès"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
