"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {locales, type Locale} from "../../i18n";

const labels: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  "en-GB": "UK",
  ar: "AR",
  zh: "ZH",
  es: "ES"
};

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const parts = pathname.split("/");
  const current = (parts[1] || "fr") as Locale;

  return (
    <div className="flex gap-2">
      {locales.map((loc) => {
        const newPath = ["", loc, ...parts.slice(2)].join("/") || `/${loc}`;
        const active = loc === current;

        return (
          <Link
            key={loc}
            href={newPath}
            className={
              "rounded-full px-3 py-1 text-sm border " +
              (active
                ? "bg-white text-black border-white"
                : "text-white/80 border-white/20 hover:border-white/50")
            }
          >
            {labels[loc]}
          </Link>
        );
      })}
    </div>
  );
}

