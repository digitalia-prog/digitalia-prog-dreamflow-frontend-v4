"use client";

import React, { useEffect, useMemo, useState } from "react";

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

  hak: string; // NEW
};

const DEFAULT_STATE: FormState = {
  mode: "VIRAL",
  platform: "TikTok",
  hookType: "HAK",
  duration: "30s",
  tone: "Hype",

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
  if (p.startsWith("/en/") || p === "/en") return "en";
  if (p.startsWith("/fr/") || p === "/fr") return "fr";
  return "fr";
}

const I18N = {
  fr: {
    title: "Script Engine (IA Viral)",
    subtitle: "Remplis 2–3 champs → clique “Générer Script”. (Auto-save ✅)",
    mode: "Mode",
    modeAgency: "Agence",
    modeCreator: "Créateur",
    modeViral: "IA Viral",
    platform: "Plateforme",
    hookType: "Type de Hook",
    duration: "Durée",
    tone: "Ton",
    offer: "Offre",
    audience: "Audience",
    problem: "Problème",
    solution: "Solution",
    proof: "Preuve",
    cta: "CTA",
    hak: "HAK (angle viral / hack / twist)",
    generate: "Générer Script",
    copy: "Copier",
    reset: "Reset",
    generated: "Script généré",
    clickGenerate: "Clique sur “Générer Script” pour voir le résultat ici.",
    copied: "Copié ✅",
    placeholders: {
      offer: "Ex: Formation UGC / App / Boutique…",
      audience: "Ex: créateurs débutants / agences…",
      problem: "Ex: pas de clients / pas de vues…",
      solution: "Ex: méthode / produit / routine…",
      proof: "Ex: +20 clients en 30 jours / avis…",
      cta: 'Ex: DM "GO" / lien bio / commente "INFO"',
      hak: "Ex: 3 erreurs que tout le monde fait / technique secrète / twist…",
    },
  },
  en: {
    title: "Script Engine (Viral AI)",
    subtitle: 'Fill 2–3 fields → click “Generate Script”. (Auto-save ✅)',
    mode: "Mode",
    modeAgency: "Agency",
    modeCreator: "Creator",
    modeViral: "Viral AI",
    platform: "Platform",
    hookType: "Hook Type",
    duration: "Duration",
    tone: "Tone",
    offer: "Offer",
    audience: "Audience",
    problem: "Problem",
    solution: "Solution",
    proof: "Proof",
    cta: "CTA",
    hak: "HAK (viral angle / hack / twist)",
    generate: "Generate Script",
    copy: "Copy",
    reset: "Reset",
    generated: "Generated script",
    clickGenerate: 'Click “Generate Script” to see the result here.',
    copied: "Copied ✅",
    placeholders: {
      offer: "Ex: UGC course / App / Store…",
      audience: "Ex: beginner creators / agencies…",
      problem: "Ex: no clients / no views…",
      solution: "Ex: method / product / routine…",
      proof: "Ex: +20 clients in 30 days / reviews…",
      cta: 'Ex: DM "GO" / link in bio / comment "INFO"',
      hak: "Ex: 3 mistakes everyone makes / secret technique / twist…",
    },
  },
};

function storageKey(locale: "fr" | "en", mode: Mode) {
  return `ugc_script_engine_v3:${locale}:${mode}`;
}

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function viralHook(s: FormState) {
  const custom = s.hak.trim();
  if (custom) return `HAK: ${custom}`;

  const hooks = [
    "STOP ✋ — personne ne t’explique ça correctement.",
    "Si tu fais encore ça… tu perds des vues.",
    "Le vrai problème n’est pas ce que tu crois.",
    "Personne ne parle de cette technique.",
    "Je vais te montrer un hack que 90% ignorent.",
    "La plupart des gens font ça… et c’est pour ça qu’ils échouent.",
  ];

  return rand(hooks);
}

function generateScript(s: FormState, locale: "fr" | "en") {
  const t = I18N[locale];

  const offer = s.offer.trim() || (locale === "fr" ? "ton produit / service" : "your offer");
  const audience = s.audience.trim() || (locale === "fr" ? "ton audience" : "your audience");
  const problem = s.problem.trim() || (locale === "fr" ? "ils n’ont pas de résultats" : "they have no results");
  const solution = s.solution.trim() || (locale === "fr" ? "une méthode simple en 3 étapes" : "a simple 3-step method");
  const proof = s.proof.trim() || (locale === "fr" ? "preuves, avis, chiffres" : "proof, reviews, numbers");
  const cta = s.cta.trim() || (locale === "fr" ? 'DM "GO" / lien bio' : 'DM "GO" / link in bio');

  const hookLine = s.mode === "VIRAL" ? viralHook(s) : "Hook: ...";

  const lines: string[] = [];

  lines.push(`🎬 ${t.platform}: ${s.platform} • ${s.duration} • ${t.tone}: ${s.tone}`);
  lines.push(`⚡ ${t.mode}: ${s.mode === "AGENCY" ? t.modeAgency : s.mode === "CREATOR" ? t.modeCreator : t.modeViral}`);
  lines.push("");
  lines.push(`HOOK: ${hookLine}`);
  lines.push("");
  lines.push(`${locale === "fr" ? "STORY" : "STORY"}: ${locale === "fr" ? `Imagine ${audience}…` : `Imagine ${audience}…`}`);
  lines.push(`${locale === "fr" ? "PROBLÈME" : "PROBLEM"}: ${problem}`);
  lines.push(`${locale === "fr" ? "TWIST" : "TWIST"}: ${locale === "fr" ? "Et pourtant la solution est plus simple que tu crois." : "But the solution is simpler than you think."}`);
  lines.push(`${locale === "fr" ? "SOLUTION" : "SOLUTION"}: ${solution}`);
  lines.push(`${locale === "fr" ? "OFFRE" : "OFFER"}: ${offer}`);
  lines.push(`${locale === "fr" ? "PREUVE" : "PROOF"}: ${proof}`);
  lines.push(`CTA: ${cta}`);
  lines.push("");
  lines.push(locale === "fr" ? "🔥 STRUCTURE VIRALE:" : "🔥 VIRAL STRUCTURE:");
  lines.push(locale === "fr" ? "1) Hook agressif" : "1) Aggressive hook");
  lines.push(locale === "fr" ? "2) Story courte" : "2) Short story");
  lines.push(locale === "fr" ? "3) Pattern interrupt" : "3) Pattern interrupt");
  lines.push(locale === "fr" ? "4) Preuve rapide" : "4) Fast proof");
  lines.push(locale === "fr" ? "5) CTA direct" : "5) Direct CTA");

  return lines.join("\n");
}

export default function AiPage() {
  const locale = useMemo(() => getLocaleFromPath(), []);
  const t = I18N[locale];

  const [state, setState] = useState<FormState>(DEFAULT_STATE);
  const [output, setOutput] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  // Load per mode
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(locale, state.mode));
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<FormState>;
        setState((prev) => ({ ...prev, ...parsed, mode: prev.mode }));
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, state.mode]);

  // Auto-save
  useEffect(() => {
    try {
      localStorage.setItem(storageKey(locale, state.mode), JSON.stringify(state));
    } catch {}
  }, [locale, state]);

  const onChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const onGenerate = () => setOutput(generateScript(state, locale));

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopyStatus(t.copied);
      setTimeout(() => setCopyStatus(""), 1200);
    } catch {}
  };

  const onReset = () => {
    setState((prev) => ({ ...DEFAULT_STATE, mode: prev.mode }));
    setOutput("");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="text-2xl font-semibold">{t.title}</div>
        <div className="mt-1 text-sm text-white/60">{t.subtitle}</div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="grid gap-4 md:grid-cols-2">
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

          <div className="mt-6 grid gap-4">
            <Field label={t.offer} value={state.offer} onChange={(v) => onChange("offer", v)} placeholder={t.placeholders.offer} />
            <Field label={t.audience} value={state.audience} onChange={(v) => onChange("audience", v)} placeholder={t.placeholders.audience} />
            <Field label={t.problem} value={state.problem} onChange={(v) => onChange("problem", v)} placeholder={t.placeholders.problem} />
            <Field label={t.solution} value={state.solution} onChange={(v) => onChange("solution", v)} placeholder={t.placeholders.solution} />
            <Field label={t.proof} value={state.proof} onChange={(v) => onChange("proof", v)} placeholder={t.placeholders.proof} />
            <Field label={t.hak} value={state.hak} onChange={(v) => onChange("hak", v)} placeholder={t.placeholders.hak} />
            <Field label={t.cta} value={state.cta} onChange={(v) => onChange("cta", v)} placeholder={t.placeholders.cta} />
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
            >
              {t.copy} {copyStatus ? `• ${copyStatus}` : ""}
            </button>

            <button
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10 md:w-auto"
              onClick={onReset}
            >
              {t.reset}
            </button>

            <div className="ml-auto flex items-center text-xs text-white/60">Auto-save ✅</div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm font-semibold text-white/80">{t.generated}</div>
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
      <label className="text-sm text-white/70">{label}</label>
      <input
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  ); 
