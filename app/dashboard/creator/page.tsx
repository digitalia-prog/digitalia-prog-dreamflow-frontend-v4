"use client";

import Link from "next/link";
import React from "react";

type ScriptItem = {
  id: string;
  title: string;
  createdAt: number;
  lang?: string;
  platform?: string;
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

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Card({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-white/60">{title}</div>
          {subtitle && (
            <div className="mt-1 text-xl font-semibold">{subtitle}</div>
          )}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

function EmptyState({
  title,
  desc,
  actions,
}: {
  title: string;
  desc: string;
  actions: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
      <div className="text-lg font-semibold">{title}</div>
      <p className="mt-2 text-sm text-white/70">{desc}</p>
      <div className="mt-4 flex flex-wrap gap-3">{actions}</div>
    </div>
  );
}

export default function CreatorDashboardPage() {
  const [scripts, setScripts] = React.useState<ScriptItem[]>([]);
  const [campaigns, setCampaigns] = React.useState<CampaignItem[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
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
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm text-white/60">
              UGC Growth • Creator
            </div>

            <h1 className="mt-2 text-3xl font-bold">
              Creator Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-white/70">
              Ton cockpit : scripts, campagnes, contenus — sans blabla.
              Tout ce qui est affiché ici vient de tes données.
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
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card
            title="Scripts générés"
            subtitle={`${scripts.length}`}
            right={<span className="text-xs text-white/50">Total</span>}
          >
            <div className="text-sm text-white/60">
              Basé sur tes scripts enregistrés.
            </div>
          </Card>

          <Card
            title="Campagnes actives"
            subtitle={`${activeCampaigns.length}`}
            right={<span className="text-xs text-white/50">En cours</span>}
          >
            <div className="text-sm text-white/60">
              Aucune campagne ? Crée la première et le dashboard se remplit.
            </div>
          </Card>

          <Card
            title="Protection anti-abus"
            subtitle="Active"
            right={<span className="text-xs text-white/50">Bêta</span>}
          >
            <div className="text-sm text-white/60">
              Limites d’usage + contrôle bêta.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
