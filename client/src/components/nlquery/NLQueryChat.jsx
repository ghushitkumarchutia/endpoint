import { useState, useRef, useEffect } from "react";
import { Bot, User } from "lucide-react";
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
    <div className='flex flex-col h-full'>
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full text-center'>
            <div className='p-4 bg-primary/10 rounded-full mb-4'>
              <Bot className='h-8 w-8 text-primary' />
            </div>
            <h3 className='text-lg font-semibold mb-2'>Ask about your APIs</h3>
            <p className='text-sm text-muted-foreground mb-6 max-w-md'>
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
              <div key={index}>
                {message.type === "user" ? (
                  <div className='flex items-start gap-3 justify-end'>
                    <div className='max-w-[80%] p-3 bg-primary text-primary-foreground rounded-xl rounded-br-none'>
                      {message.content}
                    </div>
                    <div className='p-2 bg-muted rounded-full'>
                      <User className='h-4 w-4' />
                    </div>
                  </div>
                ) : message.type === "error" ? (
                  <div className='flex items-start gap-3'>
                    <div className='p-2 bg-destructive/10 rounded-full'>
                      <Bot className='h-4 w-4 text-destructive' />
                    </div>
                    <div className='max-w-[80%] p-3 bg-destructive/10 text-destructive rounded-xl rounded-bl-none'>
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
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className='p-4 border-t border-border'>
        {error && <p className='text-sm text-destructive mb-2'>{error}</p>}
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
