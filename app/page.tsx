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

    badge: "Bêta — 7 jours gratuit pour tests (restrictions anti-abus)",
    heroTitle: "Le dashboard UGC qui génère et organise.",
    heroSubtitle:
      "Centralise campagnes, créateurs, briefs, et utilise le Script Engine IA (Viral / HAK) pour produire des scripts structurés rapidement.",

    ctaDashboard: "Accéder au dashboard",
    ctaOffers: "Voir les offres",
    ctaTerms: "Conditions (CGU)",

    featuresTitle: "Fonctionnalités clés", 
    featuresSubtitle: "Une démo simple et claire du dashboard UGC.",

    f1Title: "Scripts structurés & actionnables",
    f1Desc: "Output lisible (HOOK / STORY / PROBLÈME / SOLUTION / PREUVE / CTA), prêt à poster.",
    f2Title: "Viral mode + HAK",
    f2Desc: "Ajoute un “hack / twist / angle viral” sans tout réécrire.",
    f3Title: "Organisation UGC",
    f3Desc: "Campagnes, créateurs, assets, publication : une base clean.",
    f4Title: "Autosave",
    f4Desc: "Tu remplis 2–3 champs, tu génères, et tout reste sauvegardé.",
    f5Title: "Anti-abus intelligent",
    f5Desc: "Restrictions simples pour garder une bêta stable (pas besoin d’expliquer la techno).",
    f6Title: "Multi-langue",
    f6Desc: "FR / EN / AR / ES / 中文 — prêt pour agences & créateurs internationaux.",

    pricingTitle: "Prix (bêta)",
    pricingSubtitle: "",
     

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

    pricingFootnote: "Note : tu peux ajuster les prix après tests (selon coûts & valeur perçue).",

    whoTitle: "Pour qui ?",
    whoSubtitle: "Quand c’est utile (et rentable) :",
    whoA: "Agences UGC (gestion multi-clients)",
    whoB: "Créateurs UGC (scripts rapides + constance)",
    whoC: "Marques e-commerce (briefs + validation + organisation)",
    whoD: "Teams social media (process & qualité)",

    premiumTitle: "Premium — quand ça devient “sérieux”",
    premiumSubtitle: "Quand tes outputs deviennent vraiment :",
    premiumA: "Psychologiques",
    premiumB: "Émotionnels",
    premiumC: "Branding (ton + promesse + différenciation)",

    faqTitle: "FAQ",
    faqQ1: "La bêta est gratuite ?",
    faqA1: "Oui : 7 jours de test avec restrictions anti-abus, pour garder une expérience stable.",
    faqQ2: "Je dois expliquer comment ça fonctionne ?",
    faqA2: "Non. Tu vends un résultat : scripts + organisation. Les détails techniques ne sont pas nécessaires.",
    faqQ3: "Puis-je demander une feature ?",
    faqA3: "Oui. Le feedback est prioritaire en bêta : on itère vite.",

    feedbackTitle: "Feedback (bêta)",
    feedbackSubtitle: "Aide-nous à améliorer la plateforme : 1 minute, ultra précieux.",
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
    heroTitle: "The UGC dashboard that generates and organizes.",
    heroSubtitle:
      "Centralize campaigns, creators, briefs, and use the Script Engine (Viral / HAK) to produce structured scripts fast — without a “fake site”.",

    ctaDashboard: "Open dashboard",
    ctaOffers: "See offers",
    ctaTerms: "Terms",

    featuresTitle: "Key features",
    featuresSubtitle: "Goal: a clean demo that works — not an “empty MVP”.",

    f1Title: "Structured, actionable scripts",
    f1Desc: "Readable output (HOOK / STORY / PROBLEM / SOLUTION / PROOF / CTA), ready to post.",
    f2Title: "Viral mode + HAK",
    f2Desc: "Add a “hack / twist / viral angle” without rewriting everything.",
    f3Title: "UGC organization",
    f3Desc: "Campaigns, creators, assets, publishing: a clean base.",
    f4Title: "Autosave",
    f4Desc: "Fill 2–3 fields, generate, and everything stays saved.",
    f5Title: "Smart anti-abuse",
    f5Desc: "Simple limits to keep the beta stable (no need to explain the tech).",
    f6Title: "Multi-language",
    f6Desc: "FR / EN / AR / ES / 中文 — ready for international teams.",

    pricingTitle: "Pricing (beta)",
    pricingSubtitle:
      "In beta: we test with agencies & creators, 7 days free + anti-abuse limits. Then subscription.",

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

    pricingFootnote: "Note: you can adjust pricing after tests (costs & perceived value).",

    whoTitle: "Who is it for?",
    whoSubtitle: "Best use cases:",
    whoA: "UGC agencies (multi-client)",
    whoB: "UGC creators (fast scripts + consistency)",
    whoC: "E-commerce brands (briefs + validation + organization)",
    whoD: "Social media teams (process & quality)",

    premiumTitle: "Premium — when it gets serious",
    premiumSubtitle: "When your outputs become truly:",
    premiumA: "Psychological",
    premiumB: "Emotional",
    premiumC: "Branding-driven (tone + promise + differentiation)",

    faqTitle: "FAQ",
    faqQ1: "Is the beta free?",
    faqA1: "Yes: 7 days with anti-abuse limits to keep the experience stable.",
    faqQ2: "Do I need to explain how it works?",
    faqA2: "No. Sell outcomes: scripts + organization. Technical details aren’t needed.",
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
    heroTitle: "لوحة UGC التي تُولِّد وتُنظِّم.",
    heroSubtitle:
      "اجمع الحملات وصنّاع المحتوى والـ briefs، واستخدم Script Engine (Viral / HAK) لإنتاج سكربتات منظمة بسرعة — بدون “موقع وهمي”.",

    ctaDashboard: "الدخول للوحة التحكم",
    ctaOffers: "عرض الباقات",
    ctaTerms: "الشروط",

    featuresTitle: "الميزات الأساسية",
    featuresSubtitle: "هدفنا: ديمو نظيف يعمل — ليس “MVP فارغ”.",

    f1Title: "سكربتات منظمة وقابلة للتطبيق",
    f1Desc: "مخرجات واضحة (HOOK / STORY / PROBLEM / SOLUTION / PROOF / CTA) جاهزة للنشر.",
    f2Title: "Viral + HAK",
    f2Desc: "أضف “twist / hack” بدون إعادة كتابة كل شيء.",
    f3Title: "تنظيم UGC",
    f3Desc: "حملات، صنّاع، ملفات، نشر: قاعدة مرتبة.",
    f4Title: "حفظ تلقائي",
    f4Desc: "املأ 2–3 حقول، ولِّد، وكل شيء محفوظ.",
    f5Title: "مكافحة الإساءة",
    f5Desc: "قيود بسيطة للحفاظ على استقرار البيتا (لا حاجة لشرح التقنية).",
    f6Title: "تعدد اللغات",
    f6Desc: "FR / EN / AR / ES / 中文 — جاهز للعالم.",

    pricingTitle: "الأسعار (بيتا)",
    pricingSubtitle:
      "في البيتا: 7 أيام مجانية + قيود ضد الإساءة. بعد ذلك اشتراك.",

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

    pricingFootnote: "ملاحظة: يمكنك تعديل السعر بعد الاختبار حسب التكلفة والقيمة.",

    whoTitle: "لمن؟",
    whoSubtitle: "أفضل الاستخدامات:",
    whoA: "وكالات UGC (عدة عملاء)",
    whoB: "صنّاع UGC (سكربتات سريعة + ثبات)",
    whoC: "متاجر إلكترونية (briefs + مراجعة + تنظيم)",
    whoD: "فرق السوشيال ميديا (جودة + نظام)",

    premiumTitle: "Premium — عندما يصبح الموضوع جديًا",
    premiumSubtitle: "عندما تصبح المخرجات فعلًا:",
    premiumA: "نفسية",
    premiumB: "عاطفية",
    premiumC: "مرتبطة بالبراند (نبرة + وعد + تميّز)",

    faqTitle: "الأسئلة الشائعة",
    faqQ1: "هل البيتا مجانية؟",
    faqA1: "نعم: 7 أيام مع قيود ضد الإساءة للحفاظ على الاستقرار.",
    faqQ2: "هل أشرح كيف تعمل؟",
    faqA2: "لا. بيع النتيجة: سكربتات + تنظيم.",
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
    heroTitle: "El dashboard UGC que genera y organiza.",
    heroSubtitle:
      "Centraliza campañas, creadores, briefs, y usa el Script Engine (Viral / HAK) para crear guiones estructurados rápido — sin “sitio falso”.",

    ctaDashboard: "Entrar al dashboard",
    ctaOffers: "Ver ofertas",
    ctaTerms: "Términos",

    featuresTitle: "Funciones clave",
    featuresSubtitle: "Objetivo: una demo clara que funciona — no un “MVP vacío”.",

    f1Title: "Guiones estructurados y accionables",
    f1Desc: "Salida legible (HOOK / STORY / PROBLEMA / SOLUCIÓN / PRUEBA / CTA), lista para publicar.",
    f2Title: "Modo Viral + HAK",
    f2Desc: "Añade un “hack / giro / ángulo viral” sin reescribir todo.",
    f3Title: "Organización UGC",
    f3Desc: "Campañas, creadores, assets, publicación: base limpia.",
    f4Title: "Autosave",
    f4Desc: "Rellenas 2–3 campos, generas y queda guardado.",
    f5Title: "Anti-abuso inteligente",
    f5Desc: "Límites simples para mantener la beta estable (sin explicar la tecnología).",
    f6Title: "Multi-idioma",
    f6Desc: "FR / EN / AR / ES / 中文 — listo para internacional.",

    pricingTitle: "Precio (beta)",
    pricingSubtitle:
      "En beta: 7 días gratis + límites anti-abuso. Luego suscripción.",

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

    pricingFootnote: "Nota: puedes ajustar precios tras pruebas (coste y valor percibido).",

    whoTitle: "¿Para quién?",
    whoSubtitle: "Casos ideales:",
    whoA: "Agencias UGC (multi-cliente)",
    whoB: "Creadores UGC (guiones rápidos + constancia)",
    whoC: "Marcas e-commerce (briefs + validación + organización)",
    whoD: "Equipos social media (proceso + calidad)",

    premiumTitle: "Premium — cuando se pone serio",
    premiumSubtitle: "Cuando tus outputs son realmente:",
    premiumA: "Psicológicos",
    premiumB: "Emocionales",
    premiumC: "Branding (tono + promesa + diferenciación)",

    faqTitle: "FAQ",
    faqQ1: "¿La beta es gratis?",
    faqA1: "Sí: 7 días con límites anti-abuso para mantener estabilidad.",
    faqQ2: "¿Debo explicar cómo funciona?",
    faqA2: "No. Vendes resultado: guiones + organización.",
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
    heroTitle: "能生成、能组织的 UGC 仪表盘。",
    heroSubtitle:
      "集中管理活动、创作者与需求说明，使用 Script Engine（Viral / HAK）快速生成结构化脚本——不需要“假网站”。",

    ctaDashboard: "进入仪表盘",
    ctaOffers: "查看套餐",
    ctaTerms: "条款",

    featuresTitle: "核心功能",
    featuresSubtitle: "目标：一个干净、可用的演示，不是“空 MVP”。",

    f1Title: "结构化、可执行脚本",
    f1Desc: "清晰输出（HOOK / STORY / PROBLEM / SOLUTION / PROOF / CTA），可直接发布。",
    f2Title: "Viral + HAK",
    f2Desc: "无需重写即可添加“hack / twist / viral angle”。",
    f3Title: "UGC 组织管理",
    f3Desc: "活动、创作者、素材、发布：一套清爽底座。",
    f4Title: "自动保存",
    f4Desc: "填 2–3 个字段即可生成并自动保存。",
    f5Title: "防滥用机制",
    f5Desc: "简单限制保证测试版稳定（无需解释技术细节）。",
    f6Title: "多语言",
    f6Desc: "FR / EN / AR / ES / 中文 — 面向全球团队。",

    pricingTitle: "价格（测试版）",
    pricingSubtitle: "测试版：免费 7 天 + 防滥用限制。之后订阅。",

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

    pricingFootnote: "备注：可根据测试成本与价值感知调整价格。",

    whoTitle: "适合谁？",
    whoSubtitle: "最佳使用场景：",
    whoA: "UGC 机构（多客户）",
    whoB: "UGC 创作者（快速脚本 + 稳定产出）",
    whoC: "电商品牌（需求说明 + 审核 + 组织）",
    whoD: "社媒团队（流程 + 质量）",

    premiumTitle: "Premium — 当你要开始扩张",
    premiumSubtitle: "当输出变得真正：",
    premiumA: "更具心理驱动",
    premiumB: "更具情绪张力",
    premiumC: "更强品牌感（语气 + 承诺 + 差异化）",

    faqTitle: "常见问题",
    faqQ1: "测试版免费吗？",
    faqA1: "是的：免费 7 天并带防滥用限制，保证稳定体验。",
    faqQ2: "需要解释怎么实现的吗？",
    faqA2: "不需要。你卖的是结果：脚本 + 组织管理。",
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
  const t = useMemo(() => dict[lang], [lang]);

  const isRTL = lang === "ar";
  const langLabel: Record<Lang, string> = {
    fr: "FR",
    en: "EN",
    ar: "AR",
    es: "ES",
    zh: "中文",
  };

  return (
    <main
      className="min-h-screen bg-black text-white"
      dir={isRTL ? "rtl" : "ltr"}
      lang={lang}
    >
      {/* Header */}
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

        {/* Language switch */}
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

      {/* Hero */}
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
            <Link
              href="/dashboard"
              className="rounded-xl bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700"
            >
              {t.ctaDashboard}
            </Link>

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

          {/* Small feature row */}
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="font-semibold">Script Engine (Viral + HAK)</div>
              <div className="mt-2 text-sm text-white/70">
                Hooks + story + objections + proof + CTA. Format clair, prêt à tourner.
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="font-semibold">Workflow agence & créateur</div>
              <div className="mt-2 text-sm text-white/70">
                Pipeline simple : briefs, creators, scripts, validations, publications.
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="font-semibold">Multi-langue</div>
              <div className="mt-2 text-sm text-white/70">
                FR/EN/AR/ES/中文 — extensible selon besoins.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
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

      {/* Pricing */}
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

      {/* Who is it for */}
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

      {/* Premium section */}
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

      {/* FAQ */}
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

      {/* Feedback */}
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
    </main>
  );
}
