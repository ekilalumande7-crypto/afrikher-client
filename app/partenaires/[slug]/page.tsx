"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Globe, Instagram, Linkedin, Mail, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PartnerItem {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  image_url: string;
  company_owner: string;
  role_label: string;
  short_description: string;
  long_description: string;
  website_url: string;
  linkedin_url: string;
  instagram_url: string;
  contact_email: string;
  featured: boolean;
  sort_order: number;
  is_active: boolean;
}

const DEFAULT_PARTNERS: PartnerItem[] = [
  {
    id: "technovolit-innovation",
    name: "TECHNOVOLIT INNOVATION",
    slug: "technovolit-innovation",
    logo_url: "",
    image_url: "",
    company_owner: "Christian Antamba",
    role_label: "Partenaire technologique",
    short_description: "Infrastructures, solutions digitales et innovation pour les entreprises.",
    long_description:
      "TechnoVolit Innovation accompagne la conception d'infrastructures numériques, de solutions digitales et de dispositifs d'innovation pour les entreprises, institutions et projets ambitieux.",
    website_url: "",
    linkedin_url: "",
    instagram_url: "",
    contact_email: "",
    featured: true,
    sort_order: 0,
    is_active: true,
  },
  {
    id: "fidpay",
    name: "FIDPAY",
    slug: "fidpay",
    logo_url: "",
    image_url: "",
    company_owner: "Christian Antamba",
    role_label: "Partenaire paiement",
    short_description: "Solution de paiement sécurisée pour particuliers, entreprises et diaspora.",
    long_description:
      "FidPay propose des solutions de paiement fiables, modernes et accessibles, pensées pour simplifier les transactions locales et internationales.",
    website_url: "",
    linkedin_url: "",
    instagram_url: "",
    contact_email: "",
    featured: true,
    sort_order: 1,
    is_active: true,
  },
];

function parsePartners(raw: string | undefined): PartnerItem[] {
  if (!raw) return DEFAULT_PARTNERS;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_PARTNERS;
    return parsed
      .map((item: any, index: number) => ({
        id: String(item.id || `partner-${index}`),
        name: item.name || "",
        slug: item.slug || "",
        logo_url: item.logo_url || "",
        image_url: item.image_url || item.cover_image || "",
        company_owner: item.company_owner || "",
        role_label: item.role_label || "",
        short_description: item.short_description || "",
        long_description: item.long_description || "",
        website_url: item.website_url || "",
        linkedin_url: item.linkedin_url || "",
        instagram_url: item.instagram_url || "",
        contact_email: item.contact_email || "",
        featured: Boolean(item.featured),
        sort_order: Number.isFinite(item.sort_order) ? item.sort_order : index,
        is_active: item.is_active !== false,
      }))
      .filter((item) => item.is_active)
      .sort((a, b) => Number(b.featured) - Number(a.featured) || a.sort_order - b.sort_order);
  } catch {
    return DEFAULT_PARTNERS;
  }
}

export default function PartnerDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || "";
  const [partners, setPartners] = useState<PartnerItem[]>(DEFAULT_PARTNERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await supabase
          .from("site_config")
          .select("key, value")
          .eq("key", "partners_items")
          .maybeSingle();

        setPartners(parsePartners(data?.value));
      } catch (err) {
        console.error("Partner detail load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const partner = useMemo(
    () => partners.find((item) => item.slug === slug) || null,
    [partners, slug]
  );

  const related = useMemo(
    () => partners.filter((item) => item.slug !== slug).slice(0, 3),
    [partners, slug]
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F0E8] text-[#0A0A0A]">
        <Navbar />
        <div className="flex items-center justify-center py-48">
          <Loader2 size={40} className="animate-spin text-[#C9A84C]" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!partner) {
    return (
      <main className="min-h-screen bg-[#F5F0E8] text-[#0A0A0A]">
        <Navbar />
        <div className="flex flex-col items-center justify-center px-6 py-48 text-center">
          <h1 className="font-display text-[2.8rem]">Partenaire introuvable</h1>
          <p className="mt-4 max-w-xl font-body text-[0.96rem] leading-[1.75] text-[#0A0A0A]/58">
            Ce partenaire n&apos;est pas disponible pour le moment.
          </p>
          <Link
            href="/partenaires"
            className="mt-8 inline-flex items-center gap-3 border border-[#0A0A0A]/12 px-6 py-3 font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#0A0A0A] transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C]"
          >
            Retour aux partenaires
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#0A0A0A]">
      <div className="fixed left-0 right-0 top-0 z-[90] h-20 bg-[#0A0A0A]" />
      <Navbar />

      <section className="px-6 pb-16 pt-28 md:pb-20 md:pt-32">
        <div className="mx-auto max-w-7xl md:px-10 lg:px-12">
          <div className="mb-6 flex items-center gap-2 font-body text-xs text-[#8D877C]">
            <Link href="/" className="hover:text-[#C9A84C] transition-colors">Accueil</Link>
            <span>›</span>
            <Link href="/partenaires" className="hover:text-[#C9A84C] transition-colors">Partenaires</Link>
            <span>›</span>
            <span className="text-[#0A0A0A]">{partner.name}</span>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-12 lg:gap-16">
            <div className="space-y-4">
              <div className="aspect-[4/3] overflow-hidden bg-[#ECE4D7]">
                {partner.image_url ? (
                  <img src={partner.image_url} alt={partner.name} className="h-full w-full object-cover" />
                ) : partner.logo_url ? (
                  <div className="flex h-full w-full items-center justify-center bg-[#F1EBDD]">
                    <img src={partner.logo_url} alt={partner.name} className="max-h-28 max-w-[70%] object-contain" />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#F1EBDD]">
                    <span className="font-display text-5xl text-[#C9A84C]/35">{partner.name.charAt(0)}</span>
                  </div>
                )}
              </div>

              {partner.logo_url && partner.image_url && (
                <div className="border border-black/8 bg-[#FBF7F0] p-6">
                  <img src={partner.logo_url} alt={partner.name} className="max-h-16 max-w-[12rem] object-contain" />
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <p className="font-body text-[0.68rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
                {partner.role_label || "Partenaire"}
              </p>
              <h1 className="mt-3 font-display text-[2.8rem] leading-[0.96] tracking-[-0.03em] md:text-[4.2rem]">
                {partner.name}
              </h1>
              {partner.company_owner && (
                <p className="mt-4 font-body text-[1rem] leading-[1.7] text-[#0A0A0A]/62">
                  {partner.company_owner}
                </p>
              )}

              <p className="mt-5 max-w-[34rem] font-body text-[0.98rem] leading-[1.8] text-[#0A0A0A]/68">
                {partner.long_description || partner.short_description}
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {partner.website_url && (
                  <a
                    href={partner.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 border border-[#0A0A0A]/12 px-5 py-3 font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#0A0A0A] transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C]"
                  >
                    <Globe size={14} />
                    Site web
                  </a>
                )}
                {partner.contact_email && (
                  <a
                    href={`mailto:${partner.contact_email}`}
                    className="inline-flex items-center gap-3 border border-[#0A0A0A]/12 px-5 py-3 font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#0A0A0A] transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C]"
                  >
                    <Mail size={14} />
                    Contact
                  </a>
                )}
                {partner.linkedin_url && (
                  <a
                    href={partner.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 border border-[#0A0A0A]/12 px-5 py-3 font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#0A0A0A] transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C]"
                  >
                    <Linkedin size={14} />
                    LinkedIn
                  </a>
                )}
                {partner.instagram_url && (
                  <a
                    href={partner.instagram_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 border border-[#0A0A0A]/12 px-5 py-3 font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#0A0A0A] transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C]"
                  >
                    <Instagram size={14} />
                    Instagram
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-[#0A0A0A]/5 px-6 py-16 md:py-18">
          <div className="mx-auto max-w-7xl md:px-10 lg:px-12">
            <div className="mb-10 max-w-[32rem]">
              <p className="font-body text-[0.68rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
                Autres partenaires
              </p>
              <h2 className="mt-3 font-display text-[2.2rem] leading-[0.98] tracking-[-0.02em] md:text-[2.8rem]">
                D&apos;autres alliances dans l&apos;écosystème
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <Link key={item.id} href={`/partenaires/${item.slug}`} className="group block h-full no-underline">
                  <article className="flex h-full flex-col border border-black/8 bg-[#FBF7F0] p-6 transition-colors duration-300 group-hover:border-[#C9A84C]/40">
                    <div className="aspect-[4/3] overflow-hidden bg-[#ECE4D7]">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#F1EBDD]">
                          <span className="font-display text-3xl text-[#C9A84C]/35">{item.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col pt-5">
                      <p className="font-body text-[0.66rem] uppercase tracking-[0.24em] text-[#8A6E2F]">
                        {item.role_label || "Partenaire"}
                      </p>
                      <h3 className="mt-3 line-clamp-2 font-display text-[1.45rem] leading-[1.08] tracking-[-0.02em] text-[#0A0A0A]">
                        {item.name}
                      </h3>
                      <p className="mt-3 line-clamp-3 font-body text-[0.94rem] leading-[1.72] text-[#0A0A0A]/60">
                        {item.short_description}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-2 pt-5 font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">
                        Découvrir
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
