import Link from 'next/link';

export default function ConditionsPage() {
  return (
    <div className="min-h-screen bg-afrikher-dark text-afrikher-cream">
      <div className="max-w-4xl mx-auto px-6 py-32">
        <Link
          href="/"
          className="inline-block mb-8 text-sm uppercase tracking-wider text-afrikher-gold hover:text-white transition-colors duration-300"
        >
          ← Retour à l'accueil
        </Link>

        <h1 className="text-5xl md:text-6xl font-display font-bold text-afrikher-gold mb-6">
          Conditions d'Utilisation
        </h1>

        <p className="text-sm text-white/50 mb-12 uppercase tracking-wide">
          Dernière mise à jour : Mars 2026
        </p>

        <div className="space-y-8 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              1. Acceptation des Conditions
            </h2>
            <p>
              En accédant et en utilisant la plateforme AFRIKHER, vous acceptez d'être lié par ces
              conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser
              notre service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              2. Description du Service
            </h2>
            <p>
              AFRIKHER est un magazine éditorial premium dédié à l'entrepreneuriat féminin africain.
              Nous proposons du contenu éditorial, des articles, des portraits, des analyses et des
              ressources pour les femmes entrepreneures.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              3. Inscription et Compte Utilisateur
            </h2>
            <p className="mb-4">
              Pour accéder à certaines fonctionnalités, vous devrez créer un compte. Vous vous engagez à :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fournir des informations exactes et complètes lors de l'inscription</li>
              <li>Maintenir vos informations à jour</li>
              <li>Protéger la confidentialité de votre mot de passe</li>
              <li>Nous informer immédiatement de tout usage non autorisé de votre compte</li>
              <li>Ne pas transférer votre compte à un tiers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              4. Propriété Intellectuelle
            </h2>
            <p>
              Tous les contenus publiés sur AFRIKHER (textes, images, vidéos, logos, graphiques)
              sont la propriété exclusive d'AFRIKHER ou de ses partenaires. Toute reproduction,
              distribution ou utilisation sans autorisation écrite préalable est strictement interdite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              5. Contenu Utilisateur
            </h2>
            <p className="mb-4">
              Si vous publiez du contenu sur notre plateforme (commentaires, contributions), vous garantissez que :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Vous détenez tous les droits nécessaires sur ce contenu</li>
              <li>Le contenu ne viole aucun droit de propriété intellectuelle</li>
              <li>Le contenu n'est pas diffamatoire, offensant ou illégal</li>
              <li>Vous accordez à AFRIKHER une licence mondiale pour utiliser ce contenu</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              6. Abonnements et Paiements
            </h2>
            <p className="mb-4">
              Certains contenus et services sont accessibles via abonnement payant :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Les prix sont indiqués en devise locale et incluent les taxes applicables</li>
              <li>Les paiements sont traités de manière sécurisée par nos partenaires</li>
              <li>Les abonnements sont renouvelés automatiquement sauf annulation</li>
              <li>Vous pouvez annuler votre abonnement à tout moment depuis votre compte</li>
              <li>Les remboursements sont soumis à notre politique de remboursement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              7. Conduite Interdite
            </h2>
            <p className="mb-4">Il est strictement interdit de :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Utiliser la plateforme à des fins illégales</li>
              <li>Harceler, menacer ou intimider d'autres utilisateurs</li>
              <li>Publier du contenu offensant, discriminatoire ou haineux</li>
              <li>Tenter d'accéder de manière non autorisée à notre système</li>
              <li>Utiliser des robots ou scripts automatisés sans autorisation</li>
              <li>Copier ou redistribuer notre contenu sans permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              8. Limitation de Responsabilité
            </h2>
            <p>
              AFRIKHER s'efforce de fournir des informations exactes, mais ne garantit pas l'exactitude,
              l'exhaustivité ou l'actualité du contenu. Nous ne sommes pas responsables des dommages
              directs ou indirects résultant de l'utilisation de notre plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              9. Résiliation
            </h2>
            <p>
              Nous nous réservons le droit de suspendre ou de résilier votre accès à la plateforme
              à tout moment, sans préavis, en cas de violation de ces conditions d'utilisation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              10. Modifications des Conditions
            </h2>
            <p>
              AFRIKHER se réserve le droit de modifier ces conditions à tout moment. Les modifications
              entreront en vigueur dès leur publication. Votre utilisation continue de la plateforme
              après ces modifications constitue votre acceptation des nouvelles conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              11. Droit Applicable
            </h2>
            <p>
              Ces conditions sont régies par les lois en vigueur. Tout litige sera soumis à la
              juridiction compétente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              12. Contact
            </h2>
            <p>
              Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter à :{' '}
              <a href="mailto:legal@afrikher.com" className="text-afrikher-gold hover:underline">
                legal@afrikher.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-wrap gap-6 justify-center text-sm text-white/50">
            <Link href="/confidentialite" className="hover:text-afrikher-gold transition-colors duration-300">
              Confidentialité
            </Link>
            <Link href="/donnees" className="hover:text-afrikher-gold transition-colors duration-300">
              Partage des données
            </Link>
            <Link href="/" className="hover:text-afrikher-gold transition-colors duration-300">
              Accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
