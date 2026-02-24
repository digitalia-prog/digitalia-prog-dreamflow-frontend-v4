// app/dashboard/clients/page.tsx
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
  // Demo data (WOW UI) — tu remplaceras plus tard par tes vrais clients cloud.
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
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs text-white/50">UGC Growth • Dashboard</div>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
            Clients agence
          </h1>
          <p className="mt-2 text-white/60 max-w-2xl">
            Vue premium “stack/feuillage” : tu parcours tes clients comme un deck.
            <span className="text-white/80"> Effet WOW</span> pour les démos agences.
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
            onClick={() => alert("Plus tard: ouvrir le flow 'Nouveau client'")}
          >
            + Nouveau client
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {/* LEFT: Stack cards (feuillage) */}
        <div className="relative">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white/90">Deck clients</div>
              <div className="text-xs text-white/50">
                {activeIndex + 1}/{clients.length}
              </div>
            </div>

            <div className="relative mt-6 h-[420px] md:h-[520px]">
              {/* Glow */}
              <div className="pointer-events-none absolute -inset-10 opacity-40 blur-3xl">
                <div className="h-full w-full rounded-full bg-purple-600/20" />
              </div>

              {/* Stack */}
              {clients.map((c, i) => {
                const offset = i - activeIndex;

                // cartes derrière: limité à 4 pour garder propre
                if (offset < 0) return null;
                if (offset > 4) return null;

                const translateY = offset * 18;
                const translateX = offset * 10;
                const scale = 1 - offset * 0.04;
                const rotate = offset * 1.2;
                const opacity = 1 - offset * 0.15;

                const isActive = i === activeIndex;

                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveIndex(i)}
                    className="absolute left-0 top-0 w-full text-left"
                    style={{
                      transform: `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
                      opacity,
                      zIndex: 50 - offset,
                      transition:
                        "transform 420ms cubic-bezier(.2,.9,.2,1), opacity 420ms cubic-bezier(.2,.9,.2,1)",
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
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-lg font-semibold">{c.name}</div>
                          <div className="mt-1 text-sm text-white/60">{c.industry}</div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                            {c.plan}
                          </span>
                          <span
                            className={[
                              "rounded-full px-3 py-1 text-xs",
                              c.status === "Actif"
                                ? "bg-emerald-500/15 text-emerald-200 border border-emerald-400/20"
                                : c.status === "En onboarding"
                                ? "bg-amber-500/15 text-amber-200 border border-amber-400/20"
                                : "bg-white/10 text-white/70 border border-white/10",
                            ].join(" ")}
                          >
                            {c.status}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="text-xs text-white/50">KPI</div>
                          <div className="mt-1 text-sm font-semibold text-white/90">
                            {c.kpi}
                          </div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="text-xs text-white/50">Note</div>
                          <div className="mt-1 text-sm text-white/80">{c.note}</div>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between">
                        <div className="text-xs text-white/50">
                          Clique une carte pour la mettre au premier plan
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-purple-400" />
                          <span className="text-xs text-white/70">Premium view</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Controls */}
            <div className="mt-5 flex items-center justify-between">
              <button
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 disabled:opacity-40"
                onClick={() => setActiveIndex((v) => Math.max(0, v - 1))}
                disabled={activeIndex === 0}
              >
                ← Précédent
              </button>

              <button
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 disabled:opacity-40"
                onClick={() => setActiveIndex((v) => Math.min(clients.length - 1, v + 1))}
                disabled={activeIndex === clients.length - 1}
              >
                Suivant →
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Details panel */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-semibold text-white/90">Détails client</div>

          <div className="mt-5 rounded-3xl border border-white/10 bg-black/30 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xl font-semibold">{active.name}</div>
                <div className="mt-1 text-sm text-white/60">{active.industry}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                  {active.plan}
                </span>
                <span className="rounded-full border border-purple-400/20 bg-purple-500/15 px-3 py-1 text-xs text-purple-200">
                  Protection anti-abus active
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-white/50">Résumé</div>
                <div className="mt-1 text-sm text-white/80">
                  Pilote ton client comme une “fiche premium” : scripts, campagnes, validations et
                  livrables au même endroit.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-white/50">Statut</div>
                  <div className="mt-1 text-sm font-semibold">{active.status}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-white/50">KPI</div>
                  <div className="mt-1 text-sm font-semibold">{active.kpi}</div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-white/50">Prochaines actions</div>
                <ul className="mt-2 list-disc pl-5 text-sm text-white/75 space-y-1">
                  <li>Créer/assigner un brief</li>
                  <li>Générer 3 scripts + 2 variantes</li>
                  <li>Valider / publier / suivre les retours</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold hover:bg-purple-700"
                onClick={() => alert("Plus tard: ouvrir l'espace client")}
              >
                Ouvrir l’espace client
              </button>
              <button
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                onClick={() => alert("Plus tard: générer un script pour ce client")}
              >
                Générer un script
              </button>
              <button
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                onClick={() => alert("Plus tard: ouvrir campagnes du client")}
              >
                Voir campagnes
              </button>
            </div>
          </div>

          <div className="mt-6 text-xs text-white/50">
            Note : cette page est pensée pour être “demo-ready” aujourd’hui, puis branchée au cloud
            save ensuite (clients réels).
          </div>
        </div>
      </div>
    </div>
  );
}
