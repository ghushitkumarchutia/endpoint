import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { ROUTES } from "../utils/constants";
import { toast } from "react-hot-toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data);
      toast.success("Welcome back!");
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      // Error handled by helper or service, but toast here for UX
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-[80vh] flex items-center justify-center px-4'>
      <div className='w-full max-w-md bg-card border border-border p-8 rounded-xl shadow-lg'>
        <div className='text-center mb-8'>
          <h1 className='text-2xl font-bold'>Welcome Back</h1>
          <p className='text-muted-foreground text-sm mt-2'>
            Enter your credentials to access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <Input
            label='Email'
            type='email'
            placeholder='you@example.com'
            error={errors.email?.message}
            {...register("email", { required: "Email is required" })}
          />
          <Input
            label='Password'
            type='password'
            placeholder='••••••••'
            error={errors.password?.message}
            {...register("password", { required: "Password is required" })}
          />

          <div className='flex justify-end'>
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className='text-xs text-primary hover:underline'
            >
              Forgot password?
            </Link>
          </div>

          <Button type='submit' className='w-full' isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <p className='text-center text-sm text-muted-foreground mt-6'>
          Don't have an account?{" "}
          <Link to={ROUTES.REGISTER} className='text-primary hover:underline'>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
