import { AboutSectionConfig, AboutValue } from "./types";

interface AboutValuesProps {
  config: AboutSectionConfig;
  values: AboutValue[];
}

export default function AboutValues({ config, values }: AboutValuesProps) {
  const displayedValues = values.slice(0, 4);

  return (
    <section className="min-h-screen snap-start bg-[#F5F0E8] pt-28">
      <div className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl items-center px-6 md:px-10 lg:px-12">
        <div className="w-full">
          <div className="mx-auto max-w-[40rem] text-center">
            <p className="font-body text-[0.72rem] font-medium uppercase tracking-[0.34em] text-[#C9A84C]">
              {config.valuesLabel}
            </p>
            <h2 className="mt-5 font-display text-[2.8rem] leading-[0.94] tracking-[-0.025em] text-[#0A0A0A] md:text-[4rem]">
              {config.valuesTitle}
            </h2>
            <p className="mt-5 font-body text-[0.96rem] leading-[1.8] text-[#0A0A0A]/58">
              {config.valuesIntro}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {displayedValues.map((value) => (
              <article
                key={value.id}
                className="flex h-full flex-col rounded-[1.6rem] border border-black/6 bg-white/72 px-6 py-7"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#C9A84C]/25 bg-[#F7F1E5] font-display text-2xl text-[#C9A84C]">
                  {value.icone}
                </div>
                <div className="min-h-[4.6rem]">
                  <h3 className="line-clamp-2 font-display text-[1.7rem] leading-[1.05] tracking-[-0.015em] text-[#0A0A0A]">
                    {value.titre}
                  </h3>
                </div>
                <p className="mt-4 line-clamp-4 font-body text-[0.92rem] leading-[1.78] text-[#0A0A0A]/62">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
