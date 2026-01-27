import { Link, useLocation } from "react-router-dom";
import { LogOut, Bell } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { APP_NAME, ROUTES } from "../../utils/constants";
import { useState } from "react";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [hasNotifications] = useState(true); // TODO: connect to real notifications

  const isAuthPage = [
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.FORGOT_PASSWORD,
  ].includes(location.pathname);

  if (isAuthPage) return null;

  // Get first letter of user's name for avatar
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <nav className='sticky top-0 z-40 w-full border-b border-neutral-800 bg-black'>
      <div className='w-full px-6 h-[68px] flex items-center justify-between'>
        {/* Logo - left end */}
        <Link
          to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME}
          className='flex items-center gap-2.5'
        >
          <div className='h-7 w-7 bg-white rounded flex items-center justify-center'>
            <span className='text-black font-bold text-sm'>E</span>
          </div>
          <span className='font-semibold text-base text-white'>{APP_NAME}</span>
        </Link>

        {/* Right side - notification + profile + logout */}
        {isAuthenticated && (
          <div className='flex items-center gap-2'>
            {/* Notification Bell */}
            <Link
              to={ROUTES.NOTIFICATIONS}
              className='relative p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors'
            >
              <Bell className='h-4 w-4 text-white' />
              {hasNotifications && (
                <span className='absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center'>
                  <span className='text-[10px] font-medium text-white'>3</span>
                </span>
              )}
            </Link>

            {/* Profile Avatar */}
            <div className='h-8 w-8 bg-neutral-800 rounded-full flex items-center justify-center border border-neutral-700'>
              <span className='text-white font-medium text-sm'>
                {userInitial}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className='p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors'
              title='Logout'
            >
              <LogOut className='h-4 w-4 text-white' />
            </button>
          </div>
        )}

        {/* Not authenticated - show login/register */}
        {!isAuthenticated && (
          <div className='flex items-center gap-3'>
            <Link
              to={ROUTES.LOGIN}
              className='px-4 py-2 text-sm text-white hover:text-neutral-300 transition-colors'
            >
              Login
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className='px-4 py-2 text-sm bg-white text-black rounded-lg font-medium hover:bg-neutral-200 transition-colors'
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
