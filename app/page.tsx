import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";

export default function Home() {
  return (
    <main className="h-screen overflow-hidden bg-[#0A0A0A] relative">
      <Navbar />
      <HeroSection />
      {/* Agency signature */}
      <div className="absolute bottom-3 right-4 md:bottom-4 md:right-6 z-[10] flex items-center gap-1">
        <span className="text-[0.6rem] text-[#F5F0E8]/20 font-body tracking-wide">
          © 2026 afrikher by{" "}
          <a href="https://technovolut.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5F0E8]/30 transition-colors">
            technovolut
          </a>
          {" & "}
          <a href="https://www.fide-pay.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#F5F0E8]/30 transition-colors">
            Fidepay
          </a>
        </span>
      </div>
    </main>
  );
}
