import { useState } from "react";
import { Save, DollarSign } from "lucide-react";

const BudgetForm = ({ initialData, onSubmit, loading }) => {
  const [config, setConfig] = useState({
    costPerRequest: initialData?.costPerRequest ?? 0.001,
    monthlyBudget: initialData?.monthlyBudget ?? 100,
    alertThreshold: initialData?.alertThreshold ?? 80,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit({ costTracking: config });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='block text-sm text-muted-foreground mb-1'>
          Cost Per Request ($)
        </label>
        <div className='relative'>
          <DollarSign className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <input
            type='number'
            min='0'
            step='0.0001'
            value={config.costPerRequest}
            onChange={(e) =>
              setConfig({ ...config, costPerRequest: Number(e.target.value) })
            }
            className='w-full pl-9 pr-3 py-2 bg-muted border border-border rounded-lg'
          />
        </div>
      </div>

      <div>
        <label className='block text-sm text-muted-foreground mb-1'>
          Monthly Budget ($)
        </label>
        <div className='relative'>
          <DollarSign className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <input
            type='number'
            min='0'
            step='1'
            value={config.monthlyBudget}
            onChange={(e) =>
              setConfig({ ...config, monthlyBudget: Number(e.target.value) })
            }
            className='w-full pl-9 pr-3 py-2 bg-muted border border-border rounded-lg'
          />
        </div>
      </div>

      <div>
        <label className='block text-sm text-muted-foreground mb-1'>
          Alert Threshold (% of budget)
        </label>
        <input
          type='number'
          min='0'
          max='100'
          value={config.alertThreshold}
          onChange={(e) =>
            setConfig({ ...config, alertThreshold: Number(e.target.value) })
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
        {loading ? "Saving..." : "Save Budget Config"}
      </button>
    </form>
  );
};

export default BudgetForm;
