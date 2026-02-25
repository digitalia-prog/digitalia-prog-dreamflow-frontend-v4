"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

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

  const clamp = (n: number, min: number, max: number) =>
    Math.min(max, Math.max(min, n));

  const statusPill = (status: ClientCard["status"]) => {
    if (status === "Actif")
      return "bg-emerald-500/20 text-emerald-200 border-emerald-400/25";
    if (status === "En onboarding")
      return "bg-amber-500/20 text-amber-200 border-amber-400/25";
    return "bg-white/10 text-white/70 border-white/10";
  };

  // IMPORTANT: as const -> TS/Vercel OK
  const spring = {
    type: "spring" as const,
    stiffness: 260,
    damping: 26,
    mass: 0.75,
  };

  const active = clients[activeIndex];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-white/50">UGC Growth • SaaS</div>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
            Clients agence — WOW 3D
          </h1>
          <p className="mt-2 text-white/60 max-w-2xl">
            Coverflow 3D (comme ta vidéo) : profondeur + rotation + carte active
            au premier plan.
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
        {/* LEFT: Coverflow */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-white/90">Deck clients</div>
            <div className="text-xs text-white/50">
              {activeIndex + 1}/{clients.length}
            </div>
          </div>

          <div className="relative mt-6 h-[460px] md:h-[560px]">
            {/* background light/glow */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/10 via-transparent to-fuchsia-500/10" />
              <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-500/18 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-fuchsia-500/12 blur-3xl" />
            </div>

            <div
              className="relative h-full"
              style={{
                perspective: "1400px",
                transformStyle: "preserve-3d",
              }}
            >
              {clients.map((c, i) => {
                const offset = i - activeIndex;

                // montre plusieurs cartes comme ton exemple
                if (offset < -2 || offset > 6) return null;

                const isActive = offset === 0;

                // coverflow positions
                const x = offset * 150;
                const y = offset * 18;
                const z = -Math.abs(offset) * 160;
                const rotateY = offset * -22;
                const rotateX = 6;

                const scale = isActive ? 1.02 : 0.92;
                const brightness = clamp(1 - Math.abs(offset) * 0.08, 0.65, 1);

                return (
                  <motion.button
                    key={c.id}
                    onClick={() => setActiveIndex(i)}
                    className="absolute left-1/2 top-10 w-[330px] md:w-[380px] -translate-x-1/2 text-left"
                    style={{
                      zIndex: 300 - Math.abs(offset),
                      transformStyle: "preserve-3d",
                      filter: `brightness(${brightness})`,
                    }}
                    initial={false}
                    animate={{
                      x,
                      y,
                      scale,
                      rotateY,
                      rotateX,
                      translateZ: z,
                    }}
                    transition={spring}
                    whileHover={isActive ? { y: y - 8, scale: 1.05 } : undefined}
                  >
                    <div
                      className={[
                        "relative rounded-3xl border shadow-2xl overflow-hidden backdrop-blur-xl",
                        "bg-white/10",
                        isActive
                          ? "border-purple-400/60 shadow-[0_0_0_1px_rgba(168,85,247,0.45),0_40px_120px_rgba(0,0,0,0.45)]"
                          : "border-white/10 hover:border-white/20",
                      ].join(" ")}
                      style={{
                        backgroundImage:
                          "radial-gradient(1200px 400px at 20% 10%, rgba(255,255,255,0.14), transparent 55%), radial-gradient(900px 380px at 90% 80%, rgba(168,85,247,0.16), transparent 55%)",
                      }}
                    >
                      {/* top */}
                      <div className="p-5">
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

                        {/* preview behind */}
                        {!isActive && (
                          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                            <div className="text-sm text-white/80 line-clamp-2">
                              {c.note}
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-white/30" />
                              <span className="text-xs text-white/60">Preview</span>
                            </div>
                          </div>
                        )}

                        {/* full active */}
                        {isActive && (
                          <div className="mt-5 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                              <div className="text-xs text-white/60">KPI</div>
                              <div className="mt-1 text-sm font-semibold text-white/95">
                                {c.kpi}
                              </div>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                              <div className="text-xs text-white/60">Note</div>
                              <div className="mt-1 text-sm text-white/85">
                                {c.note}
                              </div>
                            </div>

                            <div className="col-span-2 mt-1 flex items-center justify-between">
                              <div className="text-xs text-white/60">
                                Clique une carte pour l’activer
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-purple-400" />
                                <span className="text-xs text-white/75">WOW deck</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    </div>
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
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xl font-semibold text-white/95">{active.name}</div>
                <div className="mt-1 text-sm text-white/60">{active.industry}</div>
              </div>

              <span className="rounded-full border border-purple-400/25 bg-purple-500/15 px-3 py-1 text-xs text-purple-200">
                Protection anti-abus active
              </span>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-white/50">Statut</div>
                <div className="mt-1 text-sm font-semibold text-white/90">{active.status}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-white/50">KPI</div>
                <div className="mt-1 text-sm font-semibold text-white/90">{active.kpi}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-white/50">Note</div>
                <div className="mt-1 text-sm text-white/80">{active.note}</div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
