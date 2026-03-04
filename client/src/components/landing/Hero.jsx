import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { ROUTES } from "../../utils/constants";
import HeroBackground from "./HeroBackground";
import HeroDashboard from "./HeroDashboard";

const Hero = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    navigate(ROUTES.REGISTER, { state: { email } });
  };

  return (
    <section className='relative min-h-screen flex text-white flex-col items-center justify-center overflow-hidden bg-black selection:bg-white/30 pt-36 pb-20'>
      <HeroBackground />

      <div className='container mx-auto px-4 relative z-10 flex flex-col items-center justify-center text-center'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='mb-6'
        >
          <div className='relative inline-flex items-center gap-2 pl-3 pr-2 py-2.5 rounded-full border-[0.5px] border-teal-400/20 bg-white/3 backdrop-blur-md text-[13px] font-dmsans-light text-[#bbb] hover:bg-white/6 transition-colors cursor-pointer overflow-hidden'>
            <div
              className='absolute inset-0 pointer-events-none bg-linear-to-r from-transparent via-white/6 to-transparent'
              style={{ animation: "shimmer 6s linear infinite" }}
            />
            <style>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>
            <span className='flex h-2.5 w-2.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.5)] animate-pulse relative z-10'></span>
            <span className='relative z-10'>
              Endpoint is now generally available
            </span>
            <ChevronRight className='w-3.5 h-3.5 text-white/40 relative z-10' />
          </div>
        </motion.div>

        <div className='max-w-[900px] mx-auto z-20'>
          <motion.h1
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className='text-[56px] md:text-[120px] font-bold font-bricolage text-white mb-6 leading-[0.9] drop-shadow-sm'
          >
            The omniscient <br className='hidden sm:block' />
            <span className='text-teal-500'>API observer.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className='text-[15px] md:text-[21px] text-white max-w-3xl mx-auto mb-10 leading-[1.6] font-normal font-dmsans-light tracking-tight'
          >
            Endpoint tracks behavior patterns, predicts failures before they
            happen, and provides AI-powered root cause analysis—all through a
            single unified interface.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className='flex items-center justify-center px-3'
          >
            <div className='flex items-center p-1 rounded-full border border-white/12 bg-white/8 backdrop-blur-xl shadow-[0_0_60px_rgba(255,255,255,0.05)] max-w-[372px] mx-auto overflow-hidden'>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
                placeholder='Email address'
                className='flex-1 h-9 md:h-9 bg-transparent px-4 md:px-5 text-[13px] md:text-[15px] text-white placeholder-white/40 font-dmsans outline-none min-w-0'
              />
              <button
                onClick={handleStart}
                className='h-9 md:h-9 px-3.5 md:px-4 py-4.5 rounded-full text-[13.5px] md:text-[16px] font-dmsans bg-white text-black hover:bg-neutral-200 transition-colors duration-200 flex items-center justify-center cursor-pointer font-medium shrink-0'
              >
                Start now
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className='mt-20 w-full max-w-6xl mx-auto relative group z-20'
        >
          <div className='absolute -inset-[2px] rounded-[18px] bg-linear-to-b from-white/15 to-transparent opacity-50' />

          <HeroDashboard />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
