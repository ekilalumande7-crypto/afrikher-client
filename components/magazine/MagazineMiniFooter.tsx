import Link from "next/link";

export default function MagazineMiniFooter() {
  return (
    <div className="bg-[#0A0A0A] border-t border-white/[0.06] py-5">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="font-body text-[0.64rem] uppercase tracking-[0.18em] text-[#F5F0E8]/56">
          © 2026 AFRIKHER. Tous droits reserves.
        </span>
        <Link
          href="/"
          className="font-body text-[0.62rem] font-medium uppercase tracking-[0.28em] text-[#C9A84C] transition-colors duration-300 hover:text-[#E8C97A]"
        >
          AFRIKHER.COM
        </Link>
      </div>
    </div>
  );
}
