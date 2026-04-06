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
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data } = await supabase
          .from("products")
          .select("id, name, description, images, type, external_url, cta_text")
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(3);

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

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 px-6 md:px-10 bg-[#0A0A0A] text-[#F5F0E8]"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header — centered for editorial feel */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="text-[#C9A84C]/50 font-body font-medium uppercase tracking-[0.5em] text-[0.5rem] mb-4 block">
            La Boutique
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-[3rem] font-display font-light leading-[0.95] tracking-tight">
            L&apos;Essentiel{" "}
            <span className="italic text-[#C9A84C]">AFRIKHER</span>
          </h2>
        </div>

        {/* Products Grid — 3 columns, tighter spacing, bigger images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {products.map((product, index) => {
            const imageUrl = product.images?.[0] || "";
            const ctaText = product.cta_text || "Explorer";
            const ctaLink = product.external_url || `/boutique/${product.id}`;
            const isExternal = product.external_url && product.external_url.startsWith("http");

            return (
              <div
                key={product.id}
                className={`group transition-all duration-1000 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${0.1 + index * 0.12}s` }}
              >
                {/* Image — larger aspect ratio */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#1A1A1A] mb-4">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover img-zoom"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/70 via-[#0A0A0A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-end justify-center pb-8">
                    {isExternal ? (
                      <a
                        href={ctaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#F5F0E8] font-body font-medium text-[0.55rem] tracking-[0.25em] uppercase border border-[#F5F0E8]/30 px-6 py-2.5 translate-y-3 group-hover:translate-y-0 transition-all duration-500 hover:bg-[#F5F0E8]/10 hover:border-[#F5F0E8]/60"
                      >
                        {ctaText}
                      </a>
                    ) : (
                      <Link
                        href={ctaLink}
                        className="text-[#F5F0E8] font-body font-medium text-[0.55rem] tracking-[0.25em] uppercase border border-[#F5F0E8]/30 px-6 py-2.5 translate-y-3 group-hover:translate-y-0 transition-all duration-500 hover:bg-[#F5F0E8]/10 hover:border-[#F5F0E8]/60"
                      >
                        {ctaText}
                      </Link>
                    )}
                  </div>
                </div>

                {/* Info — minimal, tighter */}
                <div className="space-y-1.5">
                  <span className="text-[0.45rem] uppercase tracking-[0.25em] text-[#C9A84C]/50 font-body font-medium">
                    {product.type}
                  </span>
                  <h3 className="text-[1rem] font-display font-light group-hover:text-[#C9A84C] transition-colors duration-500 leading-tight">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-[0.72rem] font-body text-[#F5F0E8]/30 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  {/* CTA link */}
                  {isExternal ? (
                    <a
                      href={ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[0.5rem] font-body font-semibold uppercase tracking-[0.2em] text-[#C9A84C]/70 hover:text-[#C9A84C] transition-colors duration-300 pt-1"
                    >
                      {ctaText}
                      <ArrowRight size={9} />
                    </a>
                  ) : (
                    <Link
                      href={ctaLink}
                      className="inline-flex items-center gap-2 text-[0.5rem] font-body font-semibold uppercase tracking-[0.2em] text-[#C9A84C]/70 hover:text-[#C9A84C] transition-colors duration-300 pt-1"
                    >
                      {ctaText}
                      <ArrowRight size={9} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* View all — minimal */}
        <div
          className={`text-center mt-10 transition-all duration-1000 ease-out ${
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
    </section>
  );
}
