import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import FeaturedArticles from "@/components/home/FeaturedArticles";
import BoutiquePreview from "@/components/home/BoutiquePreview";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] snap-y snap-mandatory overflow-y-auto h-screen">
      <Navbar />
      <div className="snap-start">
        <HeroSection />
      </div>
      <div className="snap-start">
        <AboutSection />
      </div>
      <div className="snap-start">
        <FeaturedArticles />
      </div>
      <div className="snap-start">
        <BoutiquePreview />
      </div>
      <div className="snap-start">
        <Newsletter />
      </div>
      <div className="snap-start">
        <Footer />
      </div>
    </main>
  );
}
