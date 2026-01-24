import { useState } from "react";
import { Copy, Wand2 } from "lucide-react";
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
    name: "Latency Alert",
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

const PayloadEditor = ({ value, onChange, readOnly }) => {
  const [error, setError] = useState(null);

  const handleChange = (newValue) => {
    try {
      JSON.parse(newValue);
      setError(null);
    } catch {
      setError("Invalid JSON");
    }
    onChange(newValue);
  };

  const applyTemplate = (template) => {
    const payload = JSON.parse(
      JSON.stringify(template.payload)
        .replace("{{timestamp}}", generateTimestamp())
        .replace(/{{apiId}}/g, generateRandomId()),
    );
    onChange(JSON.stringify(payload, null, 2));
    setError(null);
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed, null, 2));
      setError(null);
      toast.success("JSON formatted");
    } catch {
      setError("Cannot format invalid JSON");
    }
  };

  const copyPayload = () => {
    navigator.clipboard.writeText(value);
    toast.success("Payload copied");
  };

  return (
    <div className='space-y-3'>
      {!readOnly && (
        <div className='flex items-center gap-2 flex-wrap'>
          <span className='text-sm text-muted-foreground'>Templates:</span>
          {PAYLOAD_TEMPLATES.map((template) => (
            <button
              key={template.name}
              onClick={() => applyTemplate(template)}
              className='px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded transition-colors'
            >
              {template.name}
            </button>
          ))}
        </div>
      )}

      <div className='relative'>
        <textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          readOnly={readOnly}
          rows={12}
          className={`w-full p-3 bg-muted border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 ${
            error ? "border-destructive" : "border-border"
          } ${readOnly ? "cursor-default" : ""}`}
          placeholder='Enter JSON payload...'
        />
        {error && <p className='text-xs text-destructive mt-1'>{error}</p>}
      </div>

      <div className='flex items-center gap-2'>
        {!readOnly && (
          <button
            onClick={formatJson}
            className='flex items-center gap-1.5 px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded transition-colors'
          >
            <Wand2 className='h-3.5 w-3.5' />
            Format
          </button>
        )}
        <button
          onClick={copyPayload}
          className='flex items-center gap-1.5 px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded transition-colors'
        >
          <Copy className='h-3.5 w-3.5' />
          Copy
        </button>
      </div>
    </div>
  );
};

export default PayloadEditor;
