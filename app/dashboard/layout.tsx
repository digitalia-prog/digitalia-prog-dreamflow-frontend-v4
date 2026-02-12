import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 border-r border-white/10 bg-gradient-to-b from-purple-700 via-purple-900 to-black p-6">
          <div className="text-2xl font-extrabold">UGC Agency Pro</div>
          <div className="mt-1 text-xs text-white/70">International dashboard</div>

          <nav className="mt-8 space-y-2 text-white/80">
            <a className="block rounded-xl px-3 py-2 hover:bg-white/10" href="/dashboard">
              Aperçu
            </a>
            <a className="block rounded-xl px-3 py-2 hover:bg-white/10" href="/dashboard/social">
              Plateformes sociales
            </a>
            <a className="block rounded-xl px-3 py-2 hover:bg-white/10" href="/dashboard/campaigns">
              Campagnes
            </a>
            <a className="block rounded-xl px-3 py-2 hover:bg-white/10" href="/dashboard/creators">
              Créateurs
            </a>
            <a className="block rounded-xl px-3 py-2 hover:bg-white/10" href="/dashboard/ai">
              Générateur d&apos;IA
            </a>
            <a className="block rounded-xl px-3 py-2 hover:bg-white/10" href="/dashboard/settings">
              Paramètres
            </a>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 bg-gradient-to-br from-black via-zinc-900 to-purple-950 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

