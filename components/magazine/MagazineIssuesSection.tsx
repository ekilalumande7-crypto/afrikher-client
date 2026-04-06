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

  return (
    <section className="bg-[#F5F0E8] py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <p className="font-body text-[0.68rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
              Collection editoriale
            </p>
            <h2 className="mt-3 font-display text-[2.5rem] md:text-[3.4rem] leading-[0.96] tracking-[-0.02em] text-[#0A0A0A]">
              Nos numéros
            </h2>
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
            {magazines.map((magazine, index) => (
              <Link
                key={magazine.id}
                href={`/magazine/${magazine.slug}`}
                className={`group flex h-full flex-col transition-transform duration-500 hover:-translate-y-1 ${index === 1 ? "xl:translate-y-6" : ""}`}
              >
                <div className="relative overflow-hidden border border-black/8 bg-[#F1EBDD]">
                  <div className="aspect-[4/5] overflow-hidden">
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
                  <h3 className="mt-3 font-display text-[2rem] md:text-[2.15rem] leading-[1.04] tracking-[-0.015em] text-[#0A0A0A] transition-colors duration-300 group-hover:text-[#8A6E2F]">
                    {magazine.title}
                  </h3>
                  <p className="mt-4 line-clamp-2 font-body text-[0.92rem] leading-[1.8] text-[rgba(10,10,10,0.64)]">
                    {magazine.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-6">
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
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className={`overflow-hidden ${item === 1 ? "xl:translate-y-6" : ""}`}
              >
                <div className="border border-black/8 bg-[#F1EBDD]">
                  <div className="aspect-[4/5] animate-pulse bg-[#E8E0D1]" />
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
