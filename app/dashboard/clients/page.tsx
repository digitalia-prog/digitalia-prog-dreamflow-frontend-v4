"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ClientCard = {
  id: string;
  name: string;
  industry: string;
  status: "Actif" | "En onboarding" | "En pause";
  plan: "Creator" | "Agency" | "Agency Pro";
  kpi: string;
  note: string;
};

export default function ClientsPage() {
  const clients: ClientCard[] = useMemo(
    () => [
      {
        id: "c1",
        name: "NIVEA FR",
        industry: "Skincare • Retail",
        status: "Actif",
        plan: "Agency Pro",
        kpi: "+18% engagement",
        note: "3 scripts validés • 1 campagne live",
      },
      {
        id: "c2",
        name: "Beauty UK",
        industry: "Beauty • D2C",
        status: "Actif",
        plan: "Agency",
        kpi: "ROAS 2.4",
        note: "2 hooks gagnants • 5 variations",
      },
      {
        id: "c3",
        name: "Fitness US",
        industry: "Fitness • Coaching",
        status: "En onboarding",
        plan: "Agency",
        kpi: "CPA ↓",
        note: "Brief reçu • scripts en cours",
      },
      {
        id: "c4",
        name: "Foodies FR",
        industry: "Food • UGC",
        status: "En pause",
        plan: "Creator",
        kpi: "—",
        note: "Relance prévue • backlog à reprendre",
      },
      {
        id: "c5",
        name: "Agency Client X",
        industry: "UGC • Multi-niches",
        status: "Actif",
        plan: "Agency Pro",
        kpi: "12 livrables",
        note: "Workflow clean • validations rapides",
      },
    ],
    []
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const active = clients[activeIndex];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs text-white/50">UGC Growth • Dashboard</div>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
            Clients agence
          </h1>
          <p className="mt-2 text-white/60 max-w-2xl">
            Vue premium stack pour parcourir les clients comme un deck.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            ← Retour dashboard
          </Link>

          <button
            className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold hover:bg-purple-700"
            onClick={() => alert("Nouveau client (plus tard)")}
          >
            + Nouveau client
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {/* LEFT */}
        <div className="relative">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white/90">Deck clients</div>
              <div className="text-xs text-white/50">
                {activeIndex + 1}/{clients.length}
              </div>
            </div>

            <div className="relative mt-6 h-[420px] md:h-[520px]">
              {clients.map((c, i) => {
                const offset = i - activeIndex;
                if (offset < 0 || offset > 4) return null;

                const isActive = i === activeIndex;

                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveIndex(i)}
                    className="absolute left-0 top-0 w-full text-left"
                    style={{
                      transform: `translate(${offset * 10}px, ${offset * 18}px) scale(${1 - offset * 0.04}) rotate(${offset * 1.2}deg)`,
                      opacity: 1 - offset * 0.15,
                      zIndex: 50 - offset,
                      transition: "all 420ms cubic-bezier(.2,.9,.2,1)",
                    }}
                  >
                    <div
                      className={[
                        "rounded-3xl border bg-black/40 p-6 shadow-2xl",
                        isActive
                          ? "border-purple-400/30"
                          : "border-white/10 hover:border-white/20",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-lg font-semibold">{c.name}</div>
                          <div className="text-sm text-white/60">{c.industry}</div>
                        </div>
                        <span className="text-xs text-white/70">{c.plan}</span>
                      </div>

                      <div className="mt-4 text-sm text-white/70">{c.note}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex justify-between">
              <button
                onClick={() => setActiveIndex((v) => Math.max(0, v - 1))}
                disabled={activeIndex === 0}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm disabled:opacity-40"
              >
                ← Précédent
              </button>

              <button
                onClick={() =>
                  setActiveIndex((v) =>
                    Math.min(clients.length - 1, v + 1)
                  )
                }
                disabled={activeIndex === clients.length - 1}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm disabled:opacity-40"
              >
                Suivant →
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-semibold text-white/90">
            Détails client
          </div>

          <div className="mt-5 rounded-3xl border border-white/10 bg-black/30 p-6">
            <div className="text-xl font-semibold">{active.name}</div>
            <div className="text-sm text-white/60">{active.industry}</div>

            <div className="mt-4 text-sm text-white/80">{active.note}</div>

            <div className="mt-6 flex gap-3">
              <button className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold hover:bg-purple-700">
                Ouvrir client
              </button>
              <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm">
                Générer script
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
