"use client";

import React, { useEffect, useMemo, useState } from "react";

/**
 * Script Engine (Agency / Creator / IA Viral) — no external deps
 * - Multi-lang: FR / EN (auto-detect from URL prefix if exists, fallback FR)
 * - Auto-save via localStorage (per mode)
 * - "HAK" field + "HAK" hook type
 */

type Mode = "AGENCY" | "CREATOR" | "VIRAL";
type HookType = "Question" | "Shock" | "Story" | "Contrarian" | "HAK" | "Direct";
type Platform =
  | "TikTok"
  | "Instagram Reels"
  | "YouTube Shorts"
  | "Snapchat Spotlight"
  | "Facebook Reels"
  | "LinkedIn"
  | "X (Twitter)"
  | "Pinterest";

type Tone = "Friendly" | "Luxury" | "Humor" | "Authority" | "Calm" | "Hype";

type FormState = {
  mode: Mode;
  platform: Platform;
  hookType: HookType;
  duration: "15s" | "30s" | "45s" | "60s";
  tone: Tone;

  offer: string;
  audience: string;
  problem: string;
  solution: string;
  proof: string;
  cta: string;

  // NEW: HAK
  hak: string;
};

const DEFAULT_STATE: FormState = {
  mode: "AGENCY",
  platform: "TikTok",
  hookType: "Question",
  duration: "30s",
  tone: "Friendly",

  offer: "",
  audience: "",
  problem: "",
  solution: "",
  proof: "",
  cta: "",

  hak: "",
};

function getLocaleFromPath(): "fr" | "en" {
  if (typeof window === "undefined") return "fr";
  const p = window.location.pathname;
  // If your app uses /fr/... or /en/... prefixes, this will detect it.
  if (p.startsWith("/en/") || p === "/en") return "en";
  if (p.startsWith("/fr/") || p === "/fr") return "fr";
  // Otherwise fallback FR
  return "fr";
}

const I18N = {
  fr: {
    title: "Script Engine",
    subtitle: "Remplis 2–3 champs → clique “Générer Script”. (Auto-save activé ✅)",
    mode: "Mode",
    modeAgency: "Agence",
    modeCreator: "Créateur",
    modeViral: "IA Viral",
    params: "Paramètres",
    platform: "Plateforme",
    hookType: "Type de Hook",
    duration: "Durée",
    tone: "Ton",
    content: "Contenu",
    offer: "Offre",
    audience: "Audience",
    problem: "Problème",
    solution: "Solution",
    proof: "Preuve",
    cta: "CTA",
    hak: "HAK (astuce / hack / angle viral)",
    generate: "Générer Script",
    copy: "Copier",
    reset: "Reset",
    generated: "Script généré",
    clickGenerate: "Clique sur “Générer Script” pour voir le résultat ici.",
    copied: "Copié ✅",
    placeholders: {
      offer: "Ex: Formation UGC / App / Boutique…",
      audience: "Ex: créateurs débutants / femmes 18–30…",
      problem: "Ex: pas de clients / pas de vues…",
      solution: "Ex: méthode / produit / routine…",
      proof: "Ex: +20 clients en 30 jours / avis / chiffres…",
      cta: 'Ex: DM "GO" / lien bio / commente "INFO"',
      hak: "Ex: 3 erreurs que tout le monde fait / la technique secrète / le twist…",
    },
  },
  en: {
    title: "Script Engine",
    subtitle: 'Fill 2–3 fields → click “Generate Script”. (Auto-save enabled ✅)',
    mode: "Mode",
    modeAgency: "Agency",
    modeCreator: "Creator",
    modeViral: "Viral AI",
    params: "Settings",
    platform: "Platform",
    hookType: "Hook Type",
    duration: "Duration",
    tone: "Tone",
    content: "Content",
    offer: "Offer",
    audience: "Audience",
    problem: "Problem",
    solution: "Solution",
    proof: "Proof",
    cta: "CTA",
    hak: "HAK (hack / viral angle)",
    generate: "Generate Script",
    copy: "Copy",
    reset: "Reset",
    generated: "Generated script",
    clickGenerate: 'Click “Generate Script” to see the result here.',
    copied: "Copied ✅",
    placeholders: {
      offer: "Ex: UGC course / App / Store…",
      audience: "Ex: beginner creators / women 18–30…",
      problem: "Ex: no clients / no views…",
      solution: "Ex: method / product / routine…",
      proof: "Ex: +20 clients in 30 days / reviews / numbers…",
      cta: 'Ex: DM "GO" / link in bio / comment "INFO"',
      hak: "Ex: 3 mistakes everyone makes / secret technique / the twist…",
    },
  },
};

function buildHookLine(mode: Mode, hookType: HookType, hak: string) {
  const h = (hak || "").trim();
  if (hookType === "HAK" && h) return `HAK: ${h}`;
  if (mode === "VIRAL" && h) return `HOOK (Viral): ${h}`;
  // fallback generic
  switch (hookType) {
    case "Shock":
      return "HOOK: Stop. Si tu fais encore ça, tu perds des résultats.";
    case "Story":
      return "HOOK: Laisse-moi te raconter un truc qui a tout changé…";
    case "Contrarian":
      return "HOOK: Tout le monde te dit de faire X… c’est faux.";
    case "Direct":
      return "HOOK: Voici exactement comment obtenir [résultat] en [temps].";
    case "Question":
    default:
      return "HOOK: Et si le vrai problème n’était pas ce que tu crois ?";
  }
}

function generateScript(s: FormState, locale: "fr" | "en") {
  const t = I18N[locale];
  const lines: string[] = [];

  lines.push(`PLATFORM: ${s.platform} • ${s.duration} • Tone: ${s.tone}`);
  lines.push(`MODE: ${s.mode === "AGENCY" ? t.modeAgency : s.mode === "CREATOR" ? t.modeCreator : t.modeViral}`);
  lines.push("");
  lines.push(buildHookLine(s.mode, s.hookType, s.hak));
  lines.push("");
  if (s.audience.trim()) lines.push(`AUDIENCE: ${s.audience.trim()}`);
  if (s.problem.trim()) lines.push(`PROBLÈME: ${s.problem.trim()}`);
  if (s.solution.trim()) lines.push(`SOLUTION: ${s.solution.trim()}`);
  if (s.offer.trim()) lines.push(`OFFRE: ${s.offer.trim()}`);
  if (s.proof.trim()) lines.push(`PREUVE: ${s.proof.trim()}`);
  if (s.cta.trim()) lines.push(`CTA: ${s.cta.trim()}`);

  // Viral mode adds a small structure suggestion
  if (s.mode === "VIRAL") {
    lines.push("");
    lines.push("STRUCTURE (IA Viral):");
    lines.push("1) Hook + promesse");
    lines.push("2) 1 preuve rapide");
    lines.push("3) 3 points (étapes / erreurs / hacks)");
    lines.push("4) CTA clair");
  }

  return lines.join("\n");
}

function storageKey(locale: "fr" | "en", mode: Mode) {
  return `script_engine_v2:${locale}:${mode}`;
}

export default function AiPage() {
  const locale = useMemo(() => getLocaleFromPath(), []);
  const t = I18N[locale];

  const [state, setState] = useState<FormState>(DEFAULT_STATE);
  const [output, setOutput] = useState<string>("");
  const [copyStatus, setCopyStatus] = useState<string>("");

  // Load from localStorage (per mode)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(locale, state.mode));
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<FormState>;
        setState((prev) => ({
          ...prev,
          ...parsed,
          mode: prev.mode, // keep current mode as source of truth
        }));
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, state.mode]);

  // Auto-save
  useEffect(() => {
    try {
      localStorage.setItem(storageKey(locale, state.mode), JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [locale, state]);

  const onChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const onGenerate = () => {
    setOutput(generateScript(state, locale));
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(output || "");
      setCopyStatus(t.copied);
      setTimeout(() => setCopyStatus(""), 1200);
    } catch {
      // fallback: do nothing
    }
  };

  const onReset = () => {
    setState((prev) => ({
      ...DEFAULT_STATE,
      mode: prev.mode, // keep mode, so you can reset per mode
    }));
    setOutput("");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="text-2xl font-semibold">{t.title}</div>
        <div className="mt-1 text-sm text-white/60">{t.subtitle}</div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* LEFT: Form */}
        <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Mode */}
            <div>
              <label className="text-sm text-white/70">{t.mode}</label>
              <select
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                value={state.mode}
                onChange={(e) => onChange("mode", e.target.value as Mode)}
              >
                <option value="AGENCY">{t.modeAgency}</option>
                <option value="CREATOR">{t.modeCreator}</option>
                <option value="VIRAL">{t.modeViral}</option>
              </select>
            </div>

            {/* Platform */}
            <div>
              <label className="text-sm text-white/70">{t.platform}</label>
              <select
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                value={state.platform}
                onChange={(e) => onChange("platform", e.target.value as Platform)}
              >
                <option value="TikTok">TikTok</option>
                <option value="Instagram Reels">Instagram Reels</option>
                <option value="YouTube Shorts">YouTube Shorts</option>
                <option value="Snapchat Spotlight">Snapchat Spotlight</option>
                <option value="Facebook Reels">Facebook Reels</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="X (Twitter)">X (Twitter)</option>
                <option value="Pinterest">Pinterest</option>
              </select>
            </div>

            {/* Hook type */}
            <div>
              <label className="text-sm text-white/70">{t.hookType}</label>
              <select
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                value={state.hookType}
                onChange={(e) => onChange("hookType", e.target.value as HookType)}
              >
                <option value="Question">Question</option>
                <option value="Shock">Shock</option>
                <option value="Story">Story</option>
                <option value="Contrarian">Contrarian</option>
                <option value="HAK">HAK</option>
                <option value="Direct">Direct</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="text-sm text-white/70">{t.duration}</label>
              <select
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                value={state.duration}
                onChange={(e) => onChange("duration", e.target.value as FormState["duration"])}
              >
                <option value="15s">15s</option>
                <option value="30s">30s</option>
                <option value="45s">45s</option>
                <option value="60s">60s</option>
              </select>
            </div>

            {/* Tone */}
            <div className="md:col-span-2">
              <label className="text-sm text-white/70">{t.tone}</label>
              <select
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                value={state.tone}
                onChange={(e) => onChange("tone", e.target.value as Tone)}
              >
                <option value="Friendly">Friendly</option>
                <option value="Luxury">Luxury</option>
                <option value="Humor">Humor</option>
                <option value="Authority">Authority</option>
                <option value="Calm">Calm</option>
                <option value="Hype">Hype</option>
              </select>
            </div>
          </div>

          <div className="mt-6 text-sm font-semibold text-white/80">{t.content}</div>

          <div className="mt-3 grid gap-4">
            <div>
              <label className="text-sm text-white/70">{t.offer}</label>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                value={state.offer}
                onChange={(e) => onChange("offer", e.target.value)}
                placeholder={t.placeholders.offer}
              />
            </div>

            <div>
              <label className="text-sm text-white/70">{t.audience}</label>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                value={state.audience}
                onChange={(e) => onChange("audience", e.target.value)}
                placeholder={t.placeholders.audience}
              />
            </div>

            <div>
              <label className="text-sm text-white/70">{t.problem}</label>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                value={state.problem}
                onChange={(e) => onChange("problem", e.target.value)}
                placeholder={t.placeholders.problem}
              />
            </div>

            <div>
              <label className="text-sm text-white/70">{t.solution}</label>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                value={state.solution}
                onChange={(e) => onChange("solution", e.target.value)}
                placeholder={t.placeholders.solution}
              />
            </div>

            <div>
              <label className="text-sm text-white/70">{t.proof}</label>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                value={state.proof}
                onChange={(e) => onChange("proof", e.target.value)}
                placeholder={t.placeholders.proof}
              />
            </div>

            {/* NEW: HAK */}
            <div>
              <label className="text-sm text-white/70">{t.hak}</label>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                value={state.hak}
                onChange={(e) => onChange("hak", e.target.value)}
                placeholder={t.placeholders.hak}
              />
            </div>

            <div>
              <label className="text-sm text-white/70">{t.cta}</label>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                value={state.cta}
                onChange={(e) => onChange("cta", e.target.value)}
                placeholder={t.placeholders.cta}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 md:flex-row">
            <button
              className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold hover:bg-violet-700 md:w-auto"
              onClick={onGenerate}
            >
              {t.generate}
            </button>

            <button
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10 md:w-auto"
              onClick={onCopy}
              disabled={!output}
              title={!output ? "Génère d’abord un script" : ""}
            >
              {t.copy} {copyStatus ? `• ${copyStatus}` : ""}
            </button>

            <button
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10 md:w-auto"
              onClick={onReset}
            >
              {t.reset}
            </button>

            <div className="ml-auto flex items-center text-xs text-white/60">
              Sauvegarde auto ✅
            </div>
          </div>
        </div>

        {/* RIGHT: Output */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-white/80">{t.generated}</div>
          </div>

          <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-4">
            <pre className="whitespace-pre-wrap text-sm text-white/85">
              {output ? output : t.clickGenerate}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
