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
    <div className='bg-card border border-border rounded-xl p-6 shadow-sm'>
      <h3 className='text-lg font-semibold mb-4'>Quick API Tester</h3>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='flex gap-2'>
          <select
            className='w-24 px-2 py-2 rounded-md border border-input bg-background text-sm'
            {...register("method")}
          >
            {API_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <Input
            placeholder='https://api.example.com'
            error={errors.url?.message}
            className='flex-1'
            {...register("url", { required: "URL required" })}
          />
          <Button type='submit' disabled={loading}>
            {loading ? <Loader2 className='h-4 w-4 animate-spin' /> : "Test"}
          </Button>
        </div>
      </form>

      {result && (
        <div
          className={`mt-4 p-4 rounded-lg border text-sm ${
            result.success
              ? "bg-green-500/10 border-green-500/20 text-green-200"
              : "bg-red-500/10 border-red-500/20 text-red-200"
          }`}
        >
          <div className='flex items-center gap-2 mb-2 font-semibold'>
            {result.success ? (
              <CheckCircle className='h-4 w-4' />
            ) : (
              <AlertCircle className='h-4 w-4' />
            )}
            <span>Status: {result.statusCode || "N/A"}</span>
            {result.responseTime && (
              <span className='text-muted-foreground'>
                • {result.responseTime}ms
              </span>
            )}
          </div>

          {result.error && (
            <div className='mb-2 text-red-400'>Error: {result.error}</div>
          )}

          {result.body && (
            <pre className='bg-black/20 p-2 rounded overflow-x-auto text-xs font-mono'>
              {JSON.stringify(result.body, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default TestApiForm;
