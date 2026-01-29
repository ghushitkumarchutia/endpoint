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
    <div className='container mx-auto px-4 pt-10 max-w-2xl'>
      <h1 className='text-2xl font-bold mb-2 text-center'>Monitor New API</h1>
      <p className='text-muted-foreground mb-6 text-center'>
        Configure tracking for a new endpoint.
      </p>

      <div className='bg-black border border-[#363636] rounded-[38px] pt-16 pb-6 px-10 shadow-2xl shadow-white/5'>
        <ApiForm onSubmit={onSubmit} isLoading={loading} />
      </div>
    </div>
  );
};

export default AddApi;
