"use client";

import { useRouter } from "next/navigation";

const LOCALES = ["fr", "en", "ar", "es", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

const LABELS: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  ar: "AR",
  es: "ES",
  zh: "中文",
};

function setLocaleCookie(locale: Locale) {
  document.cookie = `NEXT_LOCALE=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  localStorage.setItem("NEXT_LOCALE", locale);
}

export default function LanguageSwitcher({ value }: { value: Locale }) {
  const router = useRouter();

  const changeLocale = (locale: Locale) => {
    setLocaleCookie(locale);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => changeLocale(l)}
          className={
            "px-3 py-1 rounded-full text-sm border transition " +
            (value === l
              ? "bg-purple-600 text-white border-purple-600"
              : "bg-zinc-900 text-zinc-200 border-zinc-700 hover:border-zinc-500")
          }
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
