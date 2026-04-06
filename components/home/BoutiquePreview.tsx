"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  type: string;
  external_url: string | null;
  cta_text: string | null;
}

export default function BoutiquePreview() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data } = await supabase
          .from("products")
          .select("id, name, description, images, type, external_url, cta_text")
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(4);

        if (data) setProducts(data as Product[]);
      } catch (err) {
        console.error("Boutique preview error:", err);
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (products.length === 0) return null;

  // Grid: 2 cols if <=2 products, 4 cols if 3-4
  const gridCols = products.length <= 2 ? "md:grid-cols-2" : "md:grid-cols-4";

  return (
    <div
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center bg-[#0A0A0A] text-[#F5F0E8]"
    >
      <div className="w-full px-6 md:px-10 py-12 md:py-0">
        <div className="max-w-[1200px] mx-auto">
          {/* Header */}
          <div
            className={`text-center mb-10 transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <span className="text-[#C9A84C]/50 font-body font-medium uppercase tracking-[0.5em] text-[0.5rem] mb-4 block">
              La Boutique
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-light leading-[0.95] tracking-tight">
              L&apos;Essentiel{" "}
              <span className="italic text-[#C9A84C]">AFRIKHER</span>
            </h2>
          </div>

          {/* Products Grid — max 4 */}
          <div className={`grid grid-cols-2 ${gridCols} gap-4 md:gap-5`}>
            {products.map((product, index) => {
              const imageUrl = product.images?.[0] || "";
              const ctaText = product.cta_text || "Explorer";
              const ctaLink = product.external_url || `/boutique/${product.id}`;
              const isExternal = product.external_url && product.external_url.startsWith("http");

              const CardContent = (
                <>
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#1A1A1A]">
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover img-zoom"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/70 via-[#0A0A0A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-end justify-center pb-6">
                      <span className="text-[#F5F0E8] font-body font-medium text-[0.5rem] tracking-[0.25em] uppercase border border-[#F5F0E8]/30 px-5 py-2 translate-y-3 group-hover:translate-y-0 transition-all duration-500">
                        {ctaText}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mt-3 space-y-1">
                    <span className="text-[0.4rem] uppercase tracking-[0.25em] text-[#C9A84C]/50 font-body font-medium block">
                      {product.type}
                    </span>
                    <h3 className="text-[0.85rem] md:text-[0.95rem] font-display font-light group-hover:text-[#C9A84C] transition-colors duration-500 leading-tight">
                      {product.name}
                    </h3>
                  </div>
                </>
              );

              return (
                <div
                  key={product.id}
                  className={`group transition-all duration-1000 ease-out ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
                >
                  {isExternal ? (
                    <a href={ctaLink} target="_blank" rel="noopener noreferrer">
                      {CardContent}
                    </a>
                  ) : (
                    <Link href={ctaLink}>
                      {CardContent}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {/* View all */}
          <div
            className={`text-center mt-8 transition-all duration-1000 ease-out ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "0.6s" }}
          >
            <Link
              href="/boutique"
              className="group inline-flex items-center space-x-3 text-[#F5F0E8]/40 font-body font-medium uppercase tracking-[0.2em] text-[0.5rem] hover:text-[#C9A84C] transition-colors duration-300"
            >
              <span>Voir la collection</span>
              <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
