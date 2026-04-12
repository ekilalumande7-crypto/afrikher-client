"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, Shield } from "lucide-react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user already accepted cookies
    try {
      const accepted = document.cookie
        .split("; ")
        .find((c) => c.startsWith("afrikher_cookies="));
      if (!accepted) {
        // Small delay so the page loads first
        const timer = setTimeout(() => setVisible(true), 600);
        return () => clearTimeout(timer);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    // Set cookie for 365 days
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `afrikher_cookies=accepted; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm" />

      {/* Popup */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
        <div
          className="w-full max-w-[440px] bg-[#0A0A0A] border border-[#C9A84C]/20 shadow-2xl"
          style={{ animation: "fadeUp 0.4s ease-out" }}
        >
          {/* Gold top line */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />

          <div className="px-8 py-8">
            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className="w-12 h-12 border border-[#C9A84C]/30 flex items-center justify-center">
                <Cookie size={22} className="text-[#C9A84C]" />
              </div>
            </div>

            {/* Title */}
            <h3
              className="text-center font-display text-[1.3rem] text-[#F5F0E8] leading-tight mb-3"
            >
              Politique de cookies
            </h3>

            {/* Text */}
            <p className="text-center text-[0.8rem] text-[#F5F0E8]/50 font-body leading-relaxed mb-2">
              AFRIKHER utilise des cookies pour assurer le bon fonctionnement du site
              et améliorer votre expérience de navigation.
            </p>

            <p className="text-center text-[0.75rem] text-[#F5F0E8]/35 font-body leading-relaxed mb-6">
              En poursuivant, vous acceptez l'utilisation de cookies conformément
              à notre politique.
            </p>

            {/* Link to full policy */}
            <div className="flex justify-center mb-6">
              <Link
                href="/cookies"
                className="inline-flex items-center gap-1.5 text-[0.65rem] text-[#C9A84C]/60 font-body tracking-[0.1em] uppercase hover:text-[#C9A84C] transition-colors"
              >
                <Shield size={12} />
                Lire la politique complète
              </Link>
            </div>

            {/* Accept button */}
            <button
              onClick={accept}
              className="w-full py-3.5 bg-[#C9A84C] text-[#0A0A0A] text-[0.7rem] font-body font-semibold tracking-[0.15em] uppercase transition-all duration-300 hover:bg-[#E8C97A] active:scale-[0.98]"
            >
              Accepter et continuer
            </button>

            {/* Refuse link */}
            <button
              onClick={accept}
              className="w-full mt-3 py-2 text-[0.65rem] text-[#F5F0E8]/25 font-body tracking-[0.08em] hover:text-[#F5F0E8]/40 transition-colors"
            >
              Cookies essentiels uniquement
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
