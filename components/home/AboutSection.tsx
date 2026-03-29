"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="py-32 px-6 md:px-12 bg-brand-cream text-brand-dark overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          {/* Image Column */}
          <div
            className="relative order-2 lg:order-1"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl relative z-10">
              <img
                src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=1974&auto=format&fit=crop"
                alt="AFRIKHER Vision"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-8 -left-8 w-32 h-32 border-2 border-brand-gold/20 rounded-full z-0 animate-pulse" />
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl z-0" />
            
            {/* Floating Quote */}
            <div
              className="absolute -bottom-6 -left-6 md:-left-12 bg-white p-6 md:p-8 shadow-xl rounded-lg z-20 max-w-xs border border-brand-charcoal/5"
            >
              <p className="font-display italic text-lg md:text-xl text-brand-dark leading-tight">
                "L'élégance est une attitude, le business une passion."
              </p>
              <div className="mt-4 flex items-center space-x-2">
                <div className="w-8 h-[1px] bg-brand-gold" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">Manifeste AFRIKHER</span>
              </div>
            </div>
          </div>

          {/* Text Column */}
          <div
            className="space-y-10 order-1 lg:order-2"
          >
            <div className="space-y-4">
              <span className="text-brand-gold font-body font-bold uppercase tracking-[0.4em] text-xs block">L'Esprit AFRIKHER</span>
              <h2 className="text-5xl md:text-7xl font-display font-bold leading-[0.9] tracking-tighter">
                Redéfinir le luxe <br /> <span className="text-brand-gold italic">au féminin.</span>
              </h2>
            </div>
            
            <div className="space-y-6 text-brand-gray text-lg leading-relaxed font-body">
              <p>
                AFRIKHER n'est pas seulement un magazine. C'est un manifeste pour la femme africaine moderne, audacieuse et visionnaire. Nous célébrons l'excellence, le savoir-faire et l'ambition qui façonnent le continent de demain.
              </p>
              <p className="font-light">
                De la haute couture à la haute finance, nous explorons les univers où les femmes excellent, avec une exigence éditoriale sans compromis. Notre mission est de bâtir un pont entre héritage et futur.
              </p>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center gap-8">
              <Link 
                href="/about" 
                className="group flex items-center space-x-4 text-brand-dark font-bold uppercase tracking-widest text-xs"
              >
                <span>Découvrir notre histoire</span>
                <div className="w-10 h-10 rounded-full border border-brand-dark flex items-center justify-center group-hover:bg-brand-dark group-hover:text-brand-cream transition-all">
                  <ArrowRight size={16} />
                </div>
              </Link>
              
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-cream bg-brand-charcoal overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Reader" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-brand-gray font-bold uppercase tracking-widest">Rejoignez +10k lectrices</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
