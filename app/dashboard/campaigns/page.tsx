"use client";

import { useState } from "react";

type TrendPoint = {
  date: string;
  value: number;
};

type TrendItem = {
  keyword: string;
  volume: number;
  growth: number;
  opportunityScore: number;
  curve: TrendPoint[];
  angle: string;
  hooks: string[];
  script: string;
};

function Sparkline({ data }: { data: TrendPoint[] }) {
  const points = data
    .map((p, i) => {
      const x = (i / Math.max(data.length - 1, 1)) * 160;
      const y = 60 - (p.value / 100) * 50;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 160 70" className="h-16 w-full">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        points={points}
        className="text-violet-400"
      />
    </svg>
  );
}

export default function CampaignsPage() {
  const [keyword, setKeyword] = useState("ongles printemps");
  const [country, setCountry] = useState("US");
  const [platform, setPlatform] = useState("Global Ads");
  const [niche, setNiche] = useState("E-commerce");
  const [goal, setGoal] = useState("Conversion");
  const [loading, setLoading] = useState(false);
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [selected, setSelected] = useState<TrendItem | null>(null);

  async function analyzeTrends() {
    setLoading(true);
    setSelected(null);

    const res = await fetch("/api/campaign-trends", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keyword, country, platform, niche, goal }),
    });

    const data = await res.json();

    setTrends(data.trends || []);
    setSelected(data.trends?.[0] || null);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Campagnes</h1>
        <p className="text-white/60 mt-1">
          Tendances en {country} 🌍 — transforme-les en campagnes.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-xl font-semibold">
          Tendances & Opportunités
        </h2>

        <div className="grid gap-4 md:grid-cols-5">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Mot-clé"
            className="rounded-xl border border-white/10 bg-black/30 px-4 py-3"
          />

          {/* 🌍 PAYS MONDE */}
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/30 px-4 py-3"
          >
            <option value="US">USA 🇺🇸</option>
            <option value="FR">France 🇫🇷</option>
            <option value="GB">UK 🇬🇧</option>
            <option value="CA">Canada 🇨🇦</option>
            <option value="DE">Allemagne 🇩🇪</option>
            <option value="ES">Espagne 🇪🇸</option>
            <option value="IT">Italie 🇮🇹</option>
            <option value="NL">Pays-Bas 🇳🇱</option>
            <option value="SE">Suède 🇸🇪</option>
            <option value="AU">Australie 🇦🇺</option>
            <option value="BR">Brésil 🇧🇷</option>
            <option value="MX">Mexique 🇲🇽</option>
            <option value="JP">Japon 🇯🇵</option>
            <option value="KR">Corée 🇰🇷</option>
            <option value="AE">Émirats 🇦🇪</option>
            <option value="DZ">Algérie 🇩🇿</option>
          </select>

          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/30 px-4 py-3"
          >
            <option>Global Ads</option>
            <option>Social</option>
            <option>E-commerce</option>
            <option>Branding</option>
          </select>

          <button
            onClick={analyzeTrends}
            className="rounded-xl bg-purple-600 px-4 py-3"
          >
            {loading ? "Analyse..." : "Analyser"}
          </button>
        </div>
      </div>

      {trends.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3">
            {trends.map((trend) => (
              <button
                key={trend.keyword}
                onClick={() => setSelected(trend)}
                className="w-full rounded-xl border border-white/10 bg-black/30 p-4"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{trend.keyword}</div>
                    <div className="text-sm text-white/50">
                      Score {trend.opportunityScore}
                    </div>
                  </div>

                  <div className="text-green-400">+{trend.growth}%</div>
                </div>

                <Sparkline data={trend.curve} />
              </button>
            ))}
          </div>

          {selected && (
            <div className="rounded-xl border border-white/10 bg-black/30 p-4 space-y-4">
              <h3 className="font-semibold">{selected.keyword}</h3>

              <div>
                <div className="text-sm text-white/50">Angle</div>
                <div>{selected.angle}</div>
              </div>

              <div>
                <div className="text-sm text-white/50">Hooks</div>
                {selected.hooks.map((h, i) => (
                  <div key={i}>• {h}</div>
                ))}
              </div>

              <a
                href={`/dashboard/ai?trend=${selected.keyword}`}
                className="block text-center bg-purple-600 p-3 rounded-lg"
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
