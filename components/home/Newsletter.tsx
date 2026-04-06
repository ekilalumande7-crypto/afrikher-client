"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
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
          .like("key", "newsletter_%");
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
      className="py-36 md:py-48 px-6 md:px-[10%] bg-[#F5F0E8] text-[#0A0A0A] relative overflow-hidden"
    >
      {/* Subtle gold accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-[#C9A84C]/20 to-transparent" />

      <div
        className={`max-w-2xl mx-auto text-center relative z-10 transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Overline */}
        <span className="text-[#C9A84C] font-body font-medium uppercase tracking-[0.5em] text-[0.5rem] mb-5 block">
          Newsletter
        </span>

        {/* Title — editorial, impactful */}
        <h2 className="text-3xl md:text-5xl lg:text-[3.5rem] font-display font-light leading-[0.95] tracking-tight mb-5">
          {titleMain}{" "}
          <span className="italic text-[#C9A84C]">{titleAccent}</span>
        </h2>

        {/* Subtitle — short, emotional */}
        <p className="text-[#0A0A0A]/40 font-body font-light text-[0.85rem] leading-[1.8] max-w-md mx-auto mb-14">
          {subtitle}
        </p>

        {/* Email Form — wide, elegant */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-0">
            <input
              type="email"
              placeholder="Votre adresse email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-gold flex-1 bg-transparent border border-[#0A0A0A]/10 py-5 px-8 text-[#0A0A0A] text-[0.8rem] font-body tracking-wide focus:outline-none transition-all duration-400 placeholder:text-[#0A0A0A]/25 sm:border-r-0"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="btn-gold-glow bg-[#0A0A0A] text-[#F5F0E8] px-10 py-5 font-body font-medium text-[0.6rem] tracking-[0.25em] uppercase hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {status === "loading" ? (
                <div className="w-4 h-4 border-2 border-[#F5F0E8] border-t-transparent animate-spin rounded-full" />
              ) : status === "success" ? (
                <>
                  <CheckCircle2 size={13} />
                  <span>Inscrit</span>
                </>
              ) : (
                <>
                  <span>S&apos;inscrire</span>
                  <ArrowRight size={13} />
                </>
              )}
            </button>
          </div>

          <p className="text-[0.5rem] text-[#0A0A0A]/20 tracking-[0.15em] uppercase mt-8 leading-relaxed">
            En vous inscrivant, vous acceptez notre politique de confidentialité.
          </p>
        </form>

        {status === "error" && (
          <p className="mt-6 text-red-500/60 text-[0.7rem] font-body">
            Une erreur est survenue. Veuillez réessayer.
          </p>
        )}
      </div>
    </section>
  );
}
