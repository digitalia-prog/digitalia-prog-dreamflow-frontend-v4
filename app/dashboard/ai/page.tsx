"use client";

import { useMemo, useState } from "react";
import { formatScript } from "@/lib/formatScript";

type Lang = "fr" | "en-GB" | "en-US" | "es" | "ar";
type Mode = "CREATOR" | "AGENCY";

const PLATFORMS = [
  "TikTok",
  "Instagram Reels",
  "YouTube Shorts",
  "Facebook Ads",
  "Google Ads",
  "Landing page",
  "Email",
] as const;

const OBJECTIVES = ["Vente", "Lead", "Notoriété", "Conversion"] as const;

const HOOK_TYPES = [
  "Question choc",
  "Stat / preuve",
  "Avant / Après",
  "Erreur fréquente",
  "Mythe vs réalité",
  "Story",
] as const;

const TONES = [
  "UGC naturel (simple)",
  "Premium (agency)",
  "Direct response (agressif)",
  "Friendly (bienveillant)",
] as const;

const DURATIONS = ["15s", "30s", "45s", "60s"] as const;

function cn(...v: (string | false | null | undefined)[]) {
  return v.filter(Boolean).join(" ");
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="text-sm text-white/80">{label}</div>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg bg-black/40 border border-white/20 px-3 py-2 outline-none focus:border-white/40";

export default function AiPage() {
  const [mode, setMode] = useState<Mode>("AGENCY");
  const [lang, setLang] = useState<Lang>("fr");
  const [platform, setPlatform] = useState<string>(PLATFORMS[0]);
  const [objective, setObjective] = useState<string>(OBJECTIVES[0]);
  const [audience, setAudience] = useState<string>("E-commerçants sur TikTok");
  const [offer, setOffer] = useState<string>("Coaching UGC Growth");
  const [price, setPrice] = useState<string>("49€/mois");
  const [angle, setAngle] = useState<string>(
    "ROI rapide & scripts prêts à filmer"
  );
  const [objection, setObjection] = useState<string>(
    "Je ne sais pas quoi dire en vidéo"
  );
  const [hookType, setHookType] = useState<string>(HOOK_TYPES[0]);
  const [tone, setTone] = useState<string>(TONES[0]);
  const [duration, setDuration] = useState<string>(DURATIONS[1]);
  const [context, setContext] = useState<string>("");

  const scriptsCount = mode === "AGENCY" ? 10 : 4;

  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<any | null>(null);
  const [error, setError] = useState("");

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
          scriptsCount,
        }),
      });

      const data = await r.json();

      if (!r.ok) {
        throw new Error(data?.error || "Erreur API");
      }

      setParsed(data.parsed || null);
    } catch (e: any) {
      setError(e.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>

        <p className="text-white/70 mb-8">
          Générer {scriptsCount} scripts marketing prêts à tourner.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
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

          <Field label="Type de hook">
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

          <Field label="Contexte">
            <textarea
              className={cn(inputCls, "h-24")}
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </Field>
        </div>

        <button
          onClick={onGenerate}
          disabled={loading}
          className="mt-6 px-5 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 font-semibold"
        >
          {loading ? "Génération..." : `Générer ${scriptsCount} scripts`}
        </button>

        {error && <div className="mt-6 text-red-400">{error}</div>}

        {parsed?.variants?.length ? (
          <div className="mt-10 space-y-6">
            {parsed.variants.map((variant: any, i: number) => (
              <div
                key={i}
                className="border border-white/10 rounded-xl p-4 bg-white/5"
              >
                <h3 className="font-semibold mb-3">Script {i + 1}</h3>

                <pre className="text-sm whitespace-pre-wrap">
                  {formatScript({ variants: [variant] })}
                </pre>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
