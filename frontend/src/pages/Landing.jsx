import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <div className="relative w-full min-h-screen bg-white text-gray-900 overflow-x-hidden">

      <Navbar />

      {/* Page Content */}
      <main className="pt-24">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>

      <Footer />

    </div>
  );
}
