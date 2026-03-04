import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

const CTABanner = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    navigate(ROUTES.REGISTER, { state: { email } });
  };

  return (
    <section className='relative bg-black border-t border-white/4 pb-16 md:pt-8 md:pb-20'>
      <div className='container mx-auto px-4 md:px-8 max-w-4xl relative z-10'>
        <div className='relative rounded-[30px] border border-white/8 bg-[#0a0a0a] overflow-hidden'>
          <div className='absolute inset-0 pointer-events-none'>
            <div className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-teal-500/[0.07] blur-[80px] rounded-full' />
            <div
              className='absolute inset-0 opacity-[0.03]'
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <div className='relative z-10 px-6 md:px-12 py-16 md:py-20 text-center'>
            <h2 className='text-[28px] md:text-[44px] font-bricolage font-bold text-white leading-tight mb-4'>
              Start monitoring your
              <br className='hidden sm:block' />
              <span className='text-teal-400 block md:inline'> APIs today</span>
            </h2>
            <p className='text-[15px] md:text-[17px] text-white/40 font-dmsans-light max-w-lg mx-auto mb-10 leading-relaxed'>
              Set up in under two minutes. No credit card required, no usage
              limits — completely free during general availability.
            </p>

            <div className='flex items-center justify-center'>
              <div className='flex items-center p-1 rounded-full border border-white/12 bg-white/6 backdrop-blur-xl w-full max-w-[372px] mx-auto overflow-hidden'>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleStart()}
                  placeholder='Email address'
                  className='flex-1 h-9 md:h-9 bg-transparent px-4 md:px-5 text-[14px] md:text-[15px] text-white placeholder-white/40 font-dmsans outline-none min-w-0'
                />
                <button
                  onClick={handleStart}
                  className='h-9 md:h-9 px-5 md:px-4 py-4.5 rounded-full text-[14px] md:text-[16px] font-dmsans bg-white text-black hover:bg-neutral-200 transition-colors duration-200 flex items-center justify-center cursor-pointer font-medium shrink-0'
                >
                  Start now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
