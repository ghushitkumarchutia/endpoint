import { useEffect, useState } from "react";
import { GitBranch, RefreshCw, Zap } from "lucide-react";
import useDependencies from "../hooks/useDependencies";
import DependencyGraph from "../components/dependency/DependencyGraph";
import ImpactHighlight from "../components/dependency/ImpactHighlight";
import GraphControls from "../components/dependency/GraphControls";
import Loader from "../components/common/Loader";

const Dependencies = () => {
  const [_selectedApi, setSelectedApi] = useState(null);
  const {
    graph,
    impactAnalysis,
    loading,
    error,
    fetchGraph,
    fetchImpactAnalysis,
  } = useDependencies();

  useEffect(() => {
    fetchGraph();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNodeClick = async (apiId) => {
    setSelectedApi(apiId);
    await fetchImpactAnalysis(apiId);
  };

  // Suppress "Request cancelled" error
  const displayError = error === "Request cancelled" ? null : error;

  return (
    <div className='flex flex-col px-4 py-[20px] md:px-6 md:py-[22px] bg-[#f5f5f6] rounded-3xl h-full overflow-hidden'>
      <div className='flex items-center justify-between mb-6 shrink-0'>
        <div>
          <h1 className='text-2xl font-bold font-dmsans text-gray-900'>
            API Dependencies
          </h1>
          <p className='text-sm text-gray-500 mt-1 font-medium font-bricolage'>
            Visualize relationships and detect cascading failures
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={fetchGraph}
            className='flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-full border border-gray-200 shadow-sm transition-all text-sm font-medium'
          >
            <RefreshCw className='h-4 w-4' />
            Refresh
          </button>
        </div>
      </div>

      {displayError && (
        <div className='p-4 bg-red-50 text-red-600 rounded-xl mb-4 text-sm font-medium border border-red-100 flex items-center gap-2 shrink-0'>
          <Zap className='h-4 w-4 fill-current' />
          {displayError}
        </div>
      )}

      <div className='flex-1 min-h-0 bg-white border border-gray-200/60 rounded-[24px] shadow-sm relative overflow-hidden'>
        {loading ? (
          <div className='h-full flex items-center justify-center'>
            <Loader size='lg' />
          </div>
        ) : (
          <DependencyGraph graph={graph} onNodeClick={handleNodeClick} />
        )}

        {impactAnalysis && <ImpactHighlight analysis={impactAnalysis} />}
      </div>

      <div className='mt-4 p-4 bg-[#e8e8ea]/50 rounded-2xl border border-gray-200/60 shrink-0 hidden md:block'>
        <div className='flex items-start gap-3'>
          <div className='p-2 bg-white rounded-lg shadow-sm'>
            <GitBranch className='h-4 w-4 text-[#14412B]' />
          </div>
          <div>
            <p className='font-bold text-sm text-gray-900 font-dmsans'>
              How to use:
            </p>
            <div className='flex items-center gap-6 mt-1.5'>
              <span className='text-xs text-gray-500 font-medium flex items-center gap-1.5'>
                <span className='w-1.5 h-1.5 rounded-full bg-gray-400'></span>
                Click nodes for impact analysis
              </span>
              <span className='text-xs text-gray-500 font-medium flex items-center gap-1.5'>
                <span className='w-1.5 h-1.5 rounded-full bg-gray-400'></span>
                Scroll to zoom
              </span>
              <span className='text-xs text-gray-500 font-medium flex items-center gap-1.5'>
                <span className='w-1.5 h-1.5 rounded-full bg-gray-400'></span>
                Drag to rearrange
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dependencies;
