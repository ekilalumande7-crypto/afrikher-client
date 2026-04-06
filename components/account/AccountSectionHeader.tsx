interface AccountSectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export default function AccountSectionHeader({
  eyebrow,
  title,
  description,
}: AccountSectionHeaderProps) {
  return (
    <div className="max-w-[42rem]">
      {eyebrow && (
        <p className="font-body text-[0.66rem] font-semibold uppercase tracking-[0.32em] text-[#C9A84C]">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-3 font-display text-[2.3rem] leading-[0.96] tracking-[-0.03em] text-[#0A0A0A] md:text-[3.2rem]">
        {title}
      </h1>
      {description && (
        <p className="mt-4 font-body text-[0.98rem] leading-[1.75] text-[#0A0A0A]/60">
          {description}
        </p>
      )}
    </div>
  );
}
