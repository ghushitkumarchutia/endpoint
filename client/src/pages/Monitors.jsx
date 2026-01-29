import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, ChevronLeft } from "lucide-react";
import apiService from "../services/apiService";
import useFetch from "../hooks/useFetch";
import ApiCard from "../components/dashboard/ApiCard";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { ROUTES } from "../utils/constants";

const Monitors = () => {
  const navigate = useNavigate();
  const { request, loading } = useFetch();
  const [apis, setApis] = useState([]);

  const fetchData = async () => {
    try {
      const apisData = await request(apiService.getApis);
      setApis(apisData.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && apis.length === 0) return <Loader size='lg' />;

  return (
    <div className='h-[calc(100%-2rem)] m-4 bg-[#f5f5f6] rounded-3xl overflow-hidden flex flex-col'>
      {/* Header */}
      <div className='px-6 py-5 flex items-center justify-between shrink-0'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            onClick={() => navigate(-1)}
            className='p-2 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer'
          >
            <ChevronLeft className='h-6 w-6' />
          </Button>
          <div>
            <h1 className='text-xl font-bold text-gray-900'>All Monitors</h1>
            <p className='text-sm text-gray-500 mt-0.5'>
              Manage and view all API monitors
            </p>
          </div>
        </div>
        <Link to={ROUTES.ADD_API}>
          <Button className='rounded-full bg-[#14412B] hover:bg-[#1a5438] text-white px-5 py-2.5 text-sm flex items-center gap-2 cursor-pointer shadow-sm transition-all'>
            <Plus className='h-4 w-4' />
            Add New
          </Button>
        </Link>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-auto p-8'>
        {apis.length === 0 ? (
          <div className='h-full flex flex-col items-center justify-center text-center max-w-md mx-auto'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
              <Plus className='h-8 w-8 text-gray-400' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-1'>
              No Monitors Yet
            </h3>
            <p className='text-gray-500 mb-6'>
              Get started by adding your first API monitor.
            </p>
            <Link to={ROUTES.ADD_API}>
              <Button className='rounded-full bg-[#14412B] hover:bg-[#1a5438] text-white px-6 py-2.5 cursor-pointer'>
                Create Monitor
              </Button>
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto'>
            {apis.map((api) => (
              <ApiCard key={api._id} api={api} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Monitors;
