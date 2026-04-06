"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import AboutHero from "@/components/about/AboutHero";
import AboutFounder from "@/components/about/AboutFounder";
import AboutValues from "@/components/about/AboutValues";
import AboutMedia from "@/components/about/AboutMedia";
import { AboutPhoto, AboutSectionConfig, AboutValue, AboutVideo } from "@/components/about/types";

const DEFAULT_CONFIG: AboutSectionConfig = {
  heroLabel: "Maison éditoriale",
  heroTitle: "Qui sommes-nous",
  heroSubtitle: "L’histoire d’AFRIKHER, entre élégance, influence et vision.",
  heroText:
    "AFRIKHER est une plateforme d’inspiration, de visibilité et d’influence dédiée aux femmes entrepreneures africaines et de la diaspora.",
  heroMission:
    "Notre mission est de raconter avec exigence les trajectoires qui façonnent l’Afrique de demain, dans un langage premium, éditorial et profondément humain.",
  heroQuote: "L’élégance hors du commun. Le Business au féminin.",
  heroImage: "",
  founderLabel: "Portrait",
  founderSectionTitle: "La Fondatrice",
  founderName: "Hadassa Hélène EKILA-LUMANDE",
  founderRole: "Fondatrice & CEO",
  founderBioShort:
    "Entrepreneure engagée, portée par la volonté de valoriser la puissance et l’expertise des femmes africaines.",
  founderBioLong:
    "AFRIKHER est né de la conviction qu’un récit africain ambitieux mérite une écriture exigeante, élégante et durable.",
  founderQuote:
    "Je crois en une Afrique où chaque femme entrepreneure peut écrire sa propre histoire de réussite.",
  founderImage: "",
  valuesLabel: "Nos valeurs",
  valuesTitle: "Ce qui nous guide",
  valuesIntro:
    "Une vision éditoriale claire, pensée pour construire une plateforme à la fois exigeante, sensible et durable.",
  mediaLabel: "Regards & archives",
  mediaTitle: "L’univers AFRIKHER",
  mediaIntro:
    "Images, vidéos et fragments de vie qui prolongent la voix éditoriale d’AFRIKHER au-delà des mots.",
  closingText:
    "Chaque écran de cette page prolonge une même intention : raconter une présence, une ligne éditoriale et une ambition féminine sans compromis.",
  closingCtaLabel: "Découvrir le magazine",
  closingCtaLink: "/magazine",
};

function extractYouTubeId(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : "";
}

export default function QuiSommesNousPage() {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<AboutSectionConfig>(DEFAULT_CONFIG);
  const [values, setValues] = useState<AboutValue[]>([]);
  const [photos, setPhotos] = useState<AboutPhoto[]>([]);
  const [videos, setVideos] = useState<AboutVideo[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) throw new Error("No Supabase config");

        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data } = await supabase
          .from("site_config")
          .select("key, value")
          .like("key", "about_%");

        const siteConfig: Record<string, string> = {};
        (data || []).forEach((row: { key: string; value: string }) => {
          siteConfig[row.key] = row.value || "";
        });

        setConfig({
          heroLabel: siteConfig.about_hero_label || siteConfig.about_sous_titre || DEFAULT_CONFIG.heroLabel,
          heroTitle: siteConfig.about_hero_title || siteConfig.about_titre || DEFAULT_CONFIG.heroTitle,
          heroSubtitle: siteConfig.about_hero_subtitle || DEFAULT_CONFIG.heroSubtitle,
          heroText: siteConfig.about_hero_text || siteConfig.about_texte || DEFAULT_CONFIG.heroText,
          heroMission: siteConfig.about_hero_mission || siteConfig.about_texte2 || DEFAULT_CONFIG.heroMission,
          heroQuote: siteConfig.about_hero_quote || siteConfig.about_citation || DEFAULT_CONFIG.heroQuote,
          heroImage: siteConfig.about_hero_image || siteConfig.about_image || DEFAULT_CONFIG.heroImage,
          founderLabel: siteConfig.about_founder_label || DEFAULT_CONFIG.founderLabel,
          founderSectionTitle: siteConfig.about_founder_title || DEFAULT_CONFIG.founderSectionTitle,
          founderName: siteConfig.about_founder_name || siteConfig.about_fond_nom || DEFAULT_CONFIG.founderName,
          founderRole: siteConfig.about_founder_role || siteConfig.about_fond_titre || DEFAULT_CONFIG.founderRole,
          founderBioShort:
            siteConfig.about_founder_bio_short || siteConfig.about_fond_bio || DEFAULT_CONFIG.founderBioShort,
          founderBioLong:
            siteConfig.about_founder_bio_long || siteConfig.about_fond_bio2 || DEFAULT_CONFIG.founderBioLong,
          founderQuote:
            siteConfig.about_founder_quote || siteConfig.about_fond_citation || DEFAULT_CONFIG.founderQuote,
          founderImage:
            siteConfig.about_founder_image || siteConfig.about_fond_photo || DEFAULT_CONFIG.founderImage,
          valuesLabel: siteConfig.about_values_label || DEFAULT_CONFIG.valuesLabel,
          valuesTitle: siteConfig.about_values_title || DEFAULT_CONFIG.valuesTitle,
          valuesIntro: siteConfig.about_values_intro || DEFAULT_CONFIG.valuesIntro,
          mediaLabel: siteConfig.about_media_label || DEFAULT_CONFIG.mediaLabel,
          mediaTitle: siteConfig.about_media_title || DEFAULT_CONFIG.mediaTitle,
          mediaIntro: siteConfig.about_media_intro || DEFAULT_CONFIG.mediaIntro,
          closingText: siteConfig.about_closing_text || DEFAULT_CONFIG.closingText,
          closingCtaLabel: siteConfig.about_closing_cta_label || DEFAULT_CONFIG.closingCtaLabel,
          closingCtaLink: siteConfig.about_closing_cta_link || DEFAULT_CONFIG.closingCtaLink,
        });

        try {
          const parsedValues = siteConfig.about_valeurs ? JSON.parse(siteConfig.about_valeurs) : [];
          if (Array.isArray(parsedValues)) {
            setValues(
              parsedValues.map((value: any, index: number) => ({
                id: value.id || `value-${index}`,
                icone: value.icone || "✦",
                titre: value.titre || value.title || "Valeur AFRIKHER",
                description: value.description || "",
              }))
            );
          }
        } catch {
          setValues([]);
        }

        try {
          const parsedPhotos = siteConfig.about_galerie ? JSON.parse(siteConfig.about_galerie) : [];
          if (Array.isArray(parsedPhotos)) {
            setPhotos(
              parsedPhotos
                .filter((item) => item && typeof item === "object" && item.url)
                .map((item: any, index: number) => ({
                  id: item.id || `photo-${index}`,
                  url: item.url,
                  legende: item.legende || item.caption || "",
                }))
            );
          }
        } catch {
          setPhotos([]);
        }

        try {
          const parsedVideos = siteConfig.about_videos ? JSON.parse(siteConfig.about_videos) : [];
          if (Array.isArray(parsedVideos)) {
            setVideos(
              parsedVideos
                .filter((item) => item && typeof item === "object" && item.url)
                .map((item: any, index: number) => ({
                  id: item.id || `video-${index}`,
                  titre: item.titre || item.title || "Vidéo AFRIKHER",
                  url: item.url,
                  description: item.description || "",
                  thumbnail:
                    item.thumbnail ||
                    item.image ||
                    (extractYouTubeId(item.url)
                      ? `https://img.youtube.com/vi/${extractYouTubeId(item.url)}/hqdefault.jpg`
                      : ""),
                  ordre: Number.isFinite(item.ordre) ? item.ordre : index,
                }))
                .sort((a, b) => (a.ordre || 0) - (b.ordre || 0))
            );
          }
        } catch {
          setVideos([]);
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F0E8]">
        <div className="fixed left-0 right-0 top-0 z-[90] h-20 bg-[#0A0A0A]" />
        <Navbar />
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" />
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen snap-y snap-mandatory overflow-y-auto scroll-smooth bg-[#F5F0E8] text-[#0A0A0A]">
      <div className="fixed left-0 right-0 top-0 z-[90] h-20 bg-[#0A0A0A]" />
      <Navbar />

      <AboutHero config={config} />
      <AboutFounder config={config} />
      <AboutValues config={config} values={values} />
      <AboutMedia config={config} photos={photos} videos={videos} />
    </main>
  );
}
