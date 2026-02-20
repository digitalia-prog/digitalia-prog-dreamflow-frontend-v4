"use client";

import { useEffect, useMemo, useState } from "react";

type Draft = {
  offer: string;
  audience: string;
  pain: string;
  solution: string;
  proof: string;
  cta: string;
};

const STORAGE_KEY = "ugc_ai_draft_v2";

const defaults: Draft = {
  offer: "",
  audience: "",
  pain: "",
  solution: "",
  proof: "",
  cta: "",
};

export default function AiPage() {
  const [draft, setDraft] = useState<Draft>(defaults);
  const [generated, setGenerated] = useState("");

  // ✅ Load saved draft on first mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Draft>;
        setDraft((p) => ({ ...p, ...saved }));
      }
    } catch {}
  }, []);

  // ✅ Auto-save every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {}
  }, [draft]);

  const canGenerate = useMemo(() => {
    return (
      draft.offer.trim().length > 0 ||
      draft.audience.trim().length > 0 ||
      draft.pain.trim().length > 0 ||
      draft.solution.trim().length > 0
    );
  }, [draft]);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((p) => ({ ...p, [key]: value }));
  }

  function generate() {
    const offer = draft.offer.trim() || "ton produit/service";
    const audience = draft.audience.trim() || "ton audience";
    const pain = draft.pain.trim() || "leur problème";
    const solution = draft.solution.trim() || `une méthode simple avec ${offer}`;
    const proof = draft.proof.trim() || "résultats / avis / avant-après";
    const cta = draft.cta.trim() || `DM "GO" / lien bio / commente "INFO"`;

    const script = [
      `HOOK: Si tu es ${audience}, tu connais ça…`,
      ``,
      `PROBLÈME: ${pain}`,
      `SOLUTION: ${solution}`,
      `OFFRE: ${offer}`,
      `PREUVE: ${proof}`,
      `CTA: ${cta}`,
    ].join("\n");

    setGenerated(script);
  }

  async function copy() {
    if (!generated) return;
    try {
      await navigator.clipboard.writeText(generated);
      alert("Copié ✅");
    } catch {
      alert("Impossible de copier");
    }
  }

  function resetAll() {
    setDraft(defaults);
    setGenerated("");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold text-white">Script Engine</h1>
        <p className="mt-2 text-sm text-white/70">
          Remplis 2–3 champs → clique “Générer Script”.{" "}
          <span className="text-white/50">(Auto-save activé ✅)</span>
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
        <Field label="Offre" value={draft.offer} onChange={(v) => update("offer", v)} placeholder='Ex: Formation UGC' />
        <Field label="Audience" value={draft.audience} onChange={(v) => update("audience", v)} placeholder='Ex: créateurs débutants' />
        <Field label="Problème" value={draft.pain} onChange={(v) => update("pain", v)} placeholder='Ex: pas de clients' />
        <Field label="Solution" value={draft.solution} onChange={(v) => update("solution", v)} placeholder='Ex: méthode pour trouver des marques' />
        <Field label="Preuve" value={draft.proof} onChange={(v) => update("proof", v)} placeholder='Ex: +20 clients en 30 jours' />
        <Field label="CTA" value={draft.cta} onChange={(v) => update("cta", v)} placeholder='Ex: DM "GO"' />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <button
          onClick={generate}
          disabled={!canGenerate}
          className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Générer Script
        </button>

        <button
          onClick={copy}
          disabled={!generated}
          className="w-full rounded-xl border border-violet-500/30 bg-violet-600/10 px-4 py-3 text-sm font-semibold text-violet-200 hover:bg-violet-600/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Copier
        </button>

        <button
          onClick={resetAll}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/10"
        >
          Reset
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Script généré</div>
          <div className="text-xs text-white/45">Sauvegarde auto ✅</div>
        </div>

        <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-white/10 bg-black/25 p-4 text-sm text-white/80">
          {generated || "Clique sur “Générer Script” pour voir le résultat ici."}
        </pre>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="mb-2 text-xs text-white/55">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40"
      />
    </div>
  );
}
