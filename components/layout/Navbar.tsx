'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Accueil', number: '01' },
    { href: '/journal', label: 'Magazine', number: '02' },
    { href: '/boutique', label: 'Rubriques', number: '03' },
    { href: '/qui-sommes-nous', label: 'Qui sommes-nous ?', number: '04' },
    { href: '/blog', label: 'Blog', number: '05' },
    { href: '/abonnements', label: 'Abonnement', number: '06' },
    { href: '/contact', label: 'Contact', number: '07' },
    { href: '/partenaires', label: 'Partenaires', number: '08' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex flex-col items-start group">
              <div className="mb-1 px-4 py-1 bg-gradient-to-r from-[#D4B661] via-[#F4E4A6] to-[#C9A84C] relative overflow-hidden transform -skew-x-12 shadow-[0_4px_15px_rgba(201,168,76,0.4)]">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-60 pointer-events-none"></div>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>
                <span className="block text-[9px] font-sans uppercase tracking-[0.25em] text-afrikher-dark font-bold transform skew-x-12 relative z-10">
                  MAGAZINE
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-afrikher-cream group-hover:text-afrikher-gold transition-colors duration-300">
                AFRIKHER
              </h1>
            </Link>

            <div className="flex items-center space-x-6">
              <button
                onClick={() => setIsAboutOpen(true)}
                className="hidden md:block font-sans text-sm uppercase tracking-wide text-white hover:text-afrikher-gold transition-colors duration-300"
              >
                En savoir plus
              </button>

              <button
                className="flex items-center space-x-2 text-white hover:text-afrikher-gold transition-colors duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menu"
              >
                <Menu className="w-6 h-6" />
                <span className="font-sans text-sm uppercase tracking-wide">Menu</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={cn(
          'fixed inset-0 bg-black z-40 transition-all duration-700 ease-out',
          isMenuOpen ? 'bg-opacity-70 backdrop-blur-md' : 'bg-opacity-0 backdrop-blur-none pointer-events-none'
        )}
        onClick={() => setIsMenuOpen(false)}
      />

      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full sm:w-[500px] bg-black z-50 transition-all duration-700 ease-in-out',
          isMenuOpen ? 'translate-x-0 shadow-[-20px_0_60px_rgba(0,0,0,0.8)]' : 'translate-x-full shadow-none'
        )}
      >
        <div className="flex flex-col h-full">
          <div className={cn(
            "flex items-center justify-between px-6 sm:px-12 pt-12 pb-8 transition-all duration-700 delay-100",
            isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}>
            <h2 className="text-[10px] font-sans uppercase tracking-[0.3em] text-white/40">NAVIGATION</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-afrikher-gold hover:border-afrikher-gold hover:rotate-90 transition-all duration-500"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 sm:px-12 pt-8 sm:pt-16">
            <div className="space-y-0">
              {navLinks.map((link, index) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "group relative block py-4 sm:py-6 transition-all duration-500",
                      isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                    )}
                    style={{
                      transitionDelay: isMenuOpen ? `${150 + index * 80}ms` : '0ms',
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 sm:space-x-8">
                        <span className="text-[11px] font-sans text-white/30 group-hover:text-afrikher-gold transition-colors duration-300 w-6">
                          {link.number}
                        </span>
                        <span
                          className={cn(
                            'font-serif text-2xl sm:text-4xl transition-all duration-500 group-hover:translate-x-2',
                            pathname === link.href
                              ? 'text-afrikher-gold'
                              : 'text-white group-hover:text-afrikher-gold'
                          )}
                          style={{ fontFamily: 'Cormorant Garamond, serif' }}
                        >
                          {link.label}
                        </span>
                      </div>
                      <div
                        className={cn(
                          'w-8 sm:w-16 h-[1px] bg-afrikher-gold transition-all duration-500',
                          pathname === link.href
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'
                        )}
                      />
                    </div>
                  </Link>
                  {index < navLinks.length - 1 && (
                    <div className="relative px-14">
                      <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={cn(
            "px-6 sm:px-12 py-8 sm:py-12 transition-all duration-700 delay-500",
            isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <p className="text-[11px] italic text-white/30 mb-6 sm:mb-8 text-center tracking-wide" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              L'élégance hors du commun.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[9px] text-white/40 font-sans uppercase tracking-wider">
              <Link href="/confidentialite" className="hover:text-afrikher-gold transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                Confidentialité
              </Link>
              <span className="text-white/20">•</span>
              <Link href="/conditions" className="hover:text-afrikher-gold transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                Conditions
              </Link>
              <span className="text-white/20">•</span>
              <Link href="/donnees" className="hover:text-afrikher-gold transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                Données
              </Link>
            </div>
          </div>
        </div>
      </div>

      {isAboutOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-300"
            onClick={() => setIsAboutOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-afrikher-dark border border-afrikher-gold/20 max-w-2xl w-full p-12 relative animate-in fade-in zoom-in-95 duration-300">
              <button
                onClick={() => setIsAboutOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-afrikher-gold hover:border-afrikher-gold hover:rotate-90 transition-all duration-500"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>

              <h2 className="text-3xl md:text-4xl font-display text-afrikher-gold mb-6">
                À propos d'AFRIKHER
              </h2>
              <h3 className="text-xl font-serif text-white mb-6 italic" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Le Magazine.
              </h3>

              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>
                  AFRIKHER est un magazine éditorial premium dédié à l'entrepreneuriat féminin africain.
                  Nous mettons en lumière les femmes qui entreprennent, innovent et transforment l'Afrique
                  d'aujourd'hui et de demain.
                </p>

                <p>
                  À travers des portraits inspirants, des récits authentiques et des analyses business,
                  AFRIKHER célèbre un leadership féminin audacieux, élégant et visionnaire.
                </p>

                <p>
                  Plus qu'un média, AFRIKHER est une plateforme d'inspiration, de visibilité et d'influence
                  pour celles qui osent bâtir leur propre avenir.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
