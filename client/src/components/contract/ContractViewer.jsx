import { FileJson, Edit2, Eye } from "lucide-react";
import SchemaEditor from "./SchemaEditor";

const ContractViewer = ({ contract, onEdit, readOnly = true }) => {
  if (!contract) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        No contract defined
      </div>
    );
  }

  const { enabled, strictMode, expectedResponseTime, expectedSchema } =
    contract;

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <FileJson className='h-5 w-5 text-muted-foreground' />
          <h3 className='font-semibold'>Response Contract</h3>
        </div>
        {!readOnly && onEdit && (
          <button
            onClick={onEdit}
            className='flex items-center gap-1 text-sm text-primary hover:underline'
          >
            <Edit2 className='h-3 w-3' />
            Edit
          </button>
        )}
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className='bg-muted/50 rounded-lg p-3'>
          <p className='text-xs text-muted-foreground mb-1'>Status</p>
          <p
            className={`font-medium ${enabled ? "text-green-500" : "text-muted-foreground"}`}
          >
            {enabled ? "Enabled" : "Disabled"}
          </p>
        </div>
        <div className='bg-muted/50 rounded-lg p-3'>
          <p className='text-xs text-muted-foreground mb-1'>Mode</p>
          <p className='font-medium'>{strictMode ? "Strict" : "Lenient"}</p>
        </div>
        <div className='bg-muted/50 rounded-lg p-3 col-span-2'>
          <p className='text-xs text-muted-foreground mb-1'>
            Expected Response Time
          </p>
          <p className='font-medium'>{expectedResponseTime || "Not set"}ms</p>
        </div>
      </div>

      {expectedSchema && (
        <div>
          <p className='text-sm text-muted-foreground mb-2 flex items-center gap-1'>
            <Eye className='h-3 w-3' />
            Expected Schema
          </p>
          <SchemaEditor schema={expectedSchema} readOnly />
        </div>
      )}
    </div>
  );
};

export default ContractViewer;
