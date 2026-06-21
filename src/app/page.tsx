import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Demo } from '@/components/landing/Demo';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="bg-[#0a0f1e]">
      <Navbar />
      <Hero />
      <Features />
      <Demo />
      <CTA />
      <Footer />
    </div>
  );
}
