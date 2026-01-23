import { Sparkles } from "lucide-react";

const SuggestedQueries = ({ suggestions, onSelect }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className='space-y-3'>
      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
        <Sparkles className='h-4 w-4' />
        <span>Try asking</span>
      </div>
      <div className='flex flex-wrap gap-2'>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion)}
            className='px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 border border-border rounded-full transition-colors text-left'
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedQueries;
