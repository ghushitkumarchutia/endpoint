import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { ROUTES } from "../utils/constants";
import { toast } from "react-hot-toast";

const Register = () => {
  const { register: registerUser } = useAuth();
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
      await registerUser(data);
      toast.success("Account created successfully!");
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-[80vh] flex items-center justify-center px-4'>
      <div className='w-full max-w-md bg-card border border-border p-8 rounded-xl shadow-lg'>
        <div className='text-center mb-8'>
          <h1 className='text-2xl font-bold'>Create Account</h1>
          <p className='text-muted-foreground text-sm mt-2'>
            Start monitoring your APIs for free
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <Input
            label='Full Name'
            placeholder='John Doe'
            error={errors.name?.message}
            {...register("name", { required: "Name is required" })}
          />
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
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Min 6 characters" },
            })}
          />

          <Button type='submit' className='w-full' isLoading={isLoading}>
            Create Account
          </Button>
        </form>

        <p className='text-center text-sm text-muted-foreground mt-6'>
          Already have an account?{" "}
          <Link to={ROUTES.LOGIN} className='text-primary hover:underline'>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
