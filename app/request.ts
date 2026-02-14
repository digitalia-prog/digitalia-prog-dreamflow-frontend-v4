import {getRequestConfig} from "next-intl/server";
import {locales, type Locale, defaultLocale} from "../i18n";

export default getRequestConfig(async ({requestLocale}) => {
  let locale = (await requestLocale) as Locale;

  if (!locales.includes(locale)) locale = defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});

