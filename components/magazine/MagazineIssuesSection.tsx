import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

interface Magazine {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image: string;
  price: number;
  currency: string;
  page_count: number;
  status: string;
  published_at: string;
}

interface MagazineIssuesSectionProps {
  magazines: Magazine[];
}

export default function MagazineIssuesSection({
  magazines,
}: MagazineIssuesSectionProps) {
  const hasMagazines = magazines.length > 0;
  const filledMagazines = hasMagazines ? magazines.slice(0, 3) : [];
  const placeholderCount = Math.max(0, 3 - filledMagazines.length);

  return (
    <section id="issues-section" className="snap-start min-h-screen border-t border-black/[0.06] bg-[#F5F0E8] flex items-center">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-12 pt-24 pb-10 md:pt-28 md:pb-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-5 mb-9 md:mb-10">
          <div>
            <p className="font-body text-[0.68rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
              Collection editoriale
            </p>
            <h2 className="mt-2.5 font-display text-[2.25rem] md:text-[2.9rem] leading-[0.98] tracking-[-0.02em] text-[#0A0A0A]">
              Nos numéros
            </h2>
            <div className="mt-4 h-px w-14 bg-[#C9A84C]/45" />
          </div>
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2.5 font-body text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A]/78 transition-all duration-300 hover:text-[#C9A84C]"
          >
            Voir la boutique
            <ArrowRight size={14} className="text-[#C9A84C]" />
          </Link>
        </div>

        {hasMagazines ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {filledMagazines.map((magazine, index) => (
              <Link
                key={magazine.id}
                href={`/magazine/${magazine.slug}`}
                className="group flex h-full flex-col transition-transform duration-500 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden border border-black/8 bg-[#F1EBDD]">
                  <div className="aspect-[4/4.5] overflow-hidden">
                    <img
                      src={magazine.cover_image}
                      alt={magazine.title}
                      className="img-zoom h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex flex-1 flex-col border-x border-b border-black/8 bg-white/88 px-6 pt-5 pb-6">
                  <p className="font-body text-[0.58rem] font-medium uppercase tracking-[0.3em] text-[#C9A84C]/80">
                    Magazine AFRIKHER
                  </p>
                  <h3 className="mt-3 line-clamp-2 font-display text-[1.7rem] md:text-[1.95rem] leading-[1.06] tracking-[-0.015em] text-[#0A0A0A] transition-colors duration-300 group-hover:text-[#8A6E2F]">
                    {magazine.title}
                  </h3>
                  <p className="mt-3.5 line-clamp-3 font-body text-[0.88rem] leading-[1.7] text-[rgba(10,10,10,0.64)]">
                    {magazine.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-5">
                    <span className="font-body text-[0.62rem] uppercase tracking-[0.24em] text-[rgba(10,10,10,0.46)]">
                      {magazine.page_count} pages
                    </span>
                    <span className="inline-flex items-center gap-2 font-body text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[#0A0A0A] transition-colors duration-300 group-hover:text-[#C9A84C]">
                      Voir le numero
                      <BookOpen size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            {Array.from({ length: placeholderCount }).map((_, index) => (
              <div
                key={`placeholder-${index}`}
                className="flex h-full flex-col"
              >
                <div className="relative overflow-hidden border border-black/8 bg-[#F1EBDD]">
                  <div className="aspect-[4/4.5] bg-[linear-gradient(180deg,#E8DDC8_0%,#F6F0E5_100%)]" />
                </div>
                <div className="flex flex-1 flex-col border-x border-b border-black/8 bg-white/88 px-6 pt-5 pb-6">
                  <p className="font-body text-[0.58rem] font-medium uppercase tracking-[0.3em] text-[#C9A84C]/80">
                    Magazine AFRIKHER
                  </p>
                  <h3 className="mt-3 line-clamp-2 font-display text-[1.7rem] md:text-[1.95rem] leading-[1.06] tracking-[-0.015em] text-[#0A0A0A]">
                    Nouveau numéro bientôt
                  </h3>
                  <p className="mt-3.5 line-clamp-3 font-body text-[0.88rem] leading-[1.7] text-[rgba(10,10,10,0.64)]">
                    La prochaine édition AFRIKHER arrive bientôt avec une nouvelle couverture, des portraits et des analyses exclusives.
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-5">
                    <span className="font-body text-[0.62rem] uppercase tracking-[0.24em] text-[rgba(10,10,10,0.46)]">
                      Bientôt
                    </span>
                    <span className="inline-flex items-center gap-2 font-body text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[#0A0A0A]/55">
                      Prochain numéro
                      <BookOpen size={13} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="overflow-hidden"
              >
                <div className="border border-black/8 bg-[#F1EBDD]">
                  <div className="aspect-[4/4.5] animate-pulse bg-[#E8E0D1]" />
                </div>
                <div className="space-y-4 border-x border-b border-black/8 bg-white/88 px-6 pt-5 pb-6">
                  <div className="h-3 w-24 animate-pulse bg-[#D8C8A1]" />
                  <div className="h-8 w-3/4 animate-pulse bg-[#E8E0D1]" />
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
