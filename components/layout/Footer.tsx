import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-24 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="space-y-8">
          <Link href="/" className="text-3xl font-display font-bold tracking-widest text-brand-gold">
            AFRIKHER
          </Link>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs font-body">
            L'élégance hors du commun. Le Business au féminin. Le média de référence pour l'entrepreneuriat féminin en Afrique.
          </p>
          <div className="flex space-x-6">
            <Link href="#" className="text-white/40 hover:text-brand-gold transition-colors">
              <Facebook size={18} strokeWidth={1.5} />
            </Link>
            <Link href="#" className="text-white/40 hover:text-brand-gold transition-colors">
              <Instagram size={18} strokeWidth={1.5} />
            </Link>
            <Link href="#" className="text-white/40 hover:text-brand-gold transition-colors">
              <Linkedin size={18} strokeWidth={1.5} />
            </Link>
          </div>
        </div>

        <div>
          <h4 className="font-display italic text-xl mb-8 text-white">Navigation</h4>
          <ul className="space-y-4 text-sm text-white/60 font-body uppercase tracking-widest">
            <li><Link href="/magazine" className="hover:text-brand-gold transition-colors">Magazine</Link></li>
            <li><Link href="/boutique" className="hover:text-brand-gold transition-colors">Boutique</Link></li>
            <li><Link href="/abonnement" className="hover:text-brand-gold transition-colors">Abonnements</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display italic text-xl mb-8 text-white">Légal</h4>
          <ul className="space-y-4 text-sm text-white/60 font-body uppercase tracking-widest">
            <li><Link href="#" className="hover:text-brand-gold transition-colors">Mentions Légales</Link></li>
            <li><Link href="#" className="hover:text-brand-gold transition-colors">Confidentialité</Link></li>
            <li><Link href="#" className="hover:text-brand-gold transition-colors">CGV</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display italic text-xl mb-8 text-white">Contact</h4>
          <ul className="space-y-4 text-sm text-white/60 font-body uppercase tracking-widest">
            <li>contact@afrikher.com</li>
            <li>Paris, France</li>
            <li>Abidjan, Côte d'Ivoire</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/10 text-center text-[10px] text-white/40 font-body uppercase tracking-[0.2em]">
        © {new Date().getFullYear()} AFRIKHER. Tous droits réservés.
      </div>
    </footer>
  );
}
