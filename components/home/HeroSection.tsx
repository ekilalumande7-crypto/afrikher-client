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
      {/* Layer 1: Background Image — z-0, slow zoom on load */}
      <div
        className="absolute inset-0 z-0 w-full h-full bg-cover bg-center grayscale contrast-[1.1]"
        style={{
          backgroundImage: `url(${heroImage})`,
          transition: "transform 12s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          transform: loaded ? "scale(1)" : "scale(1.08)",
        }}
      />

      {/* Layer 2: Dark overlay — z-[1], stronger left with local text shadow zone */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: "linear-gradient(100deg, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.58) 55%, rgba(0,0,0,0.30) 75%, rgba(0,0,0,0.12) 100%)"
        }}
      />

      {/* Subtle gold accent line — left edge, z-[2] */}
      <div className="absolute top-0 left-0 w-[1px] h-full z-[2] bg-gradient-to-b from-transparent via-[#C9A84C]/20 to-transparent" />

      {/* Layer 3: Content — z-[10], ABOVE image and overlay */}
      <div
        className="absolute inset-0 z-[10] flex items-end"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="w-full px-6 md:px-[10%] pb-[10vh] md:pb-[12vh]"
          style={{ pointerEvents: "auto" }}
        >
          {/* All elements share the same left edge — max-w-[460px] for tighter containment */}
          <div className="max-w-[460px]">
            {/* Overline */}
            <div
              className={`mb-3 transition-all duration-1000 ease-out ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "0.3s" }}
            >
              <span className="text-[0.5rem] text-[#C9A84C]/50 tracking-[0.35em] uppercase font-body font-medium">
                Magazine éditorial premium
              </span>
            </div>

            {/* Brand Name — 5-10% smaller than 5rem = ~4.5rem */}
            <h1
              className={`hero-title text-[7.5vw] md:text-[4.5rem] uppercase leading-[0.95] mb-3 gold-shimmer transition-all duration-1000 ease-out ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "0.5s" }}
            >
              {siteName}
            </h1>

            {/* Tagline — slightly smaller */}
            <h2
              className={`font-display font-light text-[1.1rem] md:text-[1.6rem] text-[#F5F0E8] leading-[1.2] mb-3 transition-all duration-1000 ease-out ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "0.7s" }}
            >
              {heroTitle}
            </h2>

            {/* Description — 2 lines max */}
            <p
              className={`font-body text-[0.78rem] font-light text-[#F5F0E8]/45 max-w-[380px] leading-[1.8] tracking-wide mb-7 transition-all duration-1000 ease-out ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "0.9s" }}
            >
              {siteDescription}
            </p>

            {/* CTAs — with glow effect */}
            <div
              className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-4 transition-all duration-1000 ease-out ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "1.1s" }}
            >
              <Link
                href={heroCta1Link}
                className="btn-gold-glow bg-[#C9A84C] text-[#0A0A0A] px-8 py-[15px] font-body font-semibold text-[0.6rem] tracking-[0.2em] uppercase hover:bg-[#E8C97A] transition-all duration-500 ease-out text-center"
              >
                {heroCta1Text}
              </Link>
              <Link
                href={heroCta2Link}
                className="border border-[#C9A84C]/30 text-[#C9A84C] px-8 py-[15px] font-body font-semibold text-[0.6rem] tracking-[0.2em] uppercase hover:bg-[#C9A84C]/10 hover:border-[#C9A84C]/60 transition-all duration-500 ease-out text-center"
              >
                {heroCta2Text}
              </Link>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
