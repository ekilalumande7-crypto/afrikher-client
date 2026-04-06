"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Footer() {
  const [config, setConfig] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadConfig() {
      try {
        const { data } = await supabase
          .from("site_config")
          .select("key, value")
          .or("key.like.contact_%,key.like.social_%");
        const map: Record<string, string> = {};
        data?.forEach((row: { key: string; value: string }) => {
          map[row.key] = row.value || "";
        });
        setConfig(map);
      } catch (err) {
        console.error("Footer config error:", err);
      }
    }
    loadConfig();
  }, []);

  const email = config.contact_email || "contact@afrikher.com";
  const addresses = [
    config.contact_address_1,
    config.contact_address_2,
    config.contact_address_3,
  ].filter(Boolean);
  const socialInstagram = config.social_instagram || "#";
  const socialFacebook = config.social_facebook || "#";
  const socialLinkedin = config.social_linkedin || "#";

  return (
    <footer className="bg-[#0A0A0A] text-[#F5F0E8] pt-24 pb-12 px-6 md:px-12 border-t border-[#C9A84C]/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="text-2xl font-display font-light tracking-[0.3em] text-[#F5F0E8] uppercase">
              AFRIKHER
            </Link>
            <p className="text-[#F5F0E8]/30 text-[0.8rem] leading-[1.8] font-body font-light max-w-xs">
              L&apos;élégance hors du commun. Le Business au féminin.
            </p>
            <div className="flex space-x-5">
              <Link href={socialFacebook} className="text-[#F5F0E8]/20 hover:text-[#C9A84C] transition-colors duration-300">
                <Facebook size={16} strokeWidth={1.5} />
              </Link>
              <Link href={socialInstagram} className="text-[#F5F0E8]/20 hover:text-[#C9A84C] transition-colors duration-300">
                <Instagram size={16} strokeWidth={1.5} />
              </Link>
              <Link href={socialLinkedin} className="text-[#F5F0E8]/20 hover:text-[#C9A84C] transition-colors duration-300">
                <Linkedin size={16} strokeWidth={1.5} />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-body text-[0.6rem] font-medium text-[#C9A84C]/50 uppercase tracking-[0.3em] mb-8">Navigation</h4>
            <ul className="space-y-4 text-[0.75rem] text-[#F5F0E8]/40 font-body tracking-wide">
              <li><Link href="/magazine" className="hover:text-[#C9A84C] transition-colors duration-300">Magazine</Link></li>
              <li><Link href="/rubriques" className="hover:text-[#C9A84C] transition-colors duration-300">Les Rubriques</Link></li>
              <li><Link href="/boutique" className="hover:text-[#C9A84C] transition-colors duration-300">Boutique</Link></li>
              <li><Link href="/abonnement" className="hover:text-[#C9A84C] transition-colors duration-300">Abonnement</Link></li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="font-body text-[0.6rem] font-medium text-[#C9A84C]/50 uppercase tracking-[0.3em] mb-8">Légal</h4>
            <ul className="space-y-4 text-[0.75rem] text-[#F5F0E8]/40 font-body tracking-wide">
              <li><Link href="#" className="hover:text-[#C9A84C] transition-colors duration-300">Mentions Légales</Link></li>
              <li><Link href="#" className="hover:text-[#C9A84C] transition-colors duration-300">Confidentialité</Link></li>
              <li><Link href="#" className="hover:text-[#C9A84C] transition-colors duration-300">CGV</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body text-[0.6rem] font-medium text-[#C9A84C]/50 uppercase tracking-[0.3em] mb-8">Contact</h4>
            <ul className="space-y-4 text-[0.75rem] text-[#F5F0E8]/40 font-body tracking-wide">
              <li>{email}</li>
              {addresses.length > 0 ? (
                addresses.map((addr, i) => <li key={i}>{addr}</li>)
              ) : (
                <li>Waterloo, Belgique</li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-[0.55rem] text-[#F5F0E8]/20 font-body tracking-[0.2em] uppercase">
            © {new Date().getFullYear()} AFRIKHER — Tous droits réservés
          </span>
          <span className="text-[0.55rem] text-[#F5F0E8]/15 font-body tracking-[0.15em] uppercase">
            Designed by TECHNOVOLUT
          </span>
        </div>
      </div>
    </footer>
  );
}
