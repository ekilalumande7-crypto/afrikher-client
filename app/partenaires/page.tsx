import { Handshake, Target, Users, Award, Mail } from 'lucide-react';

const partners = [
  {
    name: "African Business Network",
    category: "Réseau",
    description: "Leader du networking professionnel en Afrique"
  },
  {
    name: "Women in Tech Africa",
    category: "Technologie",
    description: "Communauté des femmes tech africaines"
  },
  {
    name: "StartUp Africa Fund",
    category: "Financement",
    description: "Fonds d'investissement dédié aux startups africaines"
  },
  {
    name: "African Fashion Week",
    category: "Mode",
    description: "La référence de la mode africaine"
  },
  {
    name: "She Leads Africa",
    category: "Leadership",
    description: "Plateforme d'empowerment féminin"
  },
  {
    name: "Impact Hub Dakar",
    category: "Innovation",
    description: "Espace de coworking et d'innovation"
  }
];

const partnershipTypes = [
  {
    icon: Handshake,
    title: "Partenariat Média",
    description: "Augmentez votre visibilité auprès de notre communauté qualifiée d'entrepreneures africaines."
  },
  {
    icon: Target,
    title: "Partenariat Stratégique",
    description: "Collaborons pour créer des contenus exclusifs et des événements à forte valeur ajoutée."
  },
  {
    icon: Users,
    title: "Partenariat Communauté",
    description: "Rejoignez notre réseau et bénéficiez d'un accès privilégié à notre audience engagée."
  },
  {
    icon: Award,
    title: "Sponsoring",
    description: "Soutenez nos événements et initiatives tout en renforçant votre image de marque."
  }
];

export default function PartenairesPage() {
  return (
    <div className="min-h-screen bg-afrikher-cream">
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-afrikher-dark">
          <div className="absolute inset-0 bg-gradient-to-b from-afrikher-dark/80 to-afrikher-dark/40" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-afrikher-cream mb-6">
            Nos Partenaires
          </h1>
          <p className="font-serif text-xl md:text-2xl text-afrikher-cream/90 italic" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Ensemble, nous construisons l'écosystème entrepreneurial de demain
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-afrikher-dark mb-6">
            Pourquoi devenir partenaire ?
          </h2>
          <p className="text-lg text-afrikher-gray max-w-3xl mx-auto leading-relaxed">
            AFRIKHER collabore avec des organisations qui partagent notre vision d'un entrepreneuriat
            féminin africain fort, visible et impactant. Ensemble, créons des synergies puissantes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {partnershipTypes.map((type, index) => (
            <div
              key={index}
              className="bg-white p-8 border border-afrikher-dark/10 hover:border-afrikher-gold transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-afrikher-gold flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <type.icon className="w-8 h-8 text-afrikher-dark" />
              </div>
              <h3 className="font-display text-2xl font-bold text-afrikher-dark mb-4">
                {type.title}
              </h3>
              <p className="text-afrikher-gray leading-relaxed">
                {type.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-20">
          <h2 className="font-display text-4xl font-bold text-afrikher-dark mb-12 text-center">
            Ils nous font confiance
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="bg-white p-8 border border-afrikher-dark/10 hover:border-afrikher-gold transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-afrikher-dark flex items-center justify-center">
                    <span className="text-afrikher-gold font-bold text-xl">
                      {partner.name.charAt(0)}
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-afrikher-gold/10 text-afrikher-dark text-xs uppercase tracking-wider font-semibold">
                    {partner.category}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-afrikher-dark mb-2 group-hover:text-afrikher-gold transition-colors duration-300">
                  {partner.name}
                </h3>
                <p className="text-afrikher-gray text-sm">
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-afrikher-dark p-12 md:p-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-4xl font-bold text-afrikher-cream mb-6">
              Les avantages de notre partenariat
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mt-12 text-afrikher-cream">
              <div>
                <div className="text-5xl font-bold text-afrikher-gold mb-2">50K+</div>
                <p className="text-sm uppercase tracking-wider">Lectrices Engagées</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-afrikher-gold mb-2">15</div>
                <p className="text-sm uppercase tracking-wider">Pays d'Afrique</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-afrikher-gold mb-2">100+</div>
                <p className="text-sm uppercase tracking-wider">Articles Premium</p>
              </div>
            </div>

            <div className="mt-12 space-y-4 text-afrikher-cream/80 leading-relaxed">
              <p>
                En devenant partenaire d'AFRIKHER, vous bénéficiez d'une visibilité exceptionnelle
                auprès d'une audience qualifiée de femmes entrepreneures et décideuses.
              </p>
              <p>
                Notre communauté est composée de professionnelles ambitieuses, influentes et engagées
                dans la transformation économique de l'Afrique.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 bg-white p-12 md:p-16 border border-afrikher-dark/10">
          <div className="max-w-3xl mx-auto text-center">
            <Mail className="w-16 h-16 text-afrikher-gold mx-auto mb-6" />
            <h2 className="font-display text-4xl font-bold text-afrikher-dark mb-6">
              Devenons partenaires
            </h2>
            <p className="text-lg text-afrikher-gray mb-8 leading-relaxed">
              Vous partagez notre vision et souhaitez collaborer avec AFRIKHER ?
              Contactez notre équipe pour discuter des opportunités de partenariat.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/contact"
                className="px-8 py-4 bg-afrikher-gold text-afrikher-dark font-sans font-semibold hover:bg-opacity-90 transition-all duration-300"
              >
                Nous contacter
              </a>
              <a
                href="mailto:partenariats@afrikher.com"
                className="px-8 py-4 border border-afrikher-dark text-afrikher-dark font-sans font-semibold hover:bg-afrikher-dark hover:text-afrikher-cream transition-all duration-300"
              >
                partenariats@afrikher.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
