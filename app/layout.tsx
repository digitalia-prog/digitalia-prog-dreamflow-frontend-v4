import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "../globals.css";

import LanguageSwitcher from "../components/LanguageSwitcher";

export const metadata: Metadata = {
  title: "Digitalia Dashboard",
  description: "UGC Growth SaaS",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-[#0b0b10] text-white">
        <NextIntlClientProvider messages={messages}>
          {/* mini topbar pour switch partout (landing + dashboard) */}
          <div className="fixed top-4 right-4 z-[9999]">
            <LanguageSwitcher />
          </div>

          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
