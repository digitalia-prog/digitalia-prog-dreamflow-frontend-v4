"use client";

import { useMemo, useState } from "react";

type Lang = "fr" | "en" | "es" | "ar";
type Audience = "creator" | "agency";

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

const OBJECTIVES = ["Vente", "Lead", "Notoriété", "Conversion"] as const;

export default function AiPage() {
  const [audience, setAudience] = useState<Audience>("agency");
  const [lang, setLang] = useState<Lang>("fr");
  const [platform, setPlatform] = useState<(typeof PLATFORMS)[number]>("TikTok");
  const [objective, setObjective] = useState<(typeof OBJECTIVES)[number]>("Vente");

  const [offer, setOffer] = useState("");
  const [price, setPrice] = useState("");
  const [angle, setAngle] = useState("");
  const [objection, setObjection] = useState("");
  const [hookType, setHookType] = useState("Question");
  const [duration, setDuration] = useState("30s");
  const [tone, setTone] = useState("UGC naturel (simple)");
  const [context, setContext] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const title = useMemo(() => {
    return audience === "agency" ? "Script Engine — Agence" : "Script Engine — Créateur";
  }, [audience]);

  async function onGenerate() {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const r = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience,
          lang,
          platform,
          objective,
          offer,
          price: price || undefined,
          angle,
          objection,
          hookType,
          duration,
          tone,
          context: context || undefined,
        }),
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Erreur API");

      setResult(data.prompt || "");
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-white/70 mt-2">
          Moteur propriétaire = structure + frameworks + variantes + adaptation réseau.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 p-5 bg-white/5">
            <div className="flex gap-2 flex-wrap">
              <select className="bg-black border border-white/10 rounded px-3 py-2" value={audience} onChange={(e)=>setAudience(e.target.value as Audience)}>
                <option value="agency">Agence</option>
                <option value="creator">Créateur</option>
              </select>
              <select className="bg-black border border-white/10 rounded px-3 py-2" value={lang} onChange={(e)=>setLang(e.target.value as Lang)}>
                <option value="fr">FR</option>
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="ar">AR</option>
              </select>
              <select className="bg-black border border-white/10 rounded px-3 py-2" value={platform} onChange={(e)=>setPlatform(e.target.value as any)}>
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <select className="bg-black border border-white/10 rounded px-3 py-2" value={objective} onChange={(e)=>setObjective(e.target.value as any)}>
                {OBJECTIVES.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div className="mt-4 grid gap-3">
              <input className="bg-black border border-white/10 rounded px-3 py-2" placeholder="Offre (produit/service)" value={offer} onChange={(e)=>setOffer(e.target.value)} />
              <input className="bg-black border border-white/10 rounded px-3 py-2" placeholder="Prix (optionnel)" value={price} onChange={(e)=>setPrice(e.target.value)} />
              <input className="bg-black border border-white/10 rounded px-3 py-2" placeholder="Angle (ex: avant/après, expertise, preuve…)" value={angle} onChange={(e)=>setAngle(e.target.value)} />
              <input className="bg-black border border-white/10 rounded px-3 py-2" placeholder="Objection (ex: trop cher, ça marche pas…)" value={objection} onChange={(e)=>setObjection(e.target.value)} />

              <div className="flex gap-2">
                <input className="bg-black border border-white/10 rounded px-3 py-2 w-1/2" placeholder="Hook type (Question, choc…)" value={hookType} onChange={(e)=>setHookType(e.target.value)} />
                <input className="bg-black border border-white/10 rounded px-3 py-2 w-1/2" placeholder="Durée (ex: 15s / 30s)" value={duration} onChange={(e)=>setDuration(e.target.value)} />
              </div>

              <input className="bg-black border border-white/10 rounded px-3 py-2" placeholder="Ton (ex: premium, fun, direct…)" value={tone} onChange={(e)=>setTone(e.target.value)} />
              <textarea className="bg-black border border-white/10 rounded px-3 py-2 min-h-[90px]" placeholder="Contexte (optionnel)" value={context} onChange={(e)=>setContext(e.target.value)} />
            </div>

            <button
              onClick={onGenerate}
              disabled={loading}
              className="mt-4 rounded-xl px-4 py-3 bg-white text-black font-semibold disabled:opacity-50"
            >
              {loading ? "Génération..." : "Générer"}
            </button>

            {error ? <p className="mt-3 text-red-400 text-sm">{error}</p> : null}
          </div>

          <div className="rounded-2xl border border-white/10 p-5 bg-white/5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Résultat</h2>
              <button onClick={copy} className="text-sm underline underline-offset-4 text-white/70 hover:text-white">
                Copier
              </button>
            </div>
            <pre className="mt-3 whitespace-pre-wrap text-sm text-white/80">{result || "Aucun résultat pour l’instant."}</pre>
          </div>
        </div>
      </div>
    </main>
  );
}

