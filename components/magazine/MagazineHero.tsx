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
  heroTitle: string;
  heroSubtitle: string;
}

export default function MagazineHero({
  loading,
  latestMagazine,
  heroImage,
  heroTitle,
  heroSubtitle,
}: MagazineHeroProps) {
  return (
    <section className="relative snap-start min-h-screen overflow-hidden bg-[#0A0A0A]">
      {loading ? (
        <div className="absolute inset-0 animate-pulse bg-[#1A1A1A]" />
      ) : (
        <>
          <img
            src={heroImage}
            alt="AFRIKHER Magazine"
            className="absolute inset-0 h-full w-full scale-[1.01] object-cover [filter:grayscale(100%)_brightness(0.52)_contrast(1.1)]"
          />
          <div className="absolute inset-0 bg-black/16" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.08)_0%,rgba(10,10,10,0.18)_42%,rgba(10,10,10,0.46)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0.08)_0%,rgba(10,10,10,0.14)_34%,rgba(10,10,10,0.34)_68%,rgba(10,10,10,0.56)_100%)]" />
        </>
      )}

      <div className="relative z-10 h-full min-h-screen max-w-7xl mx-auto px-6 md:px-10 lg:px-12 flex items-end justify-end">
        <div className="max-w-[38rem] pb-16 md:pb-20 text-right text-[#F5F0E8]">
          <div className="fade-in-up">
            <span className="inline-flex items-center border border-[#C9A84C]/25 bg-black/10 px-3.5 py-1.5 font-body text-[0.58rem] font-medium uppercase tracking-[0.34em] text-[#C9A84C] backdrop-blur-sm">
              AFRIKHER MAGAZINE
            </span>
          </div>

          <h1 className="fade-in-up hero-title mt-5 font-display text-[2.15rem] md:text-[3.2rem] lg:text-[4.05rem] leading-[1.01] tracking-[-0.02em] text-[#F5F0E8] [animation-delay:120ms]">
            {heroTitle}
          </h1>

          <p className="fade-in-up mt-4 ml-auto max-w-[27rem] font-body text-[0.92rem] md:text-[0.98rem] leading-[1.72] text-[#F5F0E8]/[0.78] [animation-delay:220ms]">
            {heroSubtitle}
          </p>

          <div className="fade-in-up mt-7 flex flex-col sm:flex-row flex-wrap justify-end gap-3.5 [animation-delay:320ms]">
            <a
              href="#issues-section"
              className="btn-gold-glow inline-flex items-center justify-center gap-3 bg-[#C9A84C] px-6 py-3.5 font-body text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A] transition-all duration-300 hover:bg-[#E8C97A]"
            >
              <BookOpen size={16} />
              Dernier numero
            </a>
            <Link
              href="/abonnement"
              className="inline-flex items-center justify-center gap-3 border border-[#C9A84C]/55 bg-black/10 px-6 py-3.5 font-body text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#F5F0E8] transition-all duration-300 hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 hover:text-[#C9A84C]"
            >
              S&apos;abonner
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
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
