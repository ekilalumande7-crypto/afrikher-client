import Link from "next/link";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    image: string;
    date: string;
    slug: string;
  };
  className?: string;
}

export default function ArticleCard({ article, className }: ArticleCardProps) {
  return (
    <div className={cn("group cursor-pointer", className)}>
      <Link href={`/magazine/${article.slug}`}>
        <div className="aspect-[4/5] overflow-hidden mb-6 bg-brand-charcoal">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </div>
        <span className="text-brand-gold font-medium uppercase tracking-widest text-xs mb-3 block">
          {article.category}
        </span>
        <h3 className="text-2xl font-display font-bold mb-4 group-hover:text-brand-gold transition-colors">
          {article.title}
        </h3>
        <p className="text-brand-gray text-sm leading-relaxed mb-6 line-clamp-2">
          {article.excerpt}
        </p>
        <span className="text-[10px] uppercase tracking-widest text-brand-gray/60">
          {article.date}
        </span>
      </Link>
    </div>
  );
}
