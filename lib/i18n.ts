"use client";

import { useEffect, useMemo, useState } from "react";

export type Lang = "fr" | "en" | "ar" | "es" | "zh";

export const LANGS: Lang[] = ["fr", "en", "ar", "es", "zh"];

export const langLabel: Record<Lang, string> = {
  fr: "FR",
  en: "EN",
  ar: "AR",
  es: "ES",
  zh: "中文",
};

export function isRTL(lang: Lang) {
  return lang === "ar";
}

export function getSavedLang(fallback: Lang = "fr"): Lang {
  if (typeof window === "undefined") return fallback;
  const raw = window.localStorage.getItem("lang");
  if (raw === "fr" || raw === "en" || raw === "ar" || raw === "es" || raw === "zh") return raw;
  return fallback;
}

export function saveLang(lang: Lang) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("lang", lang);
}

type Dict = Record<string, Record<Lang, string>>;

/**
 * Dictionnaire global (UI)
 * -> tu ajoutes ici au fur et à mesure, et TOUT le site suit.
 */
export const dict: Dict = {
  // NAV / GLOBAL
  "nav.features": { fr: "Fonctionnalités", en: "Features", ar: "الميزات", es: "Funciones", zh: "功能" },
  "nav.pricing": { fr: "Prix", en: "Pricing", ar: "الأسعار", es: "Precios", zh: "定价" },
  "nav.terms": { fr: "CGU", en: "Terms", ar: "الشروط", es: "Términos", zh: "条款" },

  // LANDING
  "landing.badge": {
    fr: "Version bêta — accès sur devis",
    en: "Beta — access by request",
    ar: "نسخة تجريبية — الوصول حسب الطلب",
    es: "Beta — acceso bajo solicitud",
    zh: "测试版 — 需申请访问",
  },
  "landing.title": { fr: "UGC GROWTH", en: "UGC GROWTH", ar: "UGC GROWTH", es: "UGC GROWTH", zh: "UGC GROWTH" },
  "landing.subtitle": {
    fr: "La plateforme simple pour gérer vos campagnes UGC, créateurs et clients depuis un seul endroit.",
    en: "A simple platform to manage UGC campaigns, creators, and clients in one place.",
    ar: "منصة بسيطة لإدارة حملات UGC وصنّاع المحتوى والعملاء في مكان واحد.",
    es: "Una plataforma simple para gestionar campañas UGC, creadores y clientes en un solo lugar.",
    zh: "一个简单的平台，在一个地方管理UGC活动、创作者和客户。",
  },

  // SCRIPT ENGINE
  "engine.title": { fr: "Script Engine", en: "Script Engine", ar: "محرك السكربت", es: "Motor de guion", zh: "脚本引擎" },
  "engine.generate": { fr: "Générer", en: "Generate", ar: "إنشاء", es: "Generar", zh: "生成" },
  "engine.loading": { fr: "Génération…", en: "Generating…", ar: "جارٍ الإنشاء…", es: "Generando…", zh: "生成中…" },
  "engine.output": { fr: "Sortie", en: "Output", ar: "المخرجات", es: "Salida", zh: "输出" },

  // ANTI-ABUS (sans mot API)
  "antiabuse.title": {
    fr: "Protection anti-abus",
    en: "Anti-abuse protection",
    ar: "حماية من الإساءة",
    es: "Protección anti-abuso",
    zh: "防滥用保护",
  },
  "antiabuse.desc": {
    fr: "Des restrictions automatiques protègent la plateforme contre les abus (limites d’usage et détection d’activité anormale).",
    en: "Automatic restrictions protect the platform from abuse (usage limits and abnormal activity detection).",
    ar: "قيود تلقائية تحمي المنصة من الإساءة (حدود الاستخدام وكشف النشاط غير الطبيعي).",
    es: "Restricciones automáticas protegen la plataforma contra abusos (límites de uso y detección de actividad anormal).",
    zh: "自动限制保护平台免受滥用（使用限额与异常活动检测）。",
  },
};

export function useI18n(initial: Lang = "fr") {
  const [lang, setLang] = useState<Lang>(initial);

  useEffect(() => {
    setLang(getSavedLang(initial));
  }, [initial]);

  const t = useMemo(() => {
    return (key: string) => {
      const row = dict[key];
      if (!row) return key; // si clé manquante
      return row[lang] || row.fr || key;
    };
  }, [lang]);

  const setAndSave = (l: Lang) => {
    setLang(l);
    saveLang(l);
  };

  return { lang, setLang: setAndSave, t, rtl: isRTL(lang) };
}
