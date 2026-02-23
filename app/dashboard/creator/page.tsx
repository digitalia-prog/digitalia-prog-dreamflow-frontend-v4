"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

type ScriptItem = {
  id: string;
  title: string;
  platform: string; // TikTok / Reels / YouTube Shorts...
  hookType?: string; // Question / Shock / Story...
  createdAt: string; // ISO date
};

type CampaignItem = {
  id: string;
  name: string;
  status: "active" | "paused" | "done";
  createdAt: string;
};

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function daysBetween(a: Date, b: Date) {
  const ms = Math.abs(a.getTime() - b.getTime());
  return ms / (1000 * 60 * 60 * 24);
}

function formatDate(d: Date) {
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function Card({
  title,
  value,
  subtitle,
  href,
}: {
  title: string;
  value: React.ReactNode;
  subtitle: string;
  href?: string;
}) {
  const content = (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/7 transition">
      <div className="text-sm text-white/60">{title}</div>
      <div className="mt-2 text-3xl font-semibold">{value}</div>
      <div className="mt-2 text-sm text-white/60">{subtitle}</div>
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}

export default function CreatorDashboardPage() {
  const [scripts, setScripts] = useState<ScriptItem[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);

  // ⚠️ Ici on lit "le réel" depuis localStorage.
  // Tu peux changer les clés si ton app utilise d'autres noms.
  useEffect(() => {
    const s = safeJsonParse<ScriptItem[]>(localStorage.getItem("ugc_scripts"), []);
    const c = safeJsonParse<CampaignItem[]>(localStorage.getItem("ugc_campaigns"), []);
    setScripts(Array.isArray(s) ? s : []);
    setCampaigns(Array.isArray(c) ? c : []);
  }, []);

  const now = useMemo(() => new Date(), []);

  const scriptsLast7Days = useMemo(() => {
    return scripts.filter((x) => {
      const d = new Date(x.createdAt);
      return daysBetween(now, d) <= 7;
    }).length;
  }, [scripts, now]);

  const activeCampaigns = useMemo(() => campaigns.filter((c) => c.status === "active").length, [campaigns]);

  const lastScripts = useMemo(() => {
    return [...scripts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [scripts]);

  const newestUpdate = useMemo(() => {
    // “Nouveautés” = infos produit (pas de chiffres inventés).
    // Tu peux modifier ces textes quand tu déploies une feature.
    return [
      {
        title: "Script Engine IA",
        desc: "Génération structurée : HOOK → STORY → PROBLÈME → SOLUTION → PREUVE → CTA.",
      },
      {
        title: "Feedback",
        desc: "Formulaire relié à une adresse email (ex: feedback@ugcgrowth.com).",
      },
      {
        title: "Anti-abus",
        desc: "Accès bêta avec restrictions (quotas / rate limit) pour éviter les abus.",
      },
    ];
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm text-white/60">UGC Growth • Creator</div>
            <h1 className="mt-1 text-3xl font-bold">Creator Dashboard</h1>
            <p className="mt-2 text-white/70">
              Ici tout est “réel” : si tu n’as pas de données, on affiche 0 — pas de fake.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/ai"
              className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold hover:bg-purple-700 transition"
            >
              Générer un script
            </Link>

            <Link
              href="/feedback"
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition"
            >
              Envoyer un feedback
            </Link>
          </div>
        </div>

        {/* KPIs (réels, pas inventés) */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card
            title="Scripts générés"
            value={scripts.length}
            subtitle="Total enregistré (local)"
            href="/dashboard/ai"
          />
          <Card
            title="Scripts (7 derniers jours)"
            value={scriptsLast7Days}
            subtitle="Activité récente"
            href="/dashboard/ai"
          />
          <Card
            title="Campagnes actives"
            value={activeCampaigns}
            subtitle="Basé sur tes campagnes"
            href="/dashboard/campaigns"
          />
        </div>

        {/* Actions (cliquables, pas décoratives) */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link
            href="/dashboard/ai"
            className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition block"
          >
            <div className="text-sm text-white/60">1) Génération IA</div>
            <div className="mt-2 text-lg font-semibold">Créer un script structuré</div>
            <div className="mt-2 text-sm text-white/70">
              Brief → paramètres → génération → copie/export.
            </div>
          </Link>

          <Link
            href="/dashboard/campaigns"
            className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition block"
          >
            <div className="text-sm text-white/60">2) Campagnes</div>
            <div className="mt-2 text-lg font-semibold">Suivre tes campagnes</div>
            <div className="mt-2 text-sm text-white/70">
              Statut, dates, créateurs, livrables.
            </div>
          </Link>

          <Link
            href="/dashboard/settings"
            className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition block"
          >
            <div className="text-sm text-white/60">3) Paramètres</div>
            <div className="mt-2 text-lg font-semibold">Configurer ton espace</div>
            <div className="mt-2 text-sm text-white/70">
              Identité, préférences, accès bêta.
            </div>
          </Link>
        </div>

        {/* Derniers scripts (réel) */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Derniers scripts générés</h2>
            <Link href="/dashboard/ai" className="text-sm text-purple-300 hover:text-purple-200">
              Voir le générateur →
            </Link>
          </div>

          {lastScripts.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-5 text-white/70">
              Aucun script trouvé pour l’instant.
              <div className="mt-2">
                <Link href="/dashboard/ai" className="text-purple-300 hover:text-purple-200">
                  Générer ton premier script →
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-4 grid gap-3">
              {lastScripts.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="font-semibold">{s.title}</div>
                      <div className="text-sm text-white/60">
                        {s.platform}
                        {s.hookType ? ` • ${s.hookType}` : ""} • {formatDate(new Date(s.createdAt))}
                      </div>
                    </div>
                    <Link
                      href="/dashboard/ai"
                      className="text-sm text-purple-300 hover:text-purple-200"
                    >
                      Générer similaire →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nouveautés (pas fake stats, juste produit) */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">Nouveautés</h2>
          <p className="mt-2 text-white/70">
            Mise à jour produit (pas de chiffres inventés, que du concret).
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {newestUpdate.map((u) => (
              <div key={u.title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="font-semibold">{u.title}</div>
                <div className="mt-2 text-sm text-white/70">{u.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 pb-10 text-xs text-white/40">
          Tip: quand tu passeras sur une base de données (Supabase/Prisma), on remplacera le localStorage par du vrai stockage.
        </div>
      </div>
    </main>
  );
}
