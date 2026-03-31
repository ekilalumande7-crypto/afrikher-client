"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { Play } from "lucide-react";

// ══════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════

interface Chapitre {
  id: string;
  numero: string;
  titre: string;
  description: string;
  image: string;
  items?: string[];
}

interface GalleryPhoto {
  id: string;
  url: string;
  legende: string;
  ordre: number;
}

interface VideoItem {
  id: string;
  titre: string;
  url: string;
  thumbnail: string;
  description: string;
}

// ── YouTube ID extractor ──
function extractYouTubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : '';
}

// ══════════════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════════════

export default function RubriquesPage() {
  const [loading, setLoading] = useState(true);

  // Editorial section
  const [editorialImage, setEditorialImage] = useState('');
  const [editorialCitation, setEditorialCitation] = useState('');
  const [editorialTexte, setEditorialTexte] = useState('');
  const [editorialTitre, setEditorialTitre] = useState('Éditorial');
  const [editorialSousTitre, setEditorialSousTitre] = useState("Le Sommaire d'AFRIKHER");

  // Chapitres
  const [chapitres, setChapitres] = useState<Chapitre[]>([]);

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
          .like("key", "rubriques_%");

        const config: Record<string, string> = {};
        (data || []).forEach((row: { key: string; value: string }) => {
          config[row.key] = row.value || '';
        });

        // Editorial
        if (config['rubriques_editorial_image']) setEditorialImage(config['rubriques_editorial_image']);
        if (config['rubriques_editorial_citation']) setEditorialCitation(config['rubriques_editorial_citation']);
        if (config['rubriques_editorial_texte']) setEditorialTexte(config['rubriques_editorial_texte']);
        if (config['rubriques_editorial_titre']) setEditorialTitre(config['rubriques_editorial_titre']);
        if (config['rubriques_editorial_sous_titre']) setEditorialSousTitre(config['rubriques_editorial_sous_titre']);

        // Chapitres
        try {
          const parsed = config['rubriques_chapitres'] ? JSON.parse(config['rubriques_chapitres']) : null;
          if (parsed && Array.isArray(parsed) && parsed.length > 0) setChapitres(parsed);
        } catch { /* keep empty */ }

        // Gallery
        try {
          const parsedPhotos = config['rubriques_galerie'] ? JSON.parse(config['rubriques_galerie']) : [];
          if (Array.isArray(parsedPhotos)) setPhotos(parsedPhotos);
        } catch { /* keep empty */ }

        // Videos
        try {
          const parsedVideos = config['rubriques_videos'] ? JSON.parse(config['rubriques_videos']) : [];
          if (Array.isArray(parsedVideos)) setVideos(parsedVideos);
        } catch { /* keep empty */ }

      } catch (err) {
        console.error("Error fetching rubriques data:", err);
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
        {/* Bandeau noir derrière le header */}
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
      {/* HERO — ÉDITORIAL (ex "Le Journal") */}
      {/* ══════════════════════════════════════════════ */}
      <section className="pt-36 pb-20 md:pb-28 bg-[#F5F0E8]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* Surtitre doré */}
          <p className="font-display italic text-[#C9A84C] text-lg md:text-xl mb-4 tracking-wide">
            {editorialTitre}
          </p>

          {/* Titre principal */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-[#0A0A0A] mb-3 leading-[0.95]">
            Les Rubriques<span className="text-[#C9A84C]">.</span>
          </h1>

          {/* Sous-titre */}
          <p className="font-body text-xs md:text-sm tracking-[0.35em] uppercase text-[#9A9A8A] mb-16 md:mb-20">
            {editorialSousTitre}
          </p>

          {/* Layout 3 colonnes : citation — image — texte */}
          {(editorialCitation || editorialImage || editorialTexte) && (
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16 max-w-5xl mx-auto">
              {/* Citation */}
              {editorialCitation && (
                <div className="flex-1 text-right">
                  <p className="font-display italic text-base md:text-lg text-[#2A2A2A] leading-relaxed">
                    &ldquo;{editorialCitation}&rdquo;
                  </p>
                </div>
              )}

              {/* Image ronde */}
              {editorialImage && (
                <div className="shrink-0">
                  <div className="w-44 h-44 md:w-52 md:h-52 rounded-full overflow-hidden border-2 border-[#C9A84C]/20 shadow-xl">
                    <img
                      src={editorialImage}
                      alt="AFRIKHER Éditorial"
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                </div>
              )}

              {/* Texte descriptif */}
              {editorialTexte && (
                <div className="flex-1 text-left">
                  <p className="font-body text-sm md:text-base text-[#2A2A2A]/80 leading-relaxed">
                    {editorialTexte}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Séparateur élégant */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />
      </div>

      {/* ══════════════════════════════════════════════ */}
      {/* CHAPITRES (ex "Galerie" / Rubriques) */}
      {/* ══════════════════════════════════════════════ */}
      {chapitres.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-6">
            {chapitres.map((chapitre, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={chapitre.id}
                  className={`flex flex-col ${chapitre.image ? (isEven ? 'md:flex-row' : 'md:flex-row-reverse') : ''} gap-8 md:gap-16 mb-20 md:mb-28 last:mb-0`}
                >
                  {/* Image du chapitre (si présente) */}
                  {chapitre.image && (
                    <div className="md:w-[45%] shrink-0">
                      <div className="aspect-[4/3] rounded-sm overflow-hidden bg-[#2A2A2A] shadow-xl">
                        <img
                          src={chapitre.image}
                          alt={chapitre.titre}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    </div>
                  )}

                  {/* Contenu texte */}
                  <div className={`flex-1 flex flex-col justify-center ${!chapitre.image ? 'max-w-3xl' : ''}`}>
                    {/* Chapeau doré */}
                    <div className="flex items-center gap-4 mb-6">
                      <span className="font-body text-xs tracking-[0.2em] uppercase text-[#C9A84C]">
                        Chapitre
                      </span>
                      <div className="h-[1px] flex-1 bg-[#C9A84C]/20" />
                      <span className="font-display text-4xl md:text-5xl text-[#C9A84C]/20 font-light">
                        {chapitre.numero}
                      </span>
                    </div>

                    {/* Titre */}
                    <h2 className="font-body text-xl md:text-2xl font-bold tracking-[0.15em] uppercase text-[#0A0A0A] mb-5">
                      {chapitre.titre}
                    </h2>

                    {/* Description */}
                    <div className="font-body text-sm md:text-base text-[#2A2A2A]/80 leading-relaxed whitespace-pre-line mb-4">
                      {chapitre.description}
                    </div>

                    {/* Points clés */}
                    {chapitre.items && chapitre.items.length > 0 && (
                      <ul className="space-y-2 mt-2">
                        {chapitre.items.filter(item => item.trim()).map((item, i) => (
                          <li key={i} className="flex items-start gap-3 font-body text-sm text-[#2A2A2A]/75">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] shrink-0 mt-1.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Séparateur fin entre chapitres (sauf dernier) */}
                    {idx < chapitres.length - 1 && !chapitre.image && (
                      <div className="mt-12 h-[1px] bg-[#0A0A0A]/5" />
                    )}
                  </div>
                </div>
              );
            })}
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

            {/* Masonry-style grid */}
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
                      alt={photo.legende || 'AFRIKHER Gallery'}
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
                Nos contenus
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
                        {video.thumbnail ? (
                          <img src={video.thumbnail} alt={video.titre} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Play size={48} className="text-[#C9A84C]" />
                          </div>
                        )}
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

    </main>
  );
}
