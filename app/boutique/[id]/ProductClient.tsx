"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { ShoppingBag, ChevronLeft, ChevronRight, Minus, Plus, ArrowLeft } from "lucide-react";

// ══════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  type: string;
  stock: number;
  unlimited: boolean;
  status: string;
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

export default function ProductDetailPage({ id: idParam }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [checkingOut, setCheckingOut] = useState(false);

  // ══════════════════════════════════════════════
  // FETCH
  // ══════════════════════════════════════════════

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) throw new Error("No Supabase config");

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Fetch product
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", idParam)
          .single();

        if (error || !data) {
          setProduct(null);
          setLoading(false);
          return;
        }

        const prod: Product = { ...data, images: data.images || [] };
        setProduct(prod);

        // Fetch related (same type, max 4, exclude current)
        const { data: relatedData } = await supabase
          .from("products")
          .select("*")
          .eq("status", "active")
          .eq("type", prod.type)
          .neq("id", prod.id)
          .limit(4);

        if (relatedData) {
          setRelated(relatedData.map((p: any) => ({ ...p, images: p.images || [] })));
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [idParam]);

  // ══════════════════════════════════════════════
  // CHECKOUT
  // ══════════════════════════════════════════════

  const handleCheckout = () => {
    if (!product) return;
    // Redirect to checkout page with product info
    window.location.href = `/boutique/checkout?product=${product.id}&qty=${quantity}`;
  };

  // ══════════════════════════════════════════════
  // LOADING
  // ══════════════════════════════════════════════

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F0E8]">
        <div className="fixed top-0 left-0 right-0 h-20 bg-[#0A0A0A] z-[90]" />
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-10 h-10 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#F5F0E8]">
        <div className="fixed top-0 left-0 right-0 h-20 bg-[#0A0A0A] z-[90]" />
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <ShoppingBag size={48} className="text-[#9A9A8A]/30 mb-4" />
          <p className="font-body text-[#9A9A8A] font-medium">Produit introuvable</p>
          <Link href="/boutique" className="font-body text-sm text-[#C9A84C] hover:underline mt-3">
            Retour à la boutique
          </Link>
        </div>
      </main>
    );
  }

  const images = product.images.length > 0 ? product.images : [];
  const inStock = product.unlimited || product.stock > 0;

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#0A0A0A]">
      {/* Bandeau noir */}
      <div className="fixed top-0 left-0 right-0 h-20 bg-[#0A0A0A] z-[90]" />
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-4">
        <div className="flex items-center font-body text-xs text-[#9A9A8A]">
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">Accueil</Link>
          <span className="mx-2">›</span>
          <Link href="/boutique" className="hover:text-[#C9A84C] transition-colors">Boutique</Link>
          <span className="mx-2">›</span>
          <span className="text-[#0A0A0A] line-clamp-1">{product.name}</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════ */}
      {/* PRODUCT DETAIL */}
      {/* ══════════════════════════════════════════════ */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {/* Gallery */}
            <div className="space-y-4">
              {/* Main image */}
              {images.length > 0 ? (
                <div className="relative aspect-square overflow-hidden bg-white rounded-sm">
                  <img
                    src={images[activeImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#0A0A0A] hover:bg-white transition-colors shadow-lg"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => setActiveImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#0A0A0A] hover:bg-white transition-colors shadow-lg"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="aspect-square bg-white rounded-sm flex items-center justify-center">
                  <ShoppingBag size={64} className="text-[#9A9A8A]/20" />
                </div>
              )}

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`aspect-square overflow-hidden rounded-sm border-2 transition-all ${
                        activeImage === i ? 'border-[#C9A84C]' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center space-y-8">
              {/* Type badge */}
              <div>
                <span className="font-body text-[10px] tracking-[0.2em] uppercase text-[#C9A84C] font-bold">
                  {TYPE_LABELS[product.type] || product.type}
                </span>
              </div>

              {/* Name */}
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-[#0A0A0A] leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <p className="font-display text-2xl md:text-3xl text-[#C9A84C]">
                {product.price.toFixed(2)} €
              </p>

              {/* Description */}
              {product.description && (
                <p className="font-body text-sm md:text-base text-[#2A2A2A]/80 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              )}

              {/* Stock indicator */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span className={`font-body text-xs ${inStock ? 'text-emerald-600' : 'text-red-600'}`}>
                  {product.unlimited ? 'Disponible' :
                   product.stock > 10 ? 'En stock' :
                   product.stock > 0 ? `Plus que ${product.stock} en stock` :
                   'Rupture de stock'}
                </span>
              </div>

              {/* Quantity & Buy */}
              {inStock && (
                <div className="space-y-4 pt-4 border-t border-[#0A0A0A]/5">
                  {/* Quantity selector */}
                  <div className="flex items-center space-x-4">
                    <span className="font-body text-xs tracking-[0.1em] uppercase text-[#9A9A8A]">Quantité</span>
                    <div className="flex items-center border border-[#0A0A0A]/10 rounded-full overflow-hidden">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center text-[#0A0A0A] hover:bg-[#0A0A0A]/5 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-12 text-center font-body text-sm font-bold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(q => product.unlimited ? q + 1 : Math.min(product.stock, q + 1))}
                        className="w-10 h-10 flex items-center justify-center text-[#0A0A0A] hover:bg-[#0A0A0A]/5 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Buy button */}
                  <button
                    onClick={handleCheckout}
                    disabled={checkingOut}
                    className="w-full py-4 bg-[#0A0A0A] text-[#F5F0E8] font-body text-xs tracking-[0.2em] uppercase font-bold rounded-full hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all duration-300 flex items-center justify-center space-x-3"
                  >
                    {checkingOut ? (
                      <div className="w-5 h-5 border-2 border-[#F5F0E8] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShoppingBag size={18} />
                        <span>Acheter — {(product.price * quantity).toFixed(2)} €</span>
                      </>
                    )}
                  </button>

                  <p className="text-center font-body text-[10px] text-[#9A9A8A] tracking-[0.1em] uppercase">
                    Paiement sécurisé via FIDEPAY
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════ */}
      {/* RELATED PRODUCTS */}
      {/* ══════════════════════════════════════════════ */}
      {related.length > 0 && (
        <section className="py-16 md:py-20 border-t border-[#0A0A0A]/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="font-body text-xs tracking-[0.35em] uppercase text-[#C9A84C] mb-2">
                Découvrir aussi
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-[#0A0A0A]">
                Vous aimerez aussi
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6">
              {related.map(p => (
                <Link key={p.id} href={`/boutique/${p.id}`} className="group block">
                  <div className="relative aspect-square overflow-hidden bg-white rounded-sm mb-3">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#F5F0E8]">
                        <ShoppingBag size={24} className="text-[#9A9A8A]/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-[#0A0A0A]/0 group-hover:bg-[#0A0A0A]/10 transition-colors duration-500" />
                  </div>
                  <h3 className="font-body text-sm font-medium text-[#0A0A0A] mb-1 group-hover:text-[#C9A84C] transition-colors line-clamp-2">{p.name}</h3>
                  <p className="font-body text-sm font-bold text-[#0A0A0A]">{p.price.toFixed(2)} €</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
