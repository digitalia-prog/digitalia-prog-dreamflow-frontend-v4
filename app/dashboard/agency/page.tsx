"use client";

import { useMemo, useState } from "react";

type Status = "Brief" | "Casting" | "Script" | "Shoot" | "Edit" | "Posted";

type Campaign = {
  id: string;
  brand: string;
  niche: string;
  status: Status;
  budget: number;
  creators: number;
  due: string; // YYYY-MM-DD
};

const seed: Campaign[] = [
  { id: "C-101", brand: "HydroSmart", niche: "Fitness", status: "Brief", budget: 900, creators: 3, due: "2026-02-27" },
  { id: "C-102", brand: "GlowSkin", niche: "Beauty", status: "Casting", budget: 1400, creators: 5, due: "2026-03-02" },
  { id: "C-103", brand: "MealDrop", niche: "Food", status: "Script", budget: 1200, creators: 4, due: "2026-02-25" },
  { id: "C-104", brand: "ShopTok", niche: "Tech", status: "Shoot", budget: 2000, creators: 6, due: "2026-03-06" },
  { id: "C-105", brand: "ViralPlanner", niche: "Productivity", status: "Edit", budget: 800, creators: 2, due: "2026-02-24" },
  { id: "C-106", brand: "UGC Studio", niche: "Agency", status: "Posted", budget: 1600, creators: 5, due: "2026-02-18" },
];

const statuses: Status[] = ["Brief", "Casting", "Script", "Shoot", "Edit", "Posted"];

function badge(status: Status) {
  const map: Record<Status, string> = {
    Brief: "border-white/10 bg-white/5 text-white/75",
    Casting: "border-violet-500/25 bg-violet-600/10 text-violet-200",
    Script: "border-violet-500/25 bg-violet-600/10 text-violet-200",
    Shoot: "border-violet-500/25 bg-violet-600/10 text-violet-200",
    Edit: "border-violet-500/25 bg-violet-600/10 text-violet-200",
    Posted: "border-emerald-500/25 bg-emerald-600/10 text-emerald-200",
  };
  return map[status];
}

export default function AgencyPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Status | "All">("All");
  const [rows] = useState<Campaign[]>(seed);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((c) => {
      const okStatus = filter === "All" ? true : c.status === filter;
      const okQuery =
        !q ||
        c.brand.toLowerCase().includes(q) ||
        c.niche.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q);
      return okStatus && okQuery;
    });
  }, [rows, query, filter]);

  const totalBudget = useMemo(() => filtered.reduce((s, c) => s + c.budget, 0), [filtered]);
  const totalCreators = useMemo(() => filtered.reduce((s, c) => s + c.creators, 0), [filtered]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-white/55">Agency</div>
        <div className="text-2xl font-semibold">Pipeline Campagnes</div>
        <div className="mt-2 text-sm text-white/70">
          Suivi de production : brief → casting → script → shoot → edit → posted
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Kpi label="Budget (filtré)" value={`€${totalBudget.toLocaleString("fr-FR")}`} />
          <Kpi label="Creators (filtré)" value={`${totalCreators}`} />
          <Kpi label="Campagnes" value={`${filtered.length}`} />
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher (brand, niche, id)…"
            className="w-full md:w-[340px] rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
          >
            <option value="All">Tous</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <button className="rounded-xl border border-violet-500/30 bg-violet-600/10 px-4 py-2 text-sm font-semibold text-violet-200 hover:bg-violet-600/20">
          + New campaign
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-black/20 text-white/70">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Niche</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">Creators</th>
              <th className="px-4 py-3">Due</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-4 py-3 text-white/80">{c.id}</td>
                <td className="px-4 py-3 font-semibold">{c.brand}</td>
                <td className="px-4 py-3 text-white/70">{c.niche}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full border px-2 py-1 text-xs ${badge(c.status)}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-white/80">€{c.budget.toLocaleString("fr-FR")}</td>
                <td className="px-4 py-3 text-white/80">{c.creators}</td>
                <td className="px-4 py-3 text-white/70">{c.due}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-6 text-sm text-white/60">Aucun résultat.</div>
        )}
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="text-xs text-white/55">{label}</div>
      <div className="mt-2 text-xl font-semibold">{value}</div>
    </div>
  );
}
