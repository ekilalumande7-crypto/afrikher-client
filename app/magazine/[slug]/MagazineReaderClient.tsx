"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, Share2, X
} from "lucide-react";
import PaywallBanner from "@/components/paywall/PaywallBanner";

interface Magazine {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image: string;
  price: number;
  currency: string;
  page_count: number;
  pages: string[];
  status: string;
  published_at: string;
}

/* Demo magazine for fallback */
const demoMagazine: Magazine = {
  id: "1",
  title: "AFRIKHER N\u00b01 \u2014 L'Ascension",
  slug: "afrikher-n1-ascension",
  description: "Premier num\u00e9ro d\u00e9di\u00e9 \u00e0 l'ascension des femmes entrepreneures en Afrique de l'Ouest.",
  cover_image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
  price: 9.99,
  currency: "EUR",
  page_count: 28,
  pages: [],
  status: "published",
  published_at: "2026-03-24",
};

interface Props {
  slug: string;
  hasAccess: boolean;
  magazineId: string | null;
}

export default function MagazineReaderClient({ slug, hasAccess, magazineId }: Props) {
  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // 0 = cover
  const [isZoomed, setIsZoomed] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    async function fetchMagazine() {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) throw new Error("No Supabase config");
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Fetch magazine
        const { data: magData, error: magError } = await supabase
          .from("magazines")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .single();

        if (magError || !magData) throw new Error("Magazine not found");
        setMagazine(magData);
      } catch {
        // Use demo data
        setMagazine({ ...demoMagazine, slug });
      } finally {
        setLoading(false);
      }
    }
    fetchMagazine();
  }, [slug]);

  const totalPages = magazine ? (magazine.pages.length > 0 ? magazine.pages.length + 1 : 1) : 1; // +1 for cover

  const getCurrentPageImage = useCallback(() => {
    if (!magazine) return "";
    if (currentPage === 0) return magazine.cover_image;
    if (magazine.pages.length > 0) return magazine.pages[currentPage - 1] || "";
    return "";
  }, [magazine, currentPage]);

  const canViewPage = useCallback((pageIndex: number) => {
    return pageIndex === 0 || hasAccess;
  }, [hasAccess]);

  const goToPage = useCallback((page: number) => {
    if (page < 0 || page >= totalPages) return;
    if (!canViewPage(page)) {
      setShowPaywall(true);
      return;
    }
    setCurrentPage(page);
    setIsZoomed(false);
  }, [totalPages, canViewPage]);

  const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
  const prevPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); nextPage(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prevPage(); }
      if (e.key === "Escape") { setIsZoomed(false); setShowPaywall(false); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextPage, prevPage]);

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 60) {
      if (diff > 0) nextPage();
      else prevPage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#9A9A8A] font-body text-sm">Chargement du magazine...</p>
        </div>
      </div>
    );
  }

  if (!magazine) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-[#F5F0E8] mb-4">Magazine introuvable</h1>
          <Link href="/magazine" className="text-[#C9A84C] font-body hover:underline">
            Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  const pageImage = getCurrentPageImage();
  const isOnCover = currentPage === 0;
  const hasPages = magazine.pages.length > 0;
  const paywallMagazineId = magazineId ?? undefined;

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">

      {/* ══════ Top Bar ══════ */}
      <header className="sticky top-0 z-50 bg-[#0A0A0A] border-b border-[#C9A84C]/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <Link href="/magazine" className="flex items-center gap-3 text-[#F5F0E8] hover:text-[#C9A84C] transition-colors">
            <ArrowLeft size={18} />
            <span className="text-xs font-body uppercase tracking-widest hidden sm:inline">Catalogue</span>
          </Link>

          <div className="text-center flex-1 mx-4">
            <h1 className="text-sm md:text-base font-display font-bold text-[#F5F0E8] truncate">
              {magazine.title}
            </h1>
            {hasPages && hasAccess && (
              <p className="text-[10px] text-[#9A9A8A] font-body">
                Page {currentPage + 1} sur {totalPages}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {hasAccess && hasPages && (
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#F5F0E8] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-colors"
              >
                {isZoomed ? <ZoomOut size={14} /> : <ZoomIn size={14} />}
              </button>
            )}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: magazine.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#F5F0E8] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-colors"
            >
              <Share2 size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ══════ Page Viewer ══════ */}
      <div
        className="flex-1 flex items-center justify-center relative px-4 py-6 md:py-10"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left arrow (desktop) */}
        {hasAccess && hasPages && currentPage > 0 && (
          <button
            onClick={prevPage}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#2A2A2A]/80 backdrop-blur-sm flex items-center justify-center text-[#F5F0E8] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-colors hidden md:flex"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Page Image */}
        <div className={`relative transition-all duration-500 ${isZoomed ? "max-w-5xl" : "max-w-lg md:max-w-xl lg:max-w-2xl"} w-full`}>
          <div className="relative aspect-[3/4] bg-[#1A1A1A] rounded-sm overflow-hidden shadow-2xl shadow-black/60">
            {pageImage ? (
              <img
                src={pageImage}
                alt={`${magazine.title} - Page ${currentPage + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-[#9A9A8A] font-body text-sm">Page non disponible</p>
              </div>
            )}

            {/* Paywall overlay for non-cover pages when no access */}
            {!isOnCover && !hasAccess && (
              <div className="absolute inset-0 bg-[#0A0A0A]/95 backdrop-blur-lg flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                  <PaywallBanner type="magazine" magazineId={paywallMagazineId} />
                </div>
              </div>
            )}
          </div>

          {/* Page indicator dots (mobile) */}
          {hasAccess && hasPages && totalPages <= 30 && (
            <div className="flex justify-center gap-1.5 mt-6 md:hidden flex-wrap">
              {Array.from({ length: Math.min(totalPages, 15) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentPage === i ? "bg-[#C9A84C] w-6" : "bg-[#2A2A2A]"
                  }`}
                />
              ))}
              {totalPages > 15 && (
                <span className="text-[10px] text-[#9A9A8A] ml-2">+{totalPages - 15}</span>
              )}
            </div>
          )}
        </div>

        {/* Right arrow (desktop) */}
        {hasAccess && hasPages && currentPage < totalPages - 1 && (
          <button
            onClick={nextPage}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#2A2A2A]/80 backdrop-blur-sm flex items-center justify-center text-[#F5F0E8] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-colors hidden md:flex"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* ══════ Bottom Bar ══════ */}
      <footer className="bg-[#0A0A0A] border-t border-[#C9A84C]/10 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* PaywallBanner if no access */}
          {!hasAccess ? (
            <div className="w-full">
              <PaywallBanner type="magazine" magazineId={paywallMagazineId} />
            </div>
          ) : hasAccess && hasPages ? (
            /* Page navigation for purchased magazines */
            <div className="flex items-center justify-between w-full">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className="flex items-center gap-2 text-[#F5F0E8] text-xs uppercase tracking-widest hover:text-[#C9A84C] transition-colors disabled:text-[#2A2A2A] disabled:cursor-not-allowed"
              >
                <ArrowLeft size={14} /> Precedent
              </button>

              {/* Page selector */}
              <div className="flex items-center gap-2">
                <select
                  value={currentPage}
                  onChange={(e) => goToPage(Number(e.target.value))}
                  className="bg-[#2A2A2A] text-[#F5F0E8] text-xs rounded px-3 py-2 border border-[#C9A84C]/20 focus:outline-none focus:border-[#C9A84C]"
                >
                  <option value={0}>Couverture</option>
                  {magazine.pages.map((_, i) => (
                    <option key={i} value={i + 1}>Page {i + 1}</option>
                  ))}
                </select>
                <span className="text-[#9A9A8A] text-xs font-body">/ {totalPages}</span>
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage >= totalPages - 1}
                className="flex items-center gap-2 text-[#F5F0E8] text-xs uppercase tracking-widest hover:text-[#C9A84C] transition-colors disabled:text-[#2A2A2A] disabled:cursor-not-allowed"
              >
                Suivant <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="w-full text-center">
              <Link href="/magazine" className="text-[#C9A84C] text-xs font-body uppercase tracking-widest hover:underline">
                Voir tous les numeros
              </Link>
            </div>
          )}
        </div>
      </footer>

      {/* ══════ Paywall Modal ══════ */}
      {showPaywall && (
        <div className="fixed inset-0 z-[200] bg-[#0A0A0A]/90 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="relative max-w-lg w-full">
            <button
              onClick={() => setShowPaywall(false)}
              className="absolute -top-10 right-0 text-[#9A9A8A] hover:text-[#F5F0E8] transition-colors z-10"
            >
              <X size={20} />
            </button>
            <PaywallBanner type="magazine" magazineId={paywallMagazineId} />
          </div>
        </div>
      )}
    </div>
  );
}
