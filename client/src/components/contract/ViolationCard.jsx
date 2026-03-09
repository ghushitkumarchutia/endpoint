import { SEVERITY_COLORS } from "../../utils/constants";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, Check, CheckCircle2, Bot } from "lucide-react";

const ViolationCard = ({ violation, onAcknowledge }) => {
  const { _id, apiId, violations, aiExplanation, acknowledged, createdAt } =
    violation;

  return (
    <div
      className={`bg-white border rounded-[20px] p-5 shadow-sm transition-all group ${acknowledged ? "border-gray-200/60 opacity-60 hover:opacity-100" : "border-amber-200 hover:border-amber-300 ring-1 ring-amber-500/10"}`}
    >
      <div className='flex items-start justify-between mb-4'>
        <div>
          <h3 className='font-bold text-gray-900 text-lg mb-1'>
            {apiId?.name || "Unknown API"}
          </h3>
          <p className='text-xs font-medium text-gray-500 flex items-center gap-1'>
            Detected{" "}
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </p>
        </div>
        {!acknowledged && onAcknowledge && (
          <button
            onClick={() => onAcknowledge(_id)}
            className='flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-600 hover:text-green-700 rounded-xl text-xs font-bold transition-all shadow-sm'
            title='Acknowledge Violation'
          >
            <Check className='h-3.5 w-3.5' />
            Acknowledge
          </button>
        )}
        {acknowledged && (
          <span className='flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2.5 py-1 rounded-lg border border-green-100'>
            <CheckCircle2 className='h-3.5 w-3.5' /> Acknowledged
          </span>
        )}
      </div>

      <div className='space-y-3 mb-4'>
        {violations.map((v, idx) => (
          <div
            key={idx}
            className='flex items-start gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100'
          >
            <div
              className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${SEVERITY_COLORS[v.severity]?.split(" ")[0]?.replace("text-", "bg-")?.replace("500", "100") || "bg-yellow-100"}`}
            >
              <AlertTriangle
                className={`h-4 w-4 ${SEVERITY_COLORS[v.severity]?.split(" ")[0] || "text-yellow-600"}`}
              />
            </div>

            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2 mb-1'>
                <span className='font-bold text-gray-900 text-sm capitalize'>
                  {v.type.replace(/_/g, " ")}
                </span>
                {v.field && (
                  <span className='text-xs font-mono text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-200'>
                    {v.field}
                  </span>
                )}
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2'>
                <div className='bg-white border border-green-100 rounded-lg p-2'>
                  <p className='text-[10px] font-bold text-green-600 uppercase mb-1'>
                    Expected
                  </p>
                  <code className='text-xs font-mono text-gray-700 break-all'>
                    {JSON.stringify(v.expected)}
                  </code>
                </div>
                <div className='bg-white border border-red-100 rounded-lg p-2'>
                  <p className='text-[10px] font-bold text-red-600 uppercase mb-1'>
                    Actual
                  </p>
                  <code className='text-xs font-mono text-gray-700 break-all'>
                    {JSON.stringify(v.actual)}
                  </code>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {aiExplanation && (
        <div className='flex gap-3 text-sm bg-blue-50/50 rounded-xl p-4 border border-blue-100/50'>
          <Bot className='h-5 w-5 text-blue-500 shrink-0 mt-0.5' />
          <div className='space-y-1'>
            <p className='text-xs font-bold text-blue-600 uppercase'>
              AI Analysis
            </p>
            <p className='text-gray-600 text-sm leading-relaxed'>
              {aiExplanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViolationCard;
