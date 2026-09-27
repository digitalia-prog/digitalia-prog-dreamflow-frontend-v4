"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [confirmationError, setConfirmationError] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setConfirmationError(
      new URLSearchParams(window.location.search).get("error") === "confirmation",
    );
  }, []);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const supabase = createClient();

    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (signUpError) throw signUpError;

        if (data.session) {
          router.push("/dashboard/overview");
          router.refresh();
          return;
        }

        setMessage(
          "Compte créé. Ouvre l’e-mail de confirmation envoyé par UGC Growth."
        );
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) throw signInError;

        const requestedNext = new URLSearchParams(window.location.search).get("next");
        const next = requestedNext?.startsWith("/")
          ? requestedNext
          : "/dashboard/overview";
        router.push(next.startsWith("/dashboard") ? next : "/dashboard/overview");
        router.refresh();
      }
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "La connexion a échoué. Réessaie dans un instant."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08080d] px-4 py-12 text-white">
      <div className="pointer-events-none absolute left-[-180px] top-[-180px] h-[460px] w-[460px] rounded-full bg-violet-700/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-220px] right-[-160px] h-[480px] w-[480px] rounded-full bg-fuchsia-700/10 blur-[130px]" />

      <section className="relative w-full max-w-md overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#101018]/95 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-8">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 text-sm font-black shadow-[0_12px_35px_rgba(124,58,237,0.35)]">
            UG
          </span>
          <span>
            <span className="block text-base font-semibold tracking-[-0.02em]">
              UGC Growth
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-violet-300/65">
              Creative OS
            </span>
          </span>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-2xl border border-white/[0.07] bg-black/20 p-1">
          {(["login", "signup"] as AuthMode[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setMode(item);
                setError("");
                setMessage("");
              }}
              className={`rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                mode === item
                  ? "bg-white/[0.09] text-white"
                  : "text-white/35 hover:text-white/65"
              }`}
            >
              {item === "login" ? "Connexion" : "Créer un compte"}
            </button>
          ))}
        </div>

        <h1 className="text-2xl font-bold tracking-[-0.035em]">
          {mode === "login" ? "Retrouvez votre workspace" : "Créez votre workspace"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-white/40">
          {mode === "login"
            ? "Connectez-vous pour retrouver vos analyses et votre bibliothèque."
            : "Un compte sécurisé pour synchroniser UGC Growth sur tous vos appareils."}
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-white/65">
              Adresse e-mail
            </span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 w-full rounded-2xl border border-white/[0.09] bg-black/20 px-4 text-sm outline-none placeholder:text-white/20 focus:border-violet-400/40"
              placeholder="vous@entreprise.com"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-white/65">
              Mot de passe
            </span>
            <input
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 w-full rounded-2xl border border-white/[0.09] bg-black/20 px-4 text-sm outline-none placeholder:text-white/20 focus:border-violet-400/40"
              placeholder="8 caractères minimum"
            />
          </label>

          {mode === "login" && (
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-violet-300 underline underline-offset-4 hover:text-violet-200">
                Mot de passe oublié ?
              </Link>
            </div>
          )}

        {confirmationError ? (
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-xs leading-5 text-amber-100">
              Le lien de confirmation est invalide ou expiré. Recommence l’inscription.
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs leading-5 text-red-200">
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-xs leading-5 text-emerald-100">
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3.5 text-sm font-bold shadow-[0_16px_38px_rgba(109,40,217,0.25)] transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Connexion…"
              : mode === "login"
                ? "Se connecter"
                : "Créer mon compte"}
          </button>
        </form>

        <p className="mt-6 text-center text-[10px] leading-5 text-white/20">
          Vos données sont isolées et protégées par compte.
        </p>
      </section>
    </main>
  );
}
