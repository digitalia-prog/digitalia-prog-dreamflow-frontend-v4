mkdir -p app/dashboard/ai

cat > app/dashboard/ai/page.tsx <<'EOF'
"use client";

import { useMemo, useState } from "react";

type Lang = "fr" | "en" | "es" | "ar";
type Mode = "UGC" | "HOOK" | "SCRIPT" | "ADS";

const PLATFORMS = [
  "TikTok",
  "Instagram Reels",
  "YouTube Shorts",
  "Facebook Ads",
  "Snapchat",
  "Pinterest",
  "LinkedIn",
  "X (Twitter)",
  "Google Ads",
  "Landing page",
  "Email",
  "VSL",
] as const;

const HOOK_TYPES = [
  "Question",
  "Choc / polémique",
  "Stat / preuve",
  "Story",
  "Avant/Après",
  "Erreur fréquente",
  "Mythe vs réalité",
] as const;

const DURATIONS = ["15s", "30s", "45s", "60s"] as const;

const TONES = [
  "Performance (direct)",
  "UGC naturel (simple)",
  "Premium",
  "Storytelling",
  "Funny",
  "Autorité / expert",
] as const;

const OBJECTIVES = ["Vente", "Lead", "Notoriété", "Conversion", "App install"] as const;

function cn(...v: (string | false | null | undefined)[]) {
  return v.filter(Boolean).join(" ");
}

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

export default function AiPage() {
  const [mode, setMode] = useState<Mode>("UGC");
  const [language, setLanguage] = useState<Lang>("fr");
  const [platform, setPlatform] = useState<string>("TikTok");

  const [objective, setObjective] = useState<string>("Vente");
  const [audience, setAudience] = useState<string>("");
  const [offer, setOffer] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [angle, setAngle] = useState<string>("");
  const [hookType, setHookType] = useState<string>("Question");
  const [duration, setDuration] = useState<string>("30s");
  const [tone, setTone] = useState<string>("UGC naturel (simple)");
  const [context, setContext] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [raw, setRaw] = useState<string>("");
  const [parsed, setParsed] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const title = useMemo(() => {
    if (mode === "UGC") return "Générateur UGC — complet";
    if (mode === "HOOK") return "Générateur de Hooks";
    if (mode === "SCRIPT") return "Générateur de Script";
    return "Générateur Ads Concepts";
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
          platform,
          language,
          objective,
          audience,
          offer,
          price,
          angle,
          hookType,
          duration,
          tone,
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

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-600/60";

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
            <p className="mt-2 text-white/70">
              Choisis réseau + mode + paramètres → génération hooks / scripts / angles / CTA.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(["UGC", "HOOK", "SCRIPT", "ADS"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm border",
                  mode === m
                    ? "bg-purple-600 border-purple-500"
                    : "border-white/15 bg-white/5 hover:bg-white/10"
                )}
              >
                {m === "UGC" ? "UGC (tout)" : m === "HOOK" ? "Hooks" : m === "SCRIPT" ? "Script" : "Ads"}
              </button>
            ))}
          </div>
        </div>

        {/* Lang + platform */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <label className="text-sm text-white/70">Langue</label>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["fr", "en", "es", "ar"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm border",
                    language === l
                      ? "bg-purple-600 border-purple-500"
                      : "border-white/15 bg-white/5 hover:bg-white/10"
                  )}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-white/50">
              (On ajoutera FR/UK/US/AR/ES en UI landing après — ici c’est la langue de génération.)
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <label className="text-sm text-white/70">Réseau / support</label>
            <select className={cn(inputClass, "mt-2")} value={platform} onChange={(e) => setPlatform(e.target.value)}>
              {PLATFORMS.map((p) => (
                <option key={p} value={p} className="bg-black">
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <label className="text-sm text-white/70">Objectif</label>
            <select className={cn(inputClass, "mt-2")} value={objective} onChange={(e) => setObjective(e.target.value)}>
              {OBJECTIVES.map((o) => (
                <option key={o} value={o} className="bg-black">
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Inputs */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <label className="text-sm text-white/70">Offre</label>
            <input className={cn(inputClass, "mt-2")} value={offer} onChange={(e) => setOffer(e.target.value)} placeholder="Ex: Lissage brésilien premium, routine skincare, formation..." />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <label className="text-sm text-white/70">Prix</label>
            <input className={cn(inputClass, "mt-2")} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Ex: 49€, 97€/mois, sur devis..." />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-

