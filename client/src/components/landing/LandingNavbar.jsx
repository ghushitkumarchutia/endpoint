import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { ROUTES } from "../../utils/constants";
import useAuth from "../../hooks/useAuth";

const NAV_LINKS = [
  { to: "#features", label: "Features" },
  { to: "#how-it-works", label: "How it works" },
  { to: "#faq", label: "FAQ" },
];

const LandingNavbar = () => {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e, to) => {
    if (to.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(to);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
    }
  };

  return (
    <div className='fixed top-5 left-0 right-0 z-100 flex justify-center px-4 pointer-events-none'>
      <nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`pointer-events-auto flex items-center justify-between h-[52px] px-1.5 pl-5 rounded-full w-full max-w-[680px] transition-all duration-500 ${
          scrolled
            ? "bg-[#111]/90 backdrop-blur-2xl border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
            : "bg-white/4 backdrop-blur-xl border border-white/6"
        }`}
      >
        <Link
          to='/'
          className='text-[18px] font-bricolage text-white tracking-tight shrink-0'
        >
          <span className='text-teal-400'>End</span>
          <span className='font-medium'>point</span>
        </Link>

        <div className='hidden md:flex items-center gap-0.5'>
          {NAV_LINKS.map((link) => (
            <a
              key={link.to}
              href={link.to}
              onClick={(e) => handleNavClick(e, link.to)}
              className='px-3.5 py-1.5 text-[15px] font-dmsans text-white/50 hover:text-white transition-colors duration-200 rounded-full'
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className='flex items-center gap-2'>
          <Link
            to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN}
            className='hidden md:flex'
          >
            <button className='h-9 px-6 text-[16px] font-dmsans text-black bg-white hover:bg-neutral-200 transition-all duration-200 rounded-full cursor-pointer'>
              {isAuthenticated ? "Dashboard" : "Sign in"}
            </button>
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className='md:hidden h-8 w-8 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer'
          >
            {mobileOpen ? (
              <X className='w-4.5 h-4.5' />
            ) : (
              <Menu className='w-4.5 h-4.5' />
            )}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className='pointer-events-auto md:hidden fixed top-[72px] left-4 right-4 bg-[#111]/95 backdrop-blur-2xl border-[0.5px] border-white/10 rounded-3xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.to}
              href={link.to}
              onClick={(e) => handleNavClick(e, link.to)}
              className='block py-3 px-4 text-[15px] font-dmsans text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-colors'
            >
              {link.label}
            </a>
          ))}
          <div className='mt-2 pt-3 border-t border-white/6'>
            <Link
              to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN}
              onClick={() => setMobileOpen(false)}
            >
              <button className='w-full h-12 text-[18px] font-dmsans text-black bg-white hover:bg-neutral-200 transition-colors rounded-full cursor-pointer'>
                {isAuthenticated ? "Dashboard" : "Sign in"}
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LandingNavbar;
