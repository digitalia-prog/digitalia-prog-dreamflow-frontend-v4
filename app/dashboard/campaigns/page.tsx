"use client";

import { useState } from "react";

type TrendPoint = {
  label: string;
  value: number;
};

type TrendItem = {
  keyword: string;
  volume: number;
  weeklyGrowth: number;
  monthlyGrowth: number;
  yearlyGrowth: number;
  opportunityScore: number;
  timeline: TrendPoint[];
  angle: string;
  hooks: string[];
  script: string;
};

type CampaignWorkflow = {
  name: string;
  product: string;
  hook: string;
  creator: string;
  status: "Brief" | "Script" | "Shoot" | "Edit" | "Posted";
  progress: number;
};

const countries = [
  ["US", "États-Unis 🇺🇸"],
  ["FR", "France 🇫🇷"],
  ["GB", "Grande-Bretagne 🇬🇧"],
  ["CA", "Canada 🇨🇦"],
  ["DE", "Allemagne 🇩🇪"],
  ["ES", "Espagne 🇪🇸"],
  ["IT", "Italie 🇮🇹"],
  ["NL", "Benelux 🇳🇱"],
  ["SE", "Pays scandinaves 🇸🇪"],
  ["BR", "Brésil 🇧🇷"],
  ["MX", "Mexique 🇲🇽"],
  ["DZ", "Algérie 🇩🇿"],
];

const workflowCampaigns: CampaignWorkflow[] = [
  {
    name: "Summer Bikini Campaign",
    product: "Maillot de bain",
    hook: "Pourquoi tout le monde porte ce modèle cet été ?",
    creator: "Sarah UGC",
    status: "Script",
    progress: 45,
  },
  {
    name: "Glow Routine Test",
    product: "Routine beauté",
    hook: "J’ai testé cette routine pendant 7 jours.",
    creator: "Maya Creator",
    status: "Shoot",
    progress: 62,
  },
  {
    name: "Creator Offer Launch",
    product: "Offre créateur",
    hook: "Tu postes sans stratégie ? Voilà pourquoi ça bloque.",
    creator: "À assigner",
    status: "Brief",
    progress: 20,
  },
];

function TrendChart({ data }: { data: TrendPoint[] }) {
  const max = Math.max(...data.map((p) => p.value), 100);

  const points = data
    .map((p, i) => {
      const x = 34 + (i / Math.max(data.length - 1, 1)) * 280;
      const y = 112 - (p.value / max) * 82;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox="0 0 340 150" className="h-36 w-full">
        {[0, 25, 50, 75, 100].map((v) => {
          const y = 112 - (v / 100) * 82;
          return (
            <g key={v}>
              <line
                x1="32"
                x2="320"
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,.08)"
              />
              <text
                x="4"
                y={y + 4}
                fill="rgba(255,255,255,.45)"
                fontSize="10"
              >
                {v}
              </text>
            </g>
          );
        })}

        <polyline
          fill="none"
          stroke="rgb(221,214,254)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {data.map((p, i) => {
          const x = 34 + (i / Math.max(data.length - 1, 1)) * 280;

          if (i % 3 !== 0 && i !== data.length - 1) return null;

          return (
            <text
              key={`${p.label}-${i}`}
              x={x}
              y="142"
              textAnchor="middle"
              fill="rgba(255,255,255,.55)"
              fontSize="10"
            >
              {p.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function Growth({ value }: { value: number }) {
  const positive = value >= 0;

  return (
    <span className={positive ? "text-emerald-300" : "text-red-300"}>
      {positive ? "+" : ""}
      {value}%
    </span>
  );
}

function StatusBadge({ status }: { status: CampaignWorkflow["status"] }) {
  const colors: Record<CampaignWorkflow["status"], string> = {
    Brief: "border-white/10 bg-white/5 text-white/70",
    Script: "border-violet-500/30 bg-violet-500/15 text-violet-200",
    Shoot: "border-blue-500/30 bg-blue-500/15 text-blue-200",
    Edit: "border-amber-500/30 bg-amber-500/15 text-amber-200",
    Posted: "border-emerald-500/30 bg-emerald-500/15 text-emerald-200",
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-xs ${colors[status]}`}>
      {status}
    </span>
  );
}

export default function CampaignsPage() {
  const [keyword, setKeyword] = useState("MAILLOT DE BAIN");
  const [country, setCountry] = useState("FR");
  const [platform, setPlatform] = useState("Global Ads");
  const [loading, setLoading] = useState(false);
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [selected, setSelected] = useState<TrendItem | null>(null);

  async function analyzeTrends() {
    setLoading(true);

    const res = await fetch("/api/campaign-trends", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keyword, country, platform }),
    });

    const data = await res.json();

    setTrends(data.trends || []);
    setSelected(data.trends?.[0] || null);
    setLoading(false);
  }

  const countryLabel =
    countries.find(([code]) => code === country)?.[1] || country;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-600/20 via-white/5 to-black/20 p-6">
        <div className="text-sm text-white/60">UGC Growth • Campagnes</div>

        <h1 className="mt-2 text-3xl font-bold text-white">Campagnes</h1>

        <p className="mt-2 max-w-3xl text-white/70">
          Repère les tendances, transforme les opportunités en angles marketing,
          puis organise tes scripts et créateurs dans un workflow clair.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-2 text-xl font-semibold">Tendances & Opportunités</h2>

        <p className="mb-5 text-sm text-white/60">
          Tendances en {countryLabel} — transforme-les en campagnes.
        </p>

        <div className="grid gap-4 md:grid-cols-4">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Saisir un mot-clé"
            className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
          />

          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
          >
            {countries.map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
          >
            <option>Global Ads</option>
            <option>Social</option>
            <option>E-commerce</option>
            <option>Branding</option>
          </select>

          <button
            onClick={analyzeTrends}
            disabled={loading}
            className="rounded-xl bg-violet-600 px-5 py-3 font-semibold hover:bg-violet-500 disabled:opacity-50"
          >
            {loading ? "Analyse..." : "Analyser"}
          </button>
        </div>
      </div>

      {trends.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:col-span-2">
            <div className="grid grid-cols-6 gap-4 border-b border-white/10 pb-3 text-sm font-semibold text-white/60">
              <div className="col-span-2">Mot-clé</div>
              <div>Volume</div>
              <div>Hebdo</div>
              <div>Mensuel</div>
              <div>Annuel</div>
            </div>

            <div className="space-y-3 pt-3">
              {trends.map((trend) => (
                <button
                  key={trend.keyword}
                  onClick={() => setSelected(trend)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 p-4 text-left hover:border-violet-500/60"
                >
                  <div className="grid grid-cols-6 gap-4">
                    <div className="col-span-2">
                      <div className="font-semibold">{trend.keyword}</div>
                      <div className="text-sm text-white/50">
                        Score {trend.opportunityScore}/100
                      </div>
                    </div>

                    <div>{trend.volume}/100</div>

                    <div>
                      <Growth value={trend.weeklyGrowth} />
                    </div>

                    <div>
                      <Growth value={trend.monthlyGrowth} />
                    </div>

                    <div>
                      <Growth value={trend.yearlyGrowth} />
                    </div>
                  </div>

                  <div className="mt-4">
                    <TrendChart data={trend.timeline} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selected && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold">{selected.keyword}</h3>

              <div className="mt-4 rounded-xl border border-violet-500/20 bg-violet-500/10 p-4">
                <div className="text-sm text-white/60">Score opportunité</div>
                <div className="text-4xl font-bold text-violet-200">
                  {selected.opportunityScore}/100
                </div>
              </div>

              <div className="mt-5">
                <div className="text-sm font-semibold text-white/70">Angle</div>
                <p className="mt-2 text-sm text-white/85">{selected.angle}</p>
              </div>

              <div className="mt-5">
                <div className="text-sm font-semibold text-white/70">Hooks</div>
                <div className="mt-2 space-y-2">
                  {selected.hooks.map((hook, i) => (
                    <div key={i} className="rounded-xl bg-black/30 p-3 text-sm">
                      {hook}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <div className="text-sm font-semibold text-white/70">
                  Mini script
                </div>
                <p className="mt-2 rounded-xl bg-black/30 p-3 text-sm">
                  {selected.script}
                </p>
              </div>

              <a
                href={`/dashboard/ai?trend=${encodeURIComponent(
                  selected.keyword
                )}`}
                className="mt-6 inline-flex w-full justify-center rounded-xl bg-violet-600 px-5 py-3 font-semibold hover:bg-violet-500"
              >
                Créer campagne
              </a>
            </div>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Workflow campagnes</h2>
            <p className="mt-1 text-sm text-white/60">
              Organise les campagnes en cours, les hooks choisis, les scripts et
              les créateurs assignés.
            </p>
          </div>

          <button className="rounded-xl bg-violet-600 px-4 py-2 font-semibold hover:bg-violet-500">
            + Nouvelle campagne
          </button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {workflowCampaigns.map((campaign) => (
            <div
              key={campaign.name}
              className="rounded-2xl border border-white/10 bg-black/30 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-white">
                    {campaign.name}
                  </div>
                  <div className="mt-1 text-sm text-white/50">
                    Produit : {campaign.product}
                  </div>
                </div>

                <StatusBadge status={campaign.status} />
              </div>

              <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-white/45">Hook choisi</div>
                <div className="mt-1 text-sm text-white/85">
                  “{campaign.hook}”
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="text-white/50">Créateur assigné</div>
                <div className="font-medium text-white">{campaign.creator}</div>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-xs text-white/50">
                  <span>Progression</span>
                  <span>{campaign.progress}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-violet-500"
                    style={{ width: `${campaign.progress}%` }}
                  />
                </div>
              </div>

              <button className="mt-5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10">
                Ouvrir campagne
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
