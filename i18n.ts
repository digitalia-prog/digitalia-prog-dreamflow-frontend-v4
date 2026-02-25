import {getRequestConfig} from "next-intl/server";

export const locales = ["fr", "en", "ar", "zh"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({requestLocale}) => {
  const locale = (await requestLocale) ?? "fr";export const defaultLocale = "fr";

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
