"use client";

import { useState, useEffect } from "react";
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

  if (products.length === 0) return null;

  return (
    <section className="py-32 md:py-40 px-6 md:px-12 bg-[#F5F0E8] text-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-20 gap-8">
          <div>
            <span className="text-[#C9A84C] font-body font-medium uppercase tracking-[0.4em] text-[0.6rem] mb-4 block">
              La Boutique
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-light leading-[0.95] tracking-tight">
              L&apos;Essentiel{" "}
              <span className="italic text-[#C9A84C]">AFRIKHER</span>
            </h2>
          </div>
          <Link
            href="/boutique"
            className="group inline-flex items-center space-x-3 text-[#0A0A0A]/60 font-body font-medium uppercase tracking-[0.2em] text-[0.6rem] hover:text-[#C9A84C] transition-colors duration-300"
          >
            <span>Voir la collection</span>
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* Products Grid — no prices, description + CTA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
          {products.map((product) => {
            const imageUrl = product.images?.[0] || "";
            const ctaText = product.cta_text || "Découvrir l'article";
            const ctaLink = product.external_url || `/boutique/${product.id}`;
            const isExternal = product.external_url && product.external_url.startsWith("http");

            return (
              <div key={product.id} className="group">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#0A0A0A]/5 mb-6">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#0A0A0A]/30 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                    {isExternal ? (
                      <a
                        href={ctaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#F5F0E8] font-body font-medium text-[0.65rem] tracking-[0.2em] uppercase border border-[#F5F0E8]/40 px-6 py-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 hover:bg-[#F5F0E8]/10"
                      >
                        {ctaText}
                      </a>
                    ) : (
                      <Link
                        href={ctaLink}
                        className="text-[#F5F0E8] font-body font-medium text-[0.65rem] tracking-[0.2em] uppercase border border-[#F5F0E8]/40 px-6 py-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 hover:bg-[#F5F0E8]/10"
                      >
                        {ctaText}
                      </Link>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[0.55rem] uppercase tracking-[0.2em] text-[#C9A84C] font-body font-medium">
                    {product.type}
                  </span>
                  <h3 className="text-lg font-display font-light group-hover:text-[#C9A84C] transition-colors duration-300 leading-tight">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-[0.8rem] font-body text-[#0A0A0A]/50 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  {/* CTA link below card */}
                  {isExternal ? (
                    <a
                      href={ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[0.65rem] font-body font-semibold uppercase tracking-[0.15em] text-[#C9A84C] hover:text-[#E8C97A] transition-colors duration-300 mt-2"
                    >
                      {ctaText}
                      <ArrowRight size={11} />
                    </a>
                  ) : (
                    <Link
                      href={ctaLink}
                      className="inline-flex items-center gap-2 text-[0.65rem] font-body font-semibold uppercase tracking-[0.15em] text-[#C9A84C] hover:text-[#E8C97A] transition-colors duration-300 mt-2"
                    >
                      {ctaText}
                      <ArrowRight size={11} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
