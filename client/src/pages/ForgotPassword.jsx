import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowRight, ArrowLeft, MailCheck, Mail, Loader2 } from "lucide-react";
import authService from "../services/authService";
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
      toast.success("Password reset link sent to your email");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
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
              <span className='text-zinc-100'>Email </span>
              <span className='bg-linear-to-r from-teal-300 to-teal-400 bg-clip-text text-transparent'>
                sent.
              </span>
            </h1>
          </div>

          <div className='w-full bg-black border border-white/5 rounded-[38px] p-8 md:p-10 shadow-[0_0_50px_rgba(20,184,166,0.05)] relative text-center'>
            <div className='absolute -inset-px rounded-[38px] bg-linear-to-b from-white/5 via-transparent to-teal-500/20 -z-10' />

            <div className='mx-auto w-14 h-14 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(20,184,166,0.1)]'>
              <MailCheck className='h-7 w-7 text-teal-400' />
            </div>

            <h2 className='text-[20px] font-dmsans text-white mb-2 tracking-wide'>
              Check your inbox
            </h2>
            <p className='text-[14px] font-bricolage text-zinc-400 mb-8 leading-relaxed'>
              We&apos;ve sent a password reset link to your email address.
              Please check your spam folder just in case.
            </p>

            <Link to={ROUTES.LOGIN}>
              <button className='w-full flex items-center justify-center gap-2 bg-[#111315] hover:bg-[#1a1d21] text-zinc-300 border border-white/10 rounded-[14px] py-3 md:py-2.5 text-[15px] font-dmsans transition-all duration-200 cursor-pointer'>
                <ArrowLeft className='h-4.5 w-4.5 opacity-70' />
                Back to Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <span className='text-zinc-100'>Forgot</span>
            <br />
            <span className='bg-linear-to-r from-teal-300 to-teal-400 bg-clip-text text-transparent'>
              password?
            </span>
          </h1>
        </div>

        <div className='w-full bg-black border border-white/5 rounded-[38px] p-8 md:p-10 shadow-[0_0_50px_rgba(20,184,166,0.05)] relative'>
          <div className='absolute -inset-px rounded-[38px] bg-linear-to-b from-white/5 via-transparent to-teal-500/20 -z-10' />

          <div className='text-center mb-8'>
            <h2 className='text-[20px] font-dmsans text-white mb-1 tracking-wide'>
              Reset Access
            </h2>
            <p className='text-[14px] font-bricolage text-zinc-400'>
              We&apos;ll send you a link to reset your password
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
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
                    Send Reset Link
                    <ArrowRight className='h-4.5 w-4.5' />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <p className='text-center text-[14px] md:text-[15px] font-dmsans text-zinc-500 mt-4'>
          Remember your password?{" "}
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

export default ForgotPassword;
