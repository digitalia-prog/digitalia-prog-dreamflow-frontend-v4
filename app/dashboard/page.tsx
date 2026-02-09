export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0b0b14] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">UGC Growth</h1>
            <p className="text-white/70">Dashboard MVP — Générateur UGC / Ads / Hooks</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
              Plan: Beta
            </span>
            <button className="rounded-lg bg-[#7c3aed] px-4 py-2 text-sm font-medium hover:opacity-90">
              Générer
            </button>
          </div>
        </header>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white/90">Modules</p>

              <div className="mt-3 space-y-2">
                <button className="w-full rounded-xl bg-white/10 px-3 py-2 text-left text-sm">
                  🧠 Générateur IA
                </button>
                <button className="w-full rounded-xl px-3 py-2 text-left text-sm text-white/80 hover:bg-white/5">
                  🎣 Hooks & Angles
                </button>
                <button className="w-full rounded-xl px-3 py-2 text-left text-sm text-white/80 hover:bg-white/5">
                  🎬 Script UGC
                </button>
                <button className="w-full rounded-xl px-3 py-2 text-left text-sm text-white/80 hover:bg-white/5">
                  📢 Ads (Meta/TikTok)
                </button>
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="text-xs text-white/70">Crédits IA</p>
                <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                  <div className="h-2 w-2/3 rounded-full bg-[#7c3aed]" />
                </div>
                <p className="mt-2 text-xs text-white/70">200 / 300 restants</p>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="lg:col-span-9">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold">📱 Réseau</p>
                <select className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none">
                  <option>TikTok</option>
                  <option>Instagram Reels</option>
                  <option>YouTube Shorts</option>
                  <option>Meta Ads</option>
                  <option>TikTok Ads</option>
                </select>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold">🎯 Objectif</p>
                <select className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none">
                  <option>Ventes (conversion)</option>
                  <option>Leads (DM / formulaire)</option>
                  <option>Awareness (branding)</option>
                  <option>Engagement (commentaires)</option>
                </select>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold">🧩 Livrable</p>
              <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
                <button className="rounded-xl bg-white/10 px-3 py-2 text-sm">🎬 Script UGC</button>
                <button className="rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/5">🎣 Hooks</button>
                <button className="rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/5">📢 Ads</button>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold">📝 Produit / Sujet</p>
              <textarea
                className="mt-2 h-28 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm outline-none"
                placeholder='Ex: "sac à main luxe – femmes 18-30 – TikTok – objectif ventes"'
              />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button className="rounded-lg bg-[#7c3aed] px-4 py-2 text-sm font-medium hover:opacity-90">
                  Générer maintenant
                </button>
                <button className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
                  Copier
                </button>
                <button className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
                  Export PDF
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">📤 Résultat</p>
                <span className="text-xs text-white/60">Prêt à copier-coller</span>
              </div>
              <pre className="mt-3 whitespace-pre-wrap rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white/80">
Ton script apparaîtra ici…
              </pre>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

