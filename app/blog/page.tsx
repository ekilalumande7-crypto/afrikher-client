'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: "Comment développer son leadership en tant que femme entrepreneure",
    excerpt: "Le leadership au féminin possède des caractéristiques uniques qui méritent d'être reconnues et cultivées. Découvrez les clés pour affirmer votre style de leadership.",
    category: "Leadership",
    author: "Marie Kouassi",
    date: "15 Mars 2026",
    readTime: "8 min",
    image: "/generated-1774646276440-2mxlp.png"
  },
  {
    id: 2,
    title: "Lever des fonds en Afrique : Guide complet 2026",
    excerpt: "Les opportunités de financement pour les startups africaines n'ont jamais été aussi nombreuses. Voici comment maximiser vos chances de succès.",
    category: "Financement",
    author: "Aïcha Diallo",
    date: "12 Mars 2026",
    readTime: "12 min",
    image: "/generated-1774646276440-2mxlp.png"
  },
  {
    id: 3,
    title: "Tech et Innovation : Les femmes africaines à la conquête du digital",
    excerpt: "De Lagos à Nairobi, les femmes tech transforment le paysage numérique africain. Portraits de pionnières inspirantes.",
    category: "Innovation",
    author: "Fatoumata Sow",
    date: "10 Mars 2026",
    readTime: "10 min",
    image: "/generated-1774646276440-2mxlp.png"
  },
  {
    id: 4,
    title: "Équilibre vie pro / vie perso : Mythe ou réalité ?",
    excerpt: "Comment concilier ambition entrepreneuriale et bien-être personnel ? Des entrepreneures partagent leurs stratégies.",
    category: "Bien-être",
    author: "Nadia Mensah",
    date: "8 Mars 2026",
    readTime: "6 min",
    image: "/generated-1774646276440-2mxlp.png"
  },
  {
    id: 5,
    title: "E-commerce en Afrique : Opportunités et défis",
    excerpt: "Le marché de l'e-commerce africain connaît une croissance explosive. Analyse des tendances et conseils pratiques.",
    category: "E-commerce",
    author: "Aminata Traoré",
    date: "5 Mars 2026",
    readTime: "9 min",
    image: "/generated-1774646276440-2mxlp.png"
  },
  {
    id: 6,
    title: "Networking efficace : Construire son réseau professionnel",
    excerpt: "Le réseau est souvent la clé du succès entrepreneurial. Découvrez comment créer et entretenir des relations professionnelles solides.",
    category: "Réseau",
    author: "Sophie Nkrumah",
    date: "1 Mars 2026",
    readTime: "7 min",
    image: "/generated-1774646276440-2mxlp.png"
  }
];

const categories = ["Tous", "Leadership", "Financement", "Innovation", "Bien-être", "E-commerce", "Réseau"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "Tous" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-afrikher-cream">
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-afrikher-dark">
          <div className="absolute inset-0 bg-gradient-to-b from-afrikher-dark/80 to-afrikher-dark/40" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-afrikher-cream mb-6">
            Notre Blog
          </h1>
          <p className="font-serif text-xl md:text-2xl text-afrikher-cream/90 italic" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Inspiration, conseils et analyses pour entrepreneures ambitieuses
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-afrikher-gray" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-afrikher-dark/20 focus:border-afrikher-gold focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 font-sans text-sm uppercase tracking-wider transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-afrikher-gold text-afrikher-dark'
                    : 'bg-white text-afrikher-dark hover:bg-afrikher-dark hover:text-afrikher-cream border border-afrikher-dark/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white border border-afrikher-dark/10 hover:border-afrikher-gold transition-all duration-300 group"
            >
              <div className="relative h-64 bg-afrikher-dark overflow-hidden">
                <div className="absolute inset-0 bg-afrikher-dark/20 group-hover:bg-afrikher-dark/0 transition-all duration-300" />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-afrikher-gold/10 text-afrikher-dark text-xs uppercase tracking-wider font-semibold">
                    {post.category}
                  </span>
                  <div className="flex items-center text-sm text-afrikher-gray">
                    <Clock className="w-4 h-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>

                <h3 className="font-display text-2xl font-bold text-afrikher-dark mb-3 group-hover:text-afrikher-gold transition-colors duration-300">
                  {post.title}
                </h3>

                <p className="text-afrikher-gray mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-afrikher-dark/10">
                  <div className="flex items-center gap-2 text-sm text-afrikher-gray">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <Link
                    href={`/blog/${post.id}`}
                    className="flex items-center gap-2 text-afrikher-gold font-semibold text-sm hover:gap-3 transition-all duration-300"
                  >
                    Lire plus
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <p className="text-sm text-afrikher-gray mt-3 italic">
                  Par {post.author}
                </p>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-afrikher-gray">
              Aucun article trouvé pour cette recherche.
            </p>
          </div>
        )}
      </section>

      <section className="bg-afrikher-dark text-afrikher-cream py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            Ne manquez aucun article
          </h2>
          <p className="text-lg mb-8 text-afrikher-cream/80">
            Inscrivez-vous à notre newsletter pour recevoir nos derniers articles et conseils exclusifs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-6 py-3 bg-white text-afrikher-dark focus:outline-none"
            />
            <button className="px-8 py-3 bg-afrikher-gold text-afrikher-dark font-semibold hover:bg-opacity-90 transition-all duration-300">
              S'abonner
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
