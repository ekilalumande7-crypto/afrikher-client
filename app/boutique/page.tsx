"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, ShoppingBag } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  external_url: string | null;
  images: string[];
  status: string;
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/boutique/${product.id}`}
      className="group block h-full cursor-pointer no-underline"
    >
      <article className="flex h-full flex-col">
        <div className="aspect-[4/5] overflow-hidden bg-[#E9E1D4]">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#ECE4D7]">
              <ShoppingBag size={30} className="text-[#C9A84C]/30" />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col pt-4">
          <div className="min-h-[2.8rem]">
            <h3 className="line-clamp-2 font-display text-[1.05rem] leading-[1.15] tracking-[-0.015em] text-[#0A0A0A] transition-colors duration-300 group-hover:text-[#8A6E2F] md:text-[1.2rem]">
              {product.name}
            </h3>
          </div>

          <div className="min-h-[3.2rem]">
            <p className="mt-2 line-clamp-2 font-body text-sm leading-[1.6] text-[#0A0A0A]/60">
              {product.description || "Une pièce choisie pour prolonger l’univers éditorial AFRIKHER."}
            </p>
          </div>

          <span className="mt-4 inline-flex items-center gap-2 font-body text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#C9A84C] transition-colors duration-300 group-hover:text-[#8A6E2F]">
            Découvrir
            <ArrowRight size={13} />
          </span>
        </div>
      </article>
    </Link>
  );
}

export default function BoutiquePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
          .select("id, name, description, external_url, images, status")
          .eq("status", "active")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setProducts(
          (data || []).map((product: any) => ({
            ...product,
            images: product.images || [],
          }))
        );
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#0A0A0A]">
      <div className="fixed left-0 right-0 top-0 z-[90] h-20 bg-[#0A0A0A]" />
      <Navbar />

      <section className="bg-[#0A0A0A] pb-16 pt-28 text-[#F5F0E8] md:pb-20 md:pt-32">
        <div className="mx-auto max-w-7xl px-6 text-center md:px-10 lg:px-12">
          <p className="font-body text-[0.7rem] uppercase tracking-[0.32em] text-[#C9A84C]">
            Sélection éditoriale
          </p>
          <h1 className="mt-3 font-display text-[3.4rem] leading-[0.94] text-[#F5F0E8] md:text-[5.6rem] lg:text-[6.5rem]">
            La Boutique<span className="text-[#C9A84C]">.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-3xl font-display text-[1.08rem] italic leading-[1.5] text-[#F5F0E8]/62 md:text-[1.3rem]">
            Une sélection de produits choisie comme un prolongement naturel de l’univers AFRIKHER.
          </p>
        </div>
      </section>

      <section className="bg-[#F5F0E8] pb-16 pt-14 md:pb-16 md:pt-16">
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
          <div className="max-w-[33rem]">
            <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
              Sélection en cours
            </p>
            <h2 className="mt-3 font-display text-[2.2rem] leading-[0.98] tracking-[-0.02em] text-[#0A0A0A] md:text-[2.9rem]">
              Une vitrine sobre, choisie avec intention
            </h2>
            <p className="mt-4 font-body text-[0.94rem] leading-[1.72] text-[#0A0A0A]/60">
              Des objets, créations et propositions présentés comme une sélection éditoriale, sans bruit superflu.
            </p>
          </div>

          <div className="mt-10">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" />
              </div>
            ) : products.length === 0 ? (
              <div className="border border-black/6 bg-white/72 px-8 py-16 text-center">
                <ShoppingBag size={44} className="mx-auto mb-4 text-[#9A9A8A]/30" />
                <p className="font-display text-[1.9rem] text-[#0A0A0A]/72">La sélection arrive bientôt</p>
                <p className="mt-3 font-body text-sm leading-[1.7] text-[#0A0A0A]/54">
                  La boutique AFRIKHER se construit comme une sélection éditoriale. Revenez bientôt pour découvrir les prochaines pièces.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 items-stretch gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#0A0A0A] py-14 md:py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="mb-3 font-body text-xs uppercase tracking-[0.35em] text-[#C9A84C]">
            Restez informée
          </p>
          <h2 className="mb-4 font-display text-3xl text-[#F5F0E8] md:text-4xl">
            Nouveautés & Offres Exclusives
          </h2>
          <p className="mb-8 font-body text-sm text-[#F5F0E8]/50">
            Recevez en avant-première nos nouvelles sélections et offres réservées aux abonnées.
          </p>
          <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 rounded-full border border-[#F5F0E8]/10 bg-[#F5F0E8]/10 px-5 py-3.5 font-body text-sm text-[#F5F0E8] placeholder:text-[#F5F0E8]/30 focus:border-[#C9A84C]/50 focus:outline-none"
            />
            <button className="rounded-full bg-[#C9A84C] px-6 py-3.5 font-body text-xs font-bold uppercase tracking-[0.15em] text-[#0A0A0A] transition-colors hover:bg-[#E8C97A]">
              S&apos;inscrire
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
