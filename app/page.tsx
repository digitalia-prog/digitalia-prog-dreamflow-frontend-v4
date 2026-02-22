import Link from "next/link";

export const metadata = {
  title: "UGC GROWTH",
  description: "Dashboard UGC + Script Engine IA + workflow.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <header className="mx-auto max-w-6xl px-6 py-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-600/80" />
          <div>
            <div className="font-semibold">UGC GROWTH</div>
            <div className="text-xs text-white/60">Beta</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-4 text-sm">
          <a href="#features" className="text-white/70 hover:text-white">Fonctionnalités</a>
          <a href="#pricing" className="text-white/70 hover:text-white">Prix</a>
          <a href="#faq" className="text-white/70 hover:text-white">FAQ</a>
          <a href="#feedback" className="text-white/70 hover:text-white">Feedback</a>
          <Link href="/terms" className="text-white/70 hover:text-white">CGU</Link>
        </nav>

        {/* LANGUES */}
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full border border-white/15 px-3 py-1 text-white/70">FR</span>
          <span className="rounded-full border border-white/15 px-3 py-1 text-white/70">EN</span>
          <span className="rounded-full border border-white/15 px-3 py-1 text-white/70">AR</span>
          <span className="rounded-full border border-white/15 px-3 py-1 text-white/70">ES</span>
          <span className="rounded-full border border-white/15 px-3 py-1 text-white/70">中文</span>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 md:p-14">

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/80">
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            Beta — accès test contrôlé (rate limit anti-abus)
          </div>

          <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">
            Scripts IA qui convertissent.
          </h1>

          <p className="mt-4 max-w-2xl text-white/70 md:text-lg">
            Dashboard UGC + Script Engine IA pour créateurs et agences.
            Workflow clair, génération rapide, résultat professionnel.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/dashboard"
              className="rounded-xl bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700"
            >
              Accéder au dashboard
            </Link>

            <a
              href="#pricing"
              className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white/80 hover:bg-white/5"
            >
              Voir les offres
            </a>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <MiniCard title="Script Engine IA">
              Hooks, storytelling, émotion, branding et CTA.
            </MiniCard>
            <MiniCard title="Creator & Agency">
              Deux modes adaptés selon ton workflow.
            </MiniCard>
            <MiniCard title="Multi-langues">
              FR / EN / AR / ES / 中文.
            </MiniCard>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-2xl md:text-3xl font-bold">Fonctionnalités clés</h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Feature title="Scripts structurés">
            HOOK / STORY / PROBLÈME / SOLUTION / PREUVE / CTA.
          </Feature>

          <Feature title="Mode Viral + HAK">
            Ajoute des angles psychologiques et émotionnels.
          </Feature>

          <Feature title="Rate limit intelligent">
            Protection anti-abus pour garder la qualité du service.
          </Feature>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-2xl md:text-3xl font-bold">Prix bêta</h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <PriceCard title="Bêta test" price="0€ / 7 jours" note="Accès test contrôlé">
            <li>Dashboard complet</li>
            <li>Script Engine IA</li>
            <li>Usage encadré</li>
          </PriceCard>

          <PriceCard title="Creator" price="99€ / mois" note="Pour créateurs actifs">
            <li>Scripts avancés</li>
            <li>Templates optimisés</li>
            <li>Workflow simple</li>
          </PriceCard>

          <PriceCard title="Agency" price="299€ / mois" note="Pour équipes & clients">
            <li>Multi-clients</li>
            <li>Organisation complète</li>
            <li>Support prioritaire</li>
          </PriceCard>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-2xl md:text-3xl font-bold">FAQ</h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Faq q="La bêta est gratuite ?">
            Oui, accès test 7 jours avec usage encadré.
          </Faq>

          <Faq q="Ça remplace un scripteur ?">
            Pour 80% des scripts performance oui. L’humain reste utile pour branding très fin.
          </Faq>
        </div>
      </section>

      {/* FEEDBACK */}
      <section id="feedback" className="mx-auto max-w-6xl px-6 py-14">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-bold">Feedback</h2>
          <p className="mt-2 text-white/70">
            Aide-nous à améliorer UGC GROWTH pendant la bêta.
          </p>

          <div className="mt-6 flex gap-4">
            <a
              href="mailto:feedback@ugcgrowth.com"
              className="rounded-xl bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700"
            >
              Envoyer un feedback
            </a>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-white/50">
        © {new Date().getFullYear()} UGC GROWTH
      </footer>

    </main>
  );
}

/* COMPONENTS */
function MiniCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <div className="text-sm text-white/60">{title}</div>
      <div className="mt-2 text-white/80">{children}</div>
    </div>
  );
}

function Feature({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="font-semibold">{title}</div>
      <div className="mt-2 text-white/70">{children}</div>
    </div>
  );
}

function PriceCard({
  title,
  price,
  note,
  children,
}: {
  title: string;
  price: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-baseline justify-between">
        <div className="text-lg font-semibold">{title}</div>
        <div className="text-purple-300 font-semibold">{price}</div>
      </div>
      <div className="mt-2 text-sm text-white/60">{note}</div>
      <ul className="mt-4 space-y-2 text-white/75 list-disc pl-5">{children}</ul>
    </div>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
      <div className="font-semibold">{q}</div>
      <div className="mt-2 text-white/70">{children}</div>
    </div>
  );
}
