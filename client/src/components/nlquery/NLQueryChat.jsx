import { useState, useRef, useEffect } from "react";
import { Bot, User, AlertCircle, Sparkles } from "lucide-react";
import QueryInput from "./QueryInput";
import QueryResult from "./QueryResult";
import SuggestedQueries from "./SuggestedQueries";
import useNLQuery from "../../hooks/useNLQuery";

const NLQueryChat = () => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const { executeQuery, submitFeedback, suggestions, loading, error } =
    useNLQuery();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (query) => {
    setMessages((prev) => [...prev, { type: "user", content: query }]);

    try {
      const result = await executeQuery(query);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: result,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          type: "error",
          content: err.message || "Failed to process query",
        },
      ]);
    }
  };

  const handleFeedback = async (queryId, wasHelpful) => {
    await submitFeedback(queryId, wasHelpful);
  };

  const handleSuggestionSelect = (suggestion) => {
    handleSubmit(suggestion);
  };

  return (
    <div className='flex flex-col h-full bg-[#fafafa]/50'>
      <div className='flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar'>
        {messages.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full text-center'>
            <div className='h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-gray-200/50 mb-6 border border-gray-100'>
              <Sparkles className='h-8 w-8 text-[#14412B]' />
            </div>
            <h3 className='text-xl font-bold text-gray-900 mb-2 font-dmsans'>
              Ask about your APIs
            </h3>
            <p className='text-sm text-gray-500 mb-8 max-w-md font-medium leading-relaxed'>
              Use natural language to query your API monitoring data. Ask about
              performance, errors, trends, and more.
            </p>
            <SuggestedQueries
              suggestions={suggestions}
              onSelect={handleSuggestionSelect}
            />
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div key={index} className='animate-fade-in-up'>
                {message.type === "user" ? (
                  <div className='flex items-start gap-3 justify-end'>
                    <div className='max-w-[85%] p-4 bg-[#14412B] text-white rounded-[20px] rounded-tr-sm shadow-md shadow-[#14412B]/10 text-sm font-medium leading-relaxed'>
                      {message.content}
                    </div>
                    <div className='h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center shrink-0 border border-white shadow-sm'>
                      <User className='h-4 w-4 text-gray-500' />
                    </div>
                  </div>
                ) : message.type === "error" ? (
                  <div className='flex items-start gap-3'>
                    <div className='h-8 w-8 bg-red-100 rounded-full flex items-center justify-center shrink-0 border border-white shadow-sm'>
                      <Bot className='h-4 w-4 text-red-600' />
                    </div>
                    <div className='max-w-[85%] p-4 bg-red-50 text-red-700 rounded-[20px] rounded-tl-sm border border-red-100 shadow-sm flex items-start gap-2 text-sm'>
                      <AlertCircle className='h-4 w-4 shrink-0 mt-0.5' />
                      {message.content}
                    </div>
                  </div>
                ) : (
                  <QueryResult
                    result={message.content}
                    onFeedback={handleFeedback}
                  />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} className='h-4' />
          </>
        )}
      </div>

      <div className='p-4 md:p-6 bg-white border-t border-gray-100'>
        {error && (
          <p className='text-xs text-red-600 mb-2 font-medium bg-red-50 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5'>
            <AlertCircle className='h-3 w-3' />
            {error}
          </p>
        )}
        <QueryInput
          onSubmit={handleSubmit}
          loading={loading}
          placeholder="Ask about your APIs... (e.g., 'Which API has the most errors?')"
        />
      </div>
    </div>
  );
};

export default NLQueryChat;
