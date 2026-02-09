'use client';

import { useMemo, useState } from 'react';

export default function Home() {
  const [platform, setPlatform] = useState('TikTok');
  const [deliverable, setDeliverable] = useState('Script UGC complet');
  const [goal, setGoal] = useState('Ventes');
  const [userPrompt, setUserPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('Ton résultat apparaîtra ici…');

  const finalPrompt = useMemo(() => {
    return `
Tu es un expert UGC + Growth Marketing (niveau élite).
Tu travailles pour des agences marketing digital, freelances UGC et CM.

Plateforme: ${platform}
Livrable: ${deliverable}
Objectif: ${goal}

TÂCHE:
Génère un livrable prêt client, concret, moderne, orienté conversion.

FORMAT (sans blabla):
1) 🎯 Angle marketing principal (1 phrase)
2) 🎣 10 hooks ULTRA MODERNES adaptés à ${platform}
3) 🎬 Script MOT À MOT (30–45s): Hook / Problème / Solution / Preuve / Objection / CTA
4) 🧠 3 variantes de CTA (soft / direct / urgence)
5) 🎥 Mini plan tournage smartphone (plans, gestes, textes à l’écran)

CONTEXTE UTILISATEUR:
"${userPrompt}"
    `.trim();
  }, [platform, deliverable, goal, userPrompt]);

  async function onGenerate() {
    if (!userPrompt.trim()) {
      setOutput("❌ Écris un contexte (produit / cible / offre / objection / angle).");
      return;
    }

    setLoading(true);
    setOutput('⏳ Génération...');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setOutput(`❌ Erreur API (${res.status})\n${data?.error || 'Erreur inconnue'}`);
        return;
      }

      setOutput(data?.content || '✅ OK mais contenu vide');
    } catch (e: any) {
      setOutput(`❌ Erreur réseau\n${e?.message || String(e)}`);
    } finally {
      setLoading(false);
    }
  }

  async function onCopy() {
    await navigator.clipboard.writeText(output);
  }

  return (
    <main style={{ minHeight: '100vh', padding: 24, background: '#0b0b14', color: '#fff' }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, marginBottom: 8 }}>🚀 UGC Growth</h1>
        <p style={{ opacity: 0.85, marginBottom: 18 }}>
          Dashboard MVP — Générateur UGC / Crochets / Annonces
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label>📱 Réseau</label>
            <select value={platform} onChange={(e) => setPlatform(e.target.value)} style={selectStyle}>
              <option>TikTok</option>
              <option>Instagram Reels</option>
              <option>YouTube Shorts</option>
              <option>Meta Ads</option>
              <option>TikTok Ads</option>
              <option>LinkedIn</option>
            </select>
          </div>

          <div>
            <label>📦 Livrable</label>
            <select value={deliverable} onChange={(e) => setDeliverable(e.target.value)} style={selectStyle}>
              <option>Script UGC complet</option>
              <option>Hooks uniquement</option>
              <option>Angles + Hooks</option>
              <option>Script + plan tournage</option>
              <option>Annonce (Ads) - Copy + Hook + CTA</option>
            </select>
          </div>

          <div>
            <label>🎯 Objectif</label>
            <select value={goal} onChange={(e) => setGoal(e.target.value)} style={selectStyle}>
              <option>Ventes</option>
              <option>Leads</option>
              <option>Trafic</option>
              <option>Abonnés</option>
              <option>Notoriété</option>
            </select>
          </div>
        </div>

        <label>🧾 Contexte (produit / niche / cible / offre / objection / angle)</label>
        <textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder={`Ex: "sac à main luxe - femmes 18-30 - ${platform} - prix 39€ - objection: peur qualité - angle: look luxe abordable"`}
          style={textareaStyle}
        />

        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <button onClick={onGenerate} disabled={loading} style={btnStyle}>
            {loading ? '⏳ Génération...' : '✨ Générer'}
          </button>
          <button onClick={onCopy} style={btn2Style}>📋 Copier</button>
        </div>

        <pre style={preStyle}>{output}</pre>
      </div>
    </main>
  );
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 10,
  background: '#141426',
  color: '#fff',
  border: '1px solid rgba(255,255,255,.12)',
  marginTop: 6,
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  height: 140,
  marginTop: 8,
  padding: 12,
  borderRadius: 12,
  background: '#141426',
  color: '#fff',
  border: '1px solid rgba(255,255,255,.12)',
  outline: 'none',
};

const btnStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: 12,
  border: 'none',
  cursor: 'pointer',
  background: '#7c3aed',
  color: '#fff',
  fontWeight: 700,
};

const btn2Style: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,.18)',
  cursor: 'pointer',
  background: '#141426',
  color: '#fff',
  fontWeight: 700,
};

const preStyle: React.CSSProperties = {
  whiteSpace: 'pre-wrap',
  background: '#0f1020',
  border: '1px solid rgba(255,255,255,.12)',
  padding: 16,
  borderRadius: 14,
  minHeight: 220,
};

