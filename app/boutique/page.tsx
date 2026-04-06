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
  price: number | null;
  external_url: string | null;
  images: string[];
  type: string;
  stock: number;
  unlimited: boolean;
  status: string;
  partner_id: string | null;
}

function ProductCard({ product }: { product: Product }) {
  const href = product.external_url?.trim() || `/boutique/${product.id}`;
  const isExternal = Boolean(product.external_url?.trim());

  const cardContent = (
    <article className="group flex h-full flex-col">
      <div className="overflow-hidden rounded-[1.4rem] border border-black/6 bg-white/70">
        <div className="aspect-[4/5] overflow-hidden bg-[#E9E1D4]">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingBag size={34} className="text-[#C9A84C]/30" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <div className="min-h-[5.4rem]">
          <h3 className="line-clamp-3 font-display text-[1.9rem] leading-[1.04] tracking-[-0.02em] text-[#0A0A0A] transition-colors duration-300 group-hover:text-[#8A6E2F]">
            {product.name}
          </h3>
        </div>

        <div className="min-h-[4.8rem]">
          <p className="mt-3 line-clamp-2 font-body text-[0.94rem] leading-[1.78] text-[#0A0A0A]/58">
            {product.description || "Une sélection AFRIKHER pensée comme une pièce de collection à découvrir."}
          </p>
        </div>

        <span className="mt-auto inline-flex items-center gap-2 pt-5 font-body text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#C9A84C] transition-colors duration-300 group-hover:text-[#8A6E2F]">
          Découvrir
          <ArrowRight size={14} />
        </span>
      </div>
    </article>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="block h-full no-underline">
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={href} className="block h-full no-underline">
      {cardContent}
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
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false });

        if (error) throw error;

        const prods: Product[] = (data || []).map((p: any) => ({
          ...p,
          images: p.images || [],
        }));

        setProducts(prods);
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

      <section className="relative overflow-hidden bg-[#0A0A0A] pb-16 pt-36 text-[#F5F0E8] md:pb-20">
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="absolute left-[8%] top-8 h-56 w-56 rounded-full border border-[#C9A84C]" />
          <div className="absolute right-[10%] top-16 h-40 w-40 rounded-full border border-[#C9A84C]" />
          <div className="absolute bottom-0 left-1/2 h-32 w-[70%] -translate-x-1/2 border-t border-[#C9A84C]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <p className="mb-4 font-body text-xs uppercase tracking-[0.35em] text-[#C9A84C]">
            Sélection éditoriale
          </p>
          <h1 className="font-display text-5xl leading-[0.95] text-[#F5F0E8] md:text-7xl lg:text-8xl">
            La Boutique<span className="text-[#C9A84C]">.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-3xl font-display text-lg italic text-[#F5F0E8]/62 md:text-[1.45rem]">
            Une sélection élégante de créations, d’objets et de pièces choisies pour prolonger l’univers AFRIKHER.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
          <div className="mb-12 max-w-[40rem]">
            <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
              Sélection en cours
            </p>
            <h2 className="mt-4 font-display text-[2.5rem] leading-[0.96] tracking-[-0.02em] text-[#0A0A0A] md:text-[3.35rem]">
              Des pièces choisies avec le regard AFRIKHER
            </h2>
            <p className="mt-4 font-body text-[0.96rem] leading-[1.8] text-[#0A0A0A]/58">
              Chaque proposition est pensée comme une découverte éditoriale. Moins de bruit, plus d’intention, plus de présence.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" />
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-[1.8rem] border border-black/6 bg-white/72 px-8 py-20 text-center">
              <ShoppingBag size={48} className="mx-auto mb-4 text-[#9A9A8A]/30" />
              <p className="font-display text-[2rem] text-[#0A0A0A]/72">La sélection arrive bientôt</p>
              <p className="mt-3 font-body text-sm text-[#0A0A0A]/52">
                La boutique AFRIKHER se construit comme un catalogue éditorial. Revenez bientôt pour découvrir les prochaines pièces.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 items-stretch gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#0A0A0A] py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="mb-3 font-body text-xs uppercase tracking-[0.35em] text-[#C9A84C]">
            Restez informée
          </p>
          <h2 className="mb-4 font-display text-3xl text-[#F5F0E8] md:text-4xl">
            Nouveautés & Offres Exclusives
          </h2>
          <p className="mb-8 font-body text-sm text-[#F5F0E8]/50">
            Recevez en avant-première nos nouvelles collections et offres réservées aux abonnées.
          </p>
          <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 rounded-full border border-[#F5F0E8]/10 bg-[#F5F0E8]/10 px-5 py-3.5 font-body text-sm text-[#F5F0E8] placeholder:text-[#F5F0E8]/30 focus:border-[#C9A84C]/50 focus:outline-none"
            />
            <button className="rounded-full bg-[#C9A84C] px-6 py-3.5 font-body text-xs font-bold uppercase tracking-[0.15em] text-[#0A0A0A] transition-colors hover:bg-[#E8C97A]">
              S'inscrire
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
