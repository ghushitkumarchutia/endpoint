import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../common/Button";
import Input from "../common/Input";
import apiService from "../../services/apiService";
import { API_METHODS } from "../../utils/constants";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

const TestApiForm = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      method: "GET",
      url: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await apiService.testApi(data);
      setResult({ success: true, ...response.data });
    } catch (error) {
      setResult({
        success: false,
        error: error.response?.data?.message || error.message,
        ...error.response?.data?.data,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white border border-gray-200 rounded-[24px] md:rounded-3xl p-5 md:p-8 shadow-sm'>
      <div className='mb-6'>
        <h3 className='text-lg font-dmsans text-gray-900 text-center md:text-left'>
          Quick API Tester
        </h3>
        <p className='text-sm text-gray-500 font-bricolage mt-1 text-center md:text-left'>
          Select a method and enter your endpoint URL to test.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='space-y-4 md:space-y-6'
      >
        <div className='flex flex-col md:flex-row gap-3 md:gap-4'>
          <div className='md:w-24 shrink-0'>
            <select
              className='flex w-full border border-gray-200 bg-[#f9fafb] rounded-[14px] px-3 py-3 text-sm font-bricolage text-gray-900 focus:outline-none focus:border-[#14412B]/30 focus:bg-white focus:ring-4 focus:ring-[#14412B]/5 transition-all duration-200'
              {...register("method")}
            >
              {API_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className='flex-1'>
            <Input
              placeholder='https://api.example.com/v1/resource'
              error={errors.url?.message}
              className='w-full'
              {...register("url", {
                required: "URL is required",
                pattern: {
                  value: /^(https?:\/\/)/,
                  message: "Must start with http:// or https://",
                },
              })}
            />
          </div>

          <div className='md:w-36 shrink-0'>
            <Button
              type='submit'
              disabled={loading}
              className='w-full md:w-auto bg-[#14412B] text-white md:px-6 px-5 md:py-[13px] py-3.5 rounded-2xl hover:bg-[#1a5438] font-bricolage text-sm transition-all cursor-pointer'
            >
              {loading ? (
                <Loader2 className='h-4 w-4 animate-spin mx-auto' />
              ) : (
                "Send Request"
              )}
            </Button>
          </div>
        </div>
      </form>

      {result && (
        <div className='mt-8 animate-fade-in-up'>
          <div
            className={`p-4 rounded-2xl border ${
              result.success
                ? "bg-emerald-50/50 border-emerald-100"
                : "bg-red-50/50 border-red-100"
            }`}
          >
            <div className='flex items-center justify-between mb-3'>
              <div
                className={`flex items-center gap-2 font-medium ${
                  result.success ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {result.success ? (
                  <CheckCircle className='h-5 w-5' />
                ) : (
                  <AlertCircle className='h-5 w-5' />
                )}
                <span className='font-dmsans'>
                  Status: {result.statusCode || "Error"}
                </span>
              </div>

              {result.responseTime && (
                <div className='px-3 py-1 bg-white rounded-full border border-gray-100 text-xs font-mono text-gray-500 shadow-sm'>
                  {result.responseTime}ms
                </div>
              )}
            </div>

            {result.error && (
              <div className='mb-3 text-sm text-red-600 font-bricolage bg-white/50 p-3 rounded-xl border border-red-100/50'>
                {result.error}
              </div>
            )}

            {result.body && (
              <div className='relative group'>
                <div className='absolute top-2 right-2 px-2 py-1 bg-gray-800 text-gray-300 text-[10px] rounded uppercase font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity'>
                  JSON
                </div>
                <pre className='bg-[#1a1b1e] text-gray-300 p-4 rounded-xl overflow-x-auto text-[13px] font-mono leading-relaxed border border-gray-800 shadow-inner custom-scrollbar'>
                  {JSON.stringify(result.body, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestApiForm;
