import { useState } from "react";
import { Play, Copy, Check, AlertCircle, Terminal } from "lucide-react";
import Button from "../common/Button";
import PayloadEditor from "./PayloadEditor";
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

  return (
    <div className='bg-white space-y-5 rounded-2xl'>
      <div className='flex items-center justify-between'>
        <h3 className='font-bold font-dmsans text-lg text-gray-900 flex items-center gap-2'>
          <Terminal className='h-5 w-5 text-gray-500' />
          Webhook Tester
        </h3>
        <div className='flex items-center gap-2'>
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
              webhook.active
                ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                : "bg-gray-50 border-gray-200 text-gray-500"
            }`}
          >
            <div
              className={`h-1.5 w-1.5 rounded-full ${webhook.active ? "bg-emerald-500" : "bg-gray-400"}`}
            ></div>
            {webhook.active ? "Active" : "Inactive"}
          </div>
        </div>
      </div>

      <div className='flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl group'>
        <div className='bg-white p-1.5 rounded-lg border border-gray-200 text-gray-400'>
          <Terminal className='h-4 w-4' />
        </div>
        <code className='flex-1 text-xs font-mono text-gray-600 truncate select-all'>
          {webhook.url}
        </code>
        <button
          onClick={() => {
            navigator.clipboard.writeText(webhook.url);
            toast.success("Copied to clipboard");
          }}
          className='p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-400 hover:text-gray-700 cursor-pointer'
        >
          <Copy className='h-4 w-4' />
        </button>
      </div>

      <div>
        <label className='text-sm font-medium text-gray-700 mb-2 block'>
          Payload (JSON)
        </label>
        <PayloadEditor value={payload} onChange={setPayload} />
      </div>

      {error && (
        <div className='flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100'>
          <AlertCircle className='h-5 w-5 shrink-0' />
          {error}
        </div>
      )}

      {response && (
        <div className='p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl animate-fade-in-up'>
          <div className='flex items-center gap-2 text-emerald-700 text-sm font-bold mb-2'>
            <Check className='h-5 w-5' />
            <span>Test Successful</span>
          </div>
          <p className='text-emerald-600/80 text-xs mb-3'>
            The payload was successfully sent to your endpoint.
          </p>
          <pre className='text-xs bg-white border border-emerald-100/50 p-3 rounded-lg overflow-auto max-h-32 text-gray-600'>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      <Button
        onClick={handleTest}
        isLoading={testing}
        disabled={!webhook.active}
        className='w-full flex items-center justify-center gap-2 bg-[#14412B] hover:bg-[#1a5438] text-white rounded-full py-3 shadow-lg shadow-[#14412B]/20 transition-all'
      >
        {!testing && <Play className='h-4 w-4' />}
        Send Test Request
      </Button>
    </div>
  );
};

export default WebhookTester;
