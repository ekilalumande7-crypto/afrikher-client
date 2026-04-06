"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/layout/Footer";
import MagazineBlogSection from "@/components/magazine/MagazineBlogSection";
import MagazineHeader from "@/components/magazine/MagazineHeader";
import MagazineHero from "@/components/magazine/MagazineHero";
import MagazineIssuesSection from "@/components/magazine/MagazineIssuesSection";
import MagazinePremiumCTA from "@/components/magazine/MagazinePremiumCTA";

interface Magazine {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image: string
  price: number;
  currency: string;
  page_count: number;
  status: string;
  published_at: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  published_at: string;
}

interface SiteConfig {
  [key: string]: string;
}

const demoMagazines: Magazine[] = [
  {
    id: "1",
    title: "AFRIKHER N°1 — L'Ascension",
    slug: "afrikher-n1-ascension",
    description: "Premier numero dedie a l'ascension des femmes entrepreneures en Afrique de l'Ouest.",
    cover_image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
    price: 9.99,
    currency: "EUR",
    page_count: 28,
    status: "published",
    published_at: "2026-03-24",
  },
  {
    id: "2",
    title: "AFRIKHER N°2 — Mode & Identite",
    slug: "afrikher-n2-mode-identite",
    description: "Le retour du pagne tisse dans la haute couture africaine contemporaine.",
    cover_image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1974&auto=format&fit=crop",
    price: 9.99,
    currency: "EUR",
    page_count: 28,
    status: "published",
    published_at: "2026-02-15",
  },
  {
    id: "3",
    title: "AFRIKHER N°3 — Tech & Innovation",
    slug: "afrikher-n3-tech-innovation",
    description: "Investir dans la tech africaine : les secteurs porteurs pour 2026.",
    cover_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    price: 12.99,
    currency: "EUR",
    page_count: 28,
    status: "published",
    published_at: "2026-01-10",
  },
  {
    id: "4",
    title: "AFRIKHER N°4 — Leadership au Feminin",
    slug: "afrikher-n4-leadership-feminin",
    description: "Les femmes qui faconnent le continent africain.",
    cover_image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
    price: 9.99,
    currency: "EUR",
    page_count: 28,
    status: "published",
    published_at: "2025-12-01",
  },
];

const demoBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "5 femmes qui transforment la FinTech africaine",
    slug: "femmes-fintech-africaine",
    excerpt: "Decouvrez les entrepreneures qui revolutionnent les services financiers sur le continent.",
    cover_image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
    published_at: "2026-03-28",
  },
  {
    id: "2",
    title: "Le style africain s'impose dans la mode internationale",
    slug: "style-africain-mode",
    excerpt: "Comment les createurs africains redefinissent les codes de la haute couture mondiale.",
    cover_image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=400&auto=format&fit=crop",
    published_at: "2026-03-25",
  },
  {
    id: "3",
    title: "Entreprendre en Afrique : guide pratique 2026",
    slug: "entreprendre-afrique-guide",
    excerpt: "Les etapes cles pour lancer son business en Afrique de l'Ouest cette annee.",
    cover_image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop",
    published_at: "2026-03-20",
  },
];

export default function MagazinePage() {
  const [magazines, setMagazines] = useState<Magazine[]>(demoMagazines);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(demoBlogPosts);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) throw new Error("No Supabase config");
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Check auth
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setUser(authUser);

        // Fetch site_config for hero
        const { data: configData } = await supabase.from("site_config").select("key, value");
        if (configData) {
          const config: SiteConfig = {};
          configData.forEach((row: any) => { config[row.key] = row.value; });
          setSiteConfig(config);
        }

        // Fetch magazines
        const { data: magData } = await supabase
          .from("magazines")
          .select("*")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(3);
        if (magData && magData.length > 0) setMagazines(magData);

        // Fetch blog posts
        const { data: blogData } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(3);
        if (blogData && blogData.length > 0) setBlogPosts(blogData);
      } catch {
        // Keep demo data
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const latestMagazine = magazines[0];
  const allMagazines = magazines;

  // Hero image from admin CMS or fallback
  const heroImage = siteConfig.magazine_hero_image || latestMagazine?.cover_image || "";
  const heroBadge = siteConfig.magazine_hero_badge || "AFRIKHER MAGAZINE";
  const heroTitle = siteConfig.magazine_hero_title || "Le magazine qui celebre la femme africaine entrepreneure";
  const heroSubtitle = siteConfig.magazine_hero_subtitle || "Portraits, interviews exclusives et analyses pour celles qui batissent l'Afrique de demain.";
  const heroPrimaryCtaLabel = siteConfig.magazine_hero_cta_primary_label || "Dernier numero";
  const heroPrimaryCtaHref = siteConfig.magazine_hero_cta_primary_href || "#issues-section";
  const heroSecondaryCtaLabel = siteConfig.magazine_hero_cta_secondary_label || "S'abonner";
  const heroSecondaryCtaHref = siteConfig.magazine_hero_cta_secondary_href || "/abonnement";

  return (
    <main className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth bg-[#F5F0E8]">
      <MagazineHeader isAuthenticated={Boolean(user)} />
      <MagazineHero
        loading={loading}
        latestMagazine={latestMagazine}
        heroImage={heroImage}
        heroBadge={heroBadge}
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
        heroPrimaryCtaLabel={heroPrimaryCtaLabel}
        heroPrimaryCtaHref={heroPrimaryCtaHref}
        heroSecondaryCtaLabel={heroSecondaryCtaLabel}
        heroSecondaryCtaHref={heroSecondaryCtaHref}
      />
      <MagazineIssuesSection magazines={allMagazines} />
      <MagazineBlogSection blogPosts={blogPosts} />
      <section className="snap-start min-h-screen bg-[#0A0A0A] flex flex-col">
        <div className="flex-1 flex items-center">
          <MagazinePremiumCTA compact />
        </div>
        <Footer compact />
      </section>
    </main>
  );
}
