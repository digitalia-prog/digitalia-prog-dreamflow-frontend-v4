import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <Link href="/dashboard" className="text-white/70 hover:text-white">
          ← Retour au dashboard
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-white/70">Placeholder settings (langue, devise, timezone, branding).</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="font-semibold">Langue</p>
            <p className="mt-2 text-sm text-white/70">FR / EN</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="font-semibold">Devise</p>
            <p className="mt-2 text-sm text-white/70">EUR / USD</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="font-semibold">Fuseau horaire</p>
            <p className="mt-2 text-sm text-white/70">Europe/Londres</p>
          </div>
        </div>
      </div>
    </div>
  );
}

