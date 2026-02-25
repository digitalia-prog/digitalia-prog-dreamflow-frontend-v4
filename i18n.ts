import {getRequestConfig} from "next-intl/server";

export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async () => ({
  locale: "fr",
  messages: (await import("./messages/fr.json")).default,
}));
