import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { createClient } from '@/lib/supabase/server';
import AfrikherCard from '@/components/ui/afrikher-card';
import AfrikherBadge from '@/components/ui/afrikher-badge';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from('articles')
    .select('title, excerpt')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (!article) {
    return { title: 'Article non trouvé' };
  }

  return {
    title: `${article.title} | AFRIKHER`,
    description: article.excerpt || undefined,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from('articles')
    .select('*, categories(name, slug), profiles(full_name)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (!article) {
    notFound();
  }

  const { data: relatedArticles } = await supabase
    .from('articles')
    .select('id, title, slug, excerpt, cover_image, published_at, categories(name, slug)')
    .eq('status', 'published')
    .eq('category_id', article.category_id)
    .neq('id', article.id)
    .limit(3);

  return (
    <div className="min-h-screen bg-afrikher-cream">
      <article>
        <div className="relative h-[60vh] min-h-[400px] bg-afrikher-dark">
          <img
            src={article.cover_image || '/images/placeholder.jpg'}
            alt={article.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-afrikher-dark to-transparent"></div>

          <div className="absolute bottom-0 left-0 right-0">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <Link
                href="/journal"
                className="inline-flex items-center text-afrikher-gold hover:text-afrikher-cream transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="font-sans text-sm uppercase tracking-wide">Retour au journal</span>
              </Link>

              {article.categories && (
                <AfrikherBadge variant="gold" className="mb-4">
                  {(article.categories as any).name}
                </AfrikherBadge>
              )}

              <h1 className="font-display text-4xl md:text-6xl font-bold text-afrikher-cream mb-4">
                {article.title}
              </h1>

              <div className="flex items-center text-afrikher-gray font-sans text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                <time dateTime={article.published_at}>
                  {format(new Date(article.published_at), 'd MMMM yyyy', { locale: fr })}
                </time>
                {article.profiles && (
                  <>
                    <span className="mx-2">•</span>
                    <span>Par {(article.profiles as any).full_name}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-display prose-headings:text-afrikher-dark
              prose-p:font-sans prose-p:text-afrikher-charcoal prose-p:leading-relaxed
              prose-a:text-afrikher-gold prose-a:no-underline hover:prose-a:underline
              prose-strong:text-afrikher-dark prose-strong:font-semibold"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </article>

      {relatedArticles && relatedArticles.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-afrikher-dark mb-12 text-center">
              Articles Similaires
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((related: any) => (
                <Link key={related.id} href={`/journal/${related.slug}`}>
                  <AfrikherCard className="group cursor-pointer hover:shadow-xl transition-all duration-300 h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={related.cover_image || '/images/placeholder.jpg'}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {related.categories && (
                        <div className="absolute top-4 left-4">
                          <AfrikherBadge variant="gold">
                            {related.categories.name}
                          </AfrikherBadge>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-lg font-semibold text-afrikher-dark mb-2 group-hover:text-afrikher-gold transition-colors duration-300">
                        {related.title}
                      </h3>
                      <p className="font-sans text-sm text-afrikher-gray line-clamp-2">
                        {related.excerpt}
                      </p>
                    </div>
                  </AfrikherCard>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
