'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function Footer() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const supabase = createClient();

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase
        .from('site_config')
        .select('key, value')
        .in('key', ['contact_email', 'social_facebook', 'social_instagram', 'social_linkedin']);

      if (data) {
        const configMap = data.reduce((acc, item) => {
          acc[item.key] = item.value || '';
          return acc;
        }, {} as Record<string, string>);
        setConfig(configMap);
      }
    };

    fetchConfig();
  }, []);

  const footerLinks = {
    Magazine: [
      { label: 'Journal', href: '/journal' },
      { label: 'À propos', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    Boutique: [
      { label: 'Boutique', href: '/boutique' },
      { label: 'Livres', href: '/boutique?type=book' },
      { label: 'Bouquets', href: '/boutique?type=bouquet' },
    ],
    Compte: [
      { label: 'Abonnements', href: '/abonnements' },
      { label: 'Connexion', href: '/auth/login' },
      { label: 'Mon compte', href: '/dashboard' },
    ],
  };

  return (
    <footer className="bg-afrikher-dark text-afrikher-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-3xl font-display font-bold text-afrikher-gold mb-4">
              AFRIKHER
            </h2>
            <p className="font-sans text-sm text-afrikher-gray leading-relaxed mb-6">
              L&apos;élégance hors du commun. Le Business au féminin.
            </p>
            {config.contact_email && (
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-afrikher-gold" />
                <a
                  href={`mailto:${config.contact_email}`}
                  className="font-sans text-sm text-afrikher-gray hover:text-afrikher-gold transition-colors duration-300"
                >
                  {config.contact_email}
                </a>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-display text-base font-semibold text-afrikher-gold mb-3">
                  {category}
                </h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="font-sans text-sm text-afrikher-gray hover:text-afrikher-gold transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-afrikher-charcoal pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="font-sans text-sm text-afrikher-gray mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} AFRIKHER. Tous droits réservés.
          </p>

          <div className="flex items-center space-x-6">
            {config.social_facebook && (
              <a
                href={config.social_facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-afrikher-gray hover:text-afrikher-gold transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            )}
            {config.social_instagram && (
              <a
                href={config.social_instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-afrikher-gray hover:text-afrikher-gold transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {config.social_linkedin && (
              <a
                href={config.social_linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-afrikher-gray hover:text-afrikher-gold transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-afrikher-charcoal/50">
          <div className="flex flex-col items-center text-center space-y-3">
            <p className="font-sans text-xs text-afrikher-gray/70 uppercase tracking-wider">
              &copy; 2026 AFRIKHER — TOUS DROITS RÉSERVÉS
            </p>
            <div className="flex items-center space-x-2 font-sans text-xs text-afrikher-gray/70">
              <span>DESIGNED BY TECHNOVOLUT INNOVATION FIPAY</span>
            </div>
            <a
              href="https://www.afrikher.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs text-afrikher-gold/80 hover:text-afrikher-gold transition-colors duration-300 uppercase tracking-wider"
            >
              WWW.AFRIKHER.COM
            </a>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-2 text-xs text-afrikher-gray/60">
              <Link href="/confidentialite" className="hover:text-afrikher-gold transition-colors duration-300">
                Confidentialité
              </Link>
              <span className="text-afrikher-gray/40">•</span>
              <Link href="/conditions" className="hover:text-afrikher-gold transition-colors duration-300">
                Conditions d'utilisation
              </Link>
              <span className="text-afrikher-gray/40">•</span>
              <Link href="/donnees" className="hover:text-afrikher-gold transition-colors duration-300">
                Partage des données
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}