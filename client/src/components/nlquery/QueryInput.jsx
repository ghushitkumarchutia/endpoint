import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";

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
    <form onSubmit={handleSubmit} className='relative'>
      <input
        ref={inputRef}
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder || "Ask about your APIs..."}
        disabled={loading}
        className='w-full px-4 py-3 pr-12 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50'
      />
      <button
        type='submit'
        disabled={!query.trim() || loading}
        className='absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary disabled:text-muted-foreground disabled:cursor-not-allowed'
      >
        {loading ? (
          <Loader2 className='h-5 w-5 animate-spin' />
        ) : (
          <Send className='h-5 w-5' />
        )}
      </button>
    </form>
  );
};

export default QueryInput;
