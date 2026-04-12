"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, Share2, X, Download, BookOpen
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
  heyzine_url: string | null;
  pdf_url: string | null;
  status: string;
  published_at: string;
}

interface Props {
  slug: string;
  hasAccess: boolean;
  magazineId: string | null;
}

export default function MagazineReaderClient({ slug, hasAccess: serverHasAccess, magazineId }: Props) {
  const [magazine, setMagazine] = useState<Magazine | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [clientHasAccess, setClientHasAccess] = useState(serverHasAccess);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Client-side fallback: check magazine PURCHASE if server didn't detect session
  // Magazines are PAID content — subscription alone does NOT grant access.
  useEffect(() => {
    if (serverHasAccess) { setClientHasAccess(true); return; }
    async function checkAccess() {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xykvzzitgmnipscxbhcf.supabase.co",
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5a3Z6eml0Z21uaXBzY3hiaGNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNjc1ODAsImV4cCI6MjA1ODk0MzU4MH0.yqOgQhnMKOaAoLkVDwH99jEMVilrp42ckFWPhNGk-Ys"
        );
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !magazineId) return;

        // Check magazine purchase by user_id
        const { data: purchaseByUser } = await supabase
          .from("magazine_purchases")
          .select("id")
          .eq("magazine_id", magazineId)
          .eq("user_id", user.id)
          .eq("payment_status", "completed")
          .maybeSingle();
        if (purchaseByUser) { setClientHasAccess(true); return; }

        // Fallback: check purchase by email
        if (user.email) {
          const { data: purchaseByEmail } = await supabase
            .from("magazine_purchases")
            .select("id")
            .eq("magazine_id", magazineId)
            .eq("customer_email", user.email)
            .eq("payment_status", "completed")
            .maybeSingle();
          if (purchaseByEmail) { setClientHasAccess(true); return; }
        }
      } catch { /* silent */ }
    }
    checkAccess();
  }, [serverHasAccess, magazineId]);

  const hasAccess = clientHasAccess;

  // Fetch magazine data
  useEffect(() => {
    async function fetchMagazine() {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) throw new Error("No Supabase config");
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data: magData, error: magError } = await supabase
          .from("magazines")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .single();

        if (magError || !magData) throw new Error("Magazine not found");
        setMagazine(magData);
      } catch {
        setMagazine(null);
      } finally {
        setLoading(false);
      }
    }
    fetchMagazine();
  }, [slug]);

  const totalPages = magazine ? (magazine.pages && magazine.pages.length > 0 ? magazine.pages.length + 1 : 1) : 1;

  const getCurrentPageImage = useCallback(() => {
    if (!magazine) return "";
    if (currentPage === 0) return magazine.cover_image;
    if (magazine.pages && magazine.pages.length > 0) return magazine.pages[currentPage - 1] || "";
    return "";
  }, [magazine, currentPage]);

  const canViewPage = useCallback((pageIndex: number) => {
    return pageIndex === 0 || hasAccess;
  }, [hasAccess]);

  const goToPage = useCallback((page: number) => {
    if (page < 0 || page >= totalPages) return;
    if (!canViewPage(page)) { setShowPaywall(true); return; }
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
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.targetTouches[0].clientX; };
  const handleTouchMove = (e: React.TouchEvent) => { touchEndX.current = e.targetTouches[0].clientX; };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 60) { diff > 0 ? nextPage() : prevPage(); }
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
          <Link href="/magazine" className="text-[#C9A84C] font-body hover:underline">Retour au catalogue</Link>
        </div>
      </div>
    );
  }

  const pageImage = getCurrentPageImage();
  const isOnCover = currentPage === 0;
  const hasPages = magazine.pages && magazine.pages.length > 0;
  const paywallMagazineId = magazineId ?? undefined;
  const hasHeyzine = Boolean(magazine.heyzine_url);
  const hasPdf = Boolean(magazine.pdf_url);

  // ══════════════════════════════════════════════════════════════
  // HEYZINE MODE: if heyzine_url is set and user has access, show embedded flipbook
  // ══════════════════════════════════════════════════════════════
  if (hasHeyzine && hasAccess) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-50 bg-[#0A0A0A] border-b border-[#C9A84C]/10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
            <Link href="/magazine" className="flex items-center gap-3 text-[#F5F0E8] hover:text-[#C9A84C] transition-colors">
              <ArrowLeft size={18} />
              <span className="text-xs font-body uppercase tracking-widest hidden sm:inline">Catalogue</span>
            </Link>

            <h1 className="text-sm md:text-base font-display font-bold text-[#F5F0E8] truncate flex-1 text-center mx-4">
              {magazine.title}
            </h1>

            <div className="flex items-center gap-3">
              {hasPdf && (
                <a
                  href={magazine.pdf_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C] text-[#0A0A0A] text-xs font-body font-semibold uppercase tracking-wider rounded hover:bg-[#E8C97A] transition-colors"
                >
                  <Download size={14} />
                  <span className="hidden sm:inline">Telecharger PDF</span>
                </a>
              )}
              <button
                onClick={() => {
                  if (navigator.share) navigator.share({ title: magazine.title, url: window.location.href });
                  else navigator.clipboard.writeText(window.location.href);
                }}
                className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#F5F0E8] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-colors"
              >
                <Share2 size={14} />
              </button>
            </div>
          </div>
        </header>

        {/* Heyzine Flipbook Iframe */}
        <div className="flex-1 w-full">
          <iframe
            src={magazine.heyzine_url!}
            className="w-full h-[calc(100vh-60px)]"
            style={{ border: "none" }}
            allowFullScreen
            title={magazine.title}
          />
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // HEYZINE MODE BUT NO ACCESS: show cover + paywall
  // ══════════════════════════════════════════════════════════════
  if (hasHeyzine && !hasAccess) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-50 bg-[#0A0A0A] border-b border-[#C9A84C]/10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
            <Link href="/magazine" className="flex items-center gap-3 text-[#F5F0E8] hover:text-[#C9A84C] transition-colors">
              <ArrowLeft size={18} />
              <span className="text-xs font-body uppercase tracking-widest hidden sm:inline">Catalogue</span>
            </Link>
            <h1 className="text-sm md:text-base font-display font-bold text-[#F5F0E8] truncate flex-1 text-center mx-4">
              {magazine.title}
            </h1>
            <div className="w-8" />
          </div>
        </header>

        {/* Cover + Paywall */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
          {/* Magazine cover */}
          <div className="max-w-md w-full mb-10">
            <div className="relative aspect-[3/4] bg-[#1A1A1A] rounded-sm overflow-hidden shadow-2xl shadow-black/60">
              {magazine.cover_image && (
                <img src={magazine.cover_image} alt={magazine.title} className="w-full h-full object-cover" />
              )}
            </div>
          </div>

          {/* Purchase paywall */}
          <div className="max-w-2xl w-full">
            <PaywallBanner type="magazine" magazineId={paywallMagazineId} />
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // LEGACY IMAGE MODE: page-by-page viewer (no Heyzine URL set)
  // ══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">

      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-[#0A0A0A] border-b border-[#C9A84C]/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <Link href="/magazine" className="flex items-center gap-3 text-[#F5F0E8] hover:text-[#C9A84C] transition-colors">
            <ArrowLeft size={18} />
            <span className="text-xs font-body uppercase tracking-widest hidden sm:inline">Catalogue</span>
          </Link>

          <div className="text-center flex-1 mx-4">
            <h1 className="text-sm md:text-base font-display font-bold text-[#F5F0E8] truncate">{magazine.title}</h1>
            {hasPages && hasAccess && (
              <p className="text-[10px] text-[#9A9A8A] font-body">Page {currentPage + 1} sur {totalPages}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {hasAccess && hasPdf && (
              <a
                href={magazine.pdf_url!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-[#C9A84C] text-[#0A0A0A] text-xs font-body font-semibold uppercase tracking-wider rounded hover:bg-[#E8C97A] transition-colors"
              >
                <Download size={14} />
                <span className="hidden sm:inline">PDF</span>
              </a>
            )}
            {hasAccess && hasPages && (
              <button onClick={() => setIsZoomed(!isZoomed)} className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#F5F0E8] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-colors">
                {isZoomed ? <ZoomOut size={14} /> : <ZoomIn size={14} />}
              </button>
            )}
            <button
              onClick={() => {
                if (navigator.share) navigator.share({ title: magazine.title, url: window.location.href });
                else navigator.clipboard.writeText(window.location.href);
              }}
              className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center text-[#F5F0E8] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-colors"
            >
              <Share2 size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Page Viewer */}
      <div className="flex-1 flex items-center justify-center relative px-4 py-6 md:py-10" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        {hasAccess && hasPages && currentPage > 0 && (
          <button onClick={prevPage} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#2A2A2A]/80 backdrop-blur-sm flex items-center justify-center text-[#F5F0E8] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-colors hidden md:flex">
            <ChevronLeft size={24} />
          </button>
        )}

        <div className={`relative transition-all duration-500 ${isZoomed ? "max-w-5xl" : "max-w-lg md:max-w-xl lg:max-w-2xl"} w-full`}>
          <div className="relative aspect-[3/4] bg-[#1A1A1A] rounded-sm overflow-hidden shadow-2xl shadow-black/60">
            {pageImage ? (
              <img src={pageImage} alt={`${magazine.title} - Page ${currentPage + 1}`} className="w-full h-full object-cover" draggable={false} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-[#9A9A8A] font-body text-sm">Page non disponible</p>
              </div>
            )}
            {!isOnCover && !hasAccess && (
              <div className="absolute inset-0 bg-[#0A0A0A]/95 backdrop-blur-lg flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                  <PaywallBanner type="magazine" magazineId={paywallMagazineId} />
                </div>
              </div>
            )}
          </div>
        </div>

        {hasAccess && hasPages && currentPage < totalPages - 1 && (
          <button onClick={nextPage} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#2A2A2A]/80 backdrop-blur-sm flex items-center justify-center text-[#F5F0E8] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-colors hidden md:flex">
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Bottom Bar */}
      <footer className="bg-[#0A0A0A] border-t border-[#C9A84C]/10 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {!hasAccess ? (
            <div className="w-full"><PaywallBanner type="magazine" magazineId={paywallMagazineId} /></div>
          ) : hasAccess && hasPages ? (
            <div className="flex items-center justify-between w-full">
              <button onClick={prevPage} disabled={currentPage === 0} className="flex items-center gap-2 text-[#F5F0E8] text-xs uppercase tracking-widest hover:text-[#C9A84C] transition-colors disabled:text-[#2A2A2A] disabled:cursor-not-allowed">
                <ArrowLeft size={14} /> Precedent
              </button>
              <div className="flex items-center gap-2">
                <select value={currentPage} onChange={(e) => goToPage(Number(e.target.value))} className="bg-[#2A2A2A] text-[#F5F0E8] text-xs rounded px-3 py-2 border border-[#C9A84C]/20 focus:outline-none focus:border-[#C9A84C]">
                  <option value={0}>Couverture</option>
                  {magazine.pages && magazine.pages.map((_, i) => (<option key={i} value={i + 1}>Page {i + 1}</option>))}
                </select>
                <span className="text-[#9A9A8A] text-xs font-body">/ {totalPages}</span>
              </div>
              <button onClick={nextPage} disabled={currentPage >= totalPages - 1} className="flex items-center gap-2 text-[#F5F0E8] text-xs uppercase tracking-widest hover:text-[#C9A84C] transition-colors disabled:text-[#2A2A2A] disabled:cursor-not-allowed">
                Suivant <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="w-full text-center">
              <Link href="/magazine" className="text-[#C9A84C] text-xs font-body uppercase tracking-widest hover:underline">Voir tous les numeros</Link>
            </div>
          )}
        </div>
      </footer>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 z-[200] bg-[#0A0A0A]/90 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="relative max-w-lg w-full">
            <button onClick={() => setShowPaywall(false)} className="absolute -top-10 right-0 text-[#9A9A8A] hover:text-[#F5F0E8] transition-colors z-10">
              <X size={20} />
            </button>
            <PaywallBanner type="magazine" magazineId={paywallMagazineId} />
          </div>
        </div>
      )}
    </div>
  );
}
