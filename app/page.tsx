import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import FeaturedArticles from "@/components/home/FeaturedArticles";
import BoutiquePreview from "@/components/home/BoutiquePreview";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FeaturedArticles />
      <BoutiquePreview />
      <Newsletter />
      <Footer />
    </main>
  );
}
