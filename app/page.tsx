import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
          <span className="h-2 w-2 rounded-full bg-violet-500" />
          UGC Growth — Agency Suite
        </div>

        <h1 className="mt-8 text-5xl font-extrabold leading-tight">
          Croissance du contenu généré par l’utilisateur
          <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-200 bg-clip-text text-transparent">
            Dashboard UGC pour agences (International)
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-white/70">
          Suivi multi-plateformes, campagnes, créateurs, livrables et un générateur IA.
          Pensé pour vendre à l’international (clients multi-pays, multi-devise, multi-langue).
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/dashboard"
            className="rounded-xl bg-violet-600 px-6 py-3 font-semibold hover:bg-violet-500 transition"
          >
            Aller au Dashboard
          </Link>

          <a
            href="#pricing"
            className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white/90 hover:bg-white/10 transition"
          >
            Voir les offres
          </a>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Plateformes", "TikTok • IG • YT • Meta"],
            ["Campagnes", "Suivi KPIs + reporting"],
            ["Créateurs", "Casting + gestion livrables"],
            ["International", "Multi-clients • multi-pays"],
          ].map(([title, desc]) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <p className="text-sm text-white/60">{title}</p>
              <p className="mt-2 font-semibold">{desc}</p>
            </div>
          ))}
        </div>

        <div id="pricing" className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8">
          <h2 className="text-2xl font-bold">Offres</h2>
          <p className="mt-2 text-white/70">
            Starter • Pro • Agency — prêt à brancher plus tard avec Stripe.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
              <p className="text-white/70">Starter</p>
              <p className="mt-2 text-3xl font-extrabold">0€</p>
              <ul className="mt-4 space-y-2 text-white/70">
                <li>• 10 générations / mois</li>
                <li>• Watermark visible</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-violet-500/40 bg-violet-500/10 p-6">
              <p className="text-white/80">Pro</p>
              <p className="mt-2 text-3xl font-extrabold">69€</p>
              <ul className="mt-4 space-y-2 text-white/70">
                <li>• 300 générations / mois</li>
                <li>• Mode Business</li>
                <li>• Export PDF</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
              <p className="text-white/70">Agency</p>
              <p className="mt-2 text-3xl font-extrabold">349€</p>
              <ul className="mt-4 space-y-2 text-white/70">
                <li>• Illimité</li>
                <li>• Multi-clients</li>
                <li>• API complète</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-10 text-xs text-white/40">
          Noir + violet ✅ | Build Vercel stable ✅
        </p>
      </div>
    </main>
  );
}

