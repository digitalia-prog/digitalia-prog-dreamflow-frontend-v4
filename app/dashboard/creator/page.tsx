"use client";

import Link from "next/link";
import React from "react";

type ScriptItem = {
  id: string;
  title: string;
  createdAt: number; // epoch ms
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
          {subtitle ? <div className="mt-1 text-xl font-semibold">{subtitle}</div> : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
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

    // Tri récents
    s.sort((a, b) => b.createdAt - a.createdAt);
    c.sort((a, b) => b.createdAt - a.createdAt);

    setScripts(s);
    setCampaigns(c);
  }, []);

  const activeCampaigns = campaigns.filter((c) => (c.status ?? "active") === "active");
  const latestScripts = scripts.slice(0, 5);

  // Petit “reality check”: si pas monté, éviter mismatch
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
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm text-white/60">UGC Growth • Creator</div>
            <h1 className="mt-2 text-3xl font-bold">Creator Dashboard</h1>
            <p className="mt-2 max-w-2xl text-white/70">
              Ton cockpit : scripts, campagnes, contenus — sans blabla. Tout ce qui est affiché ici
              vient de tes données (sinon c’est 0).
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/ai"
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

        {/* Stats réelles */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card
            title="Scripts générés"
            subtitle={`${scripts.length}`}
            right={<span className="text-xs text-white/50">Total</span>}
          >
            <div className="text-sm text-white/60">
              Basé sur tes scripts enregistrés (local pour l’instant).
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
              Limites d’usage + contrôle bêta (sans expliquer la mécanique).
            </div>
          </Card>
        </div>

        {/* Zone principale */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Derniers scripts */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm text-white/60">Derniers scripts</div>
                <div className="mt-1 text-xl font-semibold">Récents</div>
              </div>
              <Link
                href="/dashboard/ai"
                className="text-sm font-semibold text-purple-300 hover:text-purple-200"
              >
                Ouvrir l’Engine →
              </Link>
            </div>

            {latestScripts.length === 0 ? (
              <div className="mt-4">
                <EmptyState
                  title="Aucun script pour l’instant"
                  desc="Génère ton premier script (HOOK / STORY / PROBLÈME / SOLUTION / PREUVE / CTA) et il s’affichera ici."
                  actions={
                    <>
                      <Link
                        href="/dashboard/ai"
                        className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold hover:bg-purple-700"
                      >
                        Générer un script
                      </Link>
                      <Link
                        href="/dashboard/campaigns"
                        className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold hover:bg-white/10"
                      >
                        Créer une campagne
                      </Link>
                    </>
                  }
                />
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {latestScripts.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold">{s.title || "Script"}</div>
                        <div className="mt-1 text-xs text-white/60">
                          {formatDate(s.createdAt)}
                          {s.platform ? ` • ${s.platform}` : ""}
                          {s.lang ? ` • ${s.lang}` : ""}
                        </div>
                      </div>
                      <Link
                        href="/dashboard/ai"
                        className="shrink-0 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold hover:bg-white/10"
                      >
                        Re-générer
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Workflow */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/60">Workflow créateur</div>
            <div className="mt-1 text-xl font-semibold">Pipeline clair</div>

            <div className="mt-4 space-y-3">
              {[
                {
                  step: "1",
                  title: "Brief",
                  desc: "Objectif, niche, angle, contraintes, format.",
                },
                {
                  step: "2",
                  title: "Génération",
                  desc: "Script structuré prêt à tourner (format pro).",
                },
                {
                  step: "3",
                  title: "Publication",
                  desc: "Validation + diffusion + suivi simple.",
                },
              ].map((x) => (
                <div
                  key={x.step}
                  className="flex gap-3 rounded-xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600/70 text-sm font-bold">
                    {x.step}
                  </div>
                  <div>
                    <div className="font-semibold">{x.title}</div>
                    <div className="mt-1 text-sm text-white/70">{x.desc}</div>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <Link
                  href="/dashboard/ai"
                  className={cx(
                    "inline-flex items-center justify-center rounded-xl",
                    "bg-purple-600 px-5 py-2.5 text-sm font-semibold hover:bg-purple-700"
                  )}
                >
                  Ouvrir l’Engine maintenant
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Note pro (pas factice) */}
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <div className="text-sm text-white/60">Mode Premium (Agency)</div>
          <div className="mt-1 text-lg font-semibold">Effet WOW</div>
          <p className="mt-2 text-sm text-white/70">
            Quand tu passes en version agence : multi-clients, rôles (team), validations, historique,
            export, et reporting. Ici on garde un dashboard clean et crédible.
          </p>
        </div>
      </div>
    </div>
  );
}
