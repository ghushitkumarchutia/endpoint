import { Link, useLocation } from "react-router-dom";
import { LogOut, LayoutDashboard, Plus } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import Button from "./Button";
import NotificationBell from "../dashboard/NotificationBell";
import { APP_NAME, ROUTES } from "../../utils/constants";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isAuthPage = [
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.FORGOT_PASSWORD,
  ].includes(location.pathname);

  if (isAuthPage) return null;

  return (
    <nav className='sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
        <Link to={ROUTES.HOME} className='flex items-center gap-2'>
          <div className='h-8 w-8 bg-primary rounded-lg flex items-center justify-center'>
            <span className='text-primary-foreground font-bold text-lg'>E</span>
          </div>
          <span className='font-bold text-xl tracking-tight text-foreground'>
            {APP_NAME}
          </span>
        </Link>

        <div className='flex items-center gap-4'>
          {isAuthenticated ? (
            <>
              <Link to={ROUTES.DASHBOARD}>
                <Button variant='ghost' size='sm'>
                  <LayoutDashboard className='mr-2 h-4 w-4' />
                  Dashboard
                </Button>
              </Link>
              <Link to={ROUTES.ADD_API}>
                <Button variant='ghost' size='sm'>
                  <Plus className='mr-2 h-4 w-4' />
                  Add API
                </Button>
              </Link>

              <div className='h-6 w-px bg-border mx-1' />

              <NotificationBell />

              <div className='flex items-center gap-3 pl-2'>
                <div className='hidden md:block text-right'>
                  <p className='text-sm font-medium leading-none'>
                    {user?.name}
                  </p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {user?.email}
                  </p>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={logout}
                  title='Logout'
                >
                  <LogOut className='h-4 w-4' />
                </Button>
              </div>
            </>
          ) : (
            <div className='flex items-center gap-2'>
              <Link to={ROUTES.LOGIN}>
                <Button variant='ghost'>Login</Button>
              </Link>
              <Link to={ROUTES.REGISTER}>
                <Button>Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
