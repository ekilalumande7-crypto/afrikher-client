'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import AfrikherCard from '@/components/ui/afrikher-card';
import AfrikherButton from '@/components/ui/afrikher-button';
import { createClient } from '@/lib/supabase/client';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  type: string;
}

export default function BoutiquePreview() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('id, name, price, images, type')
        .eq('status', 'active')
        .eq('featured', true)
        .limit(3);

      if (data) {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-afrikher-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-afrikher-cream mb-4">
              Notre Boutique
            </h2>
            <div className="w-24 h-1 bg-afrikher-gold mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-afrikher-charcoal h-80 mb-4"></div>
                <div className="h-4 bg-afrikher-charcoal mb-2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-afrikher-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-afrikher-cream mb-4">
            Notre Boutique
          </h2>
          <div className="w-24 h-1 bg-afrikher-gold mx-auto mb-6"></div>
          <p className="font-sans text-lg text-afrikher-gray max-w-2xl mx-auto">
            Découvrez notre sélection exclusive de livres inspirants et de bouquets élégants
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {products.map((product) => (
            <Link key={product.id} href={`/boutique/${product.id}`}>
              <AfrikherCard theme="dark" className="group cursor-pointer hover:shadow-2xl transition-all duration-300">
                <div className="relative h-80 overflow-hidden bg-afrikher-charcoal">
                  <img
                    src={product.images[0] || '/images/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-afrikher-dark to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                    <div className="flex items-center space-x-2 text-afrikher-gold">
                      <ShoppingBag className="w-5 h-5" />
                      <span className="font-sans text-sm uppercase tracking-wide">Voir le produit</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold text-afrikher-cream mb-2 group-hover:text-afrikher-gold transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="font-sans text-2xl font-bold text-afrikher-gold">
                    {product.price.toFixed(2)} €
                  </p>
                </div>
              </AfrikherCard>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/boutique">
            <AfrikherButton variant="gold" size="lg">
              Découvrir La Boutique
            </AfrikherButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
