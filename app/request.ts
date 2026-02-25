import {getRequestConfig} from "next-intl/server";
import {locales, defaultLocale, type Locale} from "../i18n";

export default getRequestConfig(async ({requestLocale}) => {
  const locale =
    locales.includes(requestLocale as Locale)
      ? (requestLocale as Locale)
      : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
