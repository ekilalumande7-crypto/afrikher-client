import Link from 'next/link';

export default function DonneesPage() {
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
          Politique de Partage des Données
        </h1>

        <p className="text-sm text-white/50 mb-12 uppercase tracking-wide">
          Dernière mise à jour : Mars 2026
        </p>

        <div className="space-y-8 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              1. Engagement de Transparence
            </h2>
            <p>
              AFRIKHER s'engage à être transparent sur la manière dont nous partageons vos données
              personnelles. Cette politique explique avec qui nous partageons vos informations et
              pourquoi.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              2. Principe Fondamental
            </h2>
            <p>
              Nous ne vendons jamais vos données personnelles à des tiers. Vos informations ne sont
              partagées que dans les cas strictement nécessaires au fonctionnement de nos services
              ou lorsque la loi l'exige.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              3. Partage avec les Prestataires de Services
            </h2>
            <p className="mb-4">
              Nous partageons certaines données avec des prestataires de services de confiance qui nous
              aident à exploiter notre plateforme :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Hébergement et infrastructure :</strong> Supabase pour le stockage sécurisé
                des données et l'authentification
              </li>
              <li>
                <strong>Paiements :</strong> Stripe pour le traitement sécurisé des paiements et
                abonnements
              </li>
              <li>
                <strong>Communications :</strong> Services d'envoi d'emails pour nos newsletters et
                notifications
              </li>
              <li>
                <strong>Analytiques :</strong> Outils d'analyse pour comprendre l'utilisation de notre
                plateforme (données anonymisées)
              </li>
            </ul>
            <p className="mt-4">
              Ces prestataires sont contractuellement tenus de protéger vos données et ne peuvent les
              utiliser qu'aux fins spécifiées par AFRIKHER.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              4. Partage avec les Partenaires de Contenu
            </h2>
            <p>
              Dans certains cas, nous pouvons partager des données agrégées et anonymisées avec nos
              partenaires de contenu pour des études de marché ou des analyses de tendances. Ces
              données ne permettent pas de vous identifier personnellement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              5. Obligations Légales
            </h2>
            <p className="mb-4">
              Nous pouvons divulguer vos informations personnelles si la loi l'exige ou si nous
              estimons de bonne foi qu'une telle action est nécessaire pour :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Se conformer à une obligation légale ou à une ordonnance judiciaire</li>
              <li>Protéger et défendre les droits ou la propriété d'AFRIKHER</li>
              <li>Prévenir ou enquêter sur d'éventuels actes répréhensibles</li>
              <li>Protéger la sécurité personnelle des utilisateurs ou du public</li>
              <li>Se protéger contre la responsabilité légale</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              6. Transferts Internationaux
            </h2>
            <p>
              Vos données peuvent être transférées et stockées sur des serveurs situés en dehors de
              votre pays de résidence. Dans ces cas, nous nous assurons que des garanties appropriées
              sont en place pour protéger vos données conformément aux normes internationales de
              protection des données.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              7. Fusion ou Acquisition
            </h2>
            <p>
              En cas de fusion, acquisition ou vente de tout ou partie de nos actifs, vos informations
              personnelles pourraient être transférées au nouvel acquéreur. Nous vous informerons de
              tout changement de propriété ou d'utilisation de vos données personnelles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              8. Partage Social
            </h2>
            <p>
              Si vous choisissez de partager du contenu AFRIKHER sur les réseaux sociaux ou d'utiliser
              nos fonctionnalités sociales, certaines de vos informations peuvent être visibles
              publiquement selon les paramètres de confidentialité de ces plateformes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              9. Données Anonymisées
            </h2>
            <p>
              Nous pouvons créer des données statistiques anonymisées à partir de vos informations
              personnelles. Une fois anonymisées, ces données ne peuvent plus vous identifier et
              peuvent être utilisées librement à des fins d'analyse, de recherche ou de marketing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              10. Contrôle de vos Données
            </h2>
            <p className="mb-4">Vous disposez de plusieurs moyens pour contrôler le partage de vos données :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Gérer vos préférences de communication depuis votre compte</li>
              <li>Refuser les cookies non essentiels via les paramètres de votre navigateur</li>
              <li>Demander une copie de vos données ou leur suppression</li>
              <li>Vous opposer à certains types de traitement de données</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              11. Sécurité des Données Partagées
            </h2>
            <p>
              Tous nos partenaires avec qui nous partageons des données sont sélectionnés avec soin
              et doivent respecter des normes strictes de sécurité et de confidentialité. Nous
              effectuons des audits réguliers pour nous assurer de leur conformité.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              12. Modifications de cette Politique
            </h2>
            <p>
              Nous pouvons mettre à jour cette politique de partage des données périodiquement.
              Nous vous informerons de tout changement significatif par email ou via une notification
              sur notre plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-white mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              13. Questions et Réclamations
            </h2>
            <p>
              Pour toute question concernant le partage de vos données ou pour déposer une réclamation,
              contactez notre équipe à :{' '}
              <a href="mailto:privacy@afrikher.com" className="text-afrikher-gold hover:underline">
                privacy@afrikher.com
              </a>
            </p>
            <p className="mt-4">
              Vous avez également le droit de déposer une plainte auprès de l'autorité de protection
              des données de votre pays si vous estimez que vos droits n'ont pas été respectés.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-wrap gap-6 justify-center text-sm text-white/50">
            <Link href="/confidentialite" className="hover:text-afrikher-gold transition-colors duration-300">
              Confidentialité
            </Link>
            <Link href="/conditions" className="hover:text-afrikher-gold transition-colors duration-300">
              Conditions d'utilisation
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
