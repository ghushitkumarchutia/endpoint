import { ZoomIn, ZoomOut, Maximize2, Filter, RefreshCw } from "lucide-react";

const GraphControls = ({
  onZoomIn,
  onZoomOut,
  onFitView,
  onRefresh,
  filterOptions,
  selectedFilter,
  onFilterChange,
}) => {
  return (
    <div className='absolute top-4 left-4 flex flex-col gap-2 z-10'>
      <div className='bg-card border border-border rounded-lg shadow-md overflow-hidden'>
        <button
          onClick={onZoomIn}
          className='p-2 hover:bg-muted transition-colors border-b border-border'
          title='Zoom In'
        >
          <ZoomIn className='h-4 w-4' />
        </button>
        <button
          onClick={onZoomOut}
          className='p-2 hover:bg-muted transition-colors border-b border-border'
          title='Zoom Out'
        >
          <ZoomOut className='h-4 w-4' />
        </button>
        <button
          onClick={onFitView}
          className='p-2 hover:bg-muted transition-colors border-b border-border'
          title='Fit View'
        >
          <Maximize2 className='h-4 w-4' />
        </button>
        <button
          onClick={onRefresh}
          className='p-2 hover:bg-muted transition-colors'
          title='Refresh'
        >
          <RefreshCw className='h-4 w-4' />
        </button>
      </div>

      {filterOptions && filterOptions.length > 0 && (
        <div className='bg-card border border-border rounded-lg shadow-md p-2'>
          <div className='flex items-center gap-2 mb-2 text-xs text-muted-foreground'>
            <Filter className='h-3 w-3' />
            <span>Filter</span>
          </div>
          <select
            value={selectedFilter || ""}
            onChange={(e) => onFilterChange(e.target.value)}
            className='w-full text-xs p-1.5 bg-muted border border-border rounded'
          >
            <option value=''>All</option>
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default GraphControls;
