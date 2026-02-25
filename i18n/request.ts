import {getRequestConfig} from "next-intl/server";

export const locales = ["fr", "en", "ar", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;

  const locale: Locale =
    locales.includes(requested as Locale)
      ? (requested as Locale)
      : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
