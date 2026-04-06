import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";

export default function Home() {
  return (
    <main className="h-screen overflow-hidden bg-[#0A0A0A]">
      <Navbar />
      <HeroSection />
    </main>
  );
}
