import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import authService from "../services/authService";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { ROUTES } from "../utils/constants";
import { toast } from "react-hot-toast";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setIsSent(true);
      toast.success("Reset link sent to your email");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className='min-h-[80vh] flex items-center justify-center px-4'>
        <div className='w-full max-w-md bg-card border border-border p-8 rounded-xl shadow-lg text-center'>
          <h1 className='text-2xl font-bold mb-4'>Check your email</h1>
          <p className='text-muted-foreground mb-6'>
            We have sent a password reset link to your email address. Please
            check your inbox (and spam folder).
          </p>
          <Link to={ROUTES.LOGIN}>
            <Button variant='outline'>Back to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-[80vh] flex items-center justify-center px-4'>
      <div className='w-full max-w-md bg-card border border-border p-8 rounded-xl shadow-lg'>
        <div className='text-center mb-8'>
          <h1 className='text-2xl font-bold'>Forgot Password</h1>
          <p className='text-muted-foreground text-sm mt-2'>
            Enter your email to receive a reset link
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

          <Button type='submit' className='w-full' isLoading={isLoading}>
            Send Reset Link
          </Button>
        </form>

        <p className='text-center text-sm text-muted-foreground mt-6'>
          Remember your password?{" "}
          <Link to={ROUTES.LOGIN} className='text-primary hover:underline'>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
