import { Link } from "react-router-dom";
import { APP_NAME } from "../../utils/constants";

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Integrations", href: "#integrations" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Status", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Security", href: "#" },
  ],
};

const Footer = () => {
  return (
    <footer className='border-t border-[#222] bg-black pt-14 sm:pt-16 pb-8'>
      <div className='container mx-auto px-4 md:px-8 max-w-6xl'>
        <div className='flex flex-col md:flex-row justify-between items-start gap-10 sm:gap-12 mb-12 sm:mb-16'>
          <div className='max-w-xs'>
            <Link
              to='/'
              className='text-xl font-semibold text-white tracking-tight flex items-center gap-2 outline-none mb-4'
            >
              <span className='text-green-400'>End</span>
              <span className='text-white font-medium tracking-normal -ml-2'>
                point
              </span>
            </Link>
            <p className='text-[#888] text-[13px] sm:text-sm leading-relaxed font-bricolage-light'>
              An API intelligence platform that catches failures before they
              happen and provides AI-powered root cause analysis.
            </p>
          </div>

          <div className='flex gap-12 sm:gap-16 md:gap-20 flex-wrap'>
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category} className='flex flex-col gap-3 sm:gap-4'>
                <span className='text-white font-dmsans font-medium text-[13px] sm:text-sm'>
                  {category}
                </span>
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className='text-[#777] hover:text-white text-[13px] sm:text-sm transition-colors duration-200 font-bricolage-light'
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className='flex flex-col sm:flex-row items-center justify-between border-t border-[#222] pt-6 sm:pt-8 gap-4'>
          <span className='text-[#666] text-[12px] sm:text-[13px] font-bricolage-light'>
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </span>
          <div className='flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#111] border border-[#222] text-[11px] sm:text-[12px] text-[#888] font-mono'>
            <div className='w-1.5 h-1.5 rounded-full bg-teal-500' />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
