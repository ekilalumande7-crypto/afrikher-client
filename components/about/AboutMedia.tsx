import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Play } from "lucide-react";
import { AboutPhoto, AboutSectionConfig, AboutVideo } from "./types";

interface AboutMediaProps {
  config: AboutSectionConfig;
  photos: AboutPhoto[];
  videos: AboutVideo[];
}

function extractYouTubeId(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : "";
}

function getVideoThumbnail(video: AboutVideo): string {
  if (video.thumbnail) return video.thumbnail;
  const id = extractYouTubeId(video.url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

export default function AboutMedia({ config, photos, videos }: AboutMediaProps) {
  const featuredPhotos = photos.slice(0, 2);
  const featuredVideo = videos[0];
  const hasMedia = featuredPhotos.length > 0 || Boolean(featuredVideo);

  return (
    <section className="min-h-screen snap-start bg-[#F5F0E8] pt-28">
      <div className="flex min-h-[calc(100vh-7rem)] flex-col">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
            <div>
              <p className="font-body text-[0.72rem] font-medium uppercase tracking-[0.34em] text-[#C9A84C]">
                {config.mediaLabel}
              </p>
              <h2 className="mt-5 max-w-[24rem] font-display text-[2.7rem] leading-[0.94] tracking-[-0.025em] text-[#0A0A0A] md:text-[3.8rem]">
                {config.mediaTitle}
              </h2>
              <p className="mt-5 max-w-[30rem] font-body text-[0.96rem] leading-[1.8] text-[#0A0A0A]/58">
                {config.mediaIntro}
              </p>
              {config.closingText && (
                <p className="mt-5 max-w-[30rem] font-body text-[0.94rem] leading-[1.82] text-[#0A0A0A]/66">
                  {config.closingText}
                </p>
              )}
              {config.closingCtaLabel && config.closingCtaLink && (
                <Link
                  href={config.closingCtaLink}
                  className="mt-7 inline-flex items-center gap-2 border border-[#0A0A0A]/12 px-5 py-3 font-body text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A] transition-colors duration-300 hover:border-[#C9A84C] hover:text-[#C9A84C]"
                >
                  {config.closingCtaLabel}
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>

            {hasMedia ? (
              <div className="grid gap-5 md:grid-cols-2">
                {featuredPhotos.map((photo) => (
                  <a
                    key={photo.id}
                    href={photo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group block overflow-hidden rounded-[1.6rem] border border-black/6 bg-white/72"
                  >
                    <div className="aspect-[4/4.5] overflow-hidden bg-[#EAE2D4]">
                      <img
                        src={photo.url}
                        alt={photo.legende || "AFRIKHER"}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="px-5 py-4">
                      <p className="font-body text-[0.62rem] uppercase tracking-[0.22em] text-[#C9A84C]">
                        Galerie
                      </p>
                      <p className="mt-2 line-clamp-3 font-body text-[0.92rem] leading-[1.7] text-[#0A0A0A]/65">
                        {photo.legende || "Un fragment du regard AFRIKHER."}
                      </p>
                    </div>
                  </a>
                ))}

                {featuredVideo && (
                  <a
                    href={featuredVideo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group block overflow-hidden rounded-[1.6rem] border border-black/6 bg-white/72 md:col-span-2"
                  >
                    <div className="relative aspect-[16/8] overflow-hidden bg-[#EAE2D4]">
                      {getVideoThumbnail(featuredVideo) ? (
                        <img
                          src={getVideoThumbnail(featuredVideo)}
                          alt={featuredVideo.titre}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#111111]">
                          <Play size={36} className="text-[#C9A84C]" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/28" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-sm">
                          <Play size={18} className="translate-x-[1px]" />
                        </span>
                      </div>
                    </div>
                    <div className="px-5 py-4">
                      <p className="font-body text-[0.62rem] uppercase tracking-[0.22em] text-[#C9A84C]">
                        Vidéo
                      </p>
                      <h3 className="mt-2 line-clamp-2 font-display text-[1.65rem] leading-[1.06] tracking-[-0.015em] text-[#0A0A0A]">
                        {featuredVideo.titre || "Regards AFRIKHER"}
                      </h3>
                      <p className="mt-2 line-clamp-2 font-body text-[0.92rem] leading-[1.72] text-[#0A0A0A]/62">
                        {featuredVideo.description || "Une vidéo éditoriale issue de l’univers AFRIKHER."}
                      </p>
                    </div>
                  </a>
                )}
              </div>
            ) : (
              <div className="rounded-[1.8rem] border border-black/6 bg-white/68 px-8 py-10">
                <p className="font-display text-[2rem] leading-[1] tracking-[-0.02em] text-[#0A0A0A]/72">
                  AFRIKHER continue de s’écrire.
                </p>
                <p className="mt-4 max-w-[30rem] font-body text-[0.94rem] leading-[1.8] text-[#0A0A0A]/58">
                  Les prochains médias éditoriaux viendront enrichir cette page au fil des publications, des événements et des prises de parole de la communauté.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto pt-10">
          <Footer />
        </div>
      </div>
    </section>
  );
}
