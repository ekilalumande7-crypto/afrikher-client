'use client';

import Link from 'next/link';
import AfrikherButton from '@/components/ui/afrikher-button';

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-start bg-afrikher-dark text-afrikher-cream overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale brightness-[0.8]"
        style={{
          backgroundImage: "url('/hero-woman.jpg')",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            105deg,
            rgba(0,0,0,0.8) 0%,
            rgba(0,0,0,0.6) 40%,
            rgba(0,0,0,0.3) 70%,
            rgba(0,0,0,0.15) 100%
          )`,
        }}
      />

      <div className="relative z-10 w-full px-6 sm:px-12 md:px-16 lg:px-24 flex items-end h-full pb-16 sm:pb-24">
        <div className="max-w-xl" style={{ marginLeft: '0', marginBottom: '0', paddingLeft: 'clamp(0rem, 3vw, 3rem)', paddingBottom: 'clamp(1rem, 5vw, 3rem)' }}>
          <p
            className="font-sans uppercase tracking-[0.3em] mb-4 animate-fadeIn"
            style={{
              fontSize: 'clamp(0.5rem, 1.5vw, 0.65rem)',
              color: '#9A9A8A',
            }}
          >
            — MAGAZINE ÉDITORIAL PREMIUM
          </p>

          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-4 sm:mb-6 leading-tight text-white">
            AFRIKHER
          </h1>

          <p
            className="text-xl sm:text-2xl mb-2 italic"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              color: '#F5F0E8',
            }}
          >
            Bienvenue dans l'univers AFRIKHER
          </p>

          <p
            className="mb-4 sm:mb-6"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(1.4rem, 4vw, 2.1rem)',
              letterSpacing: '0.05em',
              fontWeight: 400,
              background: 'linear-gradient(90deg, #D4AF37 0%, #F4E8C1 25%, #D4AF37 50%, #F4E8C1 75%, #D4AF37 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmer 20s linear infinite'
            }}
          >
            Le Business Au Féminin
          </p>

          <p
            className="font-sans mb-8 sm:mb-12 leading-relaxed"
            style={{
              fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
              fontWeight: 300,
              color: 'rgba(245, 240, 232, 0.7)',
              maxWidth: '480px',
              lineHeight: '1.8',
              marginTop: '12px',
            }}
          >
            Le magazine de référence dédié aux femmes africaines<br />
            qui entreprennent, innovent et inspirent.<br />
            Des portraits, des récits, une vision.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link href="/journal">
              <AfrikherButton variant="gold" size="lg">
                DÉCOUVRIR LE JOURNAL
              </AfrikherButton>
            </Link>
            <a
              href="https://chat.whatsapp.com/LN308xKIo7M93Ag7TywM9P?mode=gi_t"
              target="_blank"
              rel="noopener noreferrer"
            >
              <AfrikherButton variant="outline" size="lg">
                REJOINDRE LA COMMUNAUTÉ
              </AfrikherButton>
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 md:bottom-8 md:right-8 z-20 text-right">
        <p
          className="font-sans uppercase leading-relaxed hidden sm:block"
          style={{
            fontSize: 'clamp(0.45rem, 1vw, 0.55rem)',
            color: 'rgba(245, 240, 232, 0.5)',
            letterSpacing: '0.05em',
          }}
        >
          © 2026 AFRIKHER — TOUS DROITS RÉSERVÉS<br />
          DESIGNED BY TECHNOVOLUT INNOVATION FIPAY<br />
          <a
            href="https://www.afrikher.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-afrikher-gold transition-colors duration-300"
          >
            WWW.AFRIKHER.COM
          </a>
        </p>
        <p
          className="font-sans uppercase leading-relaxed sm:hidden text-[0.45rem]"
          style={{
            color: 'rgba(245, 240, 232, 0.5)',
            letterSpacing: '0.05em',
          }}
        >
          © 2026 AFRIKHER
        </p>
      </div>

    </section>
  );
}
