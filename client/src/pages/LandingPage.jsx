import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import Stats from "../components/landing/Stats";
import FAQ from "../components/landing/FAQ";
import CTABanner from "../components/landing/CTABanner";

const LandingPage = () => {
  return (
    <div className='min-h-screen bg-black text-white selection:bg-white/30'>
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <FAQ />
      <CTABanner />
    </div>
  );
};

export default LandingPage;
