"use client";

import { useEffect, useMemo, useState } from "react";

type Platform = "TikTok" | "Instagram Reels" | "YouTube Shorts" | "UGC Ads";
type HookType = "Question" | "Shock" | "Relatable" | "Stats" | "Story";

type Draft = {
  platform: Platform;
  hookType: HookType;
  offer: string;
  audience: string;
  pain: string;
  solution: string;
  proof: string;
  cta: string;
  tone: "Direct" | "Friendly" | "Luxury" | "Funny";
  duration: "15s" | "30s" | "45s";
};

const STORAGE_KEY = "ugc_growth_ai_draft_v1";

const defaultDraft: Draft = {
  platform: "TikTok",
  hookType: "Relatable",
  offer: "Ton produit / service (ex: formation UGC, app, boutique…)",
  audience: "Pour qui ? (ex: agences, créateurs, femmes 18-30…)",
  pain: "Le problème principal (ex: pas de vues, pas de clients…)",
  solution: "Ta solution (ex: méthode, produit, routine…)",
  proof: "Preuve (résultats, avis, chiffres, avant/après…)",
  cta: "CTA (ex: DM 'GO' / lien bio / commente 'INFO')",
  tone: "Friendly",
  duration: "30s",
};

export default function AiPage() {
  const [draft, setDraft] = useState<Draft>(defaultDraft);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDraft(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {}
  }, [draft]);

  const script = useMemo(() => {
    const hookTemplates: Record<HookType, string> = {
      Question: `Tu veux ${draft.solution.toLowerCase()} sans ${draft.pain.toLowerCase()} ?`,
      Shock: `Stop. Si tu fais encore ça, tu perds des résultats.`,
      Relatable: `Si tu es ${draft.audience.toLowerCase()}, tu connais ce problème : ${draft.pain}.`,
      Stats: `90% des gens échouent ici… et c’est pour ça.`,
      Story: `Je te raconte le truc qui a tout changé…`,
    };

    const hook = hookTemplates[draft.hookType];

    return [
      `PLATFORM: ${draft.platform} • ${draft.duration} • Tone: ${draft.tone}`,
      ``,
      `HOOK: ${hook}`,
      ``,
      `PROBLÈME: ${draft.pain}`,
      `SOLUTION: ${draft.solution}`,
      `OFFRE: ${draft.offer}`,
      `PREUVE: ${draft.proof}`,
      `CTA: ${draft.cta}`,
    ].join("\n");
  }, [draft]);

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((p) => ({ ...p, [key]: value }));
  }

  function reset() {
    setDraft(defaultDraft);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(script);
      alert("Copié ✅");
    } catch {
      alert("Impossible de copier");
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-white/55">AI</div>
        <div className="text-2xl font-semibold">Script Engine</div>
        <div className="mt-2 text-sm text-white/70">
          Remplis les champs → ton script se génère automatiquement. Rien ne disparaît (auto-save).
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm font-semibold mb-4">Paramètres</div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="mb-2 text-xs text-white/55">Plateforme</div>
                <select
                  value={draft.platform}
                  onChange={(e) => update("platform", e.target.value as Platform)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm"
                >
                  <option>TikTok</option>
                  <option>Instagram Reels</option>
                  <option>YouTube Shorts</option>
                  <option>UGC Ads</option>
                </select>
              </div>

              <div>
                <div className="mb-2 text-xs text-white/55">Type de Hook</div>
                <select
                  value={draft.hookType}
                  onChange={(e) => update("hookType", e.target.value as HookType)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm"
                >
                  <option>Question</option>
                  <option>Shock</option>
                  <option>Relatable</option>
                  <option>Stats</option>
                  <option>Story</option>
                </select>
              </div>

              <div>
                <div className="mb-2 text-xs text-white/55">Durée</div>
                <select
                  value={draft.duration}
                  onChange={(e) => update("duration", e.target.value as Draft["duration"])}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm"
                >
                  <option>15s</option>
                  <option>30s</option>
                  <option>45s</option>
                </select>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="mb-2 text-xs text-white/55">Offre</div>
                <input
                  value={draft.offer}
                  onChange={(e) => update("offer", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <div className="mb-2 text-xs text-white/55">Ton</div>
                <select
                  value={draft.tone}
                  onChange={(e) => update("tone", e.target.value as Draft["tone"])}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm"
                >
                  <option>Direct</option>
                  <option>Friendly</option>
                  <option>Luxury</option>
                  <option>Funny</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm font-semibold mb-4">Contenu</div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Audience" value={draft.audience} onChange={(v) => update("audience", v)} />
              <Field label="Problème" value={draft.pain} onChange={(v) => update("pain", v)} />
              <Field label="Solution" value={draft.solution} onChange={(v) => update("solution", v)} />
              <Field label="Preuve" value={draft.proof} onChange={(v) => update("proof", v)} />
              <Field label="CTA" value={draft.cta} onChange={(v) => update("cta", v)} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Script généré</div>
              <div className="flex gap-2">
                <button
                  onClick={copy}
                  className="rounded-xl border border-violet-500/30 bg-violet-600/10 px-3 py-2 text-xs text-violet-200 hover:bg-violet-600/20"
                >
                  Copier
                </button>
                <button
                  onClick={reset}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:bg-white/10"
                >
                  Reset
                </button>
              </div>
            </div>

            <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-white/10 bg-black/25 p-4 text-xs text-white/80">
              {script}
            </pre>

            <div className="mt-3 text-xs text-white/45">
              Auto-save activé (tu peux changer de page, rien ne disparaît).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-xs text-white/55">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm"
      />
    </label>
  );
}
