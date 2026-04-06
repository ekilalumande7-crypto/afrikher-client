"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AboutSection() {
  const [config, setConfig] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadConfig() {
      try {
        const { data } = await supabase
          .from("site_config")
          .select("key, value")
          .or("key.like.about_%,key.like.foundress_%");
        const map: Record<string, string> = {};
        data?.forEach((row: { key: string; value: string }) => {
          map[row.key] = row.value || "";
        });
        setConfig(map);
      } catch (err) {
        console.error("About config error:", err);
      }
    }
    loadConfig();
  }, []);

  const aboutTitle = config.about_title || "Plus qu'un magazine";
  const aboutText = config.about_text || "AFRIKHER est une plateforme d'inspiration, de visibilité et d'influence pour les femmes qui bâtissent l'Afrique de demain.";
  const aboutImage = config.about_image || "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=1974&auto=format&fit=crop";
  const aboutQuote = config.about_quote || "L'élégance est une attitude, le business une passion.";
  const foundressName = config.foundress_name || "Hadassa Hélène EKILA-LUMANDE";
  const foundressTitle = config.foundress_title || "Fondatrice & CEO";

  return (
    <section className="py-32 md:py-40 px-6 md:px-12 bg-[#0A0A0A] text-[#F5F0E8] overflow-hidden relative">
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#C9A84C]/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image Column */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[3/4] overflow-hidden relative">
              <img
                src={aboutImage}
                alt="AFRIKHER Vision"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
              {/* Gold border accent */}
              <div className="absolute inset-0 border border-[#C9A84C]/15 pointer-events-none" />
            </div>

            {/* Floating Quote Card */}
            <div className="absolute -bottom-8 -right-4 md:-right-12 bg-[#0A0A0A] border border-[#C9A84C]/20 p-6 md:p-8 max-w-[280px] z-20">
              <p className="font-display italic text-[1.1rem] md:text-[1.25rem] text-[#F5F0E8]/90 leading-snug">
                &ldquo;{aboutQuote}&rdquo;
              </p>
              <div className="mt-5 flex items-center space-x-3">
                <div className="w-8 h-[1px] bg-[#C9A84C]" />
                <span className="text-[0.55rem] uppercase tracking-[0.2em] font-body font-medium text-[#C9A84C]">
                  {foundressName}
                </span>
              </div>
            </div>
          </div>

          {/* Text Column */}
          <div className="space-y-10 order-1 lg:order-2">
            <div className="space-y-6">
              <span className="text-[#C9A84C] font-body font-medium uppercase tracking-[0.4em] text-[0.6rem] block">
                L&apos;esprit AFRIKHER
              </span>
              <h2 className="text-4xl md:text-6xl font-display font-light leading-[0.95] tracking-tight">
                {aboutTitle.split(" ").slice(0, 2).join(" ")}{" "}
                <span className="italic text-[#C9A84C]">
                  {aboutTitle.split(" ").slice(2).join(" ") || "magazine"}
                </span>
              </h2>
            </div>

            <div className="space-y-6 text-[#F5F0E8]/50 text-[0.95rem] leading-[2] font-body font-light max-w-lg">
              <p>{aboutText}</p>
            </div>

            <div className="pt-4">
              <Link
                href="/qui-sommes-nous"
                className="group inline-flex items-center space-x-4 text-[#F5F0E8] font-body font-medium uppercase tracking-[0.2em] text-[0.65rem] hover:text-[#C9A84C] transition-colors duration-300"
              >
                <span>Découvrir notre histoire</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Foundress mini */}
            <div className="pt-8 border-t border-white/[0.06] flex items-center space-x-4">
              <div>
                <p className="font-body text-[0.7rem] font-medium text-[#F5F0E8]/80 tracking-wide">{foundressName}</p>
                <p className="font-body text-[0.6rem] text-[#C9A84C]/60 tracking-[0.15em] uppercase">{foundressTitle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
