'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Search } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import AfrikherCard from '@/components/ui/afrikher-card';
import AfrikherBadge from '@/components/ui/afrikher-badge';
import AfrikherInput from '@/components/ui/afrikher-input';
import { createClient } from '@/lib/supabase/client';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  published_at: string;
  categories: { name: string; slug: string } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function JournalPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const [articlesRes, categoriesRes] = await Promise.all([
        supabase
          .from('articles')
          .select('id, title, slug, excerpt, cover_image, published_at, categories(name, slug)')
          .eq('status', 'published')
          .order('published_at', { ascending: false }),
        supabase
          .from('categories')
          .select('id, name, slug')
          .order('name'),
      ]);

      if (articlesRes.data) setArticles(articlesRes.data as any);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = !selectedCategory || article.categories?.slug === selectedCategory;
    const matchesSearch = !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-afrikher-cream">
      <section className="bg-afrikher-dark text-afrikher-cream py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 text-center">
            Le Journal
          </h1>
          <p className="font-sans text-lg text-afrikher-gray text-center max-w-2xl mx-auto">
            Découvrez nos articles inspirants sur l&apos;entrepreneuriat au féminin,
            le leadership et le business en Afrique et dans la diaspora.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-afrikher-gray" />
            <AfrikherInput
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 font-sans text-sm uppercase tracking-wide transition-all duration-300 ${
                selectedCategory === null
                  ? 'bg-afrikher-gold text-afrikher-dark'
                  : 'bg-white text-afrikher-dark hover:bg-afrikher-gold'
              }`}
            >
              Tous
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-4 py-2 font-sans text-sm uppercase tracking-wide transition-all duration-300 ${
                  selectedCategory === category.slug
                    ? 'bg-afrikher-gold text-afrikher-dark'
                    : 'bg-white text-afrikher-dark hover:bg-afrikher-gold'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white h-64 mb-4"></div>
                <div className="h-4 bg-white mb-2"></div>
                <div className="h-4 bg-white w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-sans text-lg text-afrikher-gray">
              Aucun article trouvé
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <Link key={article.id} href={`/journal/${article.slug}`}>
                <AfrikherCard className="group cursor-pointer hover:shadow-xl transition-all duration-300 h-full">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={article.cover_image || '/images/placeholder.jpg'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {article.categories && (
                      <div className="absolute top-4 left-4">
                        <AfrikherBadge variant="gold">
                          {article.categories.name}
                        </AfrikherBadge>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-xs text-afrikher-gray mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(article.published_at), 'd MMMM yyyy', { locale: fr })}
                    </div>
                    <h3 className="font-display text-xl font-semibold text-afrikher-dark mb-3 group-hover:text-afrikher-gold transition-colors duration-300">
                      {article.title}
                    </h3>
                    <p className="font-sans text-sm text-afrikher-gray line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                </AfrikherCard>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
