'use client';

import { motion } from "motion/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function HeroSection() {
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const supabase = createClient();

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

  const bgImage = heroImage || "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1974&auto=format&fit=crop";

  return (
    <section 
      className="relative h-screen w-full overflow-hidden bg-[#0A0A0A]"
      style={{ backgroundColor: "#0A0A0A", color: "#F5F0E8" }}
    >
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 grayscale contrast-[1.1]"
        style={{ backgroundImage: \`url(\${bgImage})\` }}
      >
        <div 
          className="absolute inset-0" 
          style={{
            background: "linear-gradient(105deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.1) 100%)"
          }}
        />
      </div>

      <div 
        className="absolute bottom-[15vh] left-[8%] md:left-[12%] max-w-[800px] flex flex-col items-start text-left z-10"
      >
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mb-4"
        >
          <span className="text-[0.65rem] text-[#9A9A8A] tracking-[0.3em] uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            — MAGAZINE ÉDITORIAL PREMIUM
          </span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
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
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="italic font-light text-[1.4rem] text-[#F5F0E8] tracking-[0.05em] mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Bienvenue dans l&apos;univers AFRIKHER
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="font-normal text-[2rem] md:text-[2.8rem] leading-tight animate-gold-shine"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            background: "linear-gradient(135deg, #8A6E2F 0%, #C9A84C 25%, #F5F0E8 50%, #C9A84C 75%, #8A6E2F 100%)",
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Le Business au féminin
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="text-[0.9rem] font-light text-[#F5F0E8]/70 max-w-[480px] mt-4 leading-[1.8]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Le magazine de référence dédié aux femmes africaines qui entreprennent, innovent et inspirent. Des portraits, des récits, une vision.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 1 }}
          className="flex flex-col sm:flex-row gap-6 mt-10"
        >
          <Link
            href="/magazine"
            className="border border-[#C9A84C] text-[#C9A84C] px-10 py-3.5 text-[0.75rem] tracking-[0.2em] uppercase hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-300"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Découvrir le Magazine
          </Link>
          <Link
            href="/abonnements"
            className="border border-[#C9A84C]/60 text-[#C9A84C]/80 px-10 py-3.5 text-[0.75rem] tracking-[0.2em] uppercase hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-300"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            REJOINDRE LA COMMUNAUTÉ
          </Link>
        </motion.div>
      </div>

      <footer className="absolute bottom-0 left-0 w-full px-10 py-6 flex flex-col items-center justify-center gap-4 z-10">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center">
          <span className="text-[0.6rem] text-[#F5F0E8]/60 tracking-[0.15em] uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            © 2026 AFRIKHER — TOUS DROITS RÉSERVÉS
          </span>
          <span className="hidden md:inline text-[0.6rem] text-[#F5F0E8]/40 tracking-[0.15em]">|</span>
          <span className="text-[0.6rem] text-[#F5F0E8]/60 tracking-[0.15em] uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            DESIGNED BY TECHNOVOLUT INNOVATION FIPAY
          </span>
        </div>
        <div className="text-[0.6rem] text-[#F5F0E8]/60 tracking-[0.2em] uppercase text-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          WWW.AFRIKHER.COM
        </div>
      </footer>
    </section>
  );
}
