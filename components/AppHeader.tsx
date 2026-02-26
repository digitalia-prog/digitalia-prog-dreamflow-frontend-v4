import LanguageSwitcher, { Locale } from "./LanguageSwitcher";

export default function AppHeader({ locale }: { locale: Locale }) {
  return (
    <header className="w-full flex items-center justify-end px-6 py-3 bg-zinc-950 border-b border-zinc-800">
      <LanguageSwitcher value={locale} />
    </header>
  );
}
