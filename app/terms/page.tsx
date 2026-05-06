import Link from "next/link";

export const metadata = {
  title: "Conditions Générales — UGC GROWTH",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-6 text-white/70">
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm text-white/70 underline underline-offset-4 hover:text-white"
          >
            ← Retour
          </Link>

          <div className="flex gap-2 text-sm">
            <Link
              href="/"
              className="rounded-full border border-white/20 px-3 py-1 hover:border-white/40"
            >
              FR
            </Link>
            <Link
              href="/"
              className="rounded-full border border-white/20 px-3 py-1 hover:border-white/40"
            >
              EN
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-8">
          <div className="text-sm text-white/60">UGC GROWTH</div>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Conditions Générales d’Utilisation
          </h1>
          <p className="mt-3 max-w-3xl text-white/70">
            Les présentes conditions encadrent l’accès et l’utilisation de la
            plateforme UGC Growth, actuellement proposée en accès bêta privé.
          </p>
        </div>

        <div className="mt-8 space-y-5">
          <Section title="1. Accès à la plateforme">
            <p>
              UGC Growth est proposé en accès bêta privé. L’accès peut être
              limité, suspendu ou retiré en cas d’utilisation abusive,
              frauduleuse, excessive ou contraire aux présentes conditions.
            </p>
            <p>
              Certaines fonctionnalités peuvent évoluer, être modifiées,
              restreintes ou supprimées pendant la période bêta afin
              d’améliorer la stabilité et la qualité du service.
            </p>
          </Section>

          <Section title="2. Usage autorisé">
            <p>
              La plateforme permet notamment d’analyser des contenus vidéo ou
              audio, d’identifier des angles marketing, des hooks, des
              structures créatives, et de générer des scripts ou idées de
              campagnes.
            </p>
            <p>
              L’utilisateur s’engage à utiliser la plateforme uniquement dans un
              cadre légal, professionnel et conforme aux droits de tiers.
            </p>
          </Section>

          <Section title="3. Contenus uploadés et responsabilité utilisateur">
            <p>
              L’utilisateur est seul responsable des contenus qu’il importe,
              analyse ou exploite via UGC Growth, notamment les vidéos, audios,
              textes, liens, briefs, marques, produits, images ou tout autre
              élément transmis à la plateforme.
            </p>
            <p>
              L’utilisateur garantit disposer des droits, autorisations ou bases
              légales nécessaires pour utiliser, importer, analyser ou exploiter
              les contenus concernés.
            </p>
            <p>
              UGC Growth ne revendique aucun droit de propriété sur les contenus
              appartenant à l’utilisateur ou à des tiers.
            </p>
          </Section>

          <Section title="4. Contenus générés">
            <p>
              Les analyses, scripts, hooks, angles marketing, scores, briefs,
              recommandations et autres contenus générés sont fournis à titre
              d’aide à la création, à la réflexion marketing et à
              l’organisation.
            </p>
            <p>
              L’utilisateur reste seul responsable de la vérification, de
              l’adaptation et de l’utilisation finale des contenus générés,
              notamment en matière de conformité publicitaire, droits d’auteur,
              droits à l’image, claims produits, règles plateformes et
              obligations légales.
            </p>
            <p>
              UGC Growth ne garantit pas de résultat commercial, de viralité, de
              chiffre d’affaires, de performance publicitaire ou de retour sur
              investissement.
            </p>
          </Section>

          <Section title="5. Propriété intellectuelle">
            <p>
              La plateforme UGC Growth, son nom, son identité visuelle, ses
              interfaces, textes, designs, workflows, structures, fonctionnalités,
              logiques d’organisation, éléments graphiques, contenus, bases de
              données, technologies associées et éléments distinctifs sont
              protégés par les règles relatives à la propriété intellectuelle.
            </p>
            <p>
              L’accès à la plateforme ne confère aucun droit de propriété,
              licence, exploitation ou réutilisation sur les éléments appartenant
              à UGC Growth, sauf accord écrit préalable.
            </p>
          </Section>

          <Section title="6. Interdiction de reproduction, copie ou imitation">
            <p>
              Toute reproduction, copie, imitation, extraction, adaptation,
              réutilisation, distribution, exploitation ou tentative de
              reconstitution non autorisée, totale ou partielle, de la
              plateforme, de son interface, de ses workflows, de ses textes, de
              ses fonctionnalités, de son positionnement, de son design, de ses
              contenus ou de ses éléments distinctifs est strictement interdite.
            </p>
            <p>
              Toute utilisation visant à copier, cloner, reproduire ou créer un
              service substantiellement similaire à partir des éléments observés
              ou accessibles sur UGC Growth pourra faire l’objet de mesures de
              protection, de suspension d’accès et, le cas échéant, de poursuites
              conformément au droit applicable.
            </p>
          </Section>

          <Section title="7. Sécurité et abus">
            <p>
              Toute tentative de fraude, scraping, contournement de limites,
              accès non autorisé, extraction massive, attaque technique,
              multi-comptes abusifs ou utilisation destinée à perturber la
              plateforme est interdite.
            </p>
            <p>
              UGC Growth peut mettre en place des mesures de sécurité, limites
              d’usage, contrôles, logs techniques et systèmes anti-abus afin de
              protéger la plateforme et ses utilisateurs.
            </p>
          </Section>

          <Section title="8. Confidentialité et bêta privée">
            <p>
              Certaines informations accessibles pendant la bêta peuvent
              concerner des fonctionnalités, workflows, interfaces ou éléments
              non encore publics. L’utilisateur s’engage à ne pas divulguer,
              reproduire ou exploiter ces éléments d’une manière contraire aux
              intérêts de UGC Growth.
            </p>
            <p>
              Des échanges plus avancés, démonstrations privées, collaborations
              ou rendez-vous peuvent être encadrés par un accord de
              confidentialité séparé.
            </p>
          </Section>

          <Section title="9. Disponibilité du service">
            <p>
              UGC Growth est fourni en l’état pendant la période bêta. Le service
              peut connaître des interruptions, limitations, maintenances,
              erreurs ou évolutions techniques.
            </p>
            <p>
              UGC Growth ne saurait être tenu responsable des interruptions ou
              limitations liées à des services tiers, APIs, plateformes externes,
              hébergeurs, fournisseurs d’intelligence artificielle ou outils de
              transcription.
            </p>
          </Section>

          <Section title="10. Limitation de responsabilité">
            <p>
              UGC Growth ne peut être tenu responsable des décisions marketing,
              créatives, commerciales, publicitaires ou juridiques prises par
              l’utilisateur à partir des analyses ou contenus générés.
            </p>
            <p>
              L’utilisateur reste responsable de l’usage final du service, des
              contenus exploités, des campagnes lancées et de leur conformité aux
              lois et règles applicables.
            </p>
          </Section>

          <Section title="11. Modification des conditions">
            <p>
              Les présentes conditions peuvent être modifiées à tout moment afin
              de refléter l’évolution du produit, des fonctionnalités, de la bêta
              ou du cadre légal applicable.
            </p>
          </Section>

          <Section title="12. Droit applicable">
            <p>
              Les présentes conditions sont soumises au droit français. En cas de
              litige, les juridictions compétentes françaises seront seules
              compétentes, sauf disposition légale contraire.
            </p>
          </Section>
        </div>

        <p className="mt-10 text-xs text-white/50">
          Dernière mise à jour : 06/05/2026 — © {new Date().getFullYear()} UGC
          GROWTH
        </p>
      </div>
    </main>
  );
}
