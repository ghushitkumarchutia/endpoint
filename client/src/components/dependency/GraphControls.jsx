import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  RefreshCw,
  Layers,
} from "lucide-react";

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
    <div className='absolute bottom-6 left-6 flex flex-col gap-3 z-20'>
      {/* Zoom Controls */}
      <div className='bg-white/90 backdrop-blur-md border border-gray-200/60 rounded-2xl shadow-xl shadow-gray-200/20 p-1.5 flex flex-col gap-1'>
        <button
          onClick={onZoomIn}
          className='p-2 hover:bg-gray-100/80 rounded-xl transition-all text-gray-600 hover:text-gray-900'
          title='Zoom In'
        >
          <ZoomIn className='h-4.5 w-4.5' />
        </button>
        <button
          onClick={onZoomOut}
          className='p-2 hover:bg-gray-100/80 rounded-xl transition-all text-gray-600 hover:text-gray-900'
          title='Zoom Out'
        >
          <ZoomOut className='h-4.5 w-4.5' />
        </button>
        <div className='h-[1px] bg-gray-100 mx-2 my-0.5'></div>
        <button
          onClick={onFitView}
          className='p-2 hover:bg-gray-100/80 rounded-xl transition-all text-gray-600 hover:text-gray-900'
          title='Fit View'
        >
          <Maximize2 className='h-4.5 w-4.5' />
        </button>
      </div>

      {/* Filter Control */}
      {filterOptions && filterOptions.length > 0 && (
        <div className='bg-white/90 backdrop-blur-md border border-gray-200/60 rounded-2xl shadow-xl shadow-gray-200/20 p-1.5'>
          <div className='relative group'>
            <div className='absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none'>
              <Filter className='h-3.5 w-3.5 text-gray-400' />
            </div>
            <select
              value={selectedFilter || ""}
              onChange={(e) => onFilterChange(e.target.value)}
              className='w-full appearance-none pl-8 pr-8 py-2 bg-transparent text-xs font-medium text-gray-700 focus:outline-none cursor-pointer hover:bg-gray-50 rounded-xl transition-colors'
            >
              <option value=''>All Relationships</option>
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className='absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none'>
              <Layers className='h-3 w-3 text-gray-300' />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphControls;
