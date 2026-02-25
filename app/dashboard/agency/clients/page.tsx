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

  const statusPill = (status: ClientCard["status"]) => {
    if (status === "Actif")
      return "bg-emerald-500/20 text-emerald-200 border-emerald-400/25";
    if (status === "En onboarding")
      return "bg-amber-500/20 text-amber-200 border-amber-400/25";
    return "bg-white/10 text-white/70 border-white/10";
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-white/50">UGC Growth • SaaS</div>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
            Clients agence
          </h1>
          <p className="mt-2 text-white/60 max-w-2xl">
            Deck premium : cartes derrière en preview, carte active en full détails (couleur + relief).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/agency"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            ← Retour
          </Link>
          <button
            className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold hover:bg-purple-700"
            onClick={() => alert("Plus tard: flow 'Nouveau client'")}
          >
            + Nouveau client
          </button>
        </div>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {/* LEFT: Deck */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-white/90">Deck clients</div>
            <div className="text-xs text-white/50">
              {activeIndex + 1}/{clients.length}
            </div>
          </div>

          <div className="relative mt-6 h-[420px] md:h-[520px]">
            {/* background glow */}
            <div className="pointer-events-none absolute -inset-14 opacity-70 blur-3xl">
              <div className="h-full w-full rounded-full bg-purple-600/25" />
            </div>

            {/* 3D stage */}
            <div
              className="relative h-full"
              style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
            >
              {clients.map((c, i) => {
                const offset = i - activeIndex;

                // IMPORTANT: only show active + 2 previews (clean, no mess)
                if (offset < 0 || offset > 2) return null;

                const isActive = i === activeIndex;

                const translateY = offset * 28;
                const translateX = offset * 14;
                const scale = 1 - offset * 0.05;
                const rotateX = offset * 3;
                const rotateZ = offset * 1.2;

                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveIndex(i)}
                    className="absolute left-0 top-0 w-full text-left"
                    style={{
                      transform: `
                        translateY(${translateY}px)
                        translateX(${translateX}px)
                        scale(${scale})
                        rotateX(${rotateX}deg)
                        rotateZ(${rotateZ}deg)
                      `,
                      zIndex: 100 - offset,
                      transition:
                        "transform 520ms cubic-bezier(.2,.9,.2,1)",
                      transformOrigin: "center top",
                    }}
                  >
                    {/* Card shell */}
                    <div
                      className={[
                        "rounded-3xl border p-6 shadow-2xl overflow-hidden backdrop-blur-xl",
                        // opaque base => no bleed-through
                        "bg-black/90",
                        isActive
                          ? "border-purple-400/50 shadow-[0_0_0_1px_rgba(168,85,247,0.35),0_30px_80px_rgba(0,0,0,0.55)]"
                          : "border-white/10 hover:border-white/20",
                      ].join(" ")}
                    >
                      {/* Color layer for active card */}
                      {isActive && (
                        <div className="pointer-events-none absolute inset-0">
                          <div className="absolute -top-24 -left-24 h-56 w-56 rounded-full bg-purple-500/25 blur-3xl" />
                          <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-fuchsia-500/15 blur-3xl" />
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-fuchsia-500/10" />
                        </div>
                      )}

                      <div className="relative flex items-start justify-between gap-4">
                        <div>
                          <div className="text-lg font-semibold text-white/95">
                            {c.name}
                          </div>
                          <div className="mt-1 text-sm text-white/60">
                            {c.industry}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/85">
                            {c.plan}
                          </span>
                          <span
                            className={[
                              "rounded-full px-3 py-1 text-xs border",
                              statusPill(c.status),
                            ].join(" ")}
                          >
                            {c.status}
                          </span>
                        </div>
                      </div>

                      {/* PREVIEW ONLY for cards behind */}
                      {!isActive && (
                        <div className="relative mt-4">
                          <div className="text-sm text-white/75 line-clamp-2">
                            {c.note}
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-white/30" />
                            <span className="text-xs text-white/50">
                              Preview
                            </span>
                          </div>
                        </div>
                      )}

                      {/* FULL DETAILS only for active card */}
                      {isActive && (
                        <div className="relative mt-5 grid grid-cols-2 gap-3">
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="text-xs text-white/50">KPI</div>
                            <div className="mt-1 text-sm font-semibold text-white/90">
                              {c.kpi}
                            </div>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="text-xs text-white/50">Note</div>
                            <div className="mt-1 text-sm text-white/80">
                              {c.note}
                            </div>
                          </div>

                          <div className="col-span-2 mt-1 flex items-center justify-between">
                            <div className="text-xs text-white/50">
                              Clique une carte pour l’activer
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-purple-400" />
                              <span className="text-xs text-white/70">
                                Premium deck
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
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
              onClick={() =>
                setActiveIndex((v) => Math.min(clients.length - 1, v + 1))
              }
              disabled={activeIndex === clients.length - 1}
            >
              Suivant →
            </button>
          </div>
        </div>

        {/* RIGHT: Details panel */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-semibold text-white/90">Détails client</div>

          <div className="mt-5 rounded-3xl border border-white/10 bg-black/75 p-6 backdrop-blur-xl shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xl font-semibold text-white/95">
                  {active.name}
                </div>
                <div className="mt-1 text-sm text-white/60">
                  {active.industry}
                </div>
              </div>

              <span className="rounded-full border border-purple-400/25 bg-purple-500/15 px-3 py-1 text-xs text-purple-200">
                Protection anti-abus active
              </span>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-white/50">Statut</div>
                <div className="mt-1 text-sm font-semibold text-white/90">
                  {active.status}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-white/50">KPI</div>
                <div className="mt-1 text-sm font-semibold text-white/90">
                  {active.kpi}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-white/50">Note</div>
                <div className="mt-1 text-sm text-white/80">{active.note}</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-white/50">Prochaines actions</div>
                <ul className="mt-2 list-disc pl-5 text-sm text-white/75 space-y-1">
                  <li>Créer / assigner un brief</li>
                  <li>Générer 3 scripts + 2 variantes</li>
                  <li>Valider / publier / suivre les retours</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold hover:bg-purple-700"
                onClick={() => alert("Plus tard: ouvrir l’espace client")}
              >
                Ouvrir client
              </button>

              <button
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                onClick={() => alert("Plus tard: générer un script")}
              >
                Générer script
              </button>

              <button
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                onClick={() => alert("Plus tard: campagnes")}
              >
                Voir campagnes
              </button>
            </div>
          </div>

          <div className="mt-6 text-xs text-white/50">
            Demo-ready maintenant, branchable au cloud ensuite.
          </div>
        </div>
      </div>
    </div>
  );
}
