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

function TrendChart({ data }: { data: TrendPoint[] }) {
  const max = Math.max(...data.map((p) => p.value), 100);

  const points = data
    .map((p, i) => {
      const x = 30 + (i / Math.max(data.length - 1, 1)) * 280;
      const y = 130 - (p.value / max) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="w-full">
      <svg viewBox="0 0 340 170" className="h-36 w-full">
        {[0, 25, 50, 75, 100].map((v) => {
          const y = 130 - (v / 100) * 100;
          return (
            <g key={v}>
              <line x1="25" x2="320" y1={y} y2={y} stroke="rgba(255,255,255,.08)" />
              <text x="0" y={y + 4} fill="rgba(255,255,255,.45)" fontSize="10">
                {v}
              </text>
            </g>
          );
        })}

        <polyline
          fill="none"
          stroke="rgb(196,181,253)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {data.map((p, i) => {
          const x = 30 + (i / Math.max(data.length - 1, 1)) * 280;
          return (
            <text key={p.label} x={x - 10} y="160" fill="rgba(255,255,255,.55)" fontSize="11">
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

  const countryLabel = countries.find(([code]) => code === country)?.[1] || country;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Campagnes</h1>
        <p className="mt-1 text-white/60">
          Tendances en {countryLabel} — transforme-les en campagnes.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-5 text-xl font-semibold">Tendances & Opportunités</h2>

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
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-5">
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
                <div className="text-sm font-semibold text-white/70">Mini script</div>
                <p className="mt-2 rounded-xl bg-black/30 p-3 text-sm">
                  {selected.script}
                </p>
              </div>

              <a
                href={`/dashboard/ai?trend=${encodeURIComponent(selected.keyword)}`}
                className="mt-6 inline-flex w-full justify-center rounded-xl bg-violet-600 px-5 py-3 font-semibold hover:bg-violet-500"
              >
                Créer campagne
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
