"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, ShoppingBag, SlidersHorizontal, ChevronDown } from "lucide-react";

// ══════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════

interface Product {
  id: string;
  name: string;
  description: string;
  price: number | null;
  external_url: string | null;
  images: string[];
  type: string;
  stock: number;
  unlimited: boolean;
  status: string;
  partner_id: string | null;
}

const TYPE_LABELS: Record<string, string> = {
  book: 'Livre',
  bouquet: 'Bouquet',
  digital: 'Digital',
  service: 'Service',
  accessory: 'Accessoire',
  other: 'Autre',
};

// ══════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════

export default function BoutiquePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  // Available types from fetched products
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  // ══════════════════════════════════════════════
  // FETCH PRODUCTS FROM SUPABASE
  // ══════════════════════════════════════════════

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) throw new Error("No Supabase config");

        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false });

        if (error) throw error;

        const prods: Product[] = (data || []).map((p: any) => ({
          ...p,
          images: p.images || [],
        }));

        setProducts(prods);

        // Unique types
        const types = [...new Set(prods.map(p => p.type).filter(Boolean))];
        setAvailableTypes(types);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // ══════════════════════════════════════════════
  // FILTER
  // ══════════════════════════════════════════════

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        (p.description || '').toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || p.type === filterType;
    return matchSearch && matchType;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // ══════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#0A0A0A]">
      {/* Bandeau noir derrière le header */}
      <div className="fixed top-0 left-0 right-0 h-20 bg-[#0A0A0A] z-[90]" />
      <Navbar />

      {/* ══════════════════════════════════════════════ */}
      {/* HERO */}
      {/* ══════════════════════════════════════════════ */}
      <section className="pt-36 pb-16 md:pb-20 bg-[#0A0A0A] text-[#F5F0E8]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="font-body text-xs tracking-[0.35em] uppercase text-[#C9A84C] mb-4">
            Sélection exclusive
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-[#F5F0E8] mb-3 leading-[0.95]">
            La Boutique<span className="text-[#C9A84C]">.</span>
          </h1>
          <p className="font-display italic text-lg md:text-xl text-[#F5F0E8]/60 max-w-2xl mx-auto mt-4">
            L'excellence à portée de main. Livres, bouquets, accessoires et créations exclusives.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════ */}
      {/* BREADCRUMB + FILTERS */}
      {/* ══════════════════════════════════════════════ */}
      <section className="border-b border-[#0A0A0A]/5">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="py-4 text-xs font-body text-[#9A9A8A]">
            <Link href="/" className="hover:text-[#C9A84C] transition-colors">Accueil</Link>
            <span className="mx-2">›</span>
            <span className="text-[#0A0A0A]">Boutique</span>
          </div>

          {/* Filters bar */}
          <div className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Type filters */}
              <button
                onClick={() => setFilterType('all')}
                className={`font-body text-xs tracking-[0.1em] uppercase px-4 py-2 rounded-full border transition-all ${
                  filterType === 'all'
                    ? 'bg-[#0A0A0A] text-[#F5F0E8] border-[#0A0A0A]'
                    : 'border-[#0A0A0A]/15 text-[#2A2A2A] hover:border-[#C9A84C]/50'
                }`}
              >
                Tous
              </button>
              {availableTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`font-body text-xs tracking-[0.1em] uppercase px-4 py-2 rounded-full border transition-all ${
                    filterType === type
                      ? 'bg-[#0A0A0A] text-[#F5F0E8] border-[#0A0A0A]'
                      : 'border-[#0A0A0A]/15 text-[#2A2A2A] hover:border-[#C9A84C]/50'
                  }`}
                >
                  {TYPE_LABELS[type] || type}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A8A]" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#0A0A0A]/10 rounded-full text-sm font-body focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
              />
            </div>
          </div>

          {/* Results count */}
          <div className="pb-4">
            <p className="font-body text-xs text-[#9A9A8A]">
              {filtered.length} produit{filtered.length !== 1 ? 's' : ''}
              {filterType !== 'all' ? ` — ${TYPE_LABELS[filterType] || filterType}` : ''}
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════ */}
      {/* PRODUCT GRID */}
      {/* ══════════════════════════════════════════════ */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={48} className="mx-auto text-[#9A9A8A]/30 mb-4" />
              <p className="font-body text-[#9A9A8A] font-medium">Aucun produit disponible</p>
              <p className="font-body text-sm text-[#9A9A8A]/60 mt-1">Revenez bientôt pour découvrir nos nouveautés</p>
            </div>
          ) : (
            <>
              {/* Grid — 2 cols mobile, 3 cols tablet, 4 cols desktop */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
                {visible.map(product => (
                  <Link
                    key={product.id}
                    href={`/boutique/${product.id}`}
                    className="group block"
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-white rounded-sm mb-3">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#F5F0E8]">
                          <ShoppingBag size={32} className="text-[#9A9A8A]/20" />
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-[#0A0A0A]/0 group-hover:bg-[#0A0A0A]/10 transition-colors duration-500" />

                      {/* Badge type */}
                      <div className="absolute top-2 left-2">
                        <span className="font-body text-[9px] tracking-[0.15em] uppercase bg-white/90 backdrop-blur-sm text-[#0A0A0A] px-2.5 py-1 rounded-full">
                          {TYPE_LABELS[product.type] || product.type}
                        </span>
                      </div>

                      {/* Quick view button */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <span className="font-body text-[10px] tracking-[0.2em] uppercase bg-[#0A0A0A] text-[#F5F0E8] px-5 py-2 rounded-full whitespace-nowrap">
                          Voir le produit
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div>
                      <h3 className="font-body text-sm font-medium text-[#0A0A0A] leading-snug mb-1 group-hover:text-[#C9A84C] transition-colors duration-300 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="font-body text-[11px] tracking-[0.15em] uppercase text-[#C9A84C] font-bold mt-2">
                        D&eacute;couvrir &rarr;
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <div className="text-center mt-14">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 12)}
                    className="font-body text-xs tracking-[0.2em] uppercase bg-[#0A0A0A] text-[#F5F0E8] px-8 py-3.5 rounded-full hover:bg-[#2A2A2A] transition-colors"
                  >
                    Voir plus de produits
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════ */}
      {/* NEWSLETTER SECTION (before end) */}
      {/* ══════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-body text-xs tracking-[0.35em] uppercase text-[#C9A84C] mb-3">
            Restez informée
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-[#F5F0E8] mb-4">
            Nouveautés & Offres Exclusives
          </h2>
          <p className="font-body text-sm text-[#F5F0E8]/50 mb-8">
            Recevez en avant-première nos nouvelles collections et offres réservées aux abonnées.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-5 py-3.5 bg-[#F5F0E8]/10 border border-[#F5F0E8]/10 rounded-full text-sm text-[#F5F0E8] font-body placeholder:text-[#F5F0E8]/30 focus:outline-none focus:border-[#C9A84C]/50"
            />
            <button className="px-6 py-3.5 bg-[#C9A84C] text-[#0A0A0A] font-body text-xs tracking-[0.15em] uppercase font-bold rounded-full hover:bg-[#E8C97A] transition-colors">
              S'inscrire
            </button>
          </div>
        </div>
      </section>
          <Footer />
    </main>
  );
}
