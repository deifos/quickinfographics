import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { GallerySection } from "@/components/landing/GallerySection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PricingSection } from "@/components/landing/PricingSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground relative min-h-screen">
      <Navbar />
      <HeroSection />
      <GallerySection />
      <HowItWorks />
      <PricingSection />
      <Footer />
    </div>
  );
}
