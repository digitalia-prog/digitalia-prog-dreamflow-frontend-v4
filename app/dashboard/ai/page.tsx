"use client";

import React, { useEffect, useMemo, useState } from "react";

type Mode = "AGENCY" | "CREATOR" | "VIRAL";
type Lang = "fr" | "en";

type Platform =
  | "TikTok"
  | "Instagram Reels"
  | "YouTube Shorts"
  | "Snapchat Spotlight"
  | "Facebook Ads"
  | "Pinterest";

type HookType = "Question" | "Shock" | "Story" | "Contrarian" | "HAK";
type Duration = "15s" | "30s" | "45s" | "60s";
type Tone = "Friendly" | "Luxury" | "Humor" | "Authority" | "Calm" | "Hype";

type FormState = {
  mode: Mode;
  lang: Lang;
  platform: Platform;
  hookType: HookType;
  duration: Duration;
  tone: Tone;

  offer: string;
  audience: string;
  problem: string;
  solution: string;
  proof: string;
  cta: string;
  hak: string;
};

type ApiOk = {
  output: string;
  raw?: string;
  parsed?: any;
};

type ApiErr = {
  error: string;
  details?: string;
};

const PLATFORMS: Platform[] = [
  "TikTok",
  "Instagram Reels",
  "YouTube Shorts",
  "Snapchat Spotlight",
  "Facebook Ads",
  "Pinterest",
];

const HOOKS: HookType[] = ["Question", "Shock", "Story", "Contrarian", "HAK"];
const DURATIONS: Duration[] = ["15s", "30s", "45s", "60s"];
const TONES: Tone[] = ["Friendly", "Luxury", "Humor", "Authority", "Calm", "Hype"];

function getLangFromUrl(): Lang {
  if (typeof window === "undefined") return "fr";
  const p = window.location.pathname;
  const qs = new URLSearchParams(window.location.search);
  const qLang = qs.get("lang");
  if (qLang === "en") return "en";
  if (p.startsWith("/en")) return "en";
  return "fr";
}

function storageKey(lang: Lang) {
  return `ugc_growth_script_engine_v1:${lang}`;
}

const i18n = {
  fr: {
    title: "Script Engine",
    subtitle: "Remplis 2–3 champs → clique “Générer”. (Auto-save ✅)",
    mode: "Mode",
    agency: "Agency",
    creator: "Creator",
    viral: "Viral IA",
    lang: "Langue",
    platform: "Plateforme",
    hookType: "Type de hook",
    duration: "Durée",
    tone: "Ton",
    offer: "Offre",
    audience: "Audience",
    problem: "Problème",
    solution: "Solution",
    proof: "Preuve",
    cta: "CTA",
    hak: "HAK (twist / hack viral)",
    generate: "Générer",
    reset: "Reset",
    generated: "Résultat",
    clickGenerate: "Clique “Générer” pour voir le script ici.",
    placeholders: {
      offer: "Ex: Formation UGC / SaaS / Produit…",
      audience: "Ex: créateurs débutants / agences…",
      problem: "Ex: pas de clients / pas de vues…",
      solution: "Ex: méthode / produit / routine…",
      proof: "Ex: +20 clients en 30 jours / avis / chiffres…",
      cta: 'Ex: DM "GO" / lien bio / commente "INFO"',
      hak: "Ex: 3 erreurs que tout le monde fait / technique secrète / twist…",
    },
  },
  en: {
    title: "Script Engine",
    subtitle: "Fill 2–3 fields → click “Generate”. (Auto-save ✅)",
    mode: "Mode",
    agency: "Agency",
    creator: "Creator",
    viral: "Viral AI",
    lang: "Language",
    platform: "Platform",
    hookType: "Hook type",
    duration: "Duration",
    tone: "Tone",
    offer: "Offer",
    audience: "Audience",
    problem: "Problem",
    solution: "Solution",
    proof: "Proof",
    cta: "CTA",
    hak: "HAK (viral twist / hack)",
    generate: "Generate",
    reset: "Reset",
    generated: "Output",
    clickGenerate: "Click “Generate” to see the script here.",
    placeholders: {
      offer: "e.g. UGC course / SaaS / product…",
      audience: "e.g. beginner creators / agencies…",
      problem: "e.g. no clients / no views…",
      solution: "e.g. method / product / routine…",
      proof: "e.g. +20 clients in 30 days / reviews / numbers…",
      cta: 'e.g. DM "GO" / link in bio / comment "INFO"',
      hak: "e.g. 3 mistakes everyone makes / secret technique / twist…",
    },
  },
};

function buildLocalScript(s: FormState): string {
  const lang = s.lang;
  const title = lang === "fr" ? "SCRIPT (bêta)" : "SCRIPT (beta)";

  const hook =
    s.hookType === "HAK"
      ? (s.hak?.trim()
          ? `HAK: ${s.hak.trim()}`
          : lang === "fr"
          ? "HAK: le twist que personne ne te dit."
          : "HAK: the twist nobody tells you.")
      : `${s.hookType}: ${
          lang === "fr"
            ? "accroche forte dès la 1ère seconde."
            : "strong hook in the first second."
        }`;

  const lines = [
    `${title} — ${s.platform} — ${s.duration} — ${s.tone}`,
    "",
    hook,
    "",
    lang === "fr" ? `OFFRE: ${s.offer}` : `OFFER: ${s.offer}`,
    lang === "fr" ? `AUDIENCE: ${s.audience}` : `AUDIENCE: ${s.audience}`,
    "",
    lang === "fr" ? `PROBLÈME: ${s.problem}` : `PROBLEM: ${s.problem}`,
    lang === "fr" ? `SOLUTION: ${s.solution}` : `SOLUTION: ${s.solution}`,
    s.proof ? (lang === "fr" ? `PREUVE: ${s.proof}` : `PROOF: ${s.proof}`) : "",
    "",
    lang === "fr"
      ? "STRUCTURE (simple):"
      : "STRUCTURE (simple):",
    lang === "fr"
      ? "1) Hook + promesse"
      : "1) Hook + promise",
    lang === "fr"
      ? "2) Problème (1 phrase) + agitation (1 phrase)"
      : "2) Problem (1 line) + agitation (1 line)",
    lang === "fr"
      ? "3) Solution + preuve"
      : "3) Solution + proof",
    lang === "fr"
      ? `4) CTA: ${s.cta}`
      : `4) CTA: ${s.cta}`,
    "",
    lang === "fr"
      ? "NOTES MONTAGE: cuts toutes les 1–2s, sous-titres, pattern interrupt au hook."
      : "EDIT NOTES: cuts every 1–2s, captions, pattern interrupt at the hook.",
  ]
    .filter(Boolean)
    .join("\n");

  return lines;
}

export default function AiPage() {
  const initialLang = useMemo(() => getLangFromUrl(), []);
  const [state, setState] = useState<FormState>(() => {
    const base: FormState = {
      mode: "VIRAL",
      lang: initialLang,
      platform: "TikTok",
      hookType: "HAK",
      duration: "30s",
      tone: "Humor",
      offer: "",
      audience: "",
      problem: "",
      solution: "",
      proof: "",
      cta: "",
      hak: "",
    };

    if (typeof window === "undefined") return base;
    try {
      const saved = window.localStorage.getItem(storageKey(initialLang));
      if (!saved) return base;
      return { ...base, ...JSON.parse(saved) };
    } catch {
      return base;
    }
  });

  const t = i18n[state.lang];

  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  // autosave
  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey(state.lang), JSON.stringify(state));
    } catch {}
  }, [state]);

  function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function onReset() {
    setState((s) => ({
      ...s,
      mode: "VIRAL",
      platform: "TikTok",
      hookType: "HAK",
      duration: "30s",
      tone: "Humor",
      offer: "",
      audience: "",
      problem: "",
      solution: "",
      proof: "",
      cta: "",
      hak: "",
    }));
    setOutput("");
    setError("");
  }

  async function onGenerate() {
    setLoading(true);
    setError("");

    try {
      const r = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });

      const data = (await r.json()) as ApiOk | ApiErr;

      if (!r.ok) {
        const err = data as ApiErr;
        throw new Error(err.details || err.error || "Erreur API");
      }

      const ok = data as ApiOk;
      setOutput(ok.output || ok.raw || "");
      if (!ok.output && !ok.raw) setOutput(buildLocalScript(state));
    } catch (e: any) {
      setError(String(e?.message ?? e));
      // fallback local
      setOutput(buildLocalScript(state));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#07060A] text-white">
      <div className="mx-auto max-w-5xl px-6 py-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="text-2xl font-bold">{t.title}</div>
            <div className="mt-1 text-sm text-white/60">{t.subtitle}</div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => onChange("lang", "fr")}
              className={`px-3 py-1 rounded-full border ${
                state.lang === "fr" ? "border-violet-400/60 bg-violet-600/10" : "border-white/15"
              }`}
            >
              FR
            </button>
            <button
              onClick={() => onChange("lang", "en")}
              className={`px-3 py-1 rounded-full border ${
                state.lang === "en" ? "border-violet-400/60 bg-violet-600/10" : "border-white/15"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Select
                label={t.mode}
                value={state.mode}
                onChange={(v) => onChange("mode", v as Mode)}
                options={[
                  { label: t.agency, value: "AGENCY" },
                  { label: t.creator, value: "CREATOR" },
                  { label: t.viral, value: "VIRAL" },
                ]}
              />

              <Select
                label={t.platform}
                value={state.platform}
                onChange={(v) => onChange("platform", v as Platform)}
                options={PLATFORMS.map((p) => ({ label: p, value: p }))}
              />

              <Select
                label={t.hookType}
                value={state.hookType}
                onChange={(v) => onChange("hookType", v as HookType)}
                options={HOOKS.map((h) => ({ label: h, value: h }))}
              />

              <Select
                label={t.duration}
                value={state.duration}
                onChange={(v) => onChange("duration", v as Duration)}
                options={DURATIONS.map((d) => ({ label: d, value: d }))}
              />

              <Select
                label={t.tone}
                value={state.tone}
                onChange={(v) => onChange("tone", v as Tone)}
                options={TONES.map((x) => ({ label: x, value: x }))}
              />
            </div>

            <div className="grid gap-3">
              <Field
                label={t.offer}
                value={state.offer}
                onChange={(v) => onChange("offer", v)}
                placeholder={t.placeholders.offer}
              />
              <Field
                label={t.audience}
                value={state.audience}
                onChange={(v) => onChange("audience", v)}
                placeholder={t.placeholders.audience}
              />
              <Field
                label={t.problem}
                value={state.problem}
                onChange={(v) => onChange("problem", v)}
                placeholder={t.placeholders.problem}
              />
              <Field
                label={t.solution}
                value={state.solution}
                onChange={(v) => onChange("solution", v)}
                placeholder={t.placeholders.solution}
              />
              <Field
                label={t.proof}
                value={state.proof}
                onChange={(v) => onChange("proof", v)}
                placeholder={t.placeholders.proof}
              />
              <Field
                label={t.cta}
                value={state.cta}
                onChange={(v) => onChange("cta", v)}
                placeholder={t.placeholders.cta}
              />
              <Field
                label={t.hak}
                value={state.hak}
                onChange={(v) => onChange("hak", v)}
                placeholder={t.placeholders.hak}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onGenerate}
                disabled={loading}
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                  loading ? "bg-white/10" : "bg-violet-600 hover:bg-violet-500"
                }`}
              >
                {loading ? "..." : t.generate}
              </button>

              <button
                onClick={onReset}
                className="rounded-xl px-4 py-2 text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10"
              >
                {t.reset}
              </button>

              <div className="ml-auto text-xs text-white/60">Auto-save ✅</div>
            </div>

            {error ? <div className="text-sm text-red-400">{error}</div> : null}
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
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-violet-400/50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div>
      <label className="text-sm text-white/70">{label}</label>
      <select
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 outline-none focus:border-violet-400/50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
