"use client";

import { useEffect, useState } from "react";

type Links = {
  notion: string;
  sheets: string;
  other: string;
};

const STORAGE_KEY = "ugc_growth_workspace_links";

export default function SettingsPage() {
  const [links, setLinks] = useState<Links>({ notion: "", sheets: "", other: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLinks(JSON.parse(raw));
    } catch {}
  }, []);

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Paramètres</h1>

        <div className="border border-white/10 rounded-2xl p-6 bg-white/5">
          <h2 className="text-xl font-semibold mb-2">Liens de workflow</h2>
          <p className="text-gray-400 text-sm mb-6">
            Colle ici tes liens Notion / Google Sheets / autre. (Bêta : sauvegarde locale)
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300">Notion</label>
              <input
                value={links.notion}
                onChange={(e) => setLinks({ ...links, notion: e.target.value })}
                placeholder="https://notion.so/..."
                className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Google Sheets</label>
              <input
                value={links.sheets}
                onChange={(e) => setLinks({ ...links, sheets: e.target.value })}
                placeholder="https://docs.google.com/spreadsheets/..."
                className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Autre (Drive, Dropbox, Slack…)</label>
              <input
                value={links.other}
                onChange={(e) => setLinks({ ...links, other: e.target.value })}
                placeholder="https://..."
                className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={save}
              className="mt-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold transition"
            >
              Enregistrer
            </button>

            {saved && <p className="text-sm text-green-400">✅ Enregistré</p>}
          </div>
        </div>
      </div>
    </main>
  );
}

