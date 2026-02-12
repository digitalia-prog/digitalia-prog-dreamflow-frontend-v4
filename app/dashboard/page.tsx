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
