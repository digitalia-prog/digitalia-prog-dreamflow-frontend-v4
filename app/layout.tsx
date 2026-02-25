import "./globals.css";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export const metadata = {
  title: "Digitalia Dashboard",
  description: "UGC Growth SaaS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 999,
          }}
        >
          <LanguageSwitcher />
        </div>

        {children}
      </body>
    </html>
  );
}
