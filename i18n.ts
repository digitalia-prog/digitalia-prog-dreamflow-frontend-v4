export const locales = ["fr", "en", "en-GB", "ar", "zh", "es"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export function getDirection(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

