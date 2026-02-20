export default function DashboardHome() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold">
        Croissance du contenu généré par les utilisateurs (UGC) — Tableau de bord Pro
      </h1>
      <p className="mt-2 text-white/70">
        Vue agence : performance, pipeline, créateurs, et exécution multi-plateformes.
      </p>

      {/* KPI */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          ["Clients actifs", "12", "+2 ce mois"],
          ["Campagnes live", "27", "9 en production"],
          ["Créateurs", "64", "Top: TikTok"],
          ["Livrables", "146", "24 à valider"],
        ].map(([label, value, sub]) => (
          <div key={label} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="text-sm text-white/60">{label}</div>
            <div className="mt-2 text-3xl font-extrabold">{value}</div>
            <div className="mt-2 text-xs text-white/50">{sub}</div>
          </div>
        ))}
      </div>

      {/* Panels */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="font-semibold">À faire (aujourd’hui)</div>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>• Valider 6 scripts (client: Beauty UK)</li>
            <li>• Brief UGC (client: Fitness US) — deadline 48h</li>
            <li>• Relancer 3 créateurs (deliverables manquants)</li>
          </ul>
          <div className="mt-4 text-xs text-white/50">
            Tip: utilise “Plateformes sociales” pour suivre TikTok/Insta/YT.
          </div>
        </div>

        <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
          <div className="font-semibold">International readiness</div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="text-white/60 text-xs">Timezone</div>
              <div className="mt-1 font-semibold">Europe/London</div>
            </div>
            <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="text-white/60 text-xs">Currency</div>
              <div className="mt-1 font-semibold">EUR / USD</div>
            </div>
            <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="text-white/60 text-xs">Language</div>
              <div className="mt-1 font-semibold">FR / EN</div>
            </div>
            <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="text-white/60 text-xs">Regions</div>
              <div className="mt-1 font-semibold">EU / US / MENA</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 flex flex-wrap gap-3">
        <a className="rounded-xl bg-purple-600 px-4 py-2 font-semibold hover:bg-purple-500" href="/dashboard/social">
          Ouvrir le tableau Réseaux →
        </a>
        <a className="rounded-xl bg-white/5 px-4 py-2 font-semibold ring-1 ring-white/10 hover:bg-white/10" href="/dashboard/ai">
          Générateur IA →
        </a>
        <a className="rounded-xl bg-white/5 px-4 py-2 font-semibold ring-1 ring-white/10 hover:bg-white/10" href="/dashboard/campaigns">
          Campagnes →
        </a>
      </div>
    </div>
  );
}
export default function DashboardPage() {
  const kpis = [
    { label: "Views (7d)", value: "1.28M", delta: "+14.2%" },
    { label: "Leads", value: "4,210", delta: "+6.1%" },
    { label: "UGC Posted", value: "86", delta: "+9.8%" },
    { label: "Cost / Video", value: "€32", delta: "-4.0%" },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/55">{k.label}</div>
            <div className="mt-2 flex items-end justify-between">
              <div className="text-3xl font-semibold">{k.value}</div>
              <div className="rounded-lg border border-violet-500/25 bg-violet-600/10 px-2 py-1 text-xs text-violet-200">
                {k.delta}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Performance</div>
          <div className="text-lg font-semibold">Growth (placeholder)</div>
          <div className="mt-5 h-[260px] rounded-xl border border-white/10 bg-black/20" />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Focus</div>
          <div className="text-lg font-semibold">Plan d’action</div>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>• 10 hooks par niche</li>
            <li>• 3 scripts courts</li>
            <li>• 1 UGC/jour</li>
            <li>• Analyse saves/CTR</li>
          </ul>
          <button className="mt-5 w-full rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-700">
            Create tasks
          </button>
        </div>
      </section>
    </div>
  );
}

