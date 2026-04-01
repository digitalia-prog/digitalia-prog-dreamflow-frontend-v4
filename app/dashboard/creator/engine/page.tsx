"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

type ScriptItem = {
  id: string;
  title: string;
  createdAt: number;
  platform?: string;
  lang?: string;
};

type CampaignItem = {
  id: string;
  name: string;
  status?: "active" | "paused" | "draft";
  createdAt: number;
};

const LS_SCRIPTS_KEY = "ugc_growth:scripts";
const LS_CAMPAIGNS_KEY = "ugc_growth:campaigns";

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function formatDate(ts: number) {
  try {
    return new Date(ts).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function CreatorDashboardPage() {
  const [scripts, setScripts] = useState<ScriptItem[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const s = safeJsonParse<ScriptItem[]>(
      localStorage.getItem(LS_SCRIPTS_KEY),
      []
    );

    const c = safeJsonParse<CampaignItem[]>(
      localStorage.getItem(LS_CAMPAIGNS_KEY),
      []
    );

    s.sort((a, b) => b.createdAt - a.createdAt);
    c.sort((a, b) => b.createdAt - a.createdAt);

    setScripts(s);
    setCampaigns(c);
  }, []);

  const activeCampaigns = campaigns.filter(
    (c) => (c.status ?? "active") === "active"
  );

  const latestScripts = scripts.slice(0, 5);

  if (!mounted) {
    return (
      <div className="p-6 md:p-10">
        <div className="text-white/60">Chargement…</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col gap-6">
        <div>
          <div className="text-sm text-white/60">UGC Growth • Creator</div>

          <h1 className="mt-2 text-3xl font-bold">Creator Dashboard</h1>

          <p className="mt-2 max-w-2xl text-white/70">
            Ton cockpit : scripts, campagnes, contenus.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/creator/engine"
            className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold hover:bg-purple-700"
          >
            Générer un script
          </Link>

          <Link
            href="/dashboard/campaigns"
            className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold hover:bg-white/10"
          >
            Créer / gérer une campagne
          </Link>

          <Link
            href="/dashboard/creators"
            className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold hover:bg-white/10"
          >
            Ajouter un créateur
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/60">Scripts générés</div>

            <div className="mt-2 text-2xl font-semibold">{scripts.length}</div>

            <div className="mt-2 text-xs text-white/50">Total</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/60">Campagnes actives</div>

            <div className="mt-2 text-2xl font-semibold">
              {activeCampaigns.length}
            </div>

            <div className="mt-2 text-xs text-white/50">En cours</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/60">Protection anti-abus</div>

            <div className="mt-2 text-2xl font-semibold">Active</div>

            <div className="mt-2 text-xs text-white/50">Beta</div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Derniers scripts</h2>

            <Link
              href="/dashboard/creator/engine"
              className="text-sm text-purple-300 hover:text-purple-200"
            >
              Ouvrir l’Engine →
            </Link>
          </div>

          {latestScripts.length === 0 ? (
            <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="font-medium">Aucun script pour l'instant</div>
              <div className="mt-1 text-sm text-white/60">
                Génère ton premier script depuis le Creator Engine.
              </div>

              <div className="mt-4">
                <Link
                  href="/dashboard/creator/engine"
                  className="inline-flex rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold hover:bg-purple-700"
                >
                  Générer un script
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {latestScripts.map((s) => (
                <div
                  key={s.id}
                  className="rounded-xl border border-white/10 p-3"
                >
                  <div className="font-semibold">{s.title}</div>

                  <div className="text-xs text-white/60">
                    {formatDate(s.createdAt)}
                    {s.platform ? ` • ${s.platform}` : ""}
                    {s.lang ? ` • ${s.lang}` : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">Workflow créateur</h2>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-white/10 p-3">
              1. Brief
            </div>

            <div className="rounded-xl border border-white/10 p-3">
              2. Génération
            </div>

            <div className="rounded-xl border border-white/10 p-3">
              3. Publication
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
