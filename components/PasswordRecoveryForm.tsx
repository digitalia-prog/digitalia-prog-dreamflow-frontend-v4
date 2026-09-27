"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Mode = "request" | "update";

function errorMessage(caught: unknown): string {
  const code = typeof caught === "object" && caught !== null && "code" in caught
    ? String(caught.code) : "";
  if (code === "over_email_send_rate_limit" || code === "over_request_rate_limit") {
    return "Trop de demandes. Patientez avant de réessayer.";
  }
  if (code === "same_password") return "Choisissez un mot de passe différent de l’ancien.";
  if (code === "weak_password") return "Ce mot de passe est trop faible. Choisissez-en un plus long et plus varié.";
  if (["session_not_found", "refresh_token_not_found", "otp_expired"].includes(code)) {
    return "Votre session a expiré. Demandez un nouveau lien.";
  }
  return "La demande n’a pas abouti. Vérifiez votre connexion et réessayez.";
}

export default function PasswordRecoveryForm({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [invalidLink, setInvalidLink] = useState(false);
  const isRequest = mode === "request";

  useEffect(() => {
    setInvalidLink(new URLSearchParams(window.location.search).get("error") === "recovery");
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || done || sent) return;
    setError("");
    if (!isRequest && (password.length < 8 || password !== confirmation)) {
      setError(password.length < 8 ? "Utilisez au moins 8 caractères." : "Les mots de passe ne correspondent pas.");
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      if (isRequest) {
        const callback = new URL("/auth/callback", window.location.origin);
        callback.searchParams.set("next", "/reset-password");
        const { error: requestError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: callback.toString(),
        });
        if (requestError) throw requestError;
        setSent(true);
        setInvalidLink(false);
      } else {
        const { data, error: sessionError } = await supabase.auth.getUser();
        if (sessionError || !data.user) {
          setError("Votre session a expiré. Demandez un nouveau lien.");
          return;
        }
        const { error: updateError } = await supabase.auth.updateUser({ password });
        if (updateError) throw updateError;
        setPassword("");
        setConfirmation("");
        setDone(true);
      }
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setBusy(false);
    }
  }

  const inputClass = "h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm outline-none focus:border-violet-400";
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08080d] px-4 py-12 text-white">
      <section className="w-full max-w-md rounded-[30px] border border-white/10 bg-[#101018] p-6 shadow-2xl sm:p-8">
        <p className="mb-7 text-sm font-semibold text-violet-300">UGC Growth · Creative OS</p>
        <h1 className="text-2xl font-bold tracking-tight">
          {done ? "Mot de passe modifié" : isRequest ? "Mot de passe oublié ?" : "Votre nouveau mot de passe"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-white/60">
          {done ? "Votre nouveau mot de passe est enregistré." : isRequest
            ? "Saisissez votre adresse e-mail pour recevoir un lien de réinitialisation."
            : "Choisissez un mot de passe d’au moins 8 caractères."}
        </p>
        {invalidLink && <p role="alert" className="mt-5 rounded-xl bg-amber-400/10 p-4 text-sm text-amber-100">
          Ce lien est invalide, expiré ou a été ouvert dans un autre navigateur. Demandez un nouveau lien et ouvrez-le dans le navigateur utilisé pour la demande.
        </p>}
        {sent ? (
          <div role="status" className="mt-6 rounded-xl bg-violet-500/10 p-4 text-sm leading-6 text-violet-100">
            Si un compte correspond à cette adresse, un e-mail vous sera envoyé. Vérifiez aussi les indésirables. Ouvrez le lien dans le même navigateur que celui utilisé ici.
          </div>
        ) : done ? (
          <Link href="/dashboard/overview" className="mt-7 block rounded-2xl bg-violet-600 p-4 text-center font-semibold hover:bg-violet-500">
            Revenir à mon espace
          </Link>
        ) : (
          <form onSubmit={submit} className="mt-7 space-y-5">
            {isRequest ? (
              <label className="block space-y-2 text-sm">
                <span>Adresse e-mail</span>
                <input className={inputClass} type="email" autoComplete="email" required value={email}
                  disabled={busy} onChange={(event) => setEmail(event.target.value)} />
              </label>
            ) : (
              <>
                <label className="block space-y-2 text-sm">
                  <span>Nouveau mot de passe</span>
                  <input className={inputClass} type="password" autoComplete="new-password" required minLength={8}
                    disabled={busy} value={password} onChange={(event) => setPassword(event.target.value)} />
                </label>
                <label className="block space-y-2 text-sm">
                  <span>Confirmer le mot de passe</span>
                  <input className={inputClass} type="password" autoComplete="new-password" required minLength={8}
                    disabled={busy} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} />
                </label>
              </>
            )}
            {error && <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
            <button type="submit" disabled={busy}
              className="min-h-12 w-full rounded-2xl bg-violet-600 px-4 py-3 font-semibold hover:bg-violet-500 disabled:opacity-50">
              {busy ? "Veuillez patienter…" : isRequest ? "Envoyer le lien" : "Enregistrer le mot de passe"}
            </button>
          </form>
        )}
        {!done && <div className="mt-6 flex flex-wrap gap-4 text-sm text-violet-300">
          <Link href="/login" className="underline underline-offset-4">Retour à la connexion</Link>
          {!isRequest && <Link href="/forgot-password" className="underline underline-offset-4">Demander un nouveau lien</Link>}
        </div>}
      </section>
    </main>
  );
}
