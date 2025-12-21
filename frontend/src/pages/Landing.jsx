import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    // FIX APPLIED BELOW: added `dark:bg-slate-950` and `dark:text-gray-100`
    <div className="relative w-full min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 overflow-x-hidden transition-colors duration-300">

      <Navbar />

      <main className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>

      <Footer />

    </div>
  );
}