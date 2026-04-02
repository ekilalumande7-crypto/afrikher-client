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
        console.error("Footer config load error:", err);
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
    <footer className="bg-black text-white py-24 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="space-y-8">
          <Link href="/" className="text-3xl font-display font-bold tracking-widest text-brand-gold">
            AFRIKHER
          </Link>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs font-body">
            L’élégance hors du commun. Le Business au féminin. Le média de référence pour l’entrepreneuriat féminin en Afrique.
          </p>
          <div className="flex space-x-6">
            <Link href={socialFacebook} className="text-white/40 hover:text-brand-gold transition-colors">
              <Facebook size={18} strokeWidth={1.5} />
            </Link>
            <Link href={socialInstagram} className="text-white/40 hover:text-brand-gold transition-colors">
              <Instagram size={18} strokeWidth={1.5} />
            </Link>
            <Link href={socialLinkedin} className="text-white/40 hover:text-brand-gold transition-colors">
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
            <li>{email}</li>
            {addresses.length > 0 ? (
              addresses.map((addr, i) => <li key={i}>{addr}</li>)
            ) : (
              <>
                <li>Waterloo, Belgique</li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/10 text-center text-[10px] text-white/40 font-body uppercase tracking-[0.2em]">
        © {new Date().getFullYear()} AFRIKHER. Tous droits réservés.
      </div>
    </footer>
  );
}
