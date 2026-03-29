"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function HeroSection() {
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('site_config')
          .select('value')
          .eq('key', 'hero_image')
          .single();
        
        if (data && !error) {
          setHeroImage(data.value);
        }
      } catch (err) {
        console.error("Error fetching hero image:", err);
      }
    };
    fetchConfig();
  }, []);

  // Fallback image if none in Supabase
  const bgImage = heroImage || "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1974&auto=format&fit=crop";

  return (
    <section 
      className="relative h-screen w-full overflow-hidden bg-[#0A0A0A]"
      style={{ backgroundColor: "#0A0A0A", color: "#F5F0E8" }}
    >
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 grayscale contrast-[1.1]"
        style={{ 
          backgroundImage: `url(${bgImage})`,
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
        <div
          className="mb-4"
        >
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
          AFRIKHER
        </h1>
        
        <p
          className="font-display italic font-light text-[1.4rem] text-[#F5F0E8] tracking-[0.05em] mb-4"
        >
          Bienvenue dans l'univers AFRIKHER
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
          Le Business au féminin
        </h2>

        <p
          className="font-body text-[0.9rem] font-light text-[#F5F0E8]/70 max-w-[480px] mt-4 leading-[1.8]"
        >
          Le magazine de référence dédié aux femmes africaines 
          qui entreprennent, innovent et inspirent. 
          Des portraits, des récits, une vision.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-6 mt-10"
        >
          <Link
            href="/magazine"
            className="border border-[#C9A84C] text-[#C9A84C] px-10 py-3.5 font-body text-[0.75rem] tracking-[0.2em] uppercase hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-300"
          >
            Découvrir le Magazine
          </Link>
          <Link
            href="/abonnement"
            className="border border-[#C9A84C]/60 text-[#C9A84C]/80 px-10 py-3.5 font-body text-[0.75rem] tracking-[0.2em] uppercase hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-300"
          >
            REJOINDRE LA COMMUNAUTÉ
          </Link>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="absolute bottom-0 left-0 w-full px-10 py-6 flex flex-col items-center justify-center gap-4 z-10">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center">
          <span className="text-[0.6rem] text-[#F5F0E8]/60 tracking-[0.15em] uppercase">
            © 2026 AFRIKHER — TOUS DROITS RÉSERVÉS
          </span>
          <span className="hidden md:inline text-[0.6rem] text-[#F5F0E8]/40 tracking-[0.15em]">|</span>
          <span className="text-[0.6rem] text-[#F5F0E8]/60 tracking-[0.15em] uppercase">
            DESIGNED BY TECHNOVOLUT INNOVATION FIPAY
          </span>
        </div>
        <div className="text-[0.6rem] text-[#F5F0E8]/60 tracking-[0.2em] uppercase text-center">
          WWW.AFRIKHER.COM
        </div>
      </footer>
    </section>
  );
}
