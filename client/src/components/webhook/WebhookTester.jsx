import { useState } from "react";
import { Play, Save, Copy, Check, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const WebhookTester = ({ webhook, onTest }) => {
  const [payload, setPayload] = useState(
    JSON.stringify(
      {
        event: "test",
        timestamp: new Date().toISOString(),
        data: {
          message: "Test webhook payload",
        },
      },
      null,
      2,
    ),
  );
  const [response, setResponse] = useState(null);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState(null);

  const handleTest = async () => {
    setTesting(true);
    setError(null);
    setResponse(null);

    try {
      const parsedPayload = JSON.parse(payload);
      const result = await onTest(webhook.uniqueId, parsedPayload);
      setResponse(result);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Invalid JSON payload");
      } else {
        setError(err.message || "Test failed");
      }
    } finally {
      setTesting(false);
    }
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhook.url);
    toast.success("Webhook URL copied");
  };

  return (
    <div className='bg-card border border-border rounded-xl p-4 space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='font-semibold'>Test Webhook</h3>
        <div className='flex items-center gap-2'>
          <span
            className={`px-2 py-1 text-xs rounded ${
              webhook.active
                ? "bg-green-500/10 text-green-500"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {webhook.active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div className='flex items-center gap-2 p-2 bg-muted rounded-lg'>
        <code className='flex-1 text-xs truncate'>{webhook.url}</code>
        <button
          onClick={copyWebhookUrl}
          className='p-1.5 hover:bg-background rounded transition-colors'
        >
          <Copy className='h-4 w-4' />
        </button>
      </div>

      <div>
        <label className='text-sm font-medium mb-2 block'>Payload</label>
        <textarea
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          rows={8}
          className='w-full p-3 bg-muted border border-border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50'
          placeholder='Enter JSON payload...'
        />
      </div>

      {error && (
        <div className='flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm'>
          <AlertCircle className='h-4 w-4' />
          {error}
        </div>
      )}

      {response && (
        <div className='p-3 bg-green-500/10 border border-green-500/30 rounded-lg'>
          <div className='flex items-center gap-2 text-green-500 text-sm mb-2'>
            <Check className='h-4 w-4' />
            <span>Test successful</span>
          </div>
          <pre className='text-xs overflow-auto max-h-32'>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      <button
        onClick={handleTest}
        disabled={testing || !webhook.active}
        className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
      >
        {testing ? (
          <>
            <div className='h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
            Testing...
          </>
        ) : (
          <>
            <Play className='h-4 w-4' />
            Send Test Request
          </>
        )}
      </button>
    </div>
  );
};

export default WebhookTester;
