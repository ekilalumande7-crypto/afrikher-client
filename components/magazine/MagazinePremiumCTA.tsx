import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface MagazinePremiumCTAProps {
  compact?: boolean;
}

export default function MagazinePremiumCTA({
  compact = false,
}: MagazinePremiumCTAProps) {
  return (
    <section className={compact ? "w-full bg-[#0A0A0A] pt-20 pb-10 md:pt-22 md:pb-12" : "bg-[#0A0A0A] pt-24 pb-20 md:pt-28 md:pb-24"}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
        <div className={`${compact ? "max-w-[38rem]" : "max-w-[42rem]"} mx-auto text-center`}>
          <div className={`mx-auto ${compact ? "mb-5 w-14" : "mb-6 w-16"} h-px bg-[#C9A84C]/45`} />
          <span className="inline-flex border border-[#C9A84C]/26 px-3.5 py-1.5 font-body text-[0.6rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
            Le Cercle AFRIKHER
          </span>
          <h2 className={`${compact ? "mt-6 text-[2.2rem] md:text-[3rem] lg:text-[3.6rem]" : "mt-8 text-[2.7rem] md:text-[3.7rem] lg:text-[4.5rem]"} font-display leading-[1.02] tracking-[-0.02em] text-[#F5F0E8]`}>
            Entrez dans le Cercle AFRIKHER.
          </h2>
          <p className={`${compact ? "mt-5 max-w-[31rem] text-[0.92rem] md:text-[1rem] leading-[1.7]" : "mt-6 max-w-[34rem] text-[0.98rem] md:text-[1.06rem] leading-[1.85]"} mx-auto font-body text-[#F5F0E8]/[0.72]`}>
            Retrouvez chaque édition, des contenus exclusifs et un accès
            privilégié à l’univers AFRIKHER.
          </p>

          <div className={`${compact ? "mt-8 gap-3" : "mt-10 gap-4"} flex flex-col sm:flex-row items-center justify-center`}>
            <Link
              href="/abonnement"
              className="btn-gold-glow inline-flex items-center justify-center gap-3 bg-[#C9A84C] px-6 py-3.5 font-body text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A] transition-all duration-300 hover:bg-[#E8C97A]"
            >
              Decouvrir les offres
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-3 border border-[#F5F0E8]/28 px-6 py-3.5 font-body text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#F5F0E8] transition-all duration-300 hover:border-[#C9A84C] hover:text-[#C9A84C]"
            >
              Creer un compte gratuit
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
