"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

type Client = {
  id: string;
  name: string;
  industry: string;
  plan: string;
  status: string;
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
        status: "Onboarding",
        kpi: "CPA ↓",
        note: "Brief reçu • scripts en cours",
      },
      {
        id: "4",
        name: "Foodies FR",
        industry: "Food • UGC",
        plan: "Creator",
        status: "Pause",
        kpi: "—",
        note: "Relance prévue",
      },
    ],
    []
  );

  const [active, setActive] = useState(0);

  const spring = {
    type: "spring" as const,
    stiffness: 220,
    damping: 24,
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold mb-8">Agency Clients — Vision Deck</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* LEFT */}
        <div className="rounded-2xl border border-white/10 bg-black/30 p-5 overflow-hidden">
          <div className="text-sm font-semibold mb-4">
            Deck clients ({active + 1}/{clients.length})
          </div>

          <div
            className="relative h-[520px]"
            style={{
              perspective: "1800px",
              transformStyle: "preserve-3d",
            }}
          >
            {clients.map((c, i) => {
              const offset = i - active;
              if (offset < -2 || offset > 4) return null;

              const isActive = offset === 0;

              const x = offset * 180;
              const z = -Math.abs(offset) * 320;
              const rotateY = offset * -30;

              return (
                <motion.button
                  key={c.id}
                  onClick={() => setActive(i)}
                  className="absolute left-1/2 top-14 w-[360px] -translate-x-1/2 text-left"
                  style={{
                    zIndex: 100 - Math.abs(offset),
                    transformStyle: "preserve-3d",
                  }}
                  animate={{
                    x,
                    rotateY,
                    translateZ: z,
                    scale: isActive ? 1 : 0.78,
                    opacity: isActive ? 1 : 0.35,
                  }}
                  whileHover={
                    isActive ? { y: -6, scale: 1.03 } : undefined
                  }
                  transition={spring}
                >
                  <div
                    className={`rounded-3xl border p-5 backdrop-blur-xl shadow-2xl ${
                      isActive
                        ? "bg-white/15 border-purple-400/60 shadow-[0_0_80px_rgba(168,85,247,0.45)]"
                        : "bg-black/70 border-white/10"
                    }`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <div className="text-xl font-semibold">{c.name}</div>
                        <div className="text-sm text-white/60">{c.industry}</div>
                      </div>

                      <div className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10">
                        {c.plan}
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
                      <div className="mt-4 text-sm text-white/60">• Preview</div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => setActive((v) => Math.max(0, v - 1))}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10"
            >
              ← Précédent
            </button>

            <button
              onClick={() =>
                setActive((v) => Math.min(clients.length - 1, v + 1))
              }
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10"
            >
              Suivant →
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
          <div className="text-sm font-semibold mb-4">Détails client</div>

          <div className="rounded-2xl bg-black/40 border border-white/10 p-5">
            <div className="text-xl font-semibold">{clients[active].name}</div>
            <div className="text-sm text-white/60">{clients[active].industry}</div>

            <div className="mt-5 grid gap-3">
              <div className="rounded-xl bg-white/5 p-3">
                KPI: {clients[active].kpi}
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                Note: {clients[active].note}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
