"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

type Client = {
  id: string;
  name: string;
  industry: string;
  plan: string;
  status: "Actif" | "En onboarding" | "En pause";
  kpi: string;
  note: string;
};

export default function ClientsPage() {
  const clients: Client[] = useMemo(
    () => [
      {
        id: "1",
        name: "NIVEA FR",
        industry: "Skincare • Retail",
        plan: "Agency Pro",
        status: "Actif",
        kpi: "+18% engagement",
        note: "3 scripts validés • 1 campagne live",
      },
      {
        id: "2",
        name: "Beauty UK",
        industry: "Beauty • D2C",
        plan: "Agency",
        status: "Actif",
        kpi: "ROAS 2.4",
        note: "2 hooks gagnants • 5 variations",
      },
      {
        id: "3",
        name: "Fitness US",
        industry: "Fitness • Coaching",
        plan: "Agency",
        status: "En onboarding",
        kpi: "CPA ↓",
        note: "Brief reçu • scripts en cours",
      },
      {
        id: "4",
        name: "Foodies FR",
        industry: "Food • UGC",
        plan: "Creator",
        status: "En pause",
        kpi: "—",
        note: "Relance prévue • backlog à reprendre",
      },
      {
        id: "5",
        name: "Agency Client X",
        industry: "UGC • Multi-niches",
        plan: "Agency Pro",
        status: "Actif",
        kpi: "12 livrables",
        note: "Workflow clean • validations rapides",
      },
    ],
    []
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const active = clients[activeIndex];

  const spring = {
    type: "spring" as const,
    stiffness: 220,
    damping: 22,
    mass: 0.8,
  };

  const statusPill = (status: Client["status"]) => {
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
            Clients agence — Floating Deck
          </h1>
          <p className="mt-2 text-white/60 max-w-2xl">
            Carte active qui “flotte” + coverflow 3D clean.
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
        {/* LEFT: deck */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-white/90">Deck clients</div>
            <div className="text-xs text-white/50">
              {activeIndex + 1}/{clients.length}
            </div>
          </div>

          <div className="relative mt-6 h-[480px] md:h-[560px]">
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/10 via-transparent to-fuchsia-500/10" />
              <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-500/18 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-fuchsia-500/12 blur-3xl" />
            </div>

            <div
              className="relative h-full"
              style={{ perspective: "1600px", transformStyle: "preserve-3d" }}
            >
              {clients.map((c, i) => {
                const offset = i - activeIndex;
                if (offset < -2 || offset > 5) return null;

                const isActive = offset === 0;

                const x = offset * 160;
                const y = offset * 16;
                const z = -Math.abs(offset) * 220;
                const rotateY = offset * -24;
                const rotateX = 7;

                // no global opacity bleed: keep background opaque, soften with brightness
                const brightness = Math.max(0.65, 1 - Math.abs(offset) * 0.08);

                return (
                  <motion.button
                    key={c.id}
                    onClick={() => setActiveIndex(i)}
                    className="absolute left-1/2 top-10 w-[340px] md:w-[380px] -translate-x-1/2 text-left"
                    style={{
                      zIndex: 200 - Math.abs(offset),
                      transformStyle: "preserve-3d",
                      filter: `brightness(${brightness})`,
                    }}
                    initial={false}
                    animate={{
                      x,
                      y,
                      translateZ: z,
                      rotateY,
                      rotateX,
                      scale: isActive ? 1.03 : 0.86,
                    }}
                    transition={spring}
                    whileHover={isActive ? { y: y - 8, scale: 1.06 } : undefined}
                  >
                    <motion.div
                      className={[
                        "relative rounded-3xl border shadow-2xl overflow-hidden backdrop-blur-xl",
                        "bg-black/80", // opaque => no text bleed
                        isActive
                          ? "border-purple-400/60 shadow-[0_0_0_1px_rgba(168,85,247,0.45),0_40px_120px_rgba(0,0,0,0.45)]"
                          : "border-white/10 hover:border-white/20",
                      ].join(" ")}
                      // FLOATING LOOP only for active card
                      animate={
                        isActive
                          ? { y: [0, -10, 0], rotateZ: [0, 0.6, 0] }
                          : { y: 0, rotateZ: 0 }
                      }
                      transition={
                        isActive
                          ? {
                              duration: 2.8,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }
                          : spring
                      }
                    >
                      {/* Active glow */}
                      {isActive && (
                        <div className="pointer-events-none absolute inset-0">
                          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-purple-500/18 blur-3xl" />
                          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-fuchsia-500/12 blur-3xl" />
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/12 via-transparent to-fuchsia-500/10" />
                        </div>
                      )}

                      <div className="relative p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-xl font-semibold text-white/95">
                              {c.name}
                            </div>
                            <div className="text-sm text-white/70">{c.industry}</div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/85">
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

                        {/* Preview only for non-active */}
                        {!isActive && (
                          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="text-sm text-white/80 line-clamp-2">
                              {c.note}
                            </div>
                            <div className="mt-3 text-xs text-white/60">Preview</div>
                          </div>
                        )}

                        {/* Full details only for active */}
                        {isActive && (
                          <div className="mt-5 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                              <div className="text-xs text-white/60">KPI</div>
                              <div className="mt-1 text-sm font-semibold text-white/95">
                                {c.kpi}
                              </div>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                              <div className="text-xs text-white/60">Note</div>
                              <div className="mt-1 text-sm text-white/85">{c.note}</div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    </motion.div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
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

        {/* RIGHT */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-semibold text-white/90">Détails client</div>

          <div className="mt-5 rounded-3xl border border-white/10 bg-black/60 p-6 backdrop-blur-xl">
            <div className="text-xl font-semibold text-white/95">{active.name}</div>
            <div className="text-sm text-white/60">{active.industry}</div>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
