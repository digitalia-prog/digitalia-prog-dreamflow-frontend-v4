import { getRequestConfig } from "next-intl/server";
import { defaultLocale, locales, type Locale } from "../i18n";

export default getRequestConfig(async ({ requestLocale }) => {
  // next-intl te donne parfois une Promise => on await
  const requested = await requestLocale;

  const locale: Locale =
    requested && locales.includes(requested as Locale)
      ? (requested as Locale)
      : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
