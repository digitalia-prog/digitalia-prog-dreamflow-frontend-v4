import {getRequestConfig} from "next-intl/server";

export const locales = ["fr", "en", "ar", "zh"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale = "fr";

export default getRequestConfig(async ({requestLocale}) => {
  const locale = (await requestLocale) ?? defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});

