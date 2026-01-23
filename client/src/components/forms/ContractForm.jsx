import { useState } from "react";
import { Save } from "lucide-react";
import SchemaEditor from "../contract/SchemaEditor";

const ContractForm = ({ initialData, onSubmit, loading }) => {
  const [config, setConfig] = useState({
    enabled: initialData?.enabled ?? true,
    strictMode: initialData?.strictMode ?? false,
    expectedResponseTime: initialData?.expectedResponseTime ?? 1000,
    expectedSchema: initialData?.expectedSchema ?? null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(config);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='flex items-center gap-3'>
        <label className='flex items-center gap-2 cursor-pointer'>
          <input
            type='checkbox'
            checked={config.enabled}
            onChange={(e) =>
              setConfig({ ...config, enabled: e.target.checked })
            }
            className='w-4 h-4 rounded border-border'
          />
          <span className='text-sm'>Enable Contract Validation</span>
        </label>
      </div>

      <div className='flex items-center gap-3'>
        <label className='flex items-center gap-2 cursor-pointer'>
          <input
            type='checkbox'
            checked={config.strictMode}
            onChange={(e) =>
              setConfig({ ...config, strictMode: e.target.checked })
            }
            className='w-4 h-4 rounded border-border'
          />
          <span className='text-sm'>Strict Mode (fail on extra fields)</span>
        </label>
      </div>

      <div>
        <label className='block text-sm text-muted-foreground mb-1'>
          Expected Response Time (ms)
        </label>
        <input
          type='number'
          min='0'
          value={config.expectedResponseTime}
          onChange={(e) =>
            setConfig({
              ...config,
              expectedResponseTime: Number(e.target.value),
            })
          }
          className='w-full px-3 py-2 bg-muted border border-border rounded-lg'
        />
      </div>

      <div>
        <label className='block text-sm text-muted-foreground mb-1'>
          Expected Response Schema (JSON)
        </label>
        <SchemaEditor
          schema={config.expectedSchema}
          onChange={(schema) =>
            setConfig({ ...config, expectedSchema: schema })
          }
        />
      </div>

      <button
        type='submit'
        disabled={loading}
        className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50'
      >
        <Save className='h-4 w-4' />
        {loading ? "Saving..." : "Save Contract"}
      </button>
    </form>
  );
};

export default ContractForm;
