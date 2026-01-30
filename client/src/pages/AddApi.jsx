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
    <div className='bg-[#f5f5f6] rounded-3xl h-auto overflow-visible lg:h-full lg:overflow-hidden'>
      <div className='max-w-2xl mx-auto pt-6 pb-16'>
        <h1 className='text-2xl font-dmsans mb-2 text-center text-gray-900'>
          Monitor New API
        </h1>
        <p className='text-gray-500 mb-6 font-dmsans-light text-center text-sm'>
          Configure tracking for a new endpoint.
        </p>

        <div className='bg-white border border-gray-200 rounded-3xl p-8 shadow-sm'>
          <ApiForm onSubmit={onSubmit} isLoading={loading} />
        </div>
      </div>
    </div>
  );
};

export default AddApi;
