import { Link } from "react-router-dom";
import Button from "../components/common/Button";
import { ROUTES } from "../utils/constants";

const NotFound = () => {
  return (
    <div className='min-h-[80vh] flex flex-col items-center justify-center px-4 text-center'>
      <h1 className='text-9xl font-bold text-primary/20'>404</h1>
      <h2 className='text-2xl font-bold mt-8 mb-4'>Page Not Found</h2>
      <p className='text-muted-foreground mb-8 max-w-md'>
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link to={ROUTES.HOME}>
        <Button>Go Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
