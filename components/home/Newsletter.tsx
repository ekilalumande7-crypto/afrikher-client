"use client";

import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [config, setConfig] = useState<Record<string, string>>({});

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

  const title = config.newsletter_title || "Rejoignez le Cercle";
  const subtitle = config.newsletter_subtitle || "Recevez nos analyses exclusives, portraits d'entrepreneures et invitations aux événements AFRIKHER.";

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

  return (
    <section className="py-32 md:py-40 px-6 md:px-12 bg-[#0A0A0A] text-[#F5F0E8] relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/[0.02] via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Overline */}
        <span className="text-[#C9A84C] font-body font-medium uppercase tracking-[0.4em] text-[0.6rem] mb-6 block">
          Newsletter
        </span>

        {/* Title */}
        <h2 className="text-4xl md:text-6xl font-display font-light leading-[0.95] tracking-tight mb-6">
          {title.split(" ").slice(0, -1).join(" ")}{" "}
          <span className="italic text-[#C9A84C]">{title.split(" ").slice(-1)}</span>
        </h2>

        {/* Subtitle */}
        <p className="text-[#F5F0E8]/40 font-body font-light text-[0.9rem] leading-[1.9] max-w-xl mx-auto mb-12">
          {subtitle}
        </p>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Votre adresse email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent border border-[#F5F0E8]/10 py-4 px-6 text-[#F5F0E8] text-[0.8rem] font-body tracking-wide focus:outline-none focus:border-[#C9A84C]/40 transition-colors placeholder:text-[#F5F0E8]/20"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="bg-[#C9A84C] text-[#0A0A0A] px-8 py-4 font-body font-medium text-[0.7rem] tracking-[0.2em] uppercase hover:bg-[#E8C97A] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <div className="w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent animate-spin rounded-full" />
              ) : status === "success" ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Inscrit</span>
                </>
              ) : (
                <>
                  <span>S&apos;inscrire</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>

          <p className="text-[0.55rem] text-[#F5F0E8]/20 tracking-[0.15em] uppercase mt-6 leading-relaxed">
            En vous inscrivant, vous acceptez notre politique de confidentialité.
            Désabonnement possible à tout moment.
          </p>
        </form>

        {status === "error" && (
          <p className="mt-6 text-red-400/80 text-[0.7rem] font-body">
            Une erreur est survenue. Veuillez réessayer.
          </p>
        )}
      </div>
    </section>
  );
}
