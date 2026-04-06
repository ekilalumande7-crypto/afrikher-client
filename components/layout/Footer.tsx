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
    <footer className="bg-[#0A0A0A] text-[#F5F0E8] pt-9 pb-6 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
        {/* Top: Brand + columns in one row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-7 md:gap-9 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="block mb-3">
              <span className="text-[1.45rem] md:text-[1.8rem] font-display font-light tracking-[0.16em] text-[#F5F0E8] uppercase leading-none">
                AFRIKHER
              </span>
            </Link>
            <p className="max-w-[15rem] text-[#F5F0E8]/44 text-[0.72rem] leading-[1.8] font-body font-light tracking-[0.04em]">
              L&apos;élégance au féminin.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-4 font-body text-[0.52rem] font-medium text-[#C9A84C]/58 uppercase tracking-[0.32em]">Navigation</h4>
            <ul className="space-y-2.5 text-[0.68rem] text-[#F5F0E8]/52 font-body tracking-[0.04em]">
              <li><Link href="/magazine" className="hover:text-[#C9A84C] transition-colors duration-300">Magazine</Link></li>
              <li><Link href="/rubriques" className="hover:text-[#C9A84C] transition-colors duration-300">Rubriques</Link></li>
              <li><Link href="/boutique" className="hover:text-[#C9A84C] transition-colors duration-300">Boutique</Link></li>
              <li><Link href="/contact" className="hover:text-[#C9A84C] transition-colors duration-300">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-body text-[0.52rem] font-medium text-[#C9A84C]/58 uppercase tracking-[0.32em]">Contact</h4>
            <ul className="space-y-2.5 text-[0.68rem] text-[#F5F0E8]/52 font-body tracking-[0.04em]">
              <li>{email}</li>
              <li>{address}</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-4 font-body text-[0.52rem] font-medium text-[#C9A84C]/58 uppercase tracking-[0.32em]">Social</h4>
            <div className="flex space-x-4">
              <Link href={socialInstagram} className="text-[#F5F0E8]/42 hover:text-[#C9A84C] transition-colors duration-300">
                <Instagram size={15} strokeWidth={1.5} />
              </Link>
              <Link href={socialLinkedin} className="text-[#F5F0E8]/42 hover:text-[#C9A84C] transition-colors duration-300">
                <Linkedin size={15} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-5 border-t border-white/[0.04]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <span className="text-[0.48rem] text-[#F5F0E8]/34 font-body tracking-[0.22em] uppercase">
              © {new Date().getFullYear()} AFRIKHER — Tous droits réservés
            </span>
            <span className="text-[0.52rem] text-[#F5F0E8]/30 font-display italic tracking-[0.04em]">
              AFRIKHER — L&apos;élégance hors du commun
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
