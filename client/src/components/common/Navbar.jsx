import { Link, useLocation } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { APP_NAME, ROUTES } from "../../utils/constants";
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

  // Get first letter of user's name for avatar
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <nav className='sticky top-0 mt-4 mx-4 rounded-3xl z-30 w-[calc(100%-2rem)] bg-[#f5f5f6]'>
      <div className='w-full px-6 h-[68px] flex items-center justify-between'>
        {/* Left Side: Mobile Menu Button Only (No Search, No Logo) */}
        <div className='flex items-center gap-4'>
          <button
            onClick={onMenuClick}
            className='md:hidden p-2 text-gray-500 hover:bg-white rounded-lg transition-colors'
          >
            <Menu className='h-6 w-6' />
          </button>
        </div>

        {/* Right side - notification + profile */}
        {isAuthenticated ? (
          <div className='flex items-center gap-4'>
            {/* Notification Bell */}
            <Link
              to={ROUTES.NOTIFICATIONS}
              className='relative p-2.5 rounded-full bg-[#FFF] hover:bg-gray-50 transition-colors'
            >
              <Bell className='h-5 w-5 text-gray-500' />
              {hasNotifications && (
                <span className='absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full border border-white'></span>
              )}
            </Link>

            {/* Profile User */}
            <div className='flex items-center gap-3 pl-2'>
              <div className='h-10 w-10 bg-[#14412B] rounded-full flex items-center justify-center border-2 border-white overflow-hidden shadow-sm'>
                <span className='text-white font-bold text-sm'>
                  {userInitial}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Not authenticated - show login/register */
          <div className='flex items-center gap-3'>
            <Link
              to={ROUTES.LOGIN}
              className='px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors'
            >
              Login
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className='px-4 py-2 text-sm bg-[#14412B] text-white rounded-lg font-medium hover:bg-[#1a5438] transition-colors shadow-sm'
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
