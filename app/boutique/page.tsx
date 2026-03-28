'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import AfrikherCard from '@/components/ui/afrikher-card';
import { createClient } from '@/lib/supabase/client';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  type: string;
}

export default function BoutiquePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('id, name, price, images, type')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (data) setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedType
    ? products.filter((p) => p.type === selectedType)
    : products;

  const types = [
    { value: 'book', label: 'Livres' },
    { value: 'bouquet', label: 'Bouquets' },
    { value: 'other', label: 'Autres' },
  ];

  return (
    <div className="min-h-screen bg-afrikher-cream">
      <section className="bg-afrikher-dark text-afrikher-cream py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 text-center">
            Boutique
          </h1>
          <p className="font-sans text-lg text-afrikher-gray text-center max-w-2xl mx-auto">
            Découvrez notre sélection exclusive de livres inspirants et de bouquets élégants
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setSelectedType(null)}
            className={`px-4 py-2 font-sans text-sm uppercase tracking-wide transition-all duration-300 ${
              selectedType === null
                ? 'bg-afrikher-gold text-afrikher-dark'
                : 'bg-white text-afrikher-dark hover:bg-afrikher-gold'
            }`}
          >
            Tous
          </button>
          {types.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`px-4 py-2 font-sans text-sm uppercase tracking-wide transition-all duration-300 ${
                selectedType === type.value
                  ? 'bg-afrikher-gold text-afrikher-dark'
                  : 'bg-white text-afrikher-dark hover:bg-afrikher-gold'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white h-80 mb-4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/boutique/${product.id}`}>
                <AfrikherCard className="group cursor-pointer hover:shadow-xl transition-all duration-300">
                  <div className="relative h-80 overflow-hidden bg-afrikher-cream">
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
                    <h3 className="font-display text-xl font-semibold text-afrikher-dark mb-2 group-hover:text-afrikher-gold transition-colors duration-300">
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
        )}
      </section>
    </div>
  );
}
