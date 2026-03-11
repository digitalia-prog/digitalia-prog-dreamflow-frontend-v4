"use client";

import { useState, useMemo } from "react";
import { formatScript } from "@/lib/formatScript";

type Mode = "AGENCY" | "CREATOR";
type Lang = "fr" | "en";

const PLATFORMS = ["TikTok", "Instagram", "YouTube"];
const OBJECTIVES = ["Vente", "Lead", "Notoriété", "Conversion"];
const HOOK_TYPES = ["Question choc", "Story", "Problème", "Statistique"];
const TONES = ["UGC naturel (simple)", "Expert", "Storytelling"];
const DURATIONS = ["15s", "30s", "45s", "60s"];

function cn(...v: (string | false | null | undefined)[]) {
  return v.filter(Boolean).join(" ");
}

function Field({ label, children }: { label: string; children: any }) {
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

  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [objective, setObjective] = useState(OBJECTIVES[0]);
  const [audience, setAudience] = useState("E-commerçants sur TikTok");
  const [offer, setOffer] = useState("Coaching UGC Growth");
  const [price, setPrice] = useState("49€/mois");
  const [angle, setAngle] = useState("ROI rapide & scripts prêts à filmer");
  const [objection, setObjection] = useState("J’ai pas le temps");
  const [hookType, setHookType] = useState(HOOK_TYPES[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [duration, setDuration] = useState(DURATIONS[1]);
  const [context, setContext] = useState("");

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
    }

    setLoading(false);
  }

  return (
    <main className="p-10 max-w-5xl mx-auto text-white">
      <h1 className="text-2xl font-semibold mb-8">{title}</h1>

      <div className="grid grid-cols-2 gap-6">

        <Field label="Mode">
          <select
            className={inputCls}
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
          >
            <option value="AGENCY">AGENCY</option>
            <option value="CREATOR">CREATOR</option>
          </select>
        </Field>

        <Field label="Langue">
          <select
            className={inputCls}
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
          >
            <option value="fr">FR</option>
            <option value="en">EN</option>
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

      </div>

      <div className="mt-6">
        <Field label="Contexte (optionnel)">
          <textarea
            className={inputCls}
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </Field>
      </div>

      <button
        onClick={onGenerate}
        disabled={loading}
        className={cn(
          "mt-6 px-5 py-3 rounded-lg font-semibold",
          loading ? "bg-white/10" : "bg-violet-600 hover:bg-violet-500"
        )}
      >
        {loading ? "Génération..." : "Générer"}
      </button>

      {error && (
        <div className="mt-6 text-red-400">
          {error}
        </div>
      )}

      {parsed && (
        <div className="mt-10 border border-white/10 rounded-xl p-4 bg-white/5">
          <h2 className="font-semibold mb-4">Scripts générés</h2>
          <pre className="text-xs whitespace-pre-wrap break-words">
            {formatScript(parsed)}
          </pre>
        </div>
      )}
    </main>
  );
}
