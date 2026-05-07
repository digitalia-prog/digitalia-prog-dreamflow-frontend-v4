"use client";

import Link from "next/link";

export default function ClientsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 text-white">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-white/50">
            UGC Growth • Agency
          </div>

          <h1 className="mt-2 text-4xl font-bold">
            Clients agence
          </h1>

          <p className="mt-3 max-w-2xl text-white/60">
            Gère tes clients, campagnes, scripts et validations
            dans un espace simple et propre.
          </p>
        </div>

        <button className="rounded-xl bg-violet-600 px-5 py-3 font-semibold hover:bg-violet-500">
          + Nouveau client
        </button>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[
          {
            name: "NIVEA FR",
            niche: "Skincare • Retail",
            status: "Actif",
            kpi: "+18% engagement",
          },
          {
            name: "Beauty UK",
            niche: "Beauty • D2C",
            status: "Actif",
            kpi: "ROAS 2.4",
          },
          {
            name: "Fitness US",
            niche: "Fitness • Coaching",
            status: "Onboarding",
            kpi: "CPA ↓",
          },
        ].map((client) => (
          <div
            key={client.name}
            className="rounded-3xl border border-white/10 bg-[#111111] p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  {client.name}
                </h2>

                <p className="text-sm text-white/50">
                  {client.niche}
                </p>
              </div>

              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
                {client.status}
              </span>
            </div>

            <div className="mt-6 rounded-2xl bg-black/40 p-4">
              <div className="text-xs text-white/50">
                KPI
              </div>

              <div className="mt-1 text-lg font-semibold">
                {client.kpi}
              </div>
            </div>

            <button className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10">
              Ouvrir le client
            </button>
          </div>
        ))}
      </div>

      <Link
        href="/dashboard/agency"
        className="mt-10 inline-flex text-sm text-white/60 hover:text-white"
      >
        ← Retour
      </Link>
    </div>
  );
}
