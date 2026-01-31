import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles } from "lucide-react";

const QueryInput = ({ onSubmit, loading, placeholder }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      onSubmit(query.trim());
      setQuery("");
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit} className='relative group'>
      <div className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors group-focus-within:text-[#14412B]'>
        <Sparkles className='h-4 w-4' />
      </div>
      <input
        ref={inputRef}
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder || "Ask about your APIs..."}
        disabled={loading}
        className='w-full pl-12 pr-14 py-4 bg-gray-50/50 border border-gray-200 rounded-full text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[#14412B]/10 focus:border-[#14412B]/30 focus:bg-white transition-all shadow-sm'
      />
      <button
        type='submit'
        disabled={!query.trim() || loading}
        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all duration-300 ${
          !query.trim() || loading
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-[#14412B] text-white hover:bg-[#1a5438] hover:shadow-lg hover:shadow-[#14412B]/20 hover:scale-105"
        }`}
      >
        {loading ? (
          <Loader2 className='h-4.5 w-4.5 animate-spin' />
        ) : (
          <Send className='h-4.5 w-4.5 ml-0.5' />
        )}
      </button>
    </form>
  );
};

export default QueryInput;
