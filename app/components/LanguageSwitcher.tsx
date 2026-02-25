"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "../../i18n";

const labels: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  ar: "AR",
  zh: "中文",
};

export default function LanguageSwitcher() {
  const pathname = usePathname() || "/";

  // Switch simple via query (?lang=xx).
  // Si tu veux le switch "vrai" (cookie + middleware), dis-moi après.
  return (
    <div className="flex items-center gap-2">
      {locales.map((l) => (
        <Link
          key={l}
          href={`${pathname}?lang=${l}`}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
        >
          {labels[l]}
        </Link>
      ))}
    </div>
  );
}
