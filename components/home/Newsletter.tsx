"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [config, setConfig] = useState<Record<string, string>>({});
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function loadConfig() {
      try {
        const { data } = await supabase
          .from("site_config")
          .select("key, value")
          .or("key.like.newsletter_%,key.eq.whatsapp_link");
        const map: Record<string, string> = {};
        data?.forEach((row: { key: string; value: string }) => {
          map[row.key] = row.value || "";
        });
        setConfig(map);
      } catch (err) {
        console.error("Newsletter config error:", err);
      }
    }
    loadConfig();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const title = config.newsletter_title || "Le Cercle AFRIKHER";
  const subtitle = config.newsletter_subtitle || "Analyses exclusives, portraits d'entrepreneures et invitations aux événements.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  // Split title: last word in gold italic
  const titleWords = title.split(" ");
  const titleMain = titleWords.slice(0, -1).join(" ");
  const titleAccent = titleWords.slice(-1).join("");

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 px-6 md:px-10 bg-[#F5F0E8] text-[#0A0A0A] relative overflow-hidden"
    >
      <div
        className={`max-w-[1200px] mx-auto relative z-10 transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-2xl mx-auto text-center">
          {/* Overline */}
          <span className="text-[#C9A84C] font-body font-medium uppercase tracking-[0.5em] text-[0.5rem] mb-4 block">
            Newsletter
          </span>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-[3rem] font-display font-light leading-[0.95] tracking-tight mb-4">
            {titleMain}{" "}
            <span className="italic text-[#C9A84C]">{titleAccent}</span>
          </h2>

          {/* Subtitle */}
          <p className="text-[#0A0A0A]/40 font-body font-light text-[0.8rem] leading-[1.8] max-w-md mx-auto mb-8">
            {subtitle}
          </p>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-6">
            <div className="flex flex-col sm:flex-row gap-0">
              <input
                type="email"
                placeholder="Votre adresse email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-gold flex-1 bg-transparent border border-[#0A0A0A]/10 py-4 px-6 text-[#0A0A0A] text-[0.78rem] font-body tracking-wide focus:outline-none transition-all duration-400 placeholder:text-[#0A0A0A]/25 sm:border-r-0"
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="btn-gold-glow bg-[#0A0A0A] text-[#F5F0E8] px-8 py-4 font-body font-medium text-[0.55rem] tracking-[0.25em] uppercase hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {status === "loading" ? (
                  <div className="w-3.5 h-3.5 border-2 border-[#F5F0E8] border-t-transparent animate-spin rounded-full" />
                ) : status === "success" ? (
                  <>
                    <CheckCircle2 size={12} />
                    <span>Inscrit</span>
                  </>
                ) : (
                  <>
                    <span>S&apos;inscrire</span>
                    <ArrowRight size={12} />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-[0.45rem] text-[#0A0A0A]/20 tracking-[0.15em] uppercase leading-relaxed">
            En vous inscrivant, vous acceptez notre politique de confidentialité.
          </p>

          {status === "error" && (
            <p className="mt-4 text-red-500/60 text-[0.7rem] font-body">
              Une erreur est survenue. Veuillez réessayer.
            </p>
          )}

          {/* WhatsApp CTA — integrated inline, not isolated */}
          {config.whatsapp_link && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="h-[1px] w-12 bg-[#0A0A0A]/[0.08]" />
              <Link
                href={config.whatsapp_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#25D366] font-body font-medium text-[0.5rem] tracking-[0.15em] uppercase hover:text-[#25D366]/70 transition-colors duration-300"
              >
                <MessageCircle size={13} />
                <span>Rejoindre la communauté WhatsApp</span>
              </Link>
              <div className="h-[1px] w-12 bg-[#0A0A0A]/[0.08]" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
