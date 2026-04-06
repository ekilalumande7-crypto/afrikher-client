"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AboutSection() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const aboutTitle = config.about_title || "Bien plus qu'un magazine.";
  const aboutText = config.about_text || "AFRIKHER célèbre l'excellence, l'audace et le leadership des femmes africaines. Une plateforme où l'inspiration rencontre l'influence.";
  const aboutImage = config.about_image || "https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=1974&auto=format&fit=crop";
  const aboutQuote = config.about_quote || "L'élégance est une attitude, le business une passion.";
  const foundressName = config.foundress_name || "Hadassa Hélène EKILA-LUMANDE";
  const foundressTitle = config.foundress_title || "Fondatrice & CEO";

  const titleWords = aboutTitle.replace(/\.$/, "").split(" ");
  const titleMain = titleWords.slice(0, -1).join(" ");
  const titleAccent = titleWords.slice(-1).join("");

  return (
    <div
      ref={sectionRef}
      className="min-h-screen flex items-center bg-[#F5F0E8] text-[#0A0A0A] overflow-hidden relative"
    >
      <div className="w-full px-6 md:px-10 py-12 md:py-0">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Image Column — 7/12 */}
            <div
              className={`relative lg:col-span-7 order-2 lg:order-1 transition-all duration-1000 ease-out ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              }`}
            >
              <div className="aspect-[4/5] max-h-[65vh] overflow-hidden relative group">
                <img
                  src={aboutImage}
                  alt="AFRIKHER Vision"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1.5s] img-zoom"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 border border-[#C9A84C]/10 pointer-events-none" />
              </div>

              {/* Floating Quote Card */}
              <div className="absolute -bottom-4 right-4 md:right-8 bg-[#0A0A0A] border border-[#C9A84C]/15 p-5 md:p-6 max-w-[240px] z-20">
                <p className="font-display italic text-[0.95rem] md:text-[1.05rem] text-[#F5F0E8]/90 leading-snug">
                  &ldquo;{aboutQuote}&rdquo;
                </p>
                <div className="mt-3 flex items-center space-x-3">
                  <div className="w-6 h-[1px] bg-[#C9A84C]" />
                  <span className="text-[0.5rem] uppercase tracking-[0.2em] font-body font-medium text-[#C9A84C]">
                    {foundressName.split(" ")[0]}
                  </span>
                </div>
              </div>
            </div>

            {/* Text Column — 5/12 */}
            <div
              className={`lg:col-span-5 space-y-6 order-1 lg:order-2 transition-all duration-1000 ease-out ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}
              style={{ transitionDelay: "0.2s" }}
            >
              <div className="space-y-4">
                <span className="text-[#C9A84C] font-body font-medium uppercase tracking-[0.4em] text-[0.55rem] block">
                  L&apos;esprit AFRIKHER
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-[3.2rem] font-display font-light leading-[0.95] tracking-tight">
                  {titleMain}{" "}
                  <span className="italic text-[#C9A84C]">
                    {titleAccent}.
                  </span>
                </h2>
              </div>

              <p className="text-[#0A0A0A]/50 text-[0.88rem] leading-[1.8] font-body font-light max-w-sm">
                {aboutText}
              </p>

              <div>
                <Link
                  href="/qui-sommes-nous"
                  className="group inline-flex items-center space-x-3 text-[#0A0A0A] font-body font-medium uppercase tracking-[0.2em] text-[0.6rem] hover:text-[#C9A84C] transition-colors duration-300"
                >
                  <span>Découvrir notre histoire</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>

              <div className="pt-4 border-t border-[#0A0A0A]/[0.06] flex items-center space-x-4">
                <div>
                  <p className="font-body text-[0.65rem] font-medium text-[#0A0A0A]/70 tracking-wide">{foundressName}</p>
                  <p className="font-body text-[0.55rem] text-[#C9A84C]/60 tracking-[0.15em] uppercase">{foundressTitle}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
