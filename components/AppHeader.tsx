import LanguageSwitcher, { Locale } from "./LanguageSwitcher";

export default function AppHeader({ locale }: { locale: Locale }) {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4">
      <div className="font-semibold text-white">Dreamflow</div>
      <LanguageSwitcher value={locale} />
    </header>
  );
}
