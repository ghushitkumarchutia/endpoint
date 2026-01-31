import { useState } from "react";
import { Copy, Wand2, FileJson } from "lucide-react";
import toast from "react-hot-toast";

const PAYLOAD_TEMPLATES = [
  {
    name: "API Error",
    payload: {
      event: "api.error",
      timestamp: "{{timestamp}}",
      data: {
        apiId: "{{apiId}}",
        statusCode: 500,
        errorMessage: "Internal server error",
      },
    },
  },
  {
    name: "Latency",
    payload: {
      event: "api.latency_alert",
      timestamp: "{{timestamp}}",
      data: {
        apiId: "{{apiId}}",
        latency: 2500,
        threshold: 1000,
      },
    },
  },
  {
    name: "SLA Breach",
    payload: {
      event: "sla.breach",
      timestamp: "{{timestamp}}",
      data: {
        apiId: "{{apiId}}",
        metric: "uptime",
        actual: 95.5,
        target: 99.9,
      },
    },
  },
];

const generateRandomId = () =>
  "api_" + Math.random().toString(36).substring(2, 11);
const generateTimestamp = () => new Date().toISOString();

const PayloadEditor = ({ value, onChange, readOnly, className }) => {
  const [error, setError] = useState(null);

  const applyTemplate = (template) => {
    const payload = JSON.parse(
      JSON.stringify(template.payload)
        .replace("{{timestamp}}", generateTimestamp())
        .replace(/{{apiId}}/g, generateRandomId()),
    );
    onChange(JSON.stringify(payload, null, 2));
    setError(null);
    toast.success(`Applied ${template.name} template`);
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed, null, 2));
      setError(null);
      toast.success("JSON formatted");
    } catch {
      setError("Cannot format invalid JSON");
      toast.error("Invalid JSON");
    }
  };

  const copyPayload = () => {
    navigator.clipboard.writeText(value);
    toast.success("Payload copied");
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {!readOnly && (
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar'>
            <span className='text-xs font-medium text-gray-500 uppercase tracking-wider shrink-0 mr-1'>
              Templates:
            </span>
            {PAYLOAD_TEMPLATES.map((template) => (
              <button
                key={template.name}
                onClick={() => applyTemplate(template)}
                className='px-3 py-1.5 text-[11px] font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors whitespace-nowrap'
              >
                {template.name}
              </button>
            ))}
          </div>

          <div className='flex items-center gap-1'>
            <button
              onClick={formatJson}
              title='Format JSON'
              className='p-1.5 text-gray-400 hover:text-[#14412B] hover:bg-[#14412B]/5 rounded-lg transition-colors'
            >
              <Wand2 className='h-4 w-4' />
            </button>
            <button
              onClick={copyPayload}
              title='Copy JSON'
              className='p-1.5 text-gray-400 hover:text-[#14412B] hover:bg-[#14412B]/5 rounded-lg transition-colors'
            >
              <Copy className='h-4 w-4' />
            </button>
          </div>
        </div>
      )}

      <div className='relative group'>
        <textarea
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            // Basic validation on change if needed, but usually annoying
            try {
              JSON.parse(e.target.value);
              setError(null);
            } catch {
              setError("Invalid JSON");
            }
          }}
          readOnly={readOnly}
          rows={12}
          className={`w-full p-4 bg-[#1a1b1e] border rounded-xl font-mono text-[13px] leading-relaxed text-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-[#14412B]/50 transition-all custom-scrollbar ${
            error ? "border-red-500/50" : "border-gray-800"
          } ${readOnly ? "cursor-default opacity-80" : ""}`}
          placeholder='Enter JSON payload...'
          spellCheck='false'
        />
        <div className='absolute top-2 right-3 flex items-center gap-2 pointer-events-none'>
          {error && (
            <span className='text-[10px] text-red-400 font-medium bg-red-500/10 px-2 py-0.5 rounded'>
              {error}
            </span>
          )}
          <span className='text-[10px] uppercase font-bold text-gray-600 tracking-wider'>
            JSON
          </span>
        </div>
      </div>
    </div>
  );
};

export default PayloadEditor;
