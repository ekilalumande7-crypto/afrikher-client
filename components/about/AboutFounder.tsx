import { AboutSectionConfig } from "./types";

interface AboutFounderProps {
  config: AboutSectionConfig;
}

export default function AboutFounder({ config }: AboutFounderProps) {
  return (
    <section className="min-h-screen snap-start bg-[#0A0A0A] pt-28 text-[#F5F0E8]">
      <div className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl items-center px-6 md:px-10 lg:px-12">
        <div className="grid w-full gap-12 lg:grid-cols-[0.9fr_minmax(0,1.1fr)] lg:items-center">
          <div>
            <div className="mx-auto max-w-[24rem] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
              {config.founderImage ? (
                <img
                  src={config.founderImage}
                  alt={config.founderName}
                  className="aspect-[4/5] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center font-display text-3xl text-[#C9A84C]/40">
                  AFRIKHER
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="font-body text-[0.72rem] font-medium uppercase tracking-[0.34em] text-[#C9A84C]">
              {config.founderLabel}
            </p>
            <h2 className="mt-5 font-display text-[2.8rem] leading-[0.95] tracking-[-0.025em] md:text-[4rem]">
              {config.founderSectionTitle}
            </h2>
            <div className="mt-6">
              <p className="font-display text-[2rem] leading-[1.02] tracking-[-0.02em] text-[#F5F0E8] md:text-[2.6rem]">
                {config.founderName}
              </p>
              <p className="mt-2 font-body text-[0.76rem] uppercase tracking-[0.24em] text-[#C9A84C]">
                {config.founderRole}
              </p>
            </div>

            <p className="mt-6 max-w-[34rem] line-clamp-5 font-body text-[0.98rem] leading-[1.85] text-white/72">
              {config.founderBioShort}
            </p>
            <p className="mt-4 max-w-[34rem] line-clamp-4 font-body text-[0.94rem] leading-[1.82] text-white/56">
              {config.founderBioLong}
            </p>

            {config.founderQuote && (
              <div className="mt-7 max-w-[33rem] border-l border-[#C9A84C]/45 pl-5">
                <p className="font-display text-[1.2rem] italic leading-[1.7] text-[#C9A84C] md:text-[1.34rem]">
                  &ldquo;{config.founderQuote}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
