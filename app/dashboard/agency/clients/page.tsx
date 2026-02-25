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
        id: "1",
        name: "NIVEA FR",
        industry: "Skincare • Retail",
        status: "Actif",
        plan: "Agency Pro",
        kpi: "+18% engagement",
        note: "3 scripts validés • 1 campagne live",
      },
      {
        id: "2",
        name: "Beauty UK",
        industry: "Beauty • D2C",
        status: "Actif",
        plan: "Agency",
        kpi: "ROAS 2.4",
        note: "2 hooks gagnants • 5 variations",
      },
      {
        id: "3",
        name: "Fitness US",
        industry: "Fitness • Coaching",
        status: "En onboarding",
        plan: "Agency",
        kpi: "CPA ↓",
        note: "Brief reçu • scripts en cours",
      },
      {
        id: "4",
        name: "Foodies FR",
        industry: "Food • UGC",
        status: "En pause",
        plan: "Creator",
        kpi: "—",
        note: "Relance prévue • backlog à reprendre",
      },
      {
        id: "5",
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

  const spring = {
    type: "spring" as const,
    stiffness: 240,
    damping: 28,
  };

  const statusStyle = (s: string) => {
    if (s === "Actif")
      return "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30";
    if (s === "En onboarding")
      return "bg-amber-500/20 text-amber-200 border border-amber-400/30";
    return "bg-white/10 text-white/70 border border-white/10";
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-white/50">UGC Growth • SaaS</div>
          <h1 className="text-2xl font-semibold mt-1">Agency Dashboard</h1>
        </div>

        <Link
          href="/dashboard/agency"
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          ← Retour
        </Link>
      </div>

      {/* LAYOUT */}
      <div className="mt-8 grid md:grid-cols-2 gap-8">
        {/* LEFT DECK */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 overflow-hidden">
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Deck clients</span>
            <span className="text-white/50">
              {activeIndex + 1}/{clients.length}
            </span>
          </div>

          <div
            className="relative mt-6 h-[500px]"
            style={{ perspective: "1400px" }}
          >
            {clients.map((c, i) => {
              const offset = i - activeIndex;
              if (offset < -2 || offset > 4) return null;

              const isActive = offset === 0;

              const x = offset * 160;
              const z = -Math.abs(offset) * 220;
              const rotateY = offset * -24;

              return (
                <motion.button
                  key={c.id}
                  onClick={() => setActiveIndex(i)}
                  className="absolute left-1/2 top-12 w-[360px] -translate-x-1/2 text-left"
                  style={{
                    zIndex: 100 - Math.abs(offset),
                    transformStyle: "preserve-3d",
                  }}
                  animate={{
                    x,
                    translateZ: z,
                    rotateY,
                    scale: isActive ? 1 : 0.82,
                    opacity: isActive ? 1 : 0.45,
                  }}
                  transition={spring}
                >
                  <div
                    className={`rounded-3xl border p-5 shadow-2xl ${
                      isActive
                        ? "bg-white/12 border-purple-400/50"
                        : "bg-black/70 border-white/10"
                    }`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <div className="text-xl font-semibold">{c.name}</div>
                        <div className="text-sm text-white/60">
                          {c.industry}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10">
                          {c.plan}
                        </span>
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${statusStyle(
                            c.status
                          )}`}
                        >
                          {c.status}
                        </span>
                      </div>
                    </div>

                    {isActive ? (
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-black/30 p-3">
                          <div className="text-xs text-white/50">KPI</div>
                          <div className="font-semibold">{c.kpi}</div>
                        </div>
                        <div className="rounded-xl bg-black/30 p-3">
                          <div className="text-xs text-white/50">Note</div>
                          <div className="text-sm">{c.note}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 text-sm text-white/60">
                        • Preview
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="flex justify-between mt-4">
            <button
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10"
              onClick={() =>
                setActiveIndex((v) => Math.max(0, v - 1))
              }
            >
              ← Précédent
            </button>

            <button
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10"
              onClick={() =>
                setActiveIndex((v) =>
                  Math.min(clients.length - 1, v + 1)
                )
              }
            >
              Suivant →
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-semibold">Détails client</div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-5">
            <div className="text-xl font-semibold">{active.name}</div>
            <div className="text-sm text-white/60">{active.industry}</div>

            <div className="mt-5 grid gap-3">
              <div className="rounded-xl bg-white/5 p-3">
                <div className="text-xs text-white/50">Statut</div>
                <div>{active.status}</div>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <div className="text-xs text-white/50">KPI</div>
                <div>{active.kpi}</div>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <div className="text-xs text-white/50">Note</div>
                <div>{active.note}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
