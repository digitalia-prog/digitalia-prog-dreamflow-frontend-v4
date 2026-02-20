"use client";

import { useMemo, useState } from "react";

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

export default function AiPage() {
  const [mode, setMode] = useState<Mode>("AGENCY");
  const [lang, setLang] = useState<Lang>("fr");
  const [platform, setPlatform] = useState<string>(PLATFORMS[0]);
  const [objective, setObjective] = useState<string>(OBJECTIVES[0]);
  const [audience, setAudience] = useState<string>("E-commerçants (débutants) sur TikTok");
  const [offer, setOffer] = useState<string>("Coaching UGC Growth");
  const [price, setPrice] = useState<string>("49€/mois");
  const [angle, setAngle] = useState<string>("ROI rapide & scripts prêts à filmer");
  const [objection, setObjection] = useState<string>("J’ai pas le temps / je sais pas quoi dire");
  const [hookType, setHookType] = useState<string>(HOOK_TYPES[0]);
  const [tone, setTone] = useState<string>(TONES[0]);
  const [duration, setDuration] = useState<string>(DURATIONS[1]);
  const [context, setContext] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [raw, setRaw] = useState<string>("");
  const [parsed, setParsed] = useState<any | null>(null);
  const [error, setError] = useState<string>("");export default function AiPage({ defaultMode = "AGENCY" }: { defaultMode?: "AGENCY" | "CREATOR" })

  const title = useMemo(() => {
    return mode === "AGENCY" ? "Script Engine — Agency" : "Script Engine — Creator";
  }, [mode]);

  async function onGenerate() {
    setLoading(true);
    setError("");
    setRaw("");
    setParsed(null);

    try {
      const r = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          lang,
          platform,
          objective,
        const [mode, setMode] = useState<Mode>(defaultMode);

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
      if (!r.ok) throw new Error(data?.details || data?.error || "Erreur API");

      setRaw(data.raw || "");
      setParsed(data.parsed ?? null);
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-white/70 mb-8">
          Remplis les champs → Générer = 2 variantes A/B + framework + shotlist + plan de test.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Mode">
            <select className={inputCls} value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
              <option value="CREATOR">CREATOR (simple, tournable)</option>
              <option value="AGENCY">AGENCY (premium, stratégique)</option>
            </select>
          </Field>

          <Field label="Langue">
            <select className={inputCls} value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
              <option value="fr">FR</option>
              <option value="en-GB">EN (UK)</option>
              <option value="en-US">EN (US)</option>
              <option value="es">ES</option>
              <option value="ar">AR</option>
            </select>
          </Field>

          <Field label="Plateforme">
            <select className={inputCls} value={platform} onChange={(e) => setPlatform(e.target.value)}>
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </Field>

          <Field label="Objectif">
            <select className={inputCls} value={objective} onChange={(e) => setObjective(e.target.value)}>
              {OBJECTIVES.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </Field>

          <Field label="Audience (avatar)">
            <input className={inputCls} value={audience} onChange={(e) => setAudience(e.target.value)} />
          </Field>

          <Field label="Offre / Produit">
            <input className={inputCls} value={offer} onChange={(e) => setOffer(e.target.value)} />
          </Field>

          <Field label="Prix (optionnel)">
            <input className={inputCls} value={price} onChange={(e) => setPrice(e.target.value)} />
          </Field>

          <Field label="Angle marketing">
            <input className={inputCls} value={angle} onChange={(e) => setAngle(e.target.value)} />
          </Field>

          <Field label="Objection principale">
            <input className={inputCls} value={objection} onChange={(e) => setObjection(e.target.value)} />
          </Field>

          <Field label="Type de Hook">
            <select className={inputCls} value={hookType} onChange={(e) => setHookType(e.target.value)}>
              {HOOK_TYPES.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </Field>

          <Field label="Ton">
            <select className={inputCls} value={tone} onChange={(e) => setTone(e.target.value)}>
              {TONES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>

          <Field label="Durée">
            <select className={inputCls} value={duration} onChange={(e) => setDuration(e.target.value)}>
              {DURATIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </Field>

          <Field label="Contexte (optionnel)">
            <textarea className={cn(inputCls, "h-24")} value={context} onChange={(e) => setContext(e.target.value)} />
          </Field>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={onGenerate}
            disabled={loading}
            className={cn(
              "px-5 py-3 rounded-lg font-semibold",
              loading ? "bg-white/10" : "bg-violet-600 hover:bg-violet-500"
            )}
          >
            {loading ? "Génération..." : "Générer"}
          </button>
          {error ? <span className="text-red-400">{error}</span> : null}
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl border border-white/10 bg-white/5">
            <h2 className="font-semibold mb-3">Sortie JSON (parsed)</h2>
            <pre className="text-xs whitespace-pre-wrap break-words">{parsed ? JSON.stringify(parsed, null, 2) : "—"}</pre>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-white/5">
            <h2 className="font-semibold mb-3">Raw (si JSON cassé)</h2>
            <pre className="text-xs whitespace-pre-wrap break-words">{raw || "—"}</pre>
          </div>
        </div>
      </div>
    </main>
  );
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
