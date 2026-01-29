import { useForm } from "react-hook-form";
import { useEffect } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import { API_METHODS, CHECK_FREQUENCIES } from "../../utils/constants";

const ApiForm = ({ initialData, onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      url: "",
      method: "GET",
      checkFrequency: 300000,
      description: "",
      timeout: 30000,
      expectedStatusCode: 200,
    },
  });

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        setValue(key, initialData[key]);
      });
    }
  }, [initialData, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <Input
          label='API Name'
          placeholder='e.g. Stripe Payment API'
          error={errors.name?.message}
          {...register("name", { required: "Name is required" })}
        />

        <div className='space-y-1.5'>
          <label className='block text-sm font-medium text-gray-700'>
            HTTP Method
          </label>
          <select
            className='flex h-10 w-full border border-gray-300 bg-white rounded-xl py-2 px-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#14412B]/20 focus:border-[#14412B]'
            {...register("method")}
          >
            {API_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        <div className='md:col-span-2'>
          <Input
            label='Endpoint URL'
            placeholder='https://api.example.com/v1/payments'
            error={errors.url?.message}
            {...register("url", {
              required: "URL is required",
              pattern: {
                value: /^(https?:\/\/)/,
                message: "Must start with http:// or https://",
              },
            })}
          />
        </div>

        <div className='space-y-1.5'>
          <label className='block text-sm font-medium text-gray-700'>
            Check Frequency
          </label>
          <select
            className='flex h-10 w-full border border-gray-300 bg-white rounded-xl py-2 px-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#14412B]/20 focus:border-[#14412B]'
            {...register("checkFrequency")}
          >
            {CHECK_FREQUENCIES.map((freq) => (
              <option key={freq.value} value={freq.value}>
                {freq.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label='Timeout (ms)'
          type='number'
          error={errors.timeout?.message}
          {...register("timeout", {
            required: "Timeout is required",
            min: { value: 1000, message: "Min 1000ms" },
            max: { value: 60000, message: "Max 60000ms" },
          })}
        />

        <div className='md:col-span-2'>
          <label className='block text-sm font-medium text-gray-700 mb-1.5'>
            Description (Optional)
          </label>
          <textarea
            className='flex min-h-20 w-full border border-gray-300 bg-white rounded-xl py-3 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#14412B]/20 focus:border-[#14412B] resize-none'
            placeholder="Brief description of this API's purpose..."
            {...register("description")}
          />
        </div>
      </div>

      <div className='flex justify-end gap-3 pt-4 border-t border-gray-100'>
        <Button
          type='button'
          variant='ghost'
          onClick={() => window.history.back()}
          className='bg-white text-gray-700 border border-gray-300 px-6 py-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors'
        >
          Cancel
        </Button>
        <Button
          type='submit'
          isLoading={isLoading}
          className='bg-[#14412B] text-white px-6 py-2 rounded-xl cursor-pointer hover:bg-[#1a5438] transition-colors'
        >
          {initialData ? "Update API" : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default ApiForm;
