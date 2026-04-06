"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface SiteConfig {
  [key: string]: string;
}

export default function HeroSection() {
  const [config, setConfig] = useState<SiteConfig>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from("site_config")
          .select("key, value");

        if (data && !error) {
          const configMap: SiteConfig = {};
          data.forEach((item: { key: string; value: string }) => {
            configMap[item.key] = item.value;
          });
          setConfig(configMap);
        }
      } catch (err) {
        console.error("Error fetching site config:", err);
      }
    };
    fetchConfig();
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // CMS values with fallbacks
  const heroImage = config.hero_image || "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1974&auto=format&fit=crop";
  const siteName = config.site_name || "AFRIKHER";
  const heroTitle = config.hero_title || "Le Business au féminin";
  const siteDescription = config.site_description || "L'excellence entrepreneuriale africaine, racontée avec audace et raffinement.";
  const heroCta1Text = config.hero_cta1_text || "Découvrir le Magazine";
  const heroCta1Link = config.hero_cta1_link || "/magazine";
  const heroCta2Text = config.hero_cta2_text || "S'abonner";
  const heroCta2Link = config.hero_cta2_link || "/abonnement";

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#0A0A0A]">
      {/* Background Image — grayscale, high contrast */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center grayscale contrast-[1.1] scale-105"
        style={{
          backgroundImage: `url(${heroImage})`,
          transition: "transform 8s ease-out",
          ...(loaded ? { transform: "scale(1)" } : {}),
        }}
      />

      {/* Dark overlay — stronger on left/center-left for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(100deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.80) 30%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.30) 75%, rgba(0,0,0,0.15) 100%)"
        }}
      />

      {/* Subtle gold accent line — left edge */}
      <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#C9A84C]/20 to-transparent" />

      {/* Content — Bottom Left, controlled width */}
      <div className="absolute bottom-[12vh] md:bottom-[15vh] left-[6%] md:left-[10%] max-w-[560px] z-10">
        {/* Overline */}
        <div
          className={`mb-8 transition-all duration-1000 ease-out ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "0.3s" }}
        >
          <span className="text-[0.6rem] text-[#C9A84C]/60 tracking-[0.4em] uppercase font-body font-medium">
            Magazine éditorial premium
          </span>
        </div>

        {/* Brand Name — reduced size, tighter spacing, max-width constrained */}
        <h1
          className={`hero-title text-[10vw] md:text-[6rem] uppercase leading-none mb-6 gold-shimmer transition-all duration-1000 ease-out ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "0.5s", maxWidth: "520px" }}
        >
          {siteName}
        </h1>

        {/* Tagline — one strong phrase */}
        <h2
          className={`font-display font-light text-[1.3rem] md:text-[2rem] text-[#F5F0E8] leading-[1.2] mb-8 transition-all duration-1000 ease-out ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "0.7s" }}
        >
          {heroTitle}
        </h2>

        {/* Description — short, emotional */}
        <p
          className={`font-body text-[0.85rem] font-light text-[#F5F0E8]/50 max-w-[420px] leading-[1.9] tracking-wide transition-all duration-1000 ease-out ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "0.9s" }}
        >
          {siteDescription}
        </p>

        {/* CTAs — taller, aligned, smoother hover */}
        <div
          className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-5 mt-14 transition-all duration-1000 ease-out ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "1.1s" }}
        >
          {/* CTA Primary — Gold filled, taller */}
          <Link
            href={heroCta1Link}
            className="bg-[#C9A84C] text-[#0A0A0A] px-10 py-[18px] font-body font-semibold text-[0.7rem] tracking-[0.2em] uppercase hover:bg-[#E8C97A] hover:shadow-[0_0_30px_rgba(201,168,76,0.25)] transition-all duration-500 ease-out text-center"
          >
            {heroCta1Text}
          </Link>
          {/* CTA Secondary — Outline gold, taller */}
          <Link
            href={heroCta2Link}
            className="border border-[#C9A84C]/40 text-[#C9A84C] px-10 py-[18px] font-body font-semibold text-[0.7rem] tracking-[0.2em] uppercase hover:bg-[#C9A84C]/10 hover:border-[#C9A84C] transition-all duration-500 ease-out text-center"
          >
            {heroCta2Text}
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 transition-all duration-1000 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "1.5s" }}
      >
        <span className="text-[0.5rem] text-[#F5F0E8]/30 tracking-[0.3em] uppercase font-body">Découvrir</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-[#C9A84C]/40 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
