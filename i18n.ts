export const locales = ["fr", "en", "ar", "zh"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale = "fr";
