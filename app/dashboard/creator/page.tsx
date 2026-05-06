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
            <div className="mt-1 text-xl font-semibold text-white">
              {subtitle}
            </div>
          )}
        </div>

        {right && <div className="shrink-0">{right}</div>}
      </div>

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

function ActionCard({
  title,
  desc,
  href,
  cta,
  primary,
}: {
  title: string;
  desc: string;
  href: string;
  cta: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "block rounded-2xl border p-5 transition",
        primary
          ? "border-purple-400/40 bg-purple-600/20 hover:bg-purple-600/30"
          : "border-white/10 bg-white/5 hover:bg-white/10",
      ].join(" ")}
    >
      <div className="text-lg font-semibold text-white">{title}</div>

      <p className="mt-2 text-sm text-white/65">{desc}</p>

      <div className="mt-4 text-sm font-semibold text-purple-200">
        {cta} →
      </div>
    </Link>
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

  const latestScripts = scripts.slice(0, 3);
  const latestCampaign = campaigns[0];

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
        <div className="rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-600/20 via-white/5 to-black/20 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-sm text-white/60">
                UGC Growth • Creator
              </div>

              <h1 className="mt-2 text-3xl font-bold text-white">
                Creator Dashboard
              </h1>

              <p className="mt-2 max-w-2xl text-white/70">
                Analyse une vidéo, transforme l’insight en scripts, puis lance
                une campagne prête à tester.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/analyze-upload"
                className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
              >
                Analyser une vidéo
              </Link>

              <Link
                href="/dashboard/creator/engine"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Générer un script
              </Link>

              <Link
                href="/dashboard/campaigns"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Créer une campagne
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card
            title="Scripts générés"
            subtitle={`${scripts.length}`}
            right={<span className="text-xs text-white/50">Total</span>}
          >
            <div className="text-sm text-white/60">
              Tes scripts sauvegardés apparaîtront ici.
            </div>
          </Card>

          <Card
            title="Campagnes actives"
            subtitle={`${activeCampaigns.length}`}
            right={<span className="text-xs text-white/50">En cours</span>}
          >
            <div className="text-sm text-white/60">
              {latestCampaign
                ? `Dernière campagne : ${latestCampaign.name}`
                : "Crée ta première campagne à partir d’une tendance ou d’une vidéo."}
            </div>
          </Card>

          <Card
            title="Workflow recommandé"
            subtitle="Analyse → Script → Campagne"
            right={<span className="text-xs text-white/50">Bêta</span>}
          >
            <div className="text-sm text-white/60">
              Le chemin le plus rapide pour créer du contenu testable.
            </div>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <ActionCard
            primary
            title="1. Analyse une vidéo virale"
            desc="TikTok, YouTube ou upload : récupère hook, angle, psychologie et score viral."
            href="/dashboard/analyze-upload"
            cta="Ouvrir l’analyse vidéo"
          />

          <ActionCard
            title="2. Génère des scripts"
            desc="Transforme ton idée en hooks, scripts AIDA, CTA, shotlist et plan de test."
            href="/dashboard/creator/engine"
            cta="Ouvrir Script Engine"
          />

          <ActionCard
            title="3. Lance une campagne"
            desc="Organise tes angles, créateurs, briefs et prochaines actions dans le pipeline."
            href="/dashboard/campaigns"
            cta="Créer une campagne"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card title="Derniers scripts">
            {latestScripts.length > 0 ? (
              <div className="space-y-3">
                {latestScripts.map((script) => (
                  <div
                    key={script.id}
                    className="rounded-xl border border-white/10 bg-black/20 p-3"
                  >
                    <div className="font-semibold text-white">
                      {script.title}
                    </div>

                    <div className="mt-1 text-xs text-white/45">
                      {script.platform || "Plateforme"} •{" "}
                      {script.lang || "Langue"} •{" "}
                      {formatDate(script.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-white/60">
                Aucun script pour l’instant. Commence par analyser une vidéo ou
                générer un script.
              </div>
            )}
          </Card>

          <Card
            title="Prochaine action recommandée"
            subtitle="Créer ton premier test"
          >
            <div className="space-y-3 text-sm text-white/70">
              <div>• Analyse une vidéo performante de ta niche.</div>
              <div>• Garde le meilleur hook + angle.</div>
              <div>• Génère 4 scripts Creator ou 10 scripts Agency.</div>
              <div>• Lance une campagne test avec 2-3 variantes.</div>
            </div>

            <div className="mt-5">
              <Link
                href="/dashboard/analyze-upload"
                className="inline-flex rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
              >
                Commencer maintenant
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
