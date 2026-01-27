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

  return (
    <div className='h-[calc(100vh-120px)] flex flex-col'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h1 className='text-2xl font-bold'>API Dependencies</h1>
          <p className='text-muted-foreground'>
            Visualize relationships and detect cascading failures
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={fetchGraph}
            className='flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors'
          >
            <RefreshCw className='h-4 w-4' />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className='p-4 bg-destructive/10 text-destructive rounded-lg mb-4'>
          {error}
        </div>
      )}

      <div className='flex-1 bg-card border border-border rounded-xl overflow-hidden'>
        {loading ? (
          <div className='h-full flex items-center justify-center'>
            <Loader size='lg' />
          </div>
        ) : (
          <DependencyGraph graph={graph} onNodeClick={handleNodeClick} />
        )}
      </div>

      {impactAnalysis && (
        <div className='mt-4'>
          <ImpactHighlight analysis={impactAnalysis} />
        </div>
      )}

      <div className='mt-4 p-4 bg-muted/50 border border-border rounded-xl'>
        <div className='flex items-start gap-3'>
          <GitBranch className='h-5 w-5 text-primary mt-0.5' />
          <div>
            <p className='font-medium text-sm'>How to use:</p>
            <ul className='text-sm text-muted-foreground mt-1 space-y-1'>
              <li>• Click on any API node to see its impact analysis</li>
              <li>• Use scroll to zoom in/out on the graph</li>
              <li>• Drag nodes to rearrange the layout</li>
              <li>• Highlighted nodes show cascading failure paths</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dependencies;
