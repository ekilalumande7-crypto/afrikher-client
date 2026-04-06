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
      {/* Layer 1: Background Image — z-0 */}
      <div
        className="absolute inset-0 z-0 w-full h-full bg-cover bg-center grayscale contrast-[1.1] scale-105"
        style={{
          backgroundImage: `url(${heroImage})`,
          transition: "transform 8s ease-out",
          ...(loaded ? { transform: "scale(1)" } : {}),
        }}
      />

      {/* Layer 2: Dark overlay — z-[1], stronger left/center-left */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: "linear-gradient(100deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.82) 30%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.30) 75%, rgba(0,0,0,0.15) 100%)"
        }}
      />

      {/* Subtle gold accent line — left edge, z-[2] */}
      <div className="absolute top-0 left-0 w-[1px] h-full z-[2] bg-gradient-to-b from-transparent via-[#C9A84C]/20 to-transparent" />

      {/* Layer 3: Content — z-[10], ABOVE image and overlay
          Single column container with consistent left alignment */}
      <div
        className="absolute inset-0 z-[10] flex items-end"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="w-full px-6 md:px-[10%] pb-[10vh] md:pb-[12vh]"
          style={{ pointerEvents: "auto" }}
        >
          {/* All elements share the same left edge — single column axis */}
          <div className="max-w-[480px]">
            {/* Overline */}
            <div
              className={`mb-4 transition-all duration-1000 ease-out ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "0.3s" }}
            >
              <span className="text-[0.55rem] text-[#C9A84C]/60 tracking-[0.35em] uppercase font-body font-medium">
                Magazine éditorial premium
              </span>
            </div>

            {/* Brand Name — contained, net, above everything */}
            <h1
              className={`hero-title text-[8.5vw] md:text-[5rem] uppercase leading-[0.95] mb-4 gold-shimmer transition-all duration-1000 ease-out ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "0.5s" }}
            >
              {siteName}
            </h1>

            {/* Tagline */}
            <h2
              className={`font-display font-light text-[1.2rem] md:text-[1.8rem] text-[#F5F0E8] leading-[1.2] mb-4 transition-all duration-1000 ease-out ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "0.7s" }}
            >
              {heroTitle}
            </h2>

            {/* Description */}
            <p
              className={`font-body text-[0.82rem] font-light text-[#F5F0E8]/50 max-w-[400px] leading-[1.8] tracking-wide mb-8 transition-all duration-1000 ease-out ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "0.9s" }}
            >
              {siteDescription}
            </p>

            {/* CTAs */}
            <div
              className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-4 transition-all duration-1000 ease-out ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "1.1s" }}
            >
              <Link
                href={heroCta1Link}
                className="bg-[#C9A84C] text-[#0A0A0A] px-9 py-[16px] font-body font-semibold text-[0.65rem] tracking-[0.2em] uppercase hover:bg-[#E8C97A] hover:shadow-[0_0_30px_rgba(201,168,76,0.25)] transition-all duration-500 ease-out text-center"
              >
                {heroCta1Text}
              </Link>
              <Link
                href={heroCta2Link}
                className="border border-[#C9A84C]/40 text-[#C9A84C] px-9 py-[16px] font-body font-semibold text-[0.65rem] tracking-[0.2em] uppercase hover:bg-[#C9A84C]/10 hover:border-[#C9A84C] transition-all duration-500 ease-out text-center"
              >
                {heroCta2Text}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator — z-[10] */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[10] transition-all duration-1000 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: "1.5s" }}
      >
        <span className="text-[0.5rem] text-[#F5F0E8]/25 tracking-[0.3em] uppercase font-body">Découvrir</span>
        <div className="w-[1px] h-6 bg-gradient-to-b from-[#C9A84C]/30 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
