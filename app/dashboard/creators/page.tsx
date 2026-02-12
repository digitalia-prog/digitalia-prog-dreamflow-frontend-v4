import Link from "next/link";

export default function CreatorsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Créateurs</h1>
        <Link href="/dashboard" className="text-white/70 hover:text-white">
          ← Retour au dashboard
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-white/70">
          Casting + suivi livrables (placeholder). Après on branche l’API / DB.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            { name: "Maya", niche: "Beauty", country: "UK", score: "A" },
            { name: "Nora", niche: "Fitness", country: "US", score: "A-" },
            { name: "Lea", niche: "Food", country: "FR", score: "B+" },
            { name: "Sara", niche: "Lifestyle", country: "DE", score: "A" },
          ].map((x) => (
            <div key={x.name} className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{x.name}</p>
                <span className="rounded-full bg-violet-600/20 px-3 py-1 text-xs text-violet-200">
                  Score {x.score}
                </span>
              </div>
              <p className="mt-2 text-sm text-white/70">
                Niche: {x.niche} — Pays: {x.country}
              </p>
              <div className="mt-4 flex gap-2">
                <button className="rounded-xl bg-violet-600/80 px-4 py-2 text-sm font-semibold hover:bg-violet-600">
                  Voir profil
                </button>
                <button className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
                  Demander livrable
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

