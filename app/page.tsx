import Link from "next/link";

export const metadata = {
  title: "UGC GROWTH",
  description: "Dashboard UGC + Script Engine IA + workflow en un seul outil.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="mx-auto max-w-6xl px-6 py-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-600/80" />
          <div className="leading-tight">
            <div className="font-semibold">UGC GROWTH</div>
            <div className="text-xs text-white/60">Beta</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-4 text-sm">
          <a href="#features" className="text-white/70 hover:text-white">
            Fonctionnalités
          </a>
          <a href="#pricing" className="text-white/70 hover:text-white">
            Prix
          </a>
          <a href="#faq" className="text-white/70 hover:text-white">
            FAQ
          </a>
          <a href="#feedback" className="text-white/70 hover:text-white">
            Feedback
          </a>
          <Link href="/terms" className="text-white/70 hover:text-white">
            CGU
          </Link>
        </nav>

        {/* Lang quick links (site multilang) */}
        <div className="flex items-center gap-2 text-xs">
          <a className="rounded-full border border-white/15 px-3 py-1 text-white/70 hover:text-white hover:border-white/30" href="/?lang=fr">
            FR
          </a>
          <a className="rounded-full border border-white/15 px-3 py-1 text-white/70 hover:text-white hover:border-white/30" href="/?lang=en">
            EN
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 md:p-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/80">
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            Beta — 7 jours gratuit pour tests (API limitée)
          </div>

          <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">
            Le dashboard UGC <span className="text-purple-300">qui génère</span> et organise.
          </h1>

          <p className="mt-4 max-w-2xl text-white/70 md:text-lg">
            Centralise campagnes, créateurs, briefs, et utilise le <b>Script Engine IA</b> (Viral / HAK) pour produire des scripts
            structurés rapidement — sans “site factice”.
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

            <Link
              href="/terms"
              className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white/80 hover:bg-white/5"
            >
              Conditions (CGU)
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <MiniCard title="Script Engine (IA Viral + HAK)">
              Hooks + story + objections + preuves + CTA. Format clair, prêt à tourner.
            </MiniCard>
            <MiniCard title="Workflow agence & créateur">
              Pipeline simple : briefs, creators, scripts, validations, publications.
            </MiniCard>
            <MiniCard title="Multi-langue">
              FR/EN (et extensible) pour servir agences et créateurs internationaux.
            </MiniCard>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Fonctionnalités clés</h2>
            <p className="mt-2 text-white/65 max-w-2xl">
              L’objectif : une démo propre, claire, qui marche — pas un “MVP vide”.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Feature title="Scripts structurés & actionnables">
            Output lisible (HOOK / STORY / PROBLÈME / SOLUTION / PREUVE / CTA), prêt à poster.
          </Feature>
          <Feature title="Viral mode + HAK">
            Ajoute un “hack / twist / angle viral” sans tout réécrire.
          </Feature>
          <Feature title="Organisation UGC">
            Campagnes, créateurs, assets, notes, publication : une base clean.
          </Feature>
          <Feature title="Autosave">
            Tu remplis 2–3 champs, tu génères, et tout reste sauvegardé.
          </Feature>
          <Feature title="API en production">
            Génération réelle via API (pas de “fake output”).
          </Feature>
          <Feature title="Bêta contrôlée">
            Accès test 7 jours, quotas API limités pour éviter les abus.
          </Feature>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-2xl md:text-3xl font-bold">Prix (bêta)</h2>
        <p className="mt-2 text-white/65 max-w-2xl">
          En bêta : on teste avec agences & créateurs, <b>7 jours gratuits</b> + API limitée. Ensuite abonnement.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <PriceCard title="Test bêta" price="0€ / 7 jours" note="API limitée — idéal pour démonstration">
            <li>Accès dashboard</li>
            <li>Script Engine (quotas)</li>
            <li>Feedback prioritaire</li>
          </PriceCard>

          <PriceCard title="Creator" price="À partir de 99€" note="Pour créateurs qui postent beaucoup">
            <li>Plus de générations / mois</li>
            <li>Templates scripts</li>
            <li>Export facile</li>
          </PriceCard>

          <PriceCard title="Agency" price="À partir de 299€" note="Pour équipes & gestion multi-clients">
            <li>Workspace agence</li>
            <li>Pipeline UGC + scripts</li>
            <li>Support prioritaire</li>
          </PriceCard>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-white/70 text-sm">
          Note : tu peux ajuster les prix après test (selon coûts API & valeur perçue).
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-2xl md:text-3xl font-bold">FAQ</h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Faq q="C’est quoi “API limitée” ?">
            Pendant 7 jours, tu as un quota de générations (pour éviter qu’un test vide ton crédit API).
          </Faq>
          <Faq q="Le script engine remplace un scripteur ?">
            Il fait 80% (structure + vitesse). Un humain reste top pour humour, branding fin, nuances extrêmes.
          </Faq>
          <Faq q="Multi-langue : ça marche comment ?">
            Le site peut afficher FR/EN (et plus). Les scripts peuvent être générés dans la langue choisie.
          </Faq>
          <Faq q="Je peux présenter ça à une agence demain ?">
            Oui : dashboard clair + génération réelle + promesse simple = démo crédible.
          </Faq>
        </div>
      </section>

      {/* Feedback */}
      <section id="feedback" className="mx-auto max-w-6xl px-6 py-14">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold">Feedback please 🙏</h2>
          <p className="mt-2 text-white/70 max-w-2xl">
            La bêta sert à optimiser le produit. Si tu testes avec une agence / un créateur, note ce qui manque,
            ce qui te fait gagner du temps, et ce qui doit devenir “premium”.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <a
              className="rounded-xl bg-white/10 border border-white/15 px-6 py-3 font-semibold hover:bg-white/15"
              href="mailto:feedback@ugcgrowth.com?subject=UGC%20GROWTH%20Feedback"
            >
              Envoyer un feedback par email
            </a>
            <Link
              href="/dashboard"
              className="rounded-xl bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-700"
            >
              Retour au dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-white/50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} UGC GROWTH</div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-white">
              CGU
            </Link>
            <a href="#feedback" className="hover:text-white">
              Feedback
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

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
