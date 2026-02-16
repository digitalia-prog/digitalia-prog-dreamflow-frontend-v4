"use client";

import { useEffect, useMemo, useState } from "react";

type LinksState = {
  notionUrl: string;
  sheetsUrl: string;
  driveUrl: string;
};

const STORAGE_KEY = "ugc_growth_workflow_links_v1";

export default function SettingsPage() {
  const [links, setLinks] = useState<LinksState>({
    notionUrl: "",
    sheetsUrl: "",
    driveUrl: "",
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLinks(JSON.parse(raw));
    } catch {}
  }, []);

  const isValidUrl = (v: string) => {
    if (!v) return true;
    try {
      new URL(v);
      return true;
    } catch {
      return false;
    }
  };

  const canSave = useMemo(() => {
    return isValidUrl(links.notionUrl) && isValidUrl(links.sheetsUrl) && isValidUrl(links.driveUrl);
  }, [links]);

  const onSave = () => {
    if (!canSave) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold">Paramètres — Workflow</h1>
        <p className="mt-2 text-white/70">
          Branche tes liens pour tout retrouver sans ouvrir 10 onglets.
          <br />
          (En bêta : stockage local sur ton navigateur.)
        </p>

        <div className="mt-8 space-y-5">
          <Field
            label="Lien Notion"
            placeholder="https://www.notion.so/..."
            value={links.notionUrl}
            onChange={(v) => setLinks((s) => ({ ...s, notionUrl: v }))}
            error={!isValidUrl(links.notionUrl) ? "URL invalide" : ""}
          />

          <Field
            label="Lien Google Sheets"
            placeholder="https://docs.google.com/spreadsheets/..."
            value={links.sheetsUrl}
            onChange={(v) => setLinks((s) => ({ ...s, sheetsUrl: v }))}
            error={!isValidUrl(links.sheetsUrl) ? "URL invalide" : ""}
          />

          <Field
            label="Lien Drive / Dropbox"
            placeholder="https://drive.google.com/... ou https://dropbox.com/..."
            value={links.driveUrl}
            onChange={(v) => setLinks((s) => ({ ...s, driveUrl: v }))}
            error={!isValidUrl(links.driveUrl) ? "URL invalide" : ""}
          />

          <button
            onClick={onSave}
            disabled={!canSave}
            className={`mt-2 px-5 py-3 rounded-xl font-semibold ${
              canSave ? "bg-purple-600 hover:bg-purple-700" : "bg-white/10 text-white/40 cursor-not-allowed"
            }`}
          >
            Enregistrer
          </button>

          {saved ? <div className="text-sm text-green-400">✅ Sauvegardé</div> : null}
        </div>
      </div>
    </main>
  );
}

function Field(props: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="font-semibold">{props.label}</div>
      <input
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        className="mt-3 w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
      />
      {props.error ? <div className="mt-2 text-sm text-red-400">{props.error}</div> : null}
    </div>
  );
}

