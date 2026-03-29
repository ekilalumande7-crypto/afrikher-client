import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: string;
    image: string;
    type: string;
  };
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  return (
    <div className={cn("group", className)}>
      <div className="relative aspect-square overflow-hidden bg-brand-charcoal mb-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Link
            href={`/boutique/${product.id}`}
            className="bg-brand-cream text-brand-dark p-4 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform"
          >
            <ShoppingBag size={24} />
          </Link>
        </div>
      </div>
      <div className="text-center">
        <span className="text-[10px] uppercase tracking-widest text-brand-gray mb-2 block">{product.type}</span>
        <h3 className="text-xl font-display font-bold mb-2">{product.name}</h3>
        <p className="text-brand-gold font-medium">{product.price} €</p>
      </div>
    </div>
  );
}
