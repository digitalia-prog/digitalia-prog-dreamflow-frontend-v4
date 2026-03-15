"use client";

import { useMemo, useState } from "react";
import { formatScript } from "@/lib/formatScript";

type Mode = "AGENCY" | "CREATOR";
type Lang = "fr" | "en-GB" | "en-US" | "es" | "ar";

const PLATFORMS = [
  "TikTok",
  "Instagram Reels",
  "YouTube Shorts",
  "Facebook Ads",
  "Google Ads",
  "Landing page",
  "Email",
];

const OBJECTIVES = ["Vente", "Lead", "Awareness", "UGC", "Conversion"];

const HOOK_TYPES = [
  "Question choc",
  "Story",
  "Pain point",
  "Contrarian",
  "Direct claim",
  "Curiosity",
];

const TONES = [
  "UGC naturel (simple)",
  "Direct response",
  "Storytelling",
  "Premium",
  "Funny",
];

const DURATIONS = ["15s", "30s", "45s", "60s"];

function cn(...v: (string | false | null | undefined)[]) {
  return v.filter(Boolean).join(" ");
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-sm text-white/80">{label}</div>
      {children}
    </div>
  );
}

export default function AiPage() {
  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-violet-500";

  const [mode, setMode] = useState<Mode>("AGENCY");
  const [lang, setLang] = useState<Lang>("fr");
  const [platform, setPlatform] = useState<string>(PLATFORMS[0]);
  const [objective, setObjective] = useState<string>(OBJECTIVES[0]);
  const [audience, setAudience] = useState<string>(
    "E-commerçants (débutants) sur TikTok"
  );
  const [offer, setOffer] = useState<string>("Coaching UGC Growth");
  const [price, setPrice] = useState<string>("49€/mois");
  const [angle, setAngle] = useState<string>(
    "ROI rapide & scripts prêts à filmer"
  );
  const [objection, setObjection] = useState<string>(
    "J’ai pas le temps / je sais pas quoi dire"
  );
  const [hookType, setHookType] = useState<string>(HOOK_TYPES[0]);
  const [tone, setTone] = useState<string>(TONES[0]);
  const [duration, setDuration] = useState<string>(DURATIONS[1]);
  const [context, setContext] = useState<string>("Générer 10 scripts");

  const scriptsCount = mode === "AGENCY" ? 10 : 4;

  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<any | null>(null);
  const [error, setError] = useState<string>("");

  const title = useMemo(() => {
    return mode === "AGENCY"
      ? "Script Engine — Agency"
      : "Script Engine — Creator";
  }, [mode]);

  async function onGenerate() {
    setLoading(true);
    setError("");
    setParsed(null);

    try {
      const r = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode,
          lang,
          platform,
          objective,
          audience,
          offer,
          price,
          angle,
          objection,
          hookType,
          tone,
          duration,
          context,
        }),
      });

      const data = await r.json();

      if (!r.ok) {
        throw new Error(data?.details || data?.error || "Erreur API");
      }

      setParsed(data?.parsed ?? data ?? null);
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-3xl font-bold">{title}</h1>

        <p className="mb-8 text-white/70">
          Remplis les champs → Générer = hooks, script AIDA, beats, proof,
          shotlist et CTA.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Mode">
            <select
              className={inputCls}
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
            >
              <option value="CREATOR">CREATOR</option>
              <option value="AGENCY">AGENCY</option>
            </select>
          </Field>

          <Field label="Langue">
            <select
              className={inputCls}
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
            >
              <option value="fr">FR</option>
              <option value="en-GB">EN (UK)</option>
              <option value="en-US">EN (US)</option>
              <option value="es">ES</option>
              <option value="ar">AR</option>
            </select>
          </Field>

          <Field label="Plateforme">
            <select
              className={inputCls}
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              {PLATFORMS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </Field>

          <Field label="Objectif">
            <select
              className={inputCls}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
            >
              {OBJECTIVES.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </Field>

          <Field label="Audience">
            <input
              className={inputCls}
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />
          </Field>

          <Field label="Offre / Produit">
            <input
              className={inputCls}
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
            />
          </Field>

          <Field label="Prix">
            <input
              className={inputCls}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Field>

          <Field label="Angle marketing">
            <input
              className={inputCls}
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
            />
          </Field>

          <Field label="Objection principale">
            <input
              className={inputCls}
              value={objection}
              onChange={(e) => setObjection(e.target.value)}
            />
          </Field>

          <Field label="Type de Hook">
            <select
              className={inputCls}
              value={hookType}
              onChange={(e) => setHookType(e.target.value)}
            >
              {HOOK_TYPES.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>
          </Field>

          <Field label="Ton">
            <select
              className={inputCls}
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              {TONES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>

          <Field label="Durée">
            <select
              className={inputCls}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              {DURATIONS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>

          <Field label="Contexte (optionnel)">
            <textarea
              className={cn(inputCls, "h-24")}
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </Field>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={onGenerate}
            disabled={loading}
            className={cn(
              "rounded-lg px-5 py-3 font-semibold transition",
              loading
                ? "bg-white/10 text-white/60"
                : "bg-violet-600 text-white hover:bg-violet-500"
            )}
          >
            {loading ? "Génération..." : `Générer ${scriptsCount} scripts`}
          </button>

          {error && <span className="text-red-400">{error}</span>}
        </div>

        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="mb-4 font-semibold">Scripts générés</h2>
          <pre className="whitespace-pre-wrap break-words text-xs">
            {parsed ? formatScript(parsed) : "-"}
          </pre>
        </div>
      </div>
    </main>
  );
}
