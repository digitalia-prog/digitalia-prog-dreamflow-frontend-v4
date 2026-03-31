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
    return new Date(ts).toLocaleDateString();
  } catch {
    return "";
  }
}

export default function CreatorDashboardPage() {
  const [scripts, setScripts] = useState<ScriptItem[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);

  useEffect(() => {
    const s = safeJsonParse<ScriptItem[]>(
      localStorage.getItem(LS_SCRIPTS_KEY),
      []
    );

    const c = safeJsonParse<CampaignItem[]>(
      localStorage.getItem(LS_CAMPAIGNS_KEY),
      []
    );

    setScripts(s);
    setCampaigns(c);
  }, []);

  const activeCampaigns = campaigns.filter(
    (c) => (c.status ?? "active") === "active"
  );

  const latestScripts = scripts.slice(0, 5);

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col gap-6">

        <div>
          <div className="text-sm text-white/60">UGC Growth • Creator</div>
          <h1 className="text-3xl font-bold mt-2">
            Creator Dashboard
          </h1>
          <p className="text-white/70 mt-2">
            Ton cockpit créateur.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/60">
              Scripts générés
            </div>
            <div className="text-2xl font-semibold mt-2">
              {scripts.length}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/60">
              Campagnes actives
            </div>
            <div className="text-2xl font-semibold mt-2">
              {activeCampaigns.length}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/60">
              Protection anti-abus
            </div>
            <div className="text-2xl font-semibold mt-2">
              Active
            </div>
          </div>

        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex justify-between items-center">

            <h2 className="text-xl font-semibold">
              Derniers scripts
            </h2>

            <Link
              href="/dashboard/creator/engine"
              className="text-purple-400"
            >
              Générer
            </Link>

          </div>

          {latestScripts.length === 0 ? (
            <div className="mt-4 text-white/60">
              Aucun script pour l'instant
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {latestScripts.map((s) => (
                <div
                  key={s.id}
                  className="rounded-xl border border-white/10 p-3"
                >
                  <div className="font-semibold">
                    {s.title}
                  </div>

                  <div className="text-xs text-white/60">
                    {formatDate(s.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

          <h2 className="text-xl font-semibold">
            Workflow créateur
          </h2>

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
