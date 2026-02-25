import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./i18n";

export default createMiddleware({
  locales,
  defaultLocale,
  // garde les URLs propres: /dashboard au lieu de /fr/dashboard
  localePrefix: "never",
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
