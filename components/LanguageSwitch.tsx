"use client";

import { LANGS, langLabel, useI18n } from "@/lib/i18n";

export default function LanguageSwitch() {
  const { lang, setLang } = useI18n("fr");

  return (
    <div className="flex items-center gap-2">
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2 py-1 rounded-md text-xs border ${
            lang === l
              ? "border-white/40 bg-white/10"
              : "border-white/10 hover:border-white/25"
          }`}
          type="button"
        >
          {langLabel[l]}
        </button>
      ))}
    </div>
  );
}
