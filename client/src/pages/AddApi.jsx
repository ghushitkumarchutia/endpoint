import { useNavigate } from "react-router-dom";
import ApiForm from "../components/forms/ApiForm";
import apiService from "../services/apiService";
import useFetch from "../hooks/useFetch";
import { ROUTES } from "../utils/constants";
import { toast } from "react-hot-toast";

const AddApi = () => {
  const navigate = useNavigate();
  const { request, loading } = useFetch();

  const onSubmit = async (data) => {
    try {
      await request(apiService.createApi, data);
      toast.success("API monitor created successfully");
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='flex flex-col px-4 md:px-6 bg-[#f5f5f6] rounded-3xl h-auto overflow-visible lg:h-full lg:overflow-hidden'>
      <div className='max-w-2xl mx-auto w-full pt-4 md:pt-6 pb-8 md:pb-16 flex-1 flex flex-col justify-center'>
        <div className='mb-2 md:mb-4'>
          <h1 className='text-[18px] md:text-2xl font-dmsans mb-1 text-center text-gray-900'>
            Monitor New API
          </h1>
          <p className='text-gray-500 font-bricolage text-center text-[13px] md:text-sm'>
            Configure tracking for a new endpoint.
          </p>
        </div>

        <div className='bg-white border border-gray-200 rounded-[24px] md:rounded-3xl px-5 md:px-8 py-6 md:py-7 shadow-sm'>
          <ApiForm onSubmit={onSubmit} isLoading={loading} />
        </div>
      </div>
    </div>
  );
};

export default AddApi;
