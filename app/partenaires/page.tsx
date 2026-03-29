"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const partners = [
  {
    name: "TECHNOVOLUT INNOVATION",
    role: "Partenaire technologique",
    description: "Solutions digitales et innovation pour les entreprises africaines.",
  },
  {
    name: "FIPAY",
    role: "Partenaire paiement",
    description: "Solutions de paiement sécurisées pour l'Afrique et la diaspora.",
  },
  {
    name: "Devenez Partenaire",
    role: "Votre entreprise ici",
    description: "Rejoignez l'écosystème AFRIKHER et touchez une audience de femmes leaders et entrepreneures.",
  },
];

export default function PartenairesPage() {
  return (
    <main className="min-h-screen bg-brand-cream text-brand-dark">
      <Navbar />

      <section className="pt-40 pb-20 px-6 bg-brand-dark text-brand-cream">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-8">Partenaires</h1>
          <p className="text-brand-gold italic text-xl font-display max-w-2xl mx-auto">
            Ensemble, nous bâtissons un écosystème d'excellence pour l'entrepreneuriat féminin africain.
          </p>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {partners.map((partner, index) => (
            <div
              key={partner.name}
              className="border border-brand-charcoal/10 p-10 text-center hover:border-brand-gold/40 transition-colors duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-brand-dark rounded-full flex items-center justify-center">
                <span className="text-brand-gold font-display font-bold text-xl">
                  {partner.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-xl font-display font-bold mb-2">{partner.name}</h3>
              <span className="text-brand-gold text-xs uppercase tracking-widest block mb-4">{partner.role}</span>
              <p className="text-brand-gray text-sm leading-relaxed">{partner.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 bg-brand-dark text-brand-cream">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-display font-bold mb-8">Devenir Partenaire</h2>
          <p className="text-brand-gray mb-12 font-light leading-relaxed">
            Vous souhaitez associer votre marque à AFRIKHER et toucher une communauté engagée
            de femmes entrepreneures africaines et de la diaspora ? Contactez-nous.
          </p>
          <Link
            href="/contact"
            className="inline-block border border-brand-gold text-brand-gold px-12 py-4 font-body text-xs uppercase tracking-widest hover:bg-brand-gold hover:text-brand-dark transition-all duration-300"
          >
            Nous contacter
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
