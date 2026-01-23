import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import { ROUTES } from "../../utils/constants";
import heroImg from "../../assets/hero.png";

const Hero = () => {
  return (
    <div className='relative min-h-screen bg-white text-slate-900 overflow-hidden pt-10 pb-20'>
      <div className='container mx-auto px-4 relative z-10 flex flex-col items-center'>
        {/* HERO IMAGE AREA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className='relative w-full max-w-5xl mx-auto mb-12 flex justify-center'
        >
          <img
            src={heroImg}
            alt='Endpoint Platform Visualization'
            className='w-full h-auto object-contain max-h-[600px]'
          />
        </motion.div>

        {/* --- TEXT CONTENT --- */}
        <div className='text-center relative z-20 mt-4 max-w-4xl mx-auto'>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className='text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6'
          >
            All-in-one <br className='md:hidden' />
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700'>
              API Platform
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className='text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed'
          >
            Endpoint is a modern, all-in-one API observatory designed to
            perfectly fit your engineering needs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Link to={ROUTES.REGISTER}>
              <Button
                size='lg'
                className='h-14 px-12 rounded-full text-lg bg-gradient-to-r from-[#ff7e5f] to-[#feb47b] border-none shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300 text-white'
              >
                Request a Demo
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
