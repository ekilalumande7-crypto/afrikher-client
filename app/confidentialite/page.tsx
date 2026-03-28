import Link from 'next/link';

export default function ConfidentialitePage() {
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
          Politique de Confidentialité
        </h1>

        <p className="text-sm text-white/50 mb-12 uppercase tracking-wide">
          Dernière mise à jour : Mars 2026
        </p>

        <div className="space-y-8 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              1. Introduction
            </h2>
            <p>
              AFRIKHER s'engage à protéger la confidentialité de vos informations personnelles.
              Cette politique décrit comment nous collectons, utilisons et protégeons vos données
              lorsque vous utilisez notre plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              2. Informations Collectées
            </h2>
            <p className="mb-4">Nous collectons les informations suivantes :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Informations d'identification (nom, adresse e-mail)</li>
              <li>Informations de navigation (pages visitées, durée de visite)</li>
              <li>Préférences de contenu et d'abonnement</li>
              <li>Données de communication (messages, commentaires)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              3. Utilisation des Données
            </h2>
            <p className="mb-4">Vos données sont utilisées pour :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personnaliser votre expérience sur notre plateforme</li>
              <li>Vous envoyer des newsletters et communications pertinentes</li>
              <li>Améliorer nos services et contenus</li>
              <li>Répondre à vos demandes et questions</li>
              <li>Assurer la sécurité de notre plateforme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              4. Protection des Données
            </h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles
              appropriées pour protéger vos données personnelles contre tout accès non autorisé,
              modification, divulgation ou destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              5. Partage des Informations
            </h2>
            <p>
              Nous ne vendons, n'échangeons ni ne transférons vos informations personnelles à des
              tiers sans votre consentement, sauf dans les cas requis par la loi ou pour protéger
              nos droits légaux.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              6. Cookies
            </h2>
            <p>
              Notre site utilise des cookies pour améliorer votre expérience. Vous pouvez configurer
              votre navigateur pour refuser les cookies, mais certaines fonctionnalités du site
              pourraient ne pas fonctionner correctement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              7. Vos Droits
            </h2>
            <p className="mb-4">Vous disposez des droits suivants :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Droit d'accès à vos données personnelles</li>
              <li>Droit de rectification de vos données</li>
              <li>Droit à l'effacement de vos données</li>
              <li>Droit d'opposition au traitement</li>
              <li>Droit à la portabilité de vos données</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              8. Contact
            </h2>
            <p>
              Pour toute question concernant cette politique de confidentialité ou pour exercer vos
              droits, veuillez nous contacter à :{' '}
              <a href="mailto:contact@afrikher.com" className="text-afrikher-gold hover:underline">
                contact@afrikher.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              9. Modifications
            </h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment.
              Les modifications entreront en vigueur dès leur publication sur cette page. Nous vous
              encourageons à consulter régulièrement cette page pour rester informé.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-wrap gap-6 justify-center text-sm text-white/50">
            <Link href="/conditions" className="hover:text-afrikher-gold transition-colors duration-300">
              Conditions d'utilisation
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
