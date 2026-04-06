"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Eye,
  Search,
} from "lucide-react";

interface Magazine {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image: string;
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
    description:
      "Premier numero dedie a l'ascension des femmes entrepreneures en Afrique de l'Ouest.",
    cover_image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
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
    description:
      "Le retour du pagne tisse dans la haute couture africaine contemporaine.",
    cover_image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1974&auto=format&fit=crop",
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
    description:
      "Investir dans la tech africaine : les secteurs porteurs pour 2026.",
    cover_image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
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
    cover_image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
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
    excerpt:
      "Decouvrez les entrepreneures qui revolutionnent les services financiers sur le continent.",
    cover_image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
    published_at: "2026-03-28",
  },
  {
    id: "2",
    title: "Le style africain s'impose dans la mode internationale",
    slug: "style-africain-mode",
    excerpt:
      "Comment les createurs africains redefinissent les codes de la haute couture mondiale.",
    cover_image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=400&auto=format&fit=crop",
    published_at: "2026-03-25",
  },
  {
    id: "3",
    title: "Entreprendre en Afrique : guide pratique 2026",
    slug: "entreprendre-afrique-guide",
    excerpt:
      "Les etapes cles pour lancer son business en Afrique de l'Ouest cette annee.",
    cover_image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop",
    published_at: "2026-03-20",
  },
];

export default function MagazinePage() {
  const [magazines, setMagazines] = useState<Magazine[]>(demoMagazines);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(demoBlogPosts);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) throw new Error("No Supabase config");
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data: configData } = await supabase
          .from("site_config")
          .select("key, value");

        if (configData) {
          const config: SiteConfig = {};
          configData.forEach((row: { key: string; value: string }) => {
            config[row.key] = row.value;
          });
          setSiteConfig(config);
        }

        const { data: magData } = await supabase
          .from("magazines")
          .select("*")
          .eq("status", "published")
          .order("published_at", { ascending: false });

        if (magData && magData.length > 0) {
          setMagazines(magData);
        }

        const { data: blogData } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(3);

        if (blogData && blogData.length > 0) {
          setBlogPosts(blogData);
        }
      } catch {
        // Keep demo data as fallback.
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredMagazines = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return magazines;

    return magazines.filter((magazine) => {
      return (
        magazine.title.toLowerCase().includes(query) ||
        magazine.description.toLowerCase().includes(query)
      );
    });
  }, [magazines, searchQuery]);

  const latestMagazine = filteredMagazines[0] || magazines[0];
  const secondaryMagazines = filteredMagazines.slice(1, 4);
  const archiveMagazines = filteredMagazines.slice(4);

  const heroImage =
    siteConfig.magazine_hero_image ||
    latestMagazine?.cover_image ||
    demoMagazines[0].cover_image;
  const heroTitle =
    siteConfig.magazine_hero_title ||
    "Le magazine des femmes qui imposent leur vision.";
  const heroSubtitle =
    siteConfig.magazine_hero_subtitle ||
    "Portraits, interviews exclusives et analyses pour celles qui batissent l'Afrique de demain.";

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8]">
      <Navbar />

      <section className="relative overflow-hidden border-b border-white/10 pt-28">
        <div className="absolute inset-0">
          {loading ? (
            <div className="h-full w-full animate-pulse bg-[#151515]" />
          ) : (
            <img
              src={heroImage}
              alt="AFRIKHER Magazine"
              className="h-full w-full object-cover grayscale"
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(10,10,10,0.94)_0%,rgba(10,10,10,0.7)_42%,rgba(10,10,10,0.35)_72%,rgba(10,10,10,0.2)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,168,76,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(245,240,232,0.08),transparent_24%)]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-20 md:px-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:pb-28">
          <div className="space-y-8">
            <div className="space-y-5">
              <span className="inline-flex items-center border border-[#C9A84C]/30 px-4 py-2 text-[0.65rem] uppercase tracking-[0.35em] text-[#C9A84C]">
                Edition Magazine
              </span>
              <div className="space-y-3">
                <p className="font-body text-[0.72rem] uppercase tracking-[0.32em] text-[#9A9A8A]">
                  Dernier numero
                </p>
                <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[0.96] text-[#F5F0E8] md:text-7xl">
                  {heroTitle}
                </h1>
              </div>
              <p className="max-w-xl font-body text-sm leading-8 text-[#F5F0E8]/72 md:text-base">
                {heroSubtitle}
              </p>
            </div>

            <div className="grid gap-6 border-t border-white/10 pt-8 md:grid-cols-3">
              {[
                ["Parution", latestMagazine ? formatDate(latestMagazine.published_at) : "Edition en cours"],
                ["Format", "Digital premium"],
                ["Acces", "Abonnement AFRIKHER"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="font-body text-[0.65rem] uppercase tracking-[0.28em] text-[#9A9A8A]">
                    {label}
                  </p>
                  <p className="mt-3 font-display text-2xl text-[#F5F0E8]">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/abonnement"
                className="inline-flex items-center justify-center border border-[#C9A84C] bg-[#C9A84C] px-8 py-4 font-body text-[0.72rem] uppercase tracking-[0.26em] text-[#0A0A0A] transition hover:bg-[#E8C97A]"
              >
                S'abonner pour lire
              </Link>
              {latestMagazine && (
                <Link
                  href={`/magazine/${latestMagazine.slug}`}
                  className="inline-flex items-center justify-center gap-3 border border-white/15 px-8 py-4 font-body text-[0.72rem] uppercase tracking-[0.26em] text-[#F5F0E8] transition hover:border-[#C9A84C]/60 hover:text-[#C9A84C]"
                >
                  Explorer le numero
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>

          {latestMagazine && (
            <div className="relative">
              <div className="absolute -left-6 top-8 hidden h-[74%] w-px bg-[#C9A84C]/35 lg:block" />
              <div className="absolute -top-6 right-10 hidden h-24 w-24 rounded-full border border-[#C9A84C]/20 lg:block" />
              <Link
                href={`/magazine/${latestMagazine.slug}`}
                className="group relative block overflow-hidden border border-white/10 bg-[#111111] p-4 shadow-[0_40px_100px_rgba(0,0,0,0.45)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={latestMagazine.cover_image}
                    alt={latestMagazine.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="font-body text-[0.62rem] uppercase tracking-[0.32em] text-[#C9A84C]">
                      Cover Story
                    </p>
                    <h2 className="mt-3 font-display text-3xl leading-tight text-white">
                      {latestMagazine.title}
                    </h2>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </section>

      {latestMagazine && (
        <section className="border-b border-white/10 bg-[#111111]">
          <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">
            <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
              <Link
                href={`/magazine/${latestMagazine.slug}`}
                className="group grid gap-8 border border-white/8 bg-black/20 p-6 md:grid-cols-[1.05fr_0.95fr] md:p-8"
              >
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="border border-[#C9A84C]/30 px-3 py-1 text-[0.62rem] uppercase tracking-[0.28em] text-[#C9A84C]">
                      A la une
                    </span>
                    <span className="font-body text-[0.68rem] uppercase tracking-[0.24em] text-[#9A9A8A]">
                      Magazine digital
                    </span>
                  </div>
                  <div>
                    <p className="font-body text-[0.68rem] uppercase tracking-[0.26em] text-[#9A9A8A]">
                      Editorial du mois
                    </p>
                    <h3 className="mt-4 font-display text-4xl leading-tight text-[#F5F0E8] transition group-hover:text-[#C9A84C]">
                      {latestMagazine.title}
                    </h3>
                  </div>
                  <p className="max-w-xl font-body text-sm leading-8 text-[#F5F0E8]/70">
                    {latestMagazine.description}
                  </p>
                  <div className="flex items-center gap-6 font-body text-[0.72rem] uppercase tracking-[0.24em] text-[#9A9A8A]">
                    <span>{formatDate(latestMagazine.published_at)}</span>
                    <span className="flex items-center gap-2">
                      <Clock3 size={14} className="text-[#C9A84C]" />
                      {latestMagazine.page_count} pages
                    </span>
                  </div>
                </div>

                <div className="overflow-hidden">
                  <img
                    src={latestMagazine.cover_image}
                    alt={latestMagazine.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
              </Link>

              <div className="space-y-6">
                {secondaryMagazines.map((magazine) => (
                  <Link
                    key={magazine.id}
                    href={`/magazine/${magazine.slug}`}
                    className="group flex gap-5 border-b border-white/8 pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="h-28 w-24 shrink-0 overflow-hidden bg-white/5">
                      <img
                        src={magazine.cover_image}
                        alt={magazine.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-3">
                      <p className="font-body text-[0.62rem] uppercase tracking-[0.28em] text-[#C9A84C]">
                        Numero
                      </p>
                      <h4 className="font-display text-2xl leading-tight text-[#F5F0E8] transition group-hover:text-[#C9A84C]">
                        {magazine.title}
                      </h4>
                      <p className="font-body text-sm leading-7 text-[#F5F0E8]/60">
                        {magazine.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#F5F0E8] text-[#0A0A0A]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="font-body text-[0.68rem] uppercase tracking-[0.32em] text-[#9A9A8A]">
                Nos numeros
              </p>
              <h2 className="mt-4 font-display text-5xl leading-none">
                Une selection qui ressemble a une salle de lecture privee.
              </h2>
            </div>

            <div className="flex w-full flex-col gap-6 lg:max-w-md">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A9A8A]"
                />
                <input
                  type="text"
                  placeholder="Rechercher un numero"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full border border-black/10 bg-white px-12 py-4 font-body text-sm outline-none transition placeholder:text-[#9A9A8A] focus:border-[#C9A84C]"
                />
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {filteredMagazines.slice(0, 4).map((magazine, index) => (
              <Link
                key={magazine.id}
                href={`/magazine/${magazine.slug}`}
                className={`group flex flex-col border border-black/8 bg-white p-4 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(10,10,10,0.08)] ${
                  index === 0 ? "xl:col-span-2 xl:grid xl:grid-cols-[1.05fr_0.95fr] xl:gap-6 xl:p-6" : ""
                }`}
              >
                <div className="overflow-hidden bg-black/5">
                  <img
                    src={magazine.cover_image}
                    alt={magazine.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className={`flex flex-1 flex-col pt-5 ${index === 0 ? "xl:pt-0" : ""}`}>
                  <p className="font-body text-[0.62rem] uppercase tracking-[0.28em] text-[#C9A84C]">
                    Numero AFRIKHER
                  </p>
                  <h3 className="mt-3 font-display text-3xl leading-tight text-[#0A0A0A] transition group-hover:text-[#8A6E2F]">
                    {magazine.title}
                  </h3>
                  <p className="mt-4 font-body text-sm leading-7 text-[#2A2A2A]/72">
                    {magazine.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-6 font-body text-[0.7rem] uppercase tracking-[0.22em] text-[#9A9A8A]">
                    <span>{magazine.page_count} pages</span>
                    <span className="inline-flex items-center gap-2 text-[#0A0A0A]">
                      Lire
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {archiveMagazines.length > 0 && (
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {archiveMagazines.map((magazine) => (
                <Link
                  key={magazine.id}
                  href={`/magazine/${magazine.slug}`}
                  className="group border-t border-black/10 pt-6"
                >
                  <div className="flex items-center justify-between font-body text-[0.62rem] uppercase tracking-[0.26em] text-[#9A9A8A]">
                    <span>Edition</span>
                    <span>{formatDate(magazine.published_at)}</span>
                  </div>
                  <h4 className="mt-4 font-display text-2xl leading-tight text-[#0A0A0A] transition group-hover:text-[#8A6E2F]">
                    {magazine.title}
                  </h4>
                  <p className="mt-3 font-body text-sm leading-7 text-[#2A2A2A]/70">
                    {magazine.description}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#111111]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="font-body text-[0.68rem] uppercase tracking-[0.3em] text-[#9A9A8A]">
                Le blog
              </p>
              <h2 className="mt-3 font-display text-5xl leading-none text-[#F5F0E8]">
                Les prolongements editoriaux du numero.
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden md:inline-flex items-center gap-3 border border-[#C9A84C]/30 px-6 py-4 font-body text-[0.68rem] uppercase tracking-[0.24em] text-[#C9A84C] transition hover:border-[#C9A84C] hover:bg-[#C9A84C]/10"
            >
              Voir le blog
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group border border-white/8 bg-white/[0.02] p-4 transition hover:-translate-y-1 hover:border-[#C9A84C]/20"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white">
                    <Eye size={16} />
                  </div>
                </div>
                <div className="mt-5">
                  <p className="font-body text-[0.62rem] uppercase tracking-[0.28em] text-[#C9A84C]">
                    Blog AFRIKHER
                  </p>
                  <h3 className="mt-3 font-display text-2xl leading-tight text-[#F5F0E8] transition group-hover:text-[#C9A84C]">
                    {post.title}
                  </h3>
                  <p className="mt-3 font-body text-sm leading-7 text-[#F5F0E8]/62">
                    {post.excerpt}
                  </p>
                  <div className="mt-6 flex items-center gap-3 font-body text-[0.68rem] uppercase tracking-[0.24em] text-[#9A9A8A]">
                    <Clock3 size={14} className="text-[#C9A84C]" />
                    {formatDate(post.published_at)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0D0D0D]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:px-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <p className="font-body text-[0.68rem] uppercase tracking-[0.3em] text-[#9A9A8A]">
              Acces premium
            </p>
            <h2 className="font-display text-5xl leading-none text-[#F5F0E8]">
              Plus qu’un numero. Une appartenance editoriale.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              "Lecture integrale des editions premium",
              "Acces prioritaire aux contenus inedits",
              "Selection boutique et experiences reservees",
            ].map((item) => (
              <div key={item} className="border border-white/10 bg-white/[0.03] p-6">
                <div className="mb-6 h-px w-10 bg-[#C9A84C]" />
                <p className="font-body text-sm leading-7 text-[#F5F0E8]/74">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function formatDate(value?: string) {
  if (!value) return "Edition en cours";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
