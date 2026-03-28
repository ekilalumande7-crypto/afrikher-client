'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import AfrikherCard from '@/components/ui/afrikher-card';
import AfrikherBadge from '@/components/ui/afrikher-badge';
import AfrikherButton from '@/components/ui/afrikher-button';
import { createClient } from '@/lib/supabase/client';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  published_at: string;
  categories: { name: string };
}

export default function FeaturedArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchArticles = async () => {
      const { data } = await supabase
        .from('articles')
        .select('id, title, slug, excerpt, cover_image, published_at, categories(name)')
        .eq('status', 'published')
        .eq('featured', true)
        .order('published_at', { ascending: false })
        .limit(3);

      if (data) {
        setArticles(data as any);
      }
      setLoading(false);
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-afrikher-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-afrikher-dark mb-4">
              Articles À La Une
            </h2>
            <div className="w-24 h-1 bg-afrikher-gold mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-afrikher-gray h-64 mb-4"></div>
                <div className="h-4 bg-afrikher-gray mb-2"></div>
                <div className="h-4 bg-afrikher-gray w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-afrikher-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-afrikher-dark mb-4">
            Articles À La Une
          </h2>
          <div className="w-24 h-1 bg-afrikher-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {articles.map((article) => (
            <Link key={article.id} href={`/journal/${article.slug}`}>
              <AfrikherCard className="group cursor-pointer hover:shadow-xl transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={article.cover_image || '/images/placeholder.jpg'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <AfrikherBadge variant="gold">
                      {(article.categories as any)?.name || 'Article'}
                    </AfrikherBadge>
                  </div>
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

        <div className="text-center">
          <Link href="/journal">
            <AfrikherButton variant="dark" size="lg">
              Voir Tous Les Articles
            </AfrikherButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
