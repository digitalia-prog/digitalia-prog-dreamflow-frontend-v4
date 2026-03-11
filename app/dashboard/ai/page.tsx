"use client";

import { useMemo, useState } from "react";
import { formatScript } from "@/lib/formatScript";

type Mode = "CREATOR" | "AGENCY";
type Lang = "fr" | "en-GB" | "en-US" | "es" | "ar";

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
  "Direct response",
  "Friendly",
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
  const [angle, setAngle] = useState<string>("ROI rapide & scripts prêts à filmer");
  const [objection, setObjection] = useState<string>("J’ai pas le temps");
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
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-2">{title}</h1>

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

        </div>

        <button
          onClick={onGenerate}
          disabled={loading}
          className={cn(
            "mt-6 px-5 py-3 rounded-lg font-semibold",
            loading ? "bg-white/10" : "bg-violet-600 hover:bg-violet-500"
          )}
        >
          {loading ? "Génération..." : `Générer ${scriptsCount} scripts`}
        </button>

        {error && (
          <div className="mt-6 text-red-400">{error}</div>
        )}

        {parsed && (
          <div className="mt-10 border border-white/10 rounded-xl p-4 bg-white/5">
            <pre className="text-xs whitespace-pre-wrap break-words">
              {formatScript(parsed)}
            </pre>
          </div>
        )}

      </div>
    </main>
  );
}
