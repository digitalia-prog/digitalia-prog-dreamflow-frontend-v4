import Link from "next/link";

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Campagnes</h1>
        <Link href="/dashboard" className="text-white/70 hover:text-white">
          ← Retour au dashboard
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-white/70">
          Exemple (placeholder) — ici tu brancheras tes vraies campagnes via API.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { name: "Beauty UK", status: "En production", kpi: "CTR 1.9%" },
            { name: "Fitness US", status: "Script à valider", kpi: "CPA €14" },
            { name: "Skincare FR", status: "Livrables", kpi: "ROAS 2.4" },
          ].map((c) => (
            <div key={c.name} className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="font-semibold">{c.name}</p>
              <p className="mt-2 text-sm text-white/70">{c.status}</p>
              <p className="mt-3 text-sm text-white/60">{c.kpi}</p>
              <button className="mt-4 w-full rounded-xl bg-violet-600/80 px-4 py-2 text-sm font-semibold hover:bg-violet-600">
                Ouvrir
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


