import { AboutSectionConfig } from "./types";

interface AboutHeroProps {
  config: AboutSectionConfig;
}

export default function AboutHero({ config }: AboutHeroProps) {
  return (
    <section className="min-h-screen snap-start bg-[#F5F0E8] pt-28">
      <div className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl items-center px-6 md:px-10 lg:px-12">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_minmax(0,0.95fr)] lg:items-center">
          <div className="order-2 lg:order-1">
            <div className="overflow-hidden rounded-[2rem] border border-black/6 bg-[#E8E1D4]">
              {config.heroImage ? (
                <img
                  src={config.heroImage}
                  alt={config.heroTitle}
                  className="aspect-[4/5] w-full object-cover lg:aspect-[4/4.6]"
                />
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center bg-[#EDE7DB] font-display text-3xl text-[#C9A84C]/40 lg:aspect-[4/4.6]">
                  AFRIKHER
                </div>
              )}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="font-body text-[0.72rem] font-medium uppercase tracking-[0.34em] text-[#C9A84C]">
              {config.heroLabel}
            </p>
            <h1 className="mt-5 max-w-[28rem] font-display text-[3rem] leading-[0.92] tracking-[-0.03em] text-[#0A0A0A] md:text-[4.5rem] lg:text-[5.2rem]">
              {config.heroTitle}
            </h1>
            <div className="mt-5 h-px w-16 bg-[#C9A84C]/55" />
            <p className="mt-5 max-w-[32rem] font-body text-[1rem] leading-[1.8] text-[#0A0A0A]/60">
              {config.heroSubtitle}
            </p>
            <p className="mt-4 max-w-[32rem] line-clamp-5 font-body text-[0.95rem] leading-[1.85] text-[#0A0A0A]/72">
              {config.heroText}
            </p>
            <p className="mt-4 max-w-[32rem] line-clamp-4 font-body text-[0.94rem] leading-[1.82] text-[#0A0A0A]/58">
              {config.heroMission}
            </p>
            {config.heroQuote && (
              <div className="mt-6 max-w-[31rem] border-l border-[#C9A84C]/45 pl-5">
                <p className="font-display text-[1.18rem] italic leading-[1.65] text-[#0A0A0A]/72 md:text-[1.32rem]">
                  &ldquo;{config.heroQuote}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
