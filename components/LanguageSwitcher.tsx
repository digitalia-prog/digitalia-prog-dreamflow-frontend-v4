"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "../i18n";

const ITEMS: { locale: Locale; label: string }[] = [
  { locale: "fr", label: "FR" },
  { locale: "en", label: "EN" },
  { locale: "ar", label: "AR" },
  { locale: "zh", label: "ZH" },
];

function setCookie(name: string, value: string) {
  // cookie standard que next-intl lit via middleware
  document.cookie = `${name}=${value}; path=/; max-age=31536000; samesite=lax`;
}

export default function LanguageSwitcher() {
  const router = useRouter();
  const current = useLocale() as Locale;

  return (
    <div className="flex items-center gap-2">
      {ITEMS.map((it) => {
        const active = it.locale === current;
        return (
          <button
            key={it.locale}
            onClick={() => {
              setCookie("NEXT_LOCALE", it.locale);
              router.refresh();
            }}
            className={[
              "px-3 py-1 rounded-full text-xs font-semibold",
              "border border-white/10",
              "transition",
              active
                ? "bg-violet-600/90 text-white shadow-[0_0_0_1px_rgba(168,85,247,0.4),0_12px_30px_rgba(168,85,247,0.25)]"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
            ].join(" ")}
            aria-pressed={active}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
