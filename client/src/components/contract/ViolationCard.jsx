import { SEVERITY_COLORS } from "../../utils/constants";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, Check } from "lucide-react";

const ViolationCard = ({ violation, onAcknowledge }) => {
  const { _id, apiId, violations, aiExplanation, acknowledged, createdAt } =
    violation;

  return (
    <div
      className={`bg-card border rounded-xl p-4 ${acknowledged ? "border-border opacity-70" : "border-yellow-500/50"}`}
    >
      <div className='flex items-start justify-between mb-3'>
        <div>
          <h3 className='font-medium'>{apiId?.name || "Unknown API"}</h3>
          <p className='text-xs text-muted-foreground'>
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </p>
        </div>
        {!acknowledged && onAcknowledge && (
          <button
            onClick={() => onAcknowledge(_id)}
            className='p-1.5 rounded-lg hover:bg-muted transition-colors'
            title='Acknowledge'
          >
            <Check className='h-4 w-4 text-green-500' />
          </button>
        )}
        {acknowledged && (
          <span className='text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded'>
            Acknowledged
          </span>
        )}
      </div>

      <div className='space-y-2 mb-3'>
        {violations.map((v, idx) => (
          <div key={idx} className='flex items-start gap-2 text-sm'>
            <AlertTriangle
              className={`h-4 w-4 mt-0.5 ${SEVERITY_COLORS[v.severity]?.split(" ")[0] || "text-yellow-500"}`}
            />
            <div className='flex-1'>
              <span className='font-medium'>{v.type.replace(/_/g, " ")}</span>
              {v.field && (
                <span className='text-muted-foreground'> - {v.field}</span>
              )}
              <div className='text-xs text-muted-foreground mt-0.5'>
                Expected:{" "}
                <code className='bg-muted px-1 rounded'>
                  {JSON.stringify(v.expected)}
                </code>
                {" → "}
                Actual:{" "}
                <code className='bg-muted px-1 rounded'>
                  {JSON.stringify(v.actual)}
                </code>
              </div>
            </div>
          </div>
        ))}
      </div>

      {aiExplanation && (
        <div className='text-sm bg-muted/50 rounded-lg p-3 border-l-2 border-primary'>
          <p className='text-muted-foreground'>{aiExplanation}</p>
        </div>
      )}
    </div>
  );
};

export default ViolationCard;
