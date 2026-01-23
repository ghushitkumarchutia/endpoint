import { APP_NAME } from "../../utils/constants";

const Footer = () => {
  return (
    <footer className='border-t border-border bg-background py-6 md:py-0'>
      <div className='container mx-auto px-4 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row'>
        <p className='text-center text-sm leading-loose text-muted-foreground md:text-left'>
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
        <div className='flex items-center gap-4 text-sm text-muted-foreground'>
          <a href='#' className='hover:text-foreground transition-colors'>
            Terms
          </a>
          <a href='#' className='hover:text-foreground transition-colors'>
            Privacy
          </a>
          <a href='#' className='hover:text-foreground transition-colors'>
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
