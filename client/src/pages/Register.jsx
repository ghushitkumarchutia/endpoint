import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  Lock,
  EyeOff,
  Eye,
  Loader2,
  ArrowRight,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { ROUTES, APP_NAME } from "../utils/constants";
import { toast } from "react-hot-toast";

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (location.state?.email) {
      setValue("email", location.state.email);
    }
  }, [location.state, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      toast.success("Account created successfully!");
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#060c10] font-sans selection:bg-teal-400/30'>
      <div
        className='absolute inset-0 opacity-[0.15] pointer-events-none'
        style={{
          backgroundImage: `repeating-radial-gradient(circle at 50% 150%, transparent, transparent 10px, rgba(45, 212, 191, 0.2) 11px, rgba(45, 212, 191, 0.2) 12px)`,
          backgroundSize: "100% 100%",
        }}
      />

      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-teal-400/10 blur-[100px] pointer-events-none mix-blend-screen' />
      <div className='absolute -top-40 left-1/2 -translate-x-1/2 w-[300px] h-[400px] bg-teal-300/20 blur-[80px] rounded-full pointer-events-none' />

      <div
        className='absolute top-[54%] left-0 right-0 -translate-y-1/2 hidden md:flex items-center justify-between pointer-events-none z-0'
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          maskImage:
            "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
        }}
      >
        <div className='flex-1 flex items-center justify-end opacity-80'>
          <div className='flex-1 h-px bg-linear-to-r from-transparent via-teal-400/20 to-teal-400/60' />
          <svg
            width='80'
            height='400'
            viewBox='0 0 80 400'
            fill='none'
            className='shrink-0 text-teal-400/60 translate-x-px'
          >
            <path
              d='M0 200 L 40 200 Q 80 200, 80 160 L 80 0'
              stroke='currentColor'
              strokeWidth='1'
            />
            <path
              d='M0 200 L 40 200 Q 80 200, 80 240 L 80 400'
              stroke='currentColor'
              strokeWidth='1'
            />
          </svg>
        </div>

        <div className='w-[488px] shrink-0' />

        <div className='flex-1 flex items-center justify-start opacity-80'>
          <svg
            width='80'
            height='400'
            viewBox='0 0 80 400'
            fill='none'
            className='shrink-0 text-teal-400/60 -translate-x-px'
          >
            <path
              d='M80 200 L 40 200 Q 0 200, 0 160 L 0 0'
              stroke='currentColor'
              strokeWidth='1'
            />
            <path
              d='M80 200 L 40 200 Q 0 200, 0 240 L 0 400'
              stroke='currentColor'
              strokeWidth='1'
            />
          </svg>
          <div className='flex-1 h-px bg-linear-to-l from-transparent via-teal-400/20 to-teal-400/60' />
        </div>
      </div>

      <div className='w-full max-w-[440px] px-4 relative z-10 flex flex-col items-center'>
        <div className='text-center -mt-9 mb-6'>
          <h1 className='text-[32px] md:text-[40px] font-bricolage font-bold tracking-tight mb-2 leading-[1.1]'>
            <span className='text-zinc-100'>Create</span>
            <br />
            <span className='bg-linear-to-r from-teal-300 to-teal-400 bg-clip-text text-transparent'>
              your account
            </span>
          </h1>
        </div>

        <div className='w-full bg-black border border-white/5 rounded-[38px] p-8 md:p-10 shadow-[0_0_50px_rgba(20,184,166,0.05)] relative'>
          <div className='absolute -inset-px rounded-[38px] bg-linear-to-b from-white/5 via-transparent to-teal-500/20 -z-10' />

          <div className='text-center mb-8'>
            <h2 className='text-[20px] font-dmsans text-white mb-1 tracking-wide'>
              Join {APP_NAME}
            </h2>
            <p className='text-[14px] font-bricolage text-zinc-400'>
              Start monitoring your APIs for free
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-1.5'>
              <label className='block text-[13px] text-zinc-400 font-dmsans ml-1'>
                Full Name
              </label>
              <div className='relative'>
                <User className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500' />
                <input
                  type='text'
                  placeholder='John Doe'
                  {...register("name", { required: "Name is required" })}
                  className={`w-full bg-[#111315] border ${errors.name ? "border-red-500/50" : "border-white/5"} rounded-xl pl-10 pr-4 py-3 text-[14px] font-dmsans text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal-500/50 focus:bg-[#15181a] transition-all`}
                />
              </div>
              {errors.name && (
                <p className='text-xs text-red-500/80 ml-1 mt-1'>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className='space-y-1.5'>
              <label className='block text-[13px] text-zinc-400 font-dmsans ml-1'>
                Email
              </label>
              <div className='relative'>
                <Mail className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500' />
                <input
                  type='email'
                  placeholder='you@example.com'
                  {...register("email", { required: "Email is required" })}
                  className={`w-full bg-[#111315] border ${errors.email ? "border-red-500/50" : "border-white/5"} rounded-xl pl-10 pr-4 py-3 text-[14px] font-dmsans text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal-500/50 focus:bg-[#15181a] transition-all`}
                />
              </div>
              {errors.email && (
                <p className='text-xs text-red-500/80 ml-1 mt-1'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className='space-y-1.5'>
              <label className='block text-[13px] text-zinc-400 font-dmsans ml-1'>
                Password
              </label>
              <div className='relative'>
                <Lock className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500' />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder='••••••••'
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Min 6 characters" },
                  })}
                  className={`w-full bg-[#111315] border ${errors.password ? "border-red-500/50" : "border-white/5"} rounded-xl pl-10 pr-10 py-3 text-[14px] font-dmsans text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal-500/50 focus:bg-[#15181a] transition-all`}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors'
                >
                  {showPassword ? (
                    <Eye className='w-4 h-4' />
                  ) : (
                    <EyeOff className='w-4 h-4' />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className='text-xs text-red-500/80 ml-1 mt-1'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className='pt-2'>
              <button
                type='submit'
                disabled={isLoading}
                className='w-full flex items-center justify-center gap-2 bg-linear-to-r from-[#1eb2a6] to-[#0d9488] hover:from-[#20c0b4] hover:to-[#0faba0] text-white rounded-[14px] py-3 md:py-2.5 mb-2 text-[17px] font-dmsans transition-all duration-200 shadow-[0_4px_20px_rgba(20,184,166,0.3)] disabled:opacity-50 cursor-pointer active:scale-[0.98]'
              >
                {isLoading ? (
                  <>
                    <Loader2 className='w-5.5 h-5.5 animate-spin p-0' />
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className='h-4.5 w-4.5' />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <p className='text-center text-[14px] md:text-[15px] font-dmsans text-zinc-500 mt-4'>
          Already have an account?{" "}
          <Link
            to={ROUTES.LOGIN}
            className='text-teal-400 hover:text-teal-300 transition-colors'
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
