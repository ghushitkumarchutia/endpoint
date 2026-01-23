import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import authService from "../services/authService";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { ROUTES } from "../utils/constants";
import { toast } from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
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
      await authService.resetPassword({ token, password: data.password });
      toast.success("Password reset successfully");
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-[80vh] flex items-center justify-center px-4'>
      <div className='w-full max-w-md bg-card border border-border p-8 rounded-xl shadow-lg'>
        <div className='text-center mb-8'>
          <h1 className='text-2xl font-bold'>Reset Password</h1>
          <p className='text-muted-foreground text-sm mt-2'>
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <Input
            label='New Password'
            type='password'
            placeholder='••••••••'
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Min 6 characters" },
            })}
          />

          <Button type='submit' className='w-full' isLoading={isLoading}>
            Set New Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
