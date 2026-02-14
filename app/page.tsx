"use client";

import { useEffect, useMemo, useState } from "react";

type Lang = "fr" | "en" | "uk" | "es" | "ar" | "zh";

const LANGS: { code: Lang; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "uk", label: "UK" }, // English UK (copy)
  { code: "es", label: "ES" },
  { code: "ar", label: "AR" },
  { code: "zh", label: "ZH" },
];

const i18n: Record<
  Lang,
  {
    title: string;
    subtitle: string;
    chips: string;
    ctaPrimary: string;
    ctaSecondary: string;
    modulesTitle: string;
    pricingTitle: string;
    pricingNote: string;
    plans: {
      name: string;
      price: string;
      desc: string;
      bullets: string[];
      cta: string;
      highlight?: boolean;
    }[];
    faqTitle: string;
    faq: { q: string; a: string }[];
  }
> = {
  fr: {
    title: "Plateforme UGC pour agences internationales",
    subtitle:
      "Gère tes campagnes, créateurs et clients multi-pays depuis un seul dashboard.",
    chips: "FR / US / UK / ES / CN / AR — Dashboard + IA scripts localisés",
    ctaPrimary: "Accéder au Dashboard",
    ctaSecondary: "Voir les fonctionnalités",
    modulesTitle: "Modules clés",
    pricingTitle: "Tarifs (Bêta)",
    pricingNote:
      "Paiement mensuel • Annulable à tout moment • Prix en € (EUR).",
    plans: [
      {
        name: "Free",
        price: "0€ / mois",
        desc: "Tester rapidement le générateur.",
        bullets: ["10 scripts / mois", "Watermark (logo)", "Accès dashboard basique"],
        cta: "Commencer",
      },
      {
        name: "Starter",
        price: "19€ / mois",
        desc: "Pour une petite agence / 1 client actif.",
        bullets: [
          "100 scripts / mois",
          "Sans watermark",
          "1 réseau (TikTok ou Instagram)",
          "Exports simples",
        ],
        cta: "Passer en Starter",
      },
      {
        name: "Pro",
        price: "59€ / mois",
        desc: "Pour agences qui veulent scaler proprement.",
        bullets: [
          "500 scripts / mois",
          "Hooks / prompts / hashtags / CTA localisés",
          "Multi-réseaux",
          "Analytics + tendances",
          "Multi-clients",
        ],
        cta: "Passer en Pro",
        highlight: true,
      },
    ],
    faqTitle: "FAQ",
    faq: [
      {
        q: "Pourquoi plusieurs langues ?",
        a: "Parce que tes clients sont internationaux : tu adaptes hooks, scripts et CTA au pays, au style et à la langue.",
      },
      {
        q: "Je paie en euro même si je suis hors UE ?",
        a: "Oui, le prix est affiché en EUR. On pourra ajouter une conversion automatique plus tard (option).",
      },
      {
        q: "Et si un bug arrive ?",
        a: "En SaaS c’est normal d’avoir des correctifs. L’important c’est : stabilité, logs, suivi, et un process de déploiement propre (tu gardes ta crédibilité).",
      },
    ],
  },
  en: {
    title: "UGC platform for international agencies",
    subtitle: "Manage campaigns, creators and multi-country clients in one dashboard.",
    chips: "FR / US / UK / ES / CN / AR — Dashboard + localized AI scripts",
    ctaPrimary: "Go to Dashboard",
    ctaSecondary: "See features",
    modulesTitle: "Core modules",
    pricingTitle: "Pricing (Beta)",
    pricingNote: "Monthly billing • Cancel anytime • Prices in EUR (€).",
    plans: [
      {
        name: "Free",
        price: "€0 / mo",
        desc: "Quick test of the generator.",
        bullets: ["10 scripts / month", "Watermark (logo)", "Basic dashboard access"],
        cta: "Start",
      },
      {
        name: "Starter",
        price: "€19 / mo",
        desc: "For small agencies / 1 active client.",
        bullets: ["100 scripts / month", "No watermark", "1 social network", "Simple exports"],
        cta: "Choose Starter",
      },
      {
        name: "Pro",
        price: "€59 / mo",
        desc: "For agencies scaling seriously.",
        bullets: [
          "500 scripts / month",
          "Localized hooks/prompts/hashtags/CTAs",
          "Multi-network",
          "Analytics + trends",
          "Multi-clients",
        ],
        cta: "Choose Pro",
        highlight: true,
      },
    ],
    faqTitle: "FAQ",
    faq: [
      { q: "Why multiple languages?", a: "Because your clients are global: scripts and CTAs must match each market." },
      { q: "Do I pay in EUR outside Europe?", a: "Yes. Automatic conversion can be added later." },
      { q: "What if a bug happens?", a: "Fixes are normal in SaaS. What matters is stability + a clean release process." },
    ],
  },
  uk: {
    title: "UGC platform for UK agencies",
    subtitle: "Run campaigns, creators and multi-country clients from one dashboard.",
    chips: "FR / US / UK / ES / CN / AR — Dashboard + UK-ready AI scripts",
    ctaPrimary: "Open Dashboard",
    ctaSecondary: "View features",
    modulesTitle: "Core modules",
    pricingTitle: "Pricing (Beta)",
    pricingNote: "Monthly • Cancel anytime • EUR (€).",
    plans: [
      {
        name: "Free",
        price: "€0 / mo",
        desc: "Try the generator quickly.",
        bullets: ["10 scripts / month", "Watermark (logo)", "Basic dashboard access"],
        cta: "Start",
      },
      {
        name: "Starter",
        price: "€19 / mo",
        desc: "Small agency / 1 active client.",
        bullets: ["100 scripts / month", "No watermark", "1 social network", "Simple exports"],
        cta: "Choose Starter",
      },
      {
        name: "Pro",
        price: "€59 / mo",
        desc: "For agencies scaling properly.",
        bullets: [
          "500 scripts / month",
          "Localized hooks/prompts/hashtags/CTAs",
          "Multi-network",
          "Analytics + trends",
          "Multi-clients",
        ],
        cta: "Choose Pro",
        highlight: true,
      },
    ],
    faqTitle: "FAQ",
    faq: [
      { q: "Why UK language?", a: "Because UK ad style and wording differ (tone, slang, compliance)." },
      { q: "EUR pricing?", a: "Yes for now. Conversion can come later." },
      { q: "Bugs?", a: "Normal. We ship fixes fast and keep releases stable." },
    ],
  },
  es: {
    title: "Plataforma UGC para agencias internacionales",
    subtitle: "Gestiona campañas, creadores y clientes multi-país desde un solo panel.",
    chips: "FR / US / UK / ES / CN / AR — Panel + guiones IA localizados",
    ctaPrimary: "Ir al Dashboard",
    ctaSecondary: "Ver funciones",
    modulesTitle: "Módulos clave",
    pricingTitle: "Precios (Beta)",
    pricingNote: "Mensual • Cancela cuando quieras • EUR (€).",
    plans: [
      {
        name: "Free",
        price: "0€ / mes",
        desc: "Probar el generador.",
        bullets: ["10 guiones / mes", "Marca de agua (logo)", "Panel básico"],
        cta: "Empezar",
      },
      {
        name: "Starter",
        price: "19€ / mes",
        desc: "Agencia pequeña / 1 cliente activo.",
        bullets: ["100 guiones / mes", "Sin marca de agua", "1 red social", "Exportaciones simples"],
        cta: "Elegir Starter",
      },
      {
        name: "Pro",
        price: "59€ / mes",
        desc: "Para escalar en serio.",
        bullets: [
          "500 guiones / mes",
          "Hooks / prompts / hashtags / CTA localizados",
          "Multi-red",
          "Analíticas + tendencias",
          "Multi-clientes",
        ],
        cta: "Elegir Pro",
        highlight: true,
      },
    ],
    faqTitle: "FAQ",
    faq: [
      { q: "¿Por qué varios idiomas?", a: "Porque tus clientes son internacionales: el copy debe adaptarse al mercado." },
      { q: "¿Pago en EUR?", a: "Sí. Luego se puede añadir conversión automática." },
      { q: "¿Y si hay un bug?", a: "En SaaS es normal. Lo importante es un proceso de corrección estable." },
    ],
  },
  ar: {
    title: "منصة UGC للوكالات الدولية",
    subtitle: "إدارة الحملات وصناع المحتوى والعملاء متعددَي الدول من لوحة تحكم واحدة.",
    chips: "FR / US / UK / ES / CN / AR — لوحة تحكم + نصوص ذكاء اصطناعي محلية",
    ctaPrimary: "الدخول إلى لوحة التحكم",
    ctaSecondary: "عرض المميزات",
    modulesTitle: "الوحدات الأساسية",
    pricingTitle: "الأسعار (بيتا)",
    pricingNote: "دفع شهري • إلغاء في أي وقت • الأسعار باليورو (€).",
    plans: [
      {
        name: "Free",
        price: "0€ / شهر",
        desc: "تجربة سريعة للمولد.",
        bullets: ["10 نصوص / شهر", "علامة مائية (شعار)", "لوحة تحكم أساسية"],
        cta: "ابدأ",
      },
      {
        name: "Starter",
        price: "19€ / شهر",
        desc: "لوكالة صغيرة / عميل واحد نشط.",
        bullets: ["100 نص / شهر", "بدون علامة مائية", "شبكة واحدة", "تصدير بسيط"],
        cta: "اختر Starter",
      },
      {
        name: "Pro",
        price: "59€ / شهر",
        desc: "للوكالات التي تريد التوسع بجدية.",
        bullets: [
          "500 نص / شهر",
          "Hooks/Prompts/Hashtags/CTA محلية",
          "متعدد الشبكات",
          "تحليلات + ترند",
          "متعدد العملاء",
        ],
        cta: "اختر Pro",
        highlight: true,
      },
    ],
    faqTitle: "الأسئلة الشائعة",
    faq: [
      { q: "لماذا عدة لغات؟", a: "لأن عملاءك دوليون: يجب تكييف النصوص حسب السوق." },
      { q: "الدفع باليورو؟", a: "نعم حالياً. يمكن إضافة تحويل لاحقاً." },
      { q: "ماذا لو حدث خطأ؟", a: "طبيعي في SaaS. المهم الاستقرار وعملية إصدار نظيفة." },
    ],
  },
  zh: {
    title: "国际UGC代理平台",
    subtitle: "在一个仪表盘中管理活动、创作者与多国家客户。",
    chips: "FR / US / UK / ES / CN / AR — 仪表盘 + 本地化AI脚本",
    ctaPrimary: "进入仪表盘",
    ctaSecondary: "查看功能",
    modulesTitle: "核心模块",
    pricingTitle: "价格（Beta）",
    pricingNote: "按月付费 • 随时取消 • 价格为欧元 (€)。",
    plans: [
      {
        name: "Free",
        price: "0€ / 月",
        desc: "快速体验生成器。",
        bullets: ["每月10条脚本", "水印（logo）", "基础仪表盘"],
        cta: "开始",
      },
      {
        name: "Starter",
        price: "19€ / 月",
        desc: "小型代理 / 1个活跃客户。",
        bullets: ["每月100条脚本", "无水印", "1个平台", "基础导出"],
        cta: "选择 Starter",
      },
      {
        name: "Pro",
        price: "59€ / 月",
        desc: "严肃扩张用。",
        bullets: ["每月500条脚本", "本地化 hooks/hashtags/CTA", "多平台", "分析 + 趋势", "多客户"],
        cta: "选择 Pro",
        highlight: true,
      },
    ],
    faqTitle: "常见问题",
    faq: [
      { q: "为什么多语言？", a: "因为客户是全球的：脚本必须匹配市场语言与风格。" },
      { q: "用欧元付款？", a: "是的。后续可加自动换算。" },
      { q: "如果出现 bug？", a: "SaaS 里很正常，关键是稳定与快速修复流程。" },
    ],
  },
};

function getDir(lang: Lang) {
  return lang === "ar" ? "rtl" : "ltr";
}

function getLangFromUrl(): Lang {
  if (typeof window === "undefined") return "fr";
  const url = new URL(window.location.href);
  const q = url.searchParams.get("lang") as Lang | null;
  if (q && ["fr", "en", "uk", "es", "ar", "zh"].includes(q)) return q;
  const saved = (localStorage.getItem("lang") as Lang | null) ?? null;
  if (saved && ["fr", "en", "uk", "es", "ar", "zh"].includes(saved)) return saved;
  return "fr";
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("fr");

  useEffect(() => {
    setLang(getLangFromUrl());
  }, []);

  const t = useMemo(() => i18n[lang], [lang]);
  const dir = getDir(lang);

  function switchLang(next: Lang) {
    setLang(next);
    try {
      localStorage.setItem("lang", next);
      const url = new URL(window.location.href);
      url.searchParams.set("lang", next);
      window.history.replaceState({}, "", url.toString());
    } catch {
      // ignore
    }
  }

  return (
    <main dir={dir} className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl border border-purple-500/60 bg-purple-500/10" />
            <div className="leading-tight">
              <div className="font-semibold">UGC Agency Pro</div>
              <div className="text-xs text-white/60">International dashboard</div>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => switchLang(l.code)}
                className={[
                  "rounded-full border px-3 py-1 text-xs font-medium transition",
                  lang === l.code
                    ? "border-purple-500 bg-purple-500/15 text-white"
                    : "border-white/15 text-white/80 hover:border-white/30",
                ].join(" ")}
              >
                {l.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-14 pb-10">
        <div className="rounded-3xl border border-purple-500/40 bg-gradient-to-b from-purple-500/10 to-transparent p-8 md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80">
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            {t.chips}
          </div>

          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
            {t.title}
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-white/75">
            {t.subtitle}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="/dashboard"
              className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold hover:bg-purple-500"
            >
              {t.ctaPrimary}
            </a>
            <a
              href="#features"
              className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/90 hover:border-white/30"
            >
              {t.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-2xl font-bold">{t.modulesTitle}</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { title: "Campagnes", desc: "Suivi KPI, performance et reporting clients." },
            { title: "Créateurs", desc: "Casting, scoring et suivi livrables (propre)." },
            { title: "IA Scripts", desc: "Hooks, scripts, hashtags, CTA adaptés au marché." },
            { title: "Analytics", desc: "Audience, conversion, tendances, insights." },
            { title: "Multi-clients", desc: "Gérer plusieurs clients sans chaos." },
            { title: "International", desc: "Multi-langues, multi-pays, base scalable." },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="text-sm font-semibold">{c.title}</div>
              <div className="mt-2 text-sm text-white/70">{c.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{t.pricingTitle}</h2>
            <p className="mt-2 text-sm text-white/60">{t.pricingNote}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {t.plans.map((p) => (
            <div
              key={p.name}
              className={[
                "rounded-2xl border p-6",
                p.highlight
                  ? "border-purple-500/60 bg-purple-500/10"
                  : "border-white/10 bg-white/5",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold">{p.name}</div>
                {p.highlight ? (
                  <span className="rounded-full border border-purple-500/50 bg-purple-500/10 px-3 py-1 text-xs text-white/90">
                    Best value
                  </span>
                ) : null}
              </div>

              <div className="mt-3 text-3xl font-extrabold">{p.price}</div>
              <div className="mt-2 text-sm text-white/70">{p.desc}</div>

              <ul className="mt-4 space-y-2 text-sm text-white/75">
                {p.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-purple-500" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <a
                href="/checkout"
                className={[
                  "mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition",
                  p.highlight
                    ? "bg-purple-600 hover:bg-purple-500"
                    : "border border-white/15 hover:border-white/30",
                ].join(" ")}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-2xl font-bold">{t.faqTitle}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {t.faq.map((item) => (
            <div key={item.q} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="font-semibold">{item.q}</div>
              <div className="mt-2 text-sm text-white/70">{item.a}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto max-w-6xl px-6 text-sm text-white/60">
          © {new Date().getFullYear()} UGC Agency Pro • Built for international agencies
        </div>
      </footer>
    </main>
  );
}
