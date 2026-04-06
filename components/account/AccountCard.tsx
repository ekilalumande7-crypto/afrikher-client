import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AccountCardProps {
  title?: string;
  eyebrow?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export default function AccountCard({
  title,
  eyebrow,
  description,
  actions,
  children,
  className,
  contentClassName,
}: AccountCardProps) {
  return (
    <section
      className={cn(
        "border border-black/8 bg-[#FBF7F0] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] md:p-8",
        className
      )}
    >
      {(title || eyebrow || description || actions) && (
        <div className="mb-6 flex flex-col gap-4 border-b border-black/6 pb-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[36rem]">
            {eyebrow && (
              <p className="font-body text-[0.64rem] font-semibold uppercase tracking-[0.3em] text-[#C9A84C]">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="mt-3 font-display text-[2rem] leading-[0.98] tracking-[-0.02em] text-[#0A0A0A] md:text-[2.5rem]">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-3 font-body text-[0.95rem] leading-[1.72] text-[#0A0A0A]/58">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}

      <div className={cn("space-y-6", contentClassName)}>{children}</div>
    </section>
  );
}
