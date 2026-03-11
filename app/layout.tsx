import "./globals.css";
import { cookies } from "next/headers";
import AppHeader from "@/components/AppHeader";
import type { ReactNode } from "react";

export const metadata = {
  title: "Dreamflow",
  description: "Dreamflow SaaS",
};

type Locale = "fr" | "en" | "ar" | "zh";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();

  const locale =
    (cookieStore.get("NEXT_LOCALE")?.value as Locale) ?? "fr";

  return (
    <html lang={locale}>
      <body>
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
