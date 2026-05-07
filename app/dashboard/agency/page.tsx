"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Status = "Brief" | "Casting" | "Script" | "Shoot" | "Edit" | "Posted";

type Campaign = {
  id: string;
  brand: string;
  niche: string;
  status: Status;
  budget: number;
  creators: number;
  due: string;
};

const seed: Campaign[] = [
  {
    id: "C-101",
    brand: "HydroSmart",
    niche: "Fitness",
    status: "Brief",
    budget: 900,
    creators: 3,
    due: "2026-02-27",
  },
  {
    id: "C-102",
    brand: "GlowSkin",
    niche: "Beauty",
    status: "Casting",
    budget: 1400,
    creators: 5,
    due: "2026-03-02",
  },
  {
    id: "C-103",
    brand: "MealDrop",
    niche: "Food",
    status: "Script",
    budget: 1200,
    creators: 4,
    due: "2026-02-25",
  },
  {
    id: "C-104",
    brand: "ShopTok",
    niche: "Tech",
    status: "Shoot",
    budget: 2000,
    creators: 6,
    due: "2026-03-06",
  },
  {
    id: "C-105",
    brand: "ViralPlanner",
    niche: "Productivity",
    status: "Edit",
    budget: 800,
    creators: 2,
    due: "2026-02-24",
  },
  {
    id: "C-106",
    brand: "UGC Studio",
    niche: "Agency",
    status: "Posted",
    budget: 1600,
    creators: 5,
    due: "2026-02-18",
  },
];

const statuses: Status[] = [
  "Brief",
  "Casting",
  "Script",
  "Shoot",
  "Edit",
  "Posted",
];

function badge(status: Status) {
  const map: Record<Status, string> = {
    Brief: "border-white/10 bg-white/5 text-white/75",
    Casting: "border-violet-500/25 bg-violet-600/10 text-violet-200",
    Script: "border-blue-500/25 bg-blue-600/10 text-blue-200",
    Shoot: "border-amber-500/25 bg-amber-600/10 text-amber-200",
    Edit: "border-fuchsia-500/25 bg-fuchsia-600/10 text-fuchsia-200",
    Posted: "border-emerald-500/25 bg-emerald-600/10 text-emerald-200",
  };

  return map[status];
}

function Kpi({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="text-xs text-white/55">{label}</div>
      <div className="mt-2 text-xl font-semibold text-white">{value}</div>
      {hint && <div className="mt-1 text-xs text-white/45">{hint}</div>}
    </div>
  );
}

function WorkflowCard({
  step,
  title,
  text,
}: {
  step: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs font-semibold text-violet-200">{step}</div>
      <div className="mt-2 text-base font-semibold text-white">{title}</div>
      <div className="mt-2 text-sm text-white/60">{text}</div>
    </div>
  );
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

  const totalBudget = useMemo(
    () => filtered.reduce((s, c) => s + c.budget, 0),
    [filtered]
  );

  const totalCreators = useMemo(
    () => filtered.reduce((s, c) => s + c.creators, 0),
    [filtered]
  );

  const inProduction = filtered.filter((c) =>
    ["Script", "Shoot", "Edit"].includes(c.status)
  ).length;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-600/20 via-white/5 to-black/20 p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm text-white/55">UGC Growth • Agency</div>

            <h1 className="mt-2 text-3xl font-bold text-white">
              Agency Dashboard
            </h1>

            <p className="mt-2 max-w-3xl text-sm text-white/70">
              Pilote tes campagnes UGC : analyse, brief, casting, scripts,
              shoot, édition et publication.
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
              href="/dashboard/ai"
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Générer 10 scripts
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

      <div className="grid gap-4 md:grid-cols-4">
        <Kpi
          label="Budget suivi"
          value={`€${totalBudget.toLocaleString("fr-FR")}`}
          hint="Campagnes filtrées"
        />
        <Kpi
          label="Créateurs activés"
          value={`${totalCreators}`}
          hint="Casting + production"
        />
        <Kpi
          label="Campagnes"
          value={`${filtered.length}`}
          hint="Pipeline actif"
        />
        <Kpi
          label="En production"
          value={`${inProduction}`}
          hint="Script / Shoot / Edit"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <WorkflowCard
          step="01"
          title="Analyse"
          text="Décortique une vidéo ou une tendance pour trouver hook, angle et psychologie."
        />
        <WorkflowCard
          step="02"
          title="Brief"
          text="Transforme l’insight en brief clair pour créateurs et clients."
        />
        <WorkflowCard
          step="03"
          title="Scripts"
          text="Génère 10 scripts Agency avec AIDA, CTA, shotlist et plan de test."
        />
        <WorkflowCard
          step="04"
          title="Campagne"
          text="Suis la production jusqu’à la publication et aux tests créatifs."
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xl font-semibold text-white">
              Pipeline campagnes
            </div>
            <div className="mt-1 text-sm text-white/60">
              Brief → Casting → Script → Shoot → Edit → Posted
            </div>
          </div>

          <button className="rounded-xl border border-violet-500/30 bg-violet-600/10 px-4 py-2 text-sm font-semibold text-violet-200 hover:bg-violet-600/20">
            + Campagne IA
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher brand, niche, ID…"
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/40 md:w-[340px]"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as Status | "All")}
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

          <div className="text-sm text-white/45">
            {filtered.length} campagne(s) affichée(s)
          </div>
        </div>
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
              <tr
                key={c.id}
                className="border-b border-white/5 hover:bg-white/5"
              >
                <td className="px-4 py-3 text-white/80">{c.id}</td>
                <td className="px-4 py-3 font-semibold text-white">
                  {c.brand}
                </td>
                <td className="px-4 py-3 text-white/70">{c.niche}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full border px-2 py-1 text-xs ${badge(
                      c.status
                    )}`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-white/80">
                  €{c.budget.toLocaleString("fr-FR")}
                </td>
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
