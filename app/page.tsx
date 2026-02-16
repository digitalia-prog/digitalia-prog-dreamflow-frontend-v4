export const metadata = {
  title: "UGC GROWTH",
  description: "Dashboard UGC + scripts IA + workflow",
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          UGC GROWTH <html lang="fr" translate="no">
        </h1>

        <p className="text-lg md:text-xl text-gray-400 mb-8">
          La plateforme simple pour gérer vos campagnes UGC,
          créateurs et clients depuis un seul dashboard.
        </p>

        <div className="flex gap-4 justify-center">
          <a
            href="/dashboard"
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold transition"
          >
            Accéder au Dashboard
          </a>

          <a
            href="#features"
            className="border border-gray-600 hover:border-gray-400 px-6 py-3 rounded-xl transition"
          >
            Voir les fonctionnalités
          </a>
        </div>

      </div>
    </main>
  );
}

const BRAND = "UGC GROWTH";
const COMPANY = "UGC GROWTH";
const BETA_PRICE = "€999 (Bêta)";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white px-6">
      <div className="mx-auto max-w-5xl py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/80">
          <span className="h-2 w-2 rounded-full bg-purple-500" />
          Bêta privée — {BETA_PRICE}
        </div>

        <h1 className="mt-6 text-5xl md:text-6xl font-extrabold">
          {BRAND}
        </h1>

        <p className="mt-4 text-lg md:text-xl text-white/70">
          La plateforme simple pour gérer vos campagnes UGC, créateurs et clients depuis un seul dashboard.
        </p>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <a
            href="/dashboard"
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold"
          >
            Accéder au Dashboard
          </a>
          <a
            href="#pricing"
            className="border border-white/25 hover:border-white/50 px-6 py-3 rounded-xl font-semibold"
          >
            Voir le prix bêta
          </a>
          <a
            href="#features"
            className="border border-white/25 hover:border-white/50 px-6 py-3 rounded-xl font-semibold"
          >
            Voir les fonctionnalités
          </a>
        </div>

        <div id="features" className="mt-16 grid gap-4 md:grid-cols-3 text-left">
          <div className="rounded-2xl border border-white/10 p-5 bg-white/5">
            <div className="font-semibold">Scripts IA</div>
            <div className="mt-2 text-white/70 text-sm">Hooks, structure, CTA, variantes TikTok/IG/YT.</div>
          </div>
          <div className="rounded-2xl border border-white/10 p-5 bg-white/5">
            <div className="font-semibold">Dashboard agence</div>
            <div className="mt-2 text-white/70 text-sm">Campagnes, créateurs, livrables, pipeline.</div>
          </div>
          <div className="rounded-2xl border border-white/10 p-5 bg-white/5">
            <div className="font-semibold">Workflow centralisé</div>
            <div className="mt-2 text-white/70 text-sm">Liens Notion / Sheets / Drive / Slack dans “Paramètres”.</div>
          </div>
        </div>

        <div id="pricing" className="mt-16 rounded-3xl border border-purple-500/30 bg-purple-500/10 p-8 text-left">
          <div className="text-sm text-white/70">Offre Bêta</div>
          <div className="mt-2 text-3xl font-bold">{BETA_PRICE}</div>
          <ul className="mt-4 space-y-2 text-white/80">
            <li>• Setup digital + dashboard + générateur scripts</li>
            <li>• Paramètres workflow (Notion/Sheets/Drive/Slack)</li>
            <li>• Accès sur devis (pas besoin Stripe en bêta)</li>
          </ul>
          <div className="mt-6 text-sm text-white/60">
            {COMPANY} — Démo + onboarding en visio (Google Meet).
          </div>
        </div>

        <footer className="mt-16 border-t border-white/10 pt-8 text-sm text-white/60">
          © {new Date().getFullYear()} {COMPANY} •{" "}
          <a className="underline" href="/terms">Conditions générales</a>
        </footer>
      </div>
    </main>
  );
}

export default function Terms() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Conditions générales (Bêta)</h1>
        <p className="mt-4 text-white/70">
          UGC GROWTH est actuellement en version bêta. Les fonctionnalités, tarifs et limites peuvent évoluer.
        </p>

        <h2 className="mt-10 text-xl font-semibold">Accès & utilisation</h2>
        <ul className="mt-3 space-y-2 text-white/70">
          <li>• Accès sur devis / invitation.</li>
          <li>• Usage raisonnable : pas d’abus, scraping, multi-comptes.</li>
          <li>• En cas d’abus, l’accès peut être suspendu.</li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold">Responsabilité</h2>
        <p className="mt-3 text-white/70">
          Les scripts générés sont des suggestions. Le client reste responsable de la validation finale.
        </p>

        <h2 className="mt-10 text-xl font-semibold">Contact</h2>
        <p className="mt-3 text-white/70">
          Pour une démo ou un devis : répondre par email / WhatsApp (selon ton process).
        </p>
      </div>
    </main>
  );
}


"use client";

import { useEffect, useState } from "react";

type Links = {
  notion: string;
  sheets: string;
  drive: string;
  slack: string;
};

const KEY = "ugc_growth_workflow_links";

export default function SettingsPage() {
  const [links, setLinks] = useState<Links>({
    notion: "",
    sheets: "",
    drive: "",
    slack: "",
  });

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setLinks(JSON.parse(raw));
  }, []);

  function save(next: Links) {
    setLinks(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  return (
    <main className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Paramètres</h1>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 max-w-2xl">
        <h2 className="text-lg font-semibold">Liens workflow</h2>
        <p className="text-sm text-white/60 mt-1">
          Centralise tes outils (bêta : sauvegarde locale sur cet appareil).
        </p>

        <div className="mt-4 space-y-3">
          <Input label="Notion (workspace / board)" value={links.notion}
            onChange={(v) => save({ ...links, notion: v })} />
          <Input label="Google Sheets (table KPI / scripts)" value={links.sheets}
            onChange={(v) => save({ ...links, sheets: v })} />
          <Input label="Google Drive / Dropbox (stockage)" value={links.drive}
            onChange={(v) => save({ ...links, drive: v })} />
          <Input label="Slack / WhatsApp (communication)" value={links.slack}
            onChange={(v) => save({ ...links, slack: v })} />
        </div>
      </section>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-sm text-white/70 mb-1">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Colle ton lien ici"
        className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 outline-none focus:border-purple-500"
      />
    </div>
  );
}

