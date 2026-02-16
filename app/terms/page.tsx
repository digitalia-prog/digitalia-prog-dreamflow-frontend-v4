export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Conditions générales (Bêta)</h1>

        <p className="text-gray-300 mb-6">
          UGC Growth est proposé en version bêta. Certaines fonctionnalités peuvent évoluer.
        </p>

        <div className="space-y-4 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">1. Accès & utilisation</h2>
            <p>Accès réservé aux utilisateurs autorisés. Toute utilisation abusive (scraping, multi-comptes, contournement) peut entraîner une suspension.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">2. Contenus générés</h2>
            <p>Les scripts générés sont fournis “tels quels”. L’utilisateur reste responsable de la vérification (conformité, droits, claims, etc.).</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">3. Sécurité & anti-scam</h2>
            <p>Nous mettons en place des protections (limites, logs, alertes). Toute tentative de fraude ou d’attaque est interdite.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">4. Support</h2>
            <p>Support en mode bêta : prioritaire aux retours et aux bugs bloquants.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">5. Modifications</h2>
            <p>Les présentes CGU peuvent être mises à jour à tout moment.</p>
          </section>
        </div>

        <p className="text-gray-500 mt-10 text-sm">
          Dernière mise à jour : {new Date().toLocaleDateString()}
        </p>
      </div>
    </main>
  );
}

import Link from "next/link";

export const metadata = {
  title: "Conditions Générales — UGC GROWTH",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-white/70 hover:text-white underline underline-offset-4">
          ← Retour
        </Link>

        <h1 className="mt-6 text-3xl md:text-4xl font-bold">Conditions Générales (Bêta)</h1>
        <p className="mt-3 text-white/70">
          Version bêta — document simplifié. (Tu pourras le rendre “legal full” plus tard.)
        </p>

        <div className="mt-8 space-y-6 text-white/80 leading-relaxed">
          <section>
            <h2 className="font-semibold text-white">1) Objet</h2>
            <p>
              UGC GROWTH fournit un dashboard et des outils de génération/organisation (scripts, workflow,
              pages de suivi). En bêta, certaines fonctions peuvent évoluer.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-white">2) Accès bêta</h2>
            <p>
              Accès sur invitation / devis. Nous pouvons limiter ou suspendre l’accès en cas d’abus
              (multi-comptes, scraping, usage non autorisé).
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-white">3) Données & liens workflow</h2>
            <p>
              Les liens (Notion/Sheets/Drive) sont stockés côté navigateur (localStorage) tant qu’il n’y a
              pas de backend. Ne mets pas de liens sensibles si tu partages ton ordinateur.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-white">4) Paiement</h2>
            <p>
              En bêta : paiement sur devis. (Stripe non obligatoire tant que tu fais du “sur devis”.)
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-white">5) Responsabilité</h2>
            <p>
              Les outputs IA doivent être relus. UGC GROWTH ne garantit pas des résultats publicitaires.
            </p>
          </section>
        </div>

        <p className="mt-10 text-xs text-white/50">
          © {new Date().getFullYear()} DreamFlow — UGC GROWTH
        </p>
      </div>
    </main>
  );
}


