import { ReactNode } from "react";
import Link from "next/link";

interface AccountEmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export default function AccountEmptyState({
  icon,
  title,
  description,
  ctaHref,
  ctaLabel,
  secondaryHref,
  secondaryLabel,
}: AccountEmptyStateProps) {
  return (
    <div className="border border-dashed border-black/10 bg-white/35 px-6 py-14 text-center">
      {icon && <div className="mx-auto mb-5 flex justify-center text-[#C9A84C]">{icon}</div>}
      <h3 className="font-display text-[2rem] leading-[1] tracking-[-0.02em] text-[#0A0A0A]">
        {title}
      </h3>
      <p className="mx-auto mt-4 max-w-[30rem] font-body text-[0.95rem] leading-[1.72] text-[#0A0A0A]/58">
        {description}
      </p>
      {(ctaHref || secondaryHref) && (
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {ctaHref && ctaLabel && (
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center bg-[#0A0A0A] px-6 py-3 font-body text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#F5F0E8] transition-colors hover:bg-[#C9A84C] hover:text-[#0A0A0A]"
            >
              {ctaLabel}
            </Link>
          )}
          {secondaryHref && secondaryLabel && (
            <Link
              href={secondaryHref}
              className="inline-flex items-center justify-center border border-black/10 px-6 py-3 font-body text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A]/72 transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C]"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
