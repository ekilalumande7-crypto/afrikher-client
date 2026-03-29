import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <HeroSection />
    </main>
  );
}
