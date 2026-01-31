import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Filter,
  Check,
  ShieldAlert,
  FileJson,
  Activity,
} from "lucide-react";
import useContracts from "../hooks/useContracts";
import ViolationList from "../components/contract/ViolationList";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";

const Contracts = () => {
  const [filter, setFilter] = useState("all");

  const {
    violations,
    stats,
    loading,
    error,
    fetchViolations,
    fetchStats,
    acknowledgeViolation,
  } = useContracts();

  useEffect(() => {
    fetchViolations();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAcknowledge = async (violationId) => {
    try {
      await acknowledgeViolation(violationId);
      toast.success("Violation acknowledged");
      fetchViolations();
      fetchStats();
    } catch {
      toast.error("Failed to acknowledge violation");
    }
  };

  const filteredViolations = violations?.filter((v) => {
    if (filter === "all") return true;
    if (filter === "unacknowledged") return !v.acknowledged;
    return v.type === filter;
  });

  // Suppress "Request cancelled" error
  const displayError = error === "Request cancelled" ? null : error;

  if (loading && !violations) {
    return (
      <div className='flex items-center justify-center h-full bg-[#f5f5f6] rounded-3xl'>
        <Loader size='lg' />
      </div>
    );
  }

  return (
    <div className='flex flex-col px-4 py-[20px] md:px-6 md:py-[22px] bg-[#f5f5f6] rounded-3xl h-full overflow-y-auto custom-scrollbar'>
      <div className='flex items-center justify-between mb-8 shrink-0'>
        <div>
          <h1 className='text-2xl font-bold font-dmsans text-gray-900'>
            API Contracts
          </h1>
          <p className='text-sm text-gray-500 mt-1 font-medium font-bricolage'>
            Monitor contract violations and schema compliance
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-5 mb-8 shrink-0'>
        <div className='bg-white border border-gray-200/60 rounded-[20px] p-5 shadow-sm relative overflow-hidden group'>
          <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
            <ShieldAlert className='h-24 w-24 text-red-500' />
          </div>
          <div className='flex items-center gap-4 relative'>
            <div className='p-3 bg-red-50 rounded-xl border border-red-100/50'>
              <AlertTriangle className='h-6 w-6 text-red-500' />
            </div>
            <div>
              <p className='text-3xl font-bold font-dmsans text-gray-900 leading-none mb-1'>
                {stats?.totalViolations || 0}
              </p>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                Total Violations
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white border border-gray-200/60 rounded-[20px] p-5 shadow-sm relative overflow-hidden group'>
          <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
            <AlertTriangle className='h-24 w-24 text-amber-500' />
          </div>
          <div className='flex items-center gap-4 relative'>
            <div className='p-3 bg-amber-50 rounded-xl border border-amber-100/50'>
              <AlertTriangle className='h-6 w-6 text-amber-500' />
            </div>
            <div>
              <p className='text-3xl font-bold font-dmsans text-gray-900 leading-none mb-1'>
                {stats?.unacknowledged || 0}
              </p>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                Unacknowledged
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white border border-gray-200/60 rounded-[20px] p-5 shadow-sm relative overflow-hidden group'>
          <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
            <FileJson className='h-24 w-24 text-blue-500' />
          </div>
          <div className='flex items-center gap-4 relative'>
            <div className='p-3 bg-blue-50 rounded-xl border border-blue-100/50'>
              <Check className='h-6 w-6 text-blue-500' />
            </div>
            <div>
              <p className='text-3xl font-bold font-dmsans text-gray-900 leading-none mb-1'>
                {stats?.schemasTracked || 0}
              </p>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                Schemas Tracked
              </p>
            </div>
          </div>
        </div>

        <div className='bg-white border border-gray-200/60 rounded-[20px] p-5 shadow-sm relative overflow-hidden group'>
          <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
            <Activity className='h-24 w-24 text-green-500' />
          </div>
          <div className='flex items-center gap-4 relative'>
            <div className='p-3 bg-green-50 rounded-xl border border-green-100/50'>
              <Check className='h-6 w-6 text-green-500' />
            </div>
            <div>
              <p className='text-3xl font-bold font-dmsans text-gray-900 leading-none mb-1'>
                {stats?.complianceRate?.toFixed(1) || 0}%
              </p>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                Compliance Rate
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-between mb-4 shrink-0'>
        <h3 className='font-bold text-gray-900 font-dmsans text-lg'>
          Violation Log
        </h3>
        <div className='flex items-center gap-2'>
          <div className='relative'>
            <Filter className='h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2' />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className='pl-9 pr-4 py-2 bg-white border border-gray-200/60 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer shadow-sm appearance-none min-w-[180px]'
            >
              <option value='all'>All Violations</option>
              <option value='unacknowledged'>Unacknowledged</option>
              <option value='schema_mismatch'>Schema Mismatch</option>
              <option value='missing_field'>Missing Field</option>
              <option value='type_mismatch'>Type Mismatch</option>
              <option value='extra_field'>Extra Field</option>
            </select>
          </div>
        </div>
      </div>

      {displayError && (
        <div className='p-4 bg-red-50 text-red-600 rounded-2xl mb-6 text-sm font-medium border border-red-100 flex items-center gap-3'>
          {displayError}
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0'>
        <div className='lg:col-span-2 overflow-y-auto custom-scrollbar pr-2'>
          <ViolationList
            violations={filteredViolations || []}
            onAcknowledge={handleAcknowledge}
          />
        </div>

        <div className='sticky top-0 h-fit'>
          <div className='bg-white border border-gray-200/60 rounded-[24px] p-8 text-center shadow-sm'>
            <div className='p-4 bg-gray-50 rounded-full mb-4 w-fit mx-auto border border-gray-100'>
              <ShieldAlert className='h-8 w-8 text-gray-300' />
            </div>
            <p className='text-gray-500 font-medium'>
              Select a violation to view analysis
            </p>
            <p className='text-xs text-gray-400 mt-2'>
              Detailed schema diffs and AI explanations will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contracts;
