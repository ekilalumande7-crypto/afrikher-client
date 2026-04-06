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

interface MagazineHeroProps {
  loading: boolean;
  latestMagazine?: Magazine;
  heroImage: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaHref: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaHref: string;
}

export default function MagazineHero({
  loading,
  latestMagazine,
  heroImage,
  heroBadge,
  heroTitle,
  heroSubtitle,
  heroPrimaryCtaLabel,
  heroPrimaryCtaHref,
  heroSecondaryCtaLabel,
  heroSecondaryCtaHref,
}: MagazineHeroProps) {
  return (
    <section className="relative snap-start min-h-screen overflow-hidden bg-[#0A0A0A]">
      <div className="relative z-10 min-h-screen max-w-7xl mx-auto px-4 md:px-8 lg:px-10 pt-24 pb-8 md:pt-28 md:pb-10">
        <div className="relative min-h-[calc(100vh-8.5rem)] overflow-hidden rounded-[2rem] border border-white/45 bg-[#111111] shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:rounded-[2.4rem]">
          {loading ? (
            <div className="absolute inset-0 animate-pulse bg-[#1A1A1A]" />
          ) : (
            <>
              <img
                src={heroImage}
                alt="AFRIKHER Magazine"
                className="absolute inset-0 h-full w-full scale-[1.01] object-cover [filter:grayscale(72%)_brightness(0.5)_contrast(1.08)]"
              />
              <div className="absolute inset-0 bg-black/18" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0.82)_0%,rgba(10,10,10,0.56)_24%,rgba(10,10,10,0.12)_52%,rgba(10,10,10,0.48)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.12)_0%,rgba(10,10,10,0.12)_42%,rgba(10,10,10,0.34)_78%,rgba(10,10,10,0.58)_100%)]" />
            </>
          )}

          <div className="relative z-10 grid min-h-[calc(100vh-8.5rem)] grid-cols-1 gap-8 px-8 py-8 md:px-10 md:py-10 lg:grid-cols-[1.25fr_0.75fr] lg:px-12 lg:py-12">
            <div className="flex flex-col justify-between">
              <div className="max-w-[25rem]">
                <h1 className="fade-in-up hero-title font-body text-[2.4rem] uppercase leading-[0.88] tracking-[-0.05em] text-[#F5F0E8] md:text-[3.4rem] lg:text-[4.65rem] [animation-delay:120ms]">
                  AFRIKHER
                </h1>
                <div className="mt-5 inline-flex items-center gap-3 font-body text-[0.62rem] font-medium uppercase tracking-[0.32em] text-[#F5F0E8]/82">
                  <span className="h-px w-8 bg-[#C9A84C]/55" />
                  MAGAZINE
                </div>
              </div>

              <div className="hidden lg:block max-w-[10rem] pl-6">
                <p className="font-body text-[0.58rem] uppercase leading-[1.35] tracking-[0.18em] text-[#F5F0E8]/82">
                  Portraits
                  <br />
                  Interviews
                  <br />
                  Analyses
                  <br />
                  Entrepreneuriat
                  <br />
                  Leadership
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between text-right">
              <div className="ml-auto max-w-[18rem]">
                <div className="fade-in-up">
                  <span className="inline-flex items-center border border-[#C9A84C]/25 bg-black/10 px-3.5 py-1.5 font-body text-[0.58rem] font-medium uppercase tracking-[0.34em] text-[#C9A84C] backdrop-blur-sm">
                    {heroBadge}
                  </span>
                </div>
              </div>

              <div className="ml-auto max-w-[34rem] pb-6 md:pb-8">
                <h2 className="fade-in-up font-display text-[2.1rem] leading-[0.97] tracking-[-0.025em] text-[#F5F0E8] md:text-[3rem] lg:text-[4.05rem] [animation-delay:160ms]">
                  {heroTitle}
                </h2>

                <p className="fade-in-up mt-5 ml-auto max-w-[25rem] font-body text-[0.9rem] md:text-[0.98rem] leading-[1.7] text-[#F5F0E8]/[0.8] [animation-delay:240ms]">
                  {heroSubtitle}
                </p>

                <div className="fade-in-up mt-7 flex flex-col sm:flex-row flex-wrap justify-end gap-3.5 [animation-delay:320ms]">
                  <a
                    href={heroPrimaryCtaHref}
                    className="btn-gold-glow inline-flex items-center justify-center gap-3 bg-[#C9A84C] px-6 py-3.5 font-body text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A] transition-all duration-300 hover:bg-[#E8C97A]"
                  >
                    <BookOpen size={16} />
                    {heroPrimaryCtaLabel}
                  </a>
                  <Link
                    href={heroSecondaryCtaHref}
                    className="inline-flex items-center justify-center gap-3 border border-[#C9A84C]/55 bg-black/10 px-6 py-3.5 font-body text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#F5F0E8] transition-all duration-300 hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 hover:text-[#C9A84C]"
                  >
                    {heroSecondaryCtaLabel}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="font-body text-[0.55rem] uppercase tracking-[0.35em] text-[#F5F0E8]/35">
            Découvrir
          </span>
          <span className="h-8 w-px bg-[#F5F0E8]/20" />
        </div>
      </div>
    </section>
  );
}
