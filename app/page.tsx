import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-20">

        <h1 className="text-5xl font-bold">
          Croissance du contenu généré par l'utilisateur
        </h1>

        <p className="mt-6 text-white/70">
          Dashboard UGC pour agences internationales.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            href="/dashboard"
            className="rounded-xl bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700"
          >
            Aller au Dashboard
          </Link>

          <a
            href="#international"
            className="rounded-xl border border-white/20 px-6 py-3 hover:bg-white/10"
          >
            Voir section International
          </a>
        </div>

        <section
          id="international"
          className="mt-20 rounded-3xl border border-white/10 bg-white/5 p-8"
        >
          <h2 className="text-2xl font-bold">International</h2>

          <p className="mt-4 text-white/70">
            Multi-devises, multi-langues, fuseaux horaires,
            gestion multi-clients.
          </p>
        </section>

      </div>
    </main>
  );
}

