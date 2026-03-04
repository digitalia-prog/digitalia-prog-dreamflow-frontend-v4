"use client";

import { useRouter } from "next/navigation";

const LOCALES = ["fr", "en", "ar", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

function setLocale(locale: Locale) {
  // Cookie pour le serveur
  document.cookie = `NEXT_LOCALE=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;

  // localStorage pour le client (landing + dashboard sync)
  localStorage.setItem("NEXT_LOCALE", locale);

  // événement global pour prévenir les pages
  window.dispatchEvent(new Event("locale-change"));
}

export default function LanguageSwitcher({ value }: { value: Locale }) {
  const router = useRouter();

  const changeLocale = (locale: Locale) => {
    setLocale(locale);
    router.refresh(); // re-render server components
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
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
