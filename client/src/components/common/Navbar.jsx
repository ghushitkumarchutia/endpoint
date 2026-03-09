import { Link, useLocation } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../utils/constants";
import { useState } from "react";

const Navbar = ({ onMenuClick }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [hasNotifications] = useState(true);

  const isAuthPage = [
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.FORGOT_PASSWORD,
  ].includes(location.pathname);

  if (isAuthPage) return null;

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <nav className='sticky top-0 mt-4 mx-4 rounded-full md:rounded-[30px] z-40 w-[calc(100%-2rem)] bg-black'>
      <div className='w-full px-6 h-[68px] flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <button
            onClick={onMenuClick}
            className='md:hidden p-2 text-white hover:bg-white/10 hover:text-white rounded-lg transition-colors'
          >
            <Menu className='h-6 w-6' />
          </button>
        </div>

        {isAuthenticated ? (
          <div className='flex items-center gap-4'>
            <Link to={ROUTES.NOTIFICATIONS} className='relative p-2.5'>
              <Bell className='h-5 w-5 md:h-6 md:w-6 text-white hover:brightness-125 hover:scale-[1.05] transition-all duration-200 group' />
              {hasNotifications && (
                <span className='absolute top-2 right-2.5 h-2 w-2 md:h-2.5 md:w-2.5 bg-[#40518B] shadow-[0_0_8px_rgba(20,184,166,0.6)] rounded-full'></span>
              )}
            </Link>

            <div className='flex items-center gap-3 pl-2'>
              <div
                className='h-10 w-10 rounded-full flex items-center justify-center overflow-hidden'
                style={{
                  background: `linear-gradient(to bottom, transparent 0%, #4D4C4F 100%), linear-gradient(to right, #485068, #40518B)`,
                }}
              >
                <span className='text-white font-dmsans text-[20px]'>
                  {userInitial}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex items-center gap-3'>
            <Link
              to={ROUTES.LOGIN}
              className='px-4 py-2 text-sm text-white/60 hover:text-white transition-colors'
            >
              Login
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className='px-4 py-2 text-sm text-white bg-linear-to-r from-[#1eb2a6] to-[#0d9488] hover:from-[#20c0b4] hover:to-[#0faba0] hover:scale-[0.97] active:scale-[0.95] transition-all duration-200 rounded-lg font-medium shadow-[0_4px_20px_rgba(20,184,166,0.3)]'
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
