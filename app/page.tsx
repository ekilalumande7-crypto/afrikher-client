import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import FeaturedArticles from "@/components/home/FeaturedArticles";
import BoutiquePreview from "@/components/home/BoutiquePreview";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth">
      <Navbar />
      <section className="snap-start">
        <HeroSection />
      </section>
      <section className="snap-start">
        <AboutSection />
      </section>
      <section className="snap-start">
        <FeaturedArticles />
      </section>
      <section className="snap-start">
        <BoutiquePreview />
      </section>
      <section className="snap-start">
        <Newsletter />
      </section>
      <div className="snap-start">
        <Footer />
      </div>
    </main>
  );
}
