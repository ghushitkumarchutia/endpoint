import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";

const LandingPage = () => {
  return (
    <div className='min-h-screen'>
      <Hero />
      <Features />
      <HowItWorks />
    </div>
  );
};

export default LandingPage;
