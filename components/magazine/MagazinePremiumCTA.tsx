import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function MagazinePremiumCTA() {
  return (
    <section className="bg-[#0A0A0A] pt-24 pb-20 md:pt-28 md:pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
        <div className="max-w-[42rem] mx-auto text-center">
          <div className="mx-auto mb-6 h-px w-16 bg-[#C9A84C]/45" />
          <span className="inline-flex border border-[#C9A84C]/26 px-3.5 py-1.5 font-body text-[0.6rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
            Le Cercle AFRIKHER
          </span>
          <h2 className="mt-8 font-display text-[2.7rem] md:text-[3.7rem] lg:text-[4.5rem] leading-[1.02] tracking-[-0.02em] text-[#F5F0E8]">
            Entrez dans le Cercle AFRIKHER.
          </h2>
          <p className="mt-6 max-w-[34rem] mx-auto font-body text-[0.98rem] md:text-[1.06rem] leading-[1.85] text-[#F5F0E8]/[0.72]">
            Retrouvez chaque édition, des contenus exclusifs et un accès
            privilégié à l’univers AFRIKHER.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
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
