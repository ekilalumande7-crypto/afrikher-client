import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  published_at: string;
}

interface MagazineBlogSectionProps {
  blogPosts: BlogPost[];
}

export default function MagazineBlogSection({
  blogPosts,
}: MagazineBlogSectionProps) {
  const hasPosts = blogPosts.length > 0;

  return (
    <section className="snap-start min-h-screen border-t border-black/[0.06] bg-[#F6F1E8] flex items-center">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-12 pt-24 pb-10 md:pt-28 md:pb-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-5 mb-9 md:mb-10">
          <div>
            <p className="font-body text-[0.68rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
              Regards & analyses
            </p>
            <h2 className="mt-2.5 font-display text-[2.1rem] md:text-[2.65rem] leading-[0.98] tracking-[-0.02em] text-[#0A0A0A]">
              Regards AFRIKHER
            </h2>
            <div className="mt-4 h-px w-14 bg-[#C9A84C]/45" />
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2.5 font-body text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A]/78 transition-all duration-300 hover:text-[#C9A84C]"
          >
            Tous les articles
            <ArrowRight size={14} className="text-[#C9A84C]" />
          </Link>
        </div>

        {hasPosts ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden border border-black/6 bg-white/80 transition-transform duration-500 hover:-translate-y-1"
              >
                <div className="aspect-[4/2.6] overflow-hidden">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="img-zoom h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col px-6 pt-5 pb-6">
                  <div className="flex items-center gap-2 font-body text-[0.62rem] uppercase tracking-[0.22em] text-[rgba(10,10,10,0.52)]">
                    <Clock size={13} className="text-[#C9A84C]" />
                    {new Date(post.published_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <h3 className="mt-3.5 line-clamp-3 font-display text-[1.55rem] md:text-[1.75rem] leading-[1.08] tracking-[-0.015em] text-[#0A0A0A] transition-colors duration-300 group-hover:text-[#8A6E2F]">
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 font-body text-[0.86rem] leading-[1.65] text-[rgba(10,10,10,0.66)]">
                    {post.excerpt}
                  </p>
                  <span className="mt-auto pt-4 inline-flex items-center gap-2 font-body text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[#0A0A0A]/72 transition-colors duration-300 group-hover:text-[#C9A84C]">
                    Lire l&apos;article
                    <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="overflow-hidden border border-black/6 bg-white/80"
              >
                <div className="aspect-[4/2.6] animate-pulse bg-[#E8E0D1]" />
                <div className="space-y-4 px-6 pt-5 pb-6">
                  <div className="h-3 w-36 animate-pulse bg-[#D8C8A1]" />
                  <div className="h-8 w-4/5 animate-pulse bg-[#E8E0D1]" />
                  <div className="h-4 w-full animate-pulse bg-[#ECE4D5]" />
                  <div className="h-4 w-2/3 animate-pulse bg-[#ECE4D5]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
