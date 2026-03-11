"use client";

export type Locale = "fr" | "en" | "ar" | "es" | "zh";

export default function LanguageSwitcher({
  value = "fr",
}: {
  value?: Locale;
}) {
  const items: Locale[] = ["fr", "en", "ar", "es", "zh"];

  return (
    <div className="flex items-center gap-2">
      {items.map((locale) => (
        <button
          key={locale}
          type="button"
          className={`rounded-full border px-3 py-1 text-xs ${
            value === locale
              ? "border-white/40 bg-white/10 text-white"
              : "border-white/10 text-white/70"
          }`}
        >
          {locale === "zh" ? "中文" : locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
