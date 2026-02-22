"use client";

import { useState } from "react";
import Link from "next/link";

type FormState = {
  name: string;
  email: string;
  role: "creator" | "agency" | "other";
  rating: "5" | "4" | "3" | "2" | "1";
  subject: string;
  message: string;
  consent: boolean;
};

const initial: FormState = {
  name: "",
  email: "",
  role: "creator",
  rating: "5",
  subject: "",
  message: "",
  consent: true,
};

export default function FeedbackPage() {
  const [form, setForm] = useState<FormState>(initial);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOk(null);
    setErr(null);

    // mini validation
    if (!form.email.includes("@")) return setErr("Email invalide.");
    if (form.message.trim().length < 10) return setErr("Décris un peu plus (min 10 caractères).");

    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Erreur lors de l’envoi.");

      setOk("Merci ❤️ Ton feedback a bien été envoyé.");
      setForm(initial);
    } catch (e: any) {
      setErr(e?.message || "Erreur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="mx-auto max-w-3xl px-6 py-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-600/80" />
          <div className="leading-tight">
            <div className="font-semibold">UGC GROWTH</div>
            <div className="text-xs text-white/60">Feedback</div>
          </div>
        </div>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-white/70 hover:text-white">Accueil</Link>
          <Link href="/dashboard" className="text-white/70 hover:text-white">Dashboard</Link>
        </nav>
      </header>

      <section className="mx-auto max-w-3xl px-6 pb-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold">Questionnaire feedback</h1>
          <p className="mt-3 text-white/70">
            Dis-nous ce qui marche, ce qui bloque, et ce que tu veux en priorité.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-white/70">Nom</label>
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-white/30"
                  placeholder="Ton nom"
                />
              </div>

              <div>
                <label className="text-sm text-white/70">Email (pour te répondre)</label>
                <input
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-white/30"
                  placeholder="toi@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-white/70">Tu es plutôt…</label>
                <select
                  value={form.role}
                  onChange={(e) => update("role", e.target.value as FormState["role"])}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-white/30"
                >
                  <option value="creator">Créateur</option>
                  <option value="agency">Agence</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-white/70">Note globale</label>
                <select
                  value={form.rating}
                  onChange={(e) => update("rating", e.target.value as FormState["rating"])}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-white/30"
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                  <option value="4">⭐⭐⭐⭐ (4)</option>
                  <option value="3">⭐⭐⭐ (3)</option>
                  <option value="2">⭐⭐ (2)</option>
                  <option value="1">⭐ (1)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm text-white/70">Sujet</label>
              <input
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-white/30"
                placeholder="Ex: Script engine / Dashboard / Bugs / Idées…"
              />
            </div>

            <div>
              <label className="text-sm text-white/70">Ton feedback</label>
              <textarea
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                className="mt-2 min-h-[140px] w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-white/30"
                placeholder="Qu’est-ce que tu adores ? Qu’est-ce qui bloque ? Ta demande #1 ?"
                required
              />
            </div>

            <label className="flex items-start gap-3 text-sm text-white/70">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => update("consent", e.target.checked)}
                className="mt-1"
              />
              J’accepte d’être recontacté(e) au sujet de ce feedback.
            </label>

            {err && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm">{err}</div>}
            {ok && <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm">{ok}</div>}

            <button
              disabled={loading}
              className="w-full rounded-xl bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700 disabled:opacity-60"
            >
              {loading ? "Envoi..." : "Envoyer le feedback"}
            </button>

            <p className="text-xs text-white/50 text-center">
              Version bêta : on lit tous les retours manuellement pour optimiser vite.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
