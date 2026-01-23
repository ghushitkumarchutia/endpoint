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
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Input
          label='API Name'
          placeholder='e.g. Stripe Payment API'
          error={errors.name?.message}
          {...register("name", { required: "Name is required" })}
        />

        <div className='space-y-1.5'>
          <label className='block text-sm font-medium text-foreground'>
            HTTP Method
          </label>
          <select
            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
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
          <label className='block text-sm font-medium text-foreground'>
            Check Frequency
          </label>
          <select
            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
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
          <label className='block text-sm font-medium text-foreground mb-1.5'>
            Description (Optional)
          </label>
          <textarea
            className='flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
            placeholder="Brief description of this API's purpose..."
            {...register("description")}
          />
        </div>
      </div>

      <div className='flex justify-end gap-3 pt-4 border-t border-border'>
        <Button
          type='button'
          variant='ghost'
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button type='submit' isLoading={isLoading}>
          {initialData ? "Update API" : "Create Monitor"}
        </Button>
      </div>
    </form>
  );
};

export default ApiForm;
