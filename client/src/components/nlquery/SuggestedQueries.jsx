import { Sparkles, ArrowRight } from "lucide-react";

const SuggestedQueries = ({ suggestions, onSelect }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className='flex flex-col items-center gap-3 w-full max-w-2xl'>
      <div className='flex flex-wrap justify-center gap-2'>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion)}
            className='group flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-full text-xs font-medium text-gray-600 hover:border-[#14412B] hover:text-[#14412B] hover:bg-[#14412B]/5 transition-all'
          >
            <span>{suggestion}</span>
            <ArrowRight className='h-3 w-3 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300' />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQueries;
