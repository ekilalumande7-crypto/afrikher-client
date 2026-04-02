"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Quote, Play } from "lucide-react";

// ══════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════

interface Valeur {
  id: string;
  icone: string;
  titre: string;
  description: string;
}

interface GalleryPhoto {
  id: string;
  url: string;
  legende: string;
}

interface VideoItem {
  id: string;
  titre: string;
  url: string;
  description: string;
}

// ── YouTube ID extractor ──
function extractYouTubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : '';
}

// ── Icon mapping ──
const ICON_MAP: Record<string, string> = {
  'star': '✦',
  'heart': '♥',
  'target': '◎',
  'users': '❖',
  'award': '✧',
  'crown': '♛',
  'gem': '◆',
  'feather': '❧',
};

// ══════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════

export default function QuiSommesNousPage() {
  const [loading, setLoading] = useState(true);

  // Présentation
  const [aboutTitre, setAboutTitre] = useState("Qui sommes-nous");
  const [aboutSousTitre, setAboutSousTitre] = useState("L'histoire d'AFRIKHER");
  const [aboutTexte, setAboutTexte] = useState("");
  const [aboutTexte2, setAboutTexte2] = useState("");
  const [aboutImage, setAboutImage] = useState("");
  const [aboutCitation, setAboutCitation] = useState("");

  // Fondatrice
  const [fondNom, setFondNom] = useState("Hadassa Hélène EKILA-LUMANDE");
  const [fondTitre, setFondTitre] = useState("Fondatrice & CEO");
  const [fondBio, setFondBio] = useState("");
  const [fondBio2, setFondBio2] = useState("");
  const [fondPhoto, setFondPhoto] = useState("");
  const [fondCitation, setFondCitation] = useState("");

  // Valeurs
  const [valeurs, setValeurs] = useState<Valeur[]>([]);

  // Gallery
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);

  // Videos
  const [videos, setVideos] = useState<VideoItem[]>([]);

  // Lightbox
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);

  // ══════════════════════════════════════════════
  // FETCH DATA FROM SUPABASE
  // ══════════════════════════════════════════════

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

        const config: Record<string, string> = {};
        (data || []).forEach((row: { key: string; value: string }) => {
          config[row.key] = row.value || '';
        });

        // Présentation
        if (config['about_titre']) setAboutTitre(config['about_titre']);
        if (config['about_sous_titre']) setAboutSousTitre(config['about_sous_titre']);
        if (config['about_texte']) setAboutTexte(config['about_texte']);
        if (config['about_texte2']) setAboutTexte2(config['about_texte2']);
        if (config['about_image']) setAboutImage(config['about_image']);
        if (config['about_citation']) setAboutCitation(config['about_citation']);

        // Fondatrice
        if (config['about_fond_nom']) setFondNom(config['about_fond_nom']);
        if (config['about_fond_titre']) setFondTitre(config['about_fond_titre']);
        if (config['about_fond_bio']) setFondBio(config['about_fond_bio']);
        if (config['about_fond_bio2']) setFondBio2(config['about_fond_bio2']);
        if (config['about_fond_photo']) setFondPhoto(config['about_fond_photo']);
        if (config['about_fond_citation']) setFondCitation(config['about_fond_citation']);

        // Valeurs
        try {
          const parsed = config['about_valeurs'] ? JSON.parse(config['about_valeurs']) : null;
          if (parsed && Array.isArray(parsed) && parsed.length > 0) setValeurs(parsed);
        } catch { /* keep empty */ }

        // Gallery
        try {
          const parsedPhotos = config['about_galerie'] ? JSON.parse(config['about_galerie']) : [];
          if (Array.isArray(parsedPhotos)) setPhotos(parsedPhotos);
        } catch { /* keep empty */ }

        // Videos
        try {
          const parsedVideos = config['about_videos'] ? JSON.parse(config['about_videos']) : [];
          if (Array.isArray(parsedVideos)) setVideos(parsedVideos);
        } catch { /* keep empty */ }

      } catch (err) {
        console.error("Error fetching about data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ══════════════════════════════════════════════
  // LOADING STATE
  // ══════════════════════════════════════════════

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F0E8]">
        <div className="fixed top-0 left-0 right-0 h-20 bg-[#0A0A0A] z-[90]" />
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-10 h-10 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#0A0A0A]">
      {/* Bandeau noir derrière le header pour visibilité sur fond crème */}
      <div className="fixed top-0 left-0 right-0 h-20 bg-[#0A0A0A] z-[90]" />
      <Navbar />

      {/* ══════════════════════════════════════════════ */}
      {/* HERO — PRÉSENTATION */}
      {/* ══════════════════════════════════════════════ */}
      <section className="pt-36 pb-20 md:pb-28 bg-[#F5F0E8]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* Surtitre doré */}
          <p className="font-display italic text-[#C9A84C] text-lg md:text-xl mb-4 tracking-wide">
            {aboutSousTitre}
          </p>

          {/* Titre principal */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-[#0A0A0A] mb-3 leading-[0.95]">
            {aboutTitre}<span className="text-[#C9A84C]">.</span>
          </h1>

          {/* Ligne décorative */}
          <div className="w-16 h-[1px] bg-[#C9A84C] mx-auto mb-16 md:mb-20" />

          {/* Layout: image — texte */}
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 max-w-5xl mx-auto text-left">
            {/* Image */}
            {aboutImage && (
              <div className="md:w-[42%] shrink-0">
                <div className="aspect-[3/4] rounded-sm overflow-hidden shadow-2xl">
                  <img
                    src={aboutImage}
                    alt="AFRIKHER"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            )}

            {/* Textes */}
            <div className="flex-1 space-y-6">
              {aboutTexte && (
                <p className="font-body text-base md:text-lg text-[#2A2A2A] leading-relaxed">
                  {aboutTexte}
                </p>
              )}
              {aboutTexte2 && (
                <p className="font-body text-sm md:text-base text-[#2A2A2A]/80 leading-relaxed">
                  {aboutTexte2}
                </p>
              )}

              {/* Citation */}
              {aboutCitation && (
                <div className="relative pl-6 border-l-2 border-[#C9A84C]/40 mt-8">
                  <p className="font-display italic text-base md:text-lg text-[#0A0A0A]/70 leading-relaxed">
                    &ldquo;{aboutCitation}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Séparateur élégant */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />
      </div>

      {/* ══════════════════════════════════════════════ */}
      {/* FONDATRICE */}
      {/* ══════════════════════════════════════════════ */}
      {(fondNom || fondBio) && (
        <section className="py-20 md:py-28 bg-[#0A0A0A]">
          <div className="max-w-5xl mx-auto px-6">
            {/* Section header */}
            <div className="text-center mb-14">
              <p className="font-body text-xs tracking-[0.35em] uppercase text-[#C9A84C] mb-3">
                Portrait
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-[#F5F0E8] mb-4">
                La Fondatrice
              </h2>
              <div className="w-12 h-[1px] bg-[#C9A84C] mx-auto" />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
              {/* Photo ronde */}
              {fondPhoto && (
                <div className="shrink-0">
                  <div className="w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-[#C9A84C]/30 shadow-2xl shadow-[#C9A84C]/10">
                    <img
                      src={fondPhoto}
                      alt={fondNom}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                </div>
              )}

              {/* Biographie */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-display text-3xl md:text-4xl text-[#F5F0E8] mb-2">
                  {fondNom}
                </h3>
                <p className="font-body text-xs tracking-[0.2em] uppercase text-[#C9A84C] mb-8">
                  {fondTitre}
                </p>

                {fondBio && (
                  <p className="font-body text-base text-[#F5F0E8]/80 leading-relaxed mb-4">
                    {fondBio}
                  </p>
                )}
                {fondBio2 && (
                  <p className="font-body text-sm text-[#F5F0E8]/60 leading-relaxed mb-8">
                    {fondBio2}
                  </p>
                )}

                {/* Citation fondatrice */}
                {fondCitation && (
                  <div className="relative mt-6">
                    <Quote size={28} className="text-[#C9A84C]/30 mb-3" />
                    <p className="font-display italic text-lg md:text-xl text-[#C9A84C]/80 leading-relaxed">
                      &ldquo;{fondCitation}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* NOS VALEURS */}
      {/* ══════════════════════════════════════════════ */}
      {valeurs.length > 0 && (
        <section className="py-20 md:py-28 bg-[#F5F0E8]">
          <div className="max-w-6xl mx-auto px-6">
            {/* Section header */}
            <div className="text-center mb-16">
              <p className="font-body text-xs tracking-[0.35em] uppercase text-[#C9A84C] mb-3">
                Ce qui nous guide
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-[#0A0A0A] mb-4">
                Nos Valeurs
              </h2>
              <div className="w-12 h-[1px] bg-[#C9A84C] mx-auto" />
            </div>

            {/* Grille de valeurs */}
            <div className={`grid grid-cols-1 md:grid-cols-2 ${valeurs.length >= 3 ? 'lg:grid-cols-3' : ''} ${valeurs.length >= 4 ? 'xl:grid-cols-4' : ''} gap-8 md:gap-10`}>
              {valeurs.map((valeur) => (
                <div
                  key={valeur.id}
                  className="group text-center p-8 rounded-sm border border-[#0A0A0A]/5 hover:border-[#C9A84C]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#C9A84C]/5"
                >
                  {/* Icône */}
                  <div className="text-4xl mb-5 text-[#C9A84C] group-hover:scale-110 transition-transform duration-500">
                    {ICON_MAP[valeur.icone] || '◆'}
                  </div>

                  {/* Titre */}
                  <h3 className="font-body text-sm tracking-[0.2em] uppercase font-bold text-[#0A0A0A] mb-4">
                    {valeur.titre}
                  </h3>

                  {/* Description */}
                  <p className="font-body text-sm text-[#2A2A2A]/70 leading-relaxed">
                    {valeur.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* GALERIE PHOTOS */}
      {/* ══════════════════════════════════════════════ */}
      {photos.length > 0 && (
        <section className="py-20 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto px-6">
            {/* Section header */}
            <div className="text-center mb-14">
              <p className="font-body text-xs tracking-[0.35em] uppercase text-[#C9A84C] mb-3">
                En images
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-[#F5F0E8] mb-4">
                Galerie
              </h2>
              <div className="w-12 h-[1px] bg-[#C9A84C] mx-auto" />
            </div>

            {/* Masonry grid */}
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="break-inside-avoid group cursor-pointer"
                  onClick={() => setLightboxPhoto(photo)}
                >
                  <div className="relative overflow-hidden rounded-sm">
                    <img
                      src={photo.url}
                      alt={photo.legende || 'AFRIKHER'}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-[#0A0A0A]/0 group-hover:bg-[#0A0A0A]/40 transition-colors duration-500 flex items-end">
                      {photo.legende && (
                        <p className="p-4 font-body text-xs text-[#F5F0E8] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                          {photo.legende}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lightbox */}
          {lightboxPhoto && (
            <div
              className="fixed inset-0 z-[200] bg-[#0A0A0A]/95 backdrop-blur-xl flex items-center justify-center p-6"
              onClick={() => setLightboxPhoto(null)}
            >
              <button
                className="absolute top-6 right-6 text-[#F5F0E8]/60 hover:text-[#F5F0E8] transition-colors text-3xl font-light"
                onClick={() => setLightboxPhoto(null)}
              >
                &times;
              </button>
              <div className="max-w-4xl max-h-[85vh] relative" onClick={e => e.stopPropagation()}>
                <img
                  src={lightboxPhoto.url}
                  alt={lightboxPhoto.legende || ''}
                  className="max-w-full max-h-[80vh] object-contain rounded-sm"
                />
                {lightboxPhoto.legende && (
                  <p className="text-center mt-4 font-display italic text-[#F5F0E8]/60 text-sm">
                    {lightboxPhoto.legende}
                  </p>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* VIDÉOS */}
      {/* ══════════════════════════════════════════════ */}
      {videos.length > 0 && (
        <section className="py-20 bg-[#F5F0E8]">
          <div className="max-w-6xl mx-auto px-6">
            {/* Section header */}
            <div className="text-center mb-14">
              <p className="font-body text-xs tracking-[0.35em] uppercase text-[#C9A84C] mb-3">
                Découvrir
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-[#0A0A0A] mb-4">
                Vidéos
              </h2>
              <div className="w-12 h-[1px] bg-[#C9A84C] mx-auto" />
            </div>

            {/* Video grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videos.map((video) => {
                const ytId = extractYouTubeId(video.url);
                return (
                  <div key={video.id} className="group">
                    {ytId ? (
                      <div className="aspect-video rounded-sm overflow-hidden bg-[#2A2A2A] shadow-lg">
                        <iframe
                          src={`https://www.youtube.com/embed/${ytId}`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : video.url ? (
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block aspect-video rounded-sm overflow-hidden bg-[#2A2A2A] relative"
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <Play size={48} className="text-[#C9A84C]" />
                        </div>
                      </a>
                    ) : null}
                    {(video.titre || video.description) && (
                      <div className="mt-4">
                        {video.titre && (
                          <h3 className="font-body font-semibold text-base text-[#0A0A0A] mb-1">
                            {video.titre}
                          </h3>
                        )}
                        {video.description && (
                          <p className="font-body text-sm text-[#9A9A8A]">
                            {video.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

          <Footer />
    </main>
  );
}
