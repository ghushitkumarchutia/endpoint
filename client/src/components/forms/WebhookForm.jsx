import { useState } from "react";
import { Save, Link } from "lucide-react";

const WebhookForm = ({ initialData, onSubmit, loading }) => {
  const [config, setConfig] = useState({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    maxPayloads: initialData?.maxPayloads ?? 100,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!config.name.trim()) return;
    onSubmit && onSubmit(config);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='block text-sm text-muted-foreground mb-1'>
          Webhook Name *
        </label>
        <input
          type='text'
          value={config.name}
          onChange={(e) => setConfig({ ...config, name: e.target.value })}
          placeholder='My Webhook'
          className='w-full px-3 py-2 bg-muted border border-border rounded-lg'
          required
        />
      </div>

      <div>
        <label className='block text-sm text-muted-foreground mb-1'>
          Description
        </label>
        <textarea
          value={config.description}
          onChange={(e) =>
            setConfig({ ...config, description: e.target.value })
          }
          placeholder='Optional description...'
          rows={3}
          className='w-full px-3 py-2 bg-muted border border-border rounded-lg resize-none'
        />
      </div>

      <div>
        <label className='block text-sm text-muted-foreground mb-1'>
          Max Stored Payloads (1-1000)
        </label>
        <input
          type='number'
          min='1'
          max='1000'
          value={config.maxPayloads}
          onChange={(e) =>
            setConfig({ ...config, maxPayloads: Number(e.target.value) })
          }
          className='w-full px-3 py-2 bg-muted border border-border rounded-lg'
        />
      </div>

      <button
        type='submit'
        disabled={loading || !config.name.trim()}
        className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50'
      >
        <Link className='h-4 w-4' />
        {loading ? "Creating..." : "Create Webhook"}
      </button>
    </form>
  );
};

export default WebhookForm;
