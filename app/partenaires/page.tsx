"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Loader2, Mail, Globe } from "lucide-react";
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

export default function PartenairesPage() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [partners, setPartners] = useState<PartnerItem[]>(DEFAULT_PARTNERS);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await supabase
          .from("site_config")
          .select("key, value")
          .like("key", "partners_%");

        const map: Record<string, string> = {};
        data?.forEach((row: { key: string; value: string }) => {
          map[row.key] = row.value || "";
        });
        setConfig(map);
        setPartners(parsePartners(map.partners_items));
      } catch (err) {
        console.error("Partners config load error:", err);
      } finally {
        setPageLoading(false);
      }
    }
    loadData();
  }, []);

  const activePartners = useMemo(() => partners.filter((partner) => partner.is_active !== false), [partners]);

  if (pageLoading) {
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

  if (config.partners_enabled === "false") {
    return (
      <main className="min-h-screen bg-[#F5F0E8] text-[#0A0A0A]">
        <Navbar />
        <section className="bg-[#0A0A0A] px-6 pb-24 pt-28 text-[#F5F0E8] md:pb-28 md:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-body text-[0.72rem] uppercase tracking-[0.34em] text-[#C9A84C]">
              Écosystème AFRIKHER
            </p>
            <h1 className="mt-3 font-display text-[3.4rem] leading-[0.94] tracking-[-0.03em] md:text-[5.4rem]">
              Partenaires
            </h1>
            <p className="mx-auto mt-4 max-w-2xl font-display text-[1.04rem] italic leading-[1.5] text-[#F5F0E8]/64 md:text-[1.22rem]">
              La page partenaires sera disponible prochainement.
            </p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#0A0A0A]">
      <div className="fixed left-0 right-0 top-0 z-[90] h-20 bg-[#0A0A0A]" />
      <Navbar />

      <section className="bg-[#0A0A0A] px-6 pb-16 pt-28 text-[#F5F0E8] md:pb-20 md:pt-32">
        <div className="mx-auto max-w-5xl text-center md:px-10 lg:px-12">
          <p className="font-body text-[0.72rem] uppercase tracking-[0.34em] text-[#C9A84C]">
            {config.partners_hero_label || "Écosystème AFRIKHER"}
          </p>
          <h1 className="mt-3 font-display text-[3.4rem] leading-[0.94] tracking-[-0.03em] md:text-[5.4rem]">
            {config.partners_hero_title || "Partenaires"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-display text-[1.04rem] italic leading-[1.5] text-[#F5F0E8]/64 md:text-[1.22rem]">
            {config.partners_hero_subtitle ||
              "Ensemble, nous bâtissons un écosystème d'excellence autour des projets, services et ambitions portés par AFRIKHER."}
          </p>
          <div className="mx-auto mt-6 h-px w-24 bg-[#C9A84C]/75" />
        </div>
      </section>

      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-7xl md:px-10 lg:px-12">
          <div className="max-w-[35rem]">
            <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.32em] text-[#C9A84C]">
              {config.partners_intro_label || "Sélection de partenaires"}
            </p>
            <h2 className="mt-3 font-display text-[2.2rem] leading-[0.98] tracking-[-0.02em] md:text-[3rem]">
              {config.partners_intro_title || "Des alliances construites avec intention"}
            </h2>
            <p className="mt-4 font-body text-[0.96rem] leading-[1.72] text-[#0A0A0A]/60">
              {config.partners_intro_text ||
                "AFRIKHER construit un écosystème avec des partenaires choisis pour leur capacité à renforcer l'expérience, l'innovation et la confiance autour de ses lectrices, créatrices et abonnées."}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
            {activePartners.map((partner) => (
              <Link
                key={partner.id}
                href={`/partenaires/${partner.slug}`}
                className="group block h-full no-underline"
              >
                <article className="flex h-full flex-col border border-black/8 bg-[#FBF7F0] p-6 transition-colors duration-300 group-hover:border-[#C9A84C]/40">
                  <div className="aspect-[4/3] overflow-hidden bg-[#ECE4D7]">
                    {partner.image_url ? (
                      <img
                        src={partner.image_url}
                        alt={partner.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#F1EBDD]">
                        {partner.logo_url ? (
                          <img src={partner.logo_url} alt={partner.name} className="max-h-16 max-w-[70%] object-contain" />
                        ) : (
                          <span className="font-display text-3xl text-[#C9A84C]/35">
                            {partner.name.charAt(0)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col pt-5">
                    <p className="font-body text-[0.66rem] uppercase tracking-[0.24em] text-[#8A6E2F]">
                      {partner.role_label || "Partenaire"}
                    </p>
                    <h3 className="mt-3 line-clamp-2 font-display text-[1.45rem] leading-[1.08] tracking-[-0.02em] text-[#0A0A0A] transition-colors duration-300 group-hover:text-[#8A6E2F]">
                      {partner.name}
                    </h3>
                    {partner.company_owner && (
                      <p className="mt-2 font-body text-sm leading-[1.6] text-[#0A0A0A]/54">
                        {partner.company_owner}
                      </p>
                    )}
                    <p className="mt-3 line-clamp-3 font-body text-[0.94rem] leading-[1.72] text-[#0A0A0A]/60">
                      {partner.short_description}
                    </p>

                    <span className="mt-auto inline-flex items-center gap-2 pt-5 font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">
                      Découvrir
                      <ArrowRight size={14} />
                    </span>

                    <div className="mt-5 flex items-center gap-3 text-[#8D877C]">
                      {partner.contact_email && <Mail size={14} />}
                      {partner.website_url && <Globe size={14} />}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0A0A0A] px-6 py-14 text-[#F5F0E8] md:py-16">
        <div className="mx-auto max-w-5xl text-center md:px-10 lg:px-12">
          <h2 className="font-display text-[2.2rem] leading-[0.98] tracking-[-0.02em] md:text-[3rem]">
            {config.partners_cta_title || "Devenir partenaire"}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl font-body text-[0.96rem] leading-[1.75] text-[#F5F0E8]/60">
            {config.partners_cta_text ||
              "Vous souhaitez associer votre marque, votre solution ou votre savoir-faire à AFRIKHER et rejoindre un écosystème éditorial exigeant ? Parlons-en."}
          </p>
          <Link
            href={config.partners_cta_link || "/contact"}
            className="mt-8 inline-flex items-center gap-3 border border-[#C9A84C] px-6 py-3 font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#C9A84C] transition-colors duration-300 hover:bg-[#C9A84C] hover:text-[#0A0A0A]"
          >
            <span>{config.partners_cta_label || "Devenir partenaire"}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
