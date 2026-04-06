"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";
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
  const address = config.contact_address_1 || "Waterloo, Belgique";
  const socialInstagram = config.social_instagram || "#";
  const socialLinkedin = config.social_linkedin || "#";

  return (
    <footer className="bg-[#0A0A0A] text-[#F5F0E8] pt-12 pb-8 px-6 md:px-10 border-t border-[#C9A84C]/8">
      <div className="max-w-[1200px] mx-auto">
        {/* Top: Brand + columns in one row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <Link href="/" className="block mb-3">
              <span className="text-[1.6rem] md:text-[2rem] font-display font-light tracking-[0.25em] text-[#F5F0E8] uppercase leading-none">
                AFRIKHER
              </span>
            </Link>
            <p className="text-[#F5F0E8]/20 text-[0.7rem] leading-[1.6] font-body font-light tracking-wide max-w-[200px]">
              L&apos;élégance au féminin.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-body text-[0.5rem] font-medium text-[#C9A84C]/40 uppercase tracking-[0.3em] mb-4">Navigation</h4>
            <ul className="space-y-2 text-[0.65rem] text-[#F5F0E8]/30 font-body tracking-wide">
              <li><Link href="/magazine" className="hover:text-[#C9A84C] transition-colors duration-300">Magazine</Link></li>
              <li><Link href="/rubriques" className="hover:text-[#C9A84C] transition-colors duration-300">Rubriques</Link></li>
              <li><Link href="/boutique" className="hover:text-[#C9A84C] transition-colors duration-300">Boutique</Link></li>
              <li><Link href="/contact" className="hover:text-[#C9A84C] transition-colors duration-300">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body text-[0.5rem] font-medium text-[#C9A84C]/40 uppercase tracking-[0.3em] mb-4">Contact</h4>
            <ul className="space-y-2 text-[0.65rem] text-[#F5F0E8]/30 font-body tracking-wide">
              <li>{email}</li>
              <li>{address}</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-body text-[0.5rem] font-medium text-[#C9A84C]/40 uppercase tracking-[0.3em] mb-4">Social</h4>
            <div className="flex space-x-4">
              <Link href={socialInstagram} className="text-[#F5F0E8]/20 hover:text-[#C9A84C] transition-colors duration-300">
                <Instagram size={14} strokeWidth={1.5} />
              </Link>
              <Link href={socialLinkedin} className="text-[#F5F0E8]/20 hover:text-[#C9A84C] transition-colors duration-300">
                <Linkedin size={14} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/[0.04]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <span className="text-[0.45rem] text-[#F5F0E8]/15 font-body tracking-[0.2em] uppercase">
              © {new Date().getFullYear()} AFRIKHER — Tous droits réservés
            </span>
            <span className="text-[0.45rem] text-[#F5F0E8]/10 font-display italic tracking-wide">
              AFRIKHER — L&apos;élégance hors du commun
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
