"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Client = {
  id: string;
  name: string;
  industry: string;
  plan: string;
  status: "Actif" | "En onboarding" | "En pause";
  owner: string;
  campaigns: number;
  scripts: number;
  kpi: string;
  nextAction: string;
  note: string;
};

const clientsSeed: Client[] = [
  {
    id: "CL-101",
    name: "NIVEA FR",
    industry: "Skincare • Retail",
    plan: "Agency Pro",
    status: "Actif",
    owner: "Sarah UGC",
    campaigns: 3,
    scripts: 18,
    kpi: "+18% engagement",
    nextAction: "Valider 3 hooks pour la prochaine créa",
    note: "3 scripts validés • 1 campagne live",
  },
  {
    id: "CL-102",
    name: "Beauty UK",
    industry: "Beauty • D2C",
    plan: "Agency",
    status: "Actif",
    owner: "Maya Creator",
    campaigns: 2,
    scripts: 12,
    kpi: "ROAS 2.4",
    nextAction: "Préparer une variante plus émotionnelle",
    note: "2 hooks gagnants • 5 variations",
  },
  {
    id: "CL-103",
    name: "Fitness US",
    industry: "Fitness • Coaching",
    plan: "Agency",
    status: "En onboarding",
    owner: "À assigner",
    campaigns: 1,
    scripts: 6,
    kpi: "CPA ↓",
    nextAction: "Finaliser le brief de lancement",
    note: "Brief reçu • scripts en cours",
  },
  {
    id: "CL-104",
    name: "Foodies FR",
    industry: "Food • UGC",
    plan: "Creator",
    status: "En pause",
    owner: "Lina Food",
    campaigns: 0,
    scripts: 4,
    kpi: "—",
    nextAction: "Relancer le client",
    note: "Relance prévue • backlog à reprendre",
  },
];

function statusBadge(status: Client["status"]) {
  if (status === "Actif") {
    return "border-emerald-500/25 bg-emerald-500/10 text-emerald-200";
  }

  if (status === "En onboarding") {
    return "border-amber-500/25 bg-amber-500/10 text-amber-200";
  }

  return "border-white/10 bg-white/5 text-white/60";
}

function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="text-xs text-white/50">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-xs text-white/45">{hint}</div>
    </div>
  );
}

export default function ClientsPage() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(clientsSeed[0].id);

  const filteredClients = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return clientsSeed;

    return clientsSeed.filter((client) => {
      return (
        client.name.toLowerCase().includes(q) ||
        client.industry.toLowerCase().includes(q) ||
        client.plan.toLowerCase().includes(q) ||
        client.status.toLowerCase().includes(q)
      );
    });
  }, [query]);

  const selected =
    clientsSeed.find((client) => client.id === selectedId) || clientsSeed[0];

  const activeClients = clientsSeed.filter((client) => client.status === "Actif");
  const totalCampaigns = clientsSeed.reduce(
    (sum, client) => sum + client.campaigns,
    0
  );
  const totalScripts = clientsSeed.reduce((sum, client) => sum + client.scripts, 0);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="rounded-3xl border border-purple-400/20 bg-gradient-to-br from-purple-600/20 via-white/5 to-black/20 p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm text-white/60">UGC Growth • Agency</div>

            <h1 className="mt-2 text-3xl font-bold text-white">
              Clients agence
            </h1>

            <p className="mt-2 max-w-3xl text-white/70">
              Suis tes clients, leurs campagnes, les scripts livrés et les
              prochaines actions dans un espace clair.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/agency"
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              ← Retour
            </Link>

            <button
              className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
              onClick={() => alert("Plus tard : ajouter un nouveau client")}
            >
              + Nouveau client
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <KpiCard
          label="Clients actifs"
          value={`${activeClients.length}`}
          hint="Comptes en production"
        />
        <KpiCard
          label="Campagnes"
          value={`${totalCampaigns}`}
          hint="En cours ou planifiées"
        />
        <KpiCard
          label="Scripts livrés"
          value={`${totalScripts}`}
          hint="Hooks + variantes"
        />
        <KpiCard
          label="Plan principal"
          value="Agency"
          hint="Workspace multi-clients"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Liste clients
              </h2>
              <p className="mt-1 text-sm text-white/55">
                Clique sur un client pour voir ses détails et prochaines actions.
              </p>
            </div>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher client, niche, plan..."
              className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-violet-500 md:w-[320px]"
            />
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-black/25 text-white/60">
                <tr>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Campagnes</th>
                  <th className="px-4 py-3">Scripts</th>
                  <th className="px-4 py-3">KPI</th>
                </tr>
              </thead>

              <tbody>
                {filteredClients.map((client) => {
                  const isSelected = selected.id === client.id;

                  return (
                    <tr
                      key={client.id}
                      onClick={() => setSelectedId(client.id)}
                      className={[
                        "cursor-pointer border-b border-white/5 transition hover:bg-white/5",
                        isSelected ? "bg-violet-500/10" : "",
                      ].join(" ")}
                    >
                      <td className="px-4 py-4">
                        <div className="font-semibold text-white">
                          {client.name}
                        </div>
                        <div className="text-xs text-white/45">
                          {client.industry}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-white/70">
                        {client.plan}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs ${statusBadge(
                            client.status
                          )}`}
                        >
                          {client.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-white/70">
                        {client.campaigns}
                      </td>

                      <td className="px-4 py-4 text-white/70">
                        {client.scripts}
                      </td>

                      <td className="px-4 py-4 text-white/70">
                        {client.kpi}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredClients.length === 0 && (
              <div className="p-6 text-sm text-white/55">
                Aucun client trouvé.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm text-white/55">Détails client</div>

          <div className="mt-3 rounded-2xl border border-white/10 bg-black/25 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-white">
                  {selected.name}
                </h3>
                <p className="mt-1 text-sm text-white/55">
                  {selected.industry}
                </p>
              </div>

              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs ${statusBadge(
                  selected.status
                )}`}
              >
                {selected.status}
              </span>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-white/45">Responsable</div>
                <div className="mt-1 text-sm font-semibold text-white">
                  {selected.owner}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-white/45">Performance</div>
                <div className="mt-1 text-sm font-semibold text-white">
                  {selected.kpi}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-white/45">Note</div>
                <div className="mt-1 text-sm text-white/75">
                  {selected.note}
                </div>
              </div>

              <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-4">
                <div className="text-xs text-violet-200/70">
                  Prochaine action
                </div>
                <div className="mt-1 text-sm font-semibold text-white">
                  {selected.nextAction}
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/dashboard/campaigns"
                className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
              >
                Voir campagnes
              </Link>

              <Link
                href="/dashboard/ai"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
              >
                Générer scripts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
