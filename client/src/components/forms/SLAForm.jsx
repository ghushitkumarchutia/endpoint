import { useState } from "react";
import { Save } from "lucide-react";

const SLAForm = ({ initialData, onSubmit, loading }) => {
  const [config, setConfig] = useState({
    uptimeTarget: initialData?.uptimeTarget ?? 99.9,
    responseTimeP95: initialData?.responseTimeP95 ?? 500,
    errorRateMax: initialData?.errorRateMax ?? 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit({ sla: config });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='block text-sm text-muted-foreground mb-1'>
          Uptime Target (%)
        </label>
        <input
          type='number'
          min='0'
          max='100'
          step='0.1'
          value={config.uptimeTarget}
          onChange={(e) =>
            setConfig({ ...config, uptimeTarget: Number(e.target.value) })
          }
          className='w-full px-3 py-2 bg-muted border border-border rounded-lg'
        />
      </div>

      <div>
        <label className='block text-sm text-muted-foreground mb-1'>
          P95 Response Time (ms)
        </label>
        <input
          type='number'
          min='0'
          value={config.responseTimeP95}
          onChange={(e) =>
            setConfig({ ...config, responseTimeP95: Number(e.target.value) })
          }
          className='w-full px-3 py-2 bg-muted border border-border rounded-lg'
        />
      </div>

      <div>
        <label className='block text-sm text-muted-foreground mb-1'>
          Max Error Rate (%)
        </label>
        <input
          type='number'
          min='0'
          max='100'
          step='0.1'
          value={config.errorRateMax}
          onChange={(e) =>
            setConfig({ ...config, errorRateMax: Number(e.target.value) })
          }
          className='w-full px-3 py-2 bg-muted border border-border rounded-lg'
        />
      </div>

      <button
        type='submit'
        disabled={loading}
        className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50'
      >
        <Save className='h-4 w-4' />
        {loading ? "Saving..." : "Save SLA Config"}
      </button>
    </form>
  );
};

export default SLAForm;
