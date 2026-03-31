"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface SiteConfig {
  [key: string]: string;
}

export default function HeroSection() {
  const [config, setConfig] = useState<SiteConfig>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('key, value');

        if (data && !error) {
          const configMap: SiteConfig = {};
          data.forEach((item: { key: string; value: string }) => {
            configMap[item.key] = item.value;
          });
          setConfig(configMap);
        }
      } catch (err) {
        console.error("Error fetching site config:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  // Values from CMS with fallbacks
  const heroImage = config.hero_image || "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1974&auto=format&fit=crop";
  const heroTitle = config.hero_title || "Le Business au féminin";
  const heroSubtitle = config.hero_subtitle || "Portraits, interviews et analyses pour les femmes qui bâtissent l'Afrique.";
  const siteName = config.site_name || "AFRIKHER";
  const siteTagline = config.site_tagline || "Bienvenue dans l'univers AFRIKHER";
  const heroDescription = config.site_description || "Le magazine de référence dédié aux femmes africaines qui entreprennent, innovent et inspirent. Des portraits, des récits, une vision.";
  const heroCta1Text = config.hero_cta1_text || "Découvrir le Magazine";
  const heroCta1Link = config.hero_cta1_link || "/magazine";
  const heroCta2Text = config.hero_cta2_text || "Rejoindre la communauté";
  const heroCta2Link = config.hero_cta2_link || "/abonnement";
  const contactEmail = config.contact_email || "contact@afrikher.com";
  const siteUrl = config.site_url || "WWW.AFRIKHER.COM";

  return (
    <section
      className="relative h-screen w-full overflow-hidden bg-[#0A0A0A]"
      style={{ backgroundColor: "#0A0A0A", color: "#F5F0E8" }}
    >
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 grayscale contrast-[1.1]"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(105deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.1) 100%)"
          }}
        />
      </div>

      {/* Bottom Left Content Block */}
      <div
        className="absolute bottom-[15vh] left-[8%] md:left-[12%] max-w-[800px] flex flex-col items-start text-left z-10"
        style={{ position: "absolute", bottom: "15vh", left: "10%", maxWidth: "800px", zIndex: 10 }}
      >
        <div className="mb-4">
          <span className="text-[0.65rem] text-[#9A9A8A] tracking-[0.3em] uppercase font-body">
            — MAGAZINE ÉDITORIAL PREMIUM
          </span>
        </div>
        <h1
          className="hero-title text-[10vw] md:text-[7rem] uppercase leading-none mb-2 animate-gold-shine"
          style={{
            background: "linear-gradient(135deg, #8A6E2F 0%, #C9A84C 25%, #F5F0E8 50%, #C9A84C 75%, #8A6E2F 100%)",
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {siteName}
        </h1>

        <p className="font-display italic font-light text-[1.4rem] text-[#F5F0E8] tracking-[0.05em] mb-4">
          {siteTagline}
        </p>

        <h2
          className="font-display font-normal text-[2rem] md:text-[2.8rem] leading-tight animate-gold-shine"
          style={{
            background: "linear-gradient(135deg, #8A6E2F 0%, #C9A84C 25%, #F5F0E8 50%, #C9A84C 75%, #8A6E2F 100%)",
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {heroTitle}
        </h2>

        <p className="font-body text-[0.9rem] font-light text-[#F5F0E8]/70 max-w-[480px] mt-4 leading-[1.8]">
          {heroDescription}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 mt-10">
          <Link
            href={heroCta1Link}
            className="border border-[#C9A84C] text-[#C9A84C] px-10 py-3.5 font-body text-[0.75rem] tracking-[0.2em] uppercase hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-300"
          >
            {heroCta1Text}
          </Link>
          <Link
            href={heroCta2Link}
            className="border border-[#C9A84C]/60 text-[#C9A84C]/80 px-10 py-3.5 font-body text-[0.75rem] tracking-[0.2em] uppercase hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-300"
          >
            {heroCta2Text}
          </Link>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="absolute bottom-0 left-0 w-full px-10 py-6 flex flex-col items-center justify-center gap-4 z-10">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center">
          <span className="text-[0.6rem] text-[#F5F0E8]/60 tracking-[0.15em] uppercase">
            © 2026 {siteName} — TOUS DROITS RÉSERVÉS
          </span>
          <span className="hidden md:inline text-[0.6rem] text-[#F5F0E8]/40 tracking-[0.15em]">|</span>
          <span className="text-[0.6rem] text-[#F5F0E8]/60 tracking-[0.15em] uppercase">
            DESIGNED BY TECHNOVOLUT INNOVATION FIDEPAY
          </span>
        </div>
        <div className="text-[0.6rem] text-[#F5F0E8]/60 tracking-[0.2em] uppercase text-center">
          {siteUrl}
        </div>
      </footer>
    </section>
  );
}
