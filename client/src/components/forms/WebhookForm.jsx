import { useState } from "react";
import { Save, Link as LinkIcon, Check } from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";

const EVENT_OPTIONS = [
  { id: "api.error", label: "API Error" },
  { id: "api.latency_alert", label: "Latency Alert" },
  { id: "api.down", label: "API Down" },
  { id: "sla.breach", label: "SLA Breach" },
  { id: "regression.detected", label: "Regression" },
  { id: "anomaly.detected", label: "Anomaly" },
];

const WebhookForm = ({ initialData, onSubmit, loading, onCancel }) => {
  const [config, setConfig] = useState({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    url: initialData?.url ?? "",
    events: initialData?.events ?? [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!config.name.trim() || !config.url.trim()) return;
    onSubmit && onSubmit(config);
  };

  const toggleEvent = (eventId) => {
    setConfig((prev) => {
      const events = prev.events.includes(eventId)
        ? prev.events.filter((e) => e !== eventId)
        : [...prev.events, eventId];
      return { ...prev, events };
    });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6 animate-fade-in-up'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <Input
          label='Webhook Name'
          placeholder='e.g. Production Alerts'
          value={config.name}
          onChange={(e) => setConfig({ ...config, name: e.target.value })}
          required
        />
        <Input
          label='Endpoint URL'
          placeholder='https://api.yourservice.com/webhooks'
          value={config.url}
          onChange={(e) => setConfig({ ...config, url: e.target.value })}
          required
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1.5'>
          Description (Optional)
        </label>
        <textarea
          value={config.description}
          onChange={(e) =>
            setConfig({ ...config, description: e.target.value })
          }
          placeholder='What is this webhook used for?'
          rows={3}
          className='flex w-full px-4 py-3 bg-[#f9fafb] border border-gray-200 rounded-[14px] text-sm font-bricolage text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#14412B]/30 focus:bg-white focus:ring-4 focus:ring-[#14412B]/5 transition-all duration-200 resize-none'
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Subscribe to Events
        </label>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
          {EVENT_OPTIONS.map((event) => {
            const isSelected = config.events.includes(event.id);
            return (
              <button
                key={event.id}
                type='button'
                onClick={() => toggleEvent(event.id)}
                className={`flex items-center gap-2 p-3 rounded-[14px] border text-sm transition-all text-left ${
                  isSelected
                    ? "bg-[#14412B] border-[#14412B] text-white shadow-md shadow-[#14412B]/10"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full flex items-center justify-center border ${
                    isSelected
                      ? "bg-white/20 border-transparent text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {isSelected && <Check className='h-3 w-3' />}
                </div>
                <span className='font-medium'>{event.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className='flex justify-end gap-3 pt-4 border-t border-gray-100'>
        {onCancel && (
          <Button
            type='button'
            onClick={onCancel}
            className='bg-white text-gray-700 border border-gray-200 rounded-full px-6 py-2 hover:bg-gray-50 transition-colors'
          >
            Cancel
          </Button>
        )}
        <Button
          type='submit'
          isLoading={loading}
          className='bg-[#14412B] text-white rounded-full px-8 py-2 hover:bg-[#1a5438] shadow-lg shadow-[#14412B]/20'
        >
          Create Webhook
        </Button>
      </div>
    </form>
  );
};

export default WebhookForm;
