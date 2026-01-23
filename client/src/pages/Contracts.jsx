import { useState, useEffect } from "react";
import { AlertTriangle, Filter, Check, ChevronDown } from "lucide-react";
import useContracts from "../hooks/useContracts";
import ViolationList from "../components/contract/ViolationList";
import SchemaEditor from "../components/contract/SchemaEditor";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";

const Contracts = () => {
  const [filter, setFilter] = useState("all");
  const [selectedApi, setSelectedApi] = useState(null);
  const [showSchema, setShowSchema] = useState(false);

  const {
    violations,
    stats,
    loading,
    error,
    fetchViolations,
    fetchStats,
    acknowledgeViolation,
  } = useContracts();

  useEffect(() => {
    fetchViolations();
    fetchStats();
  }, []);

  const handleAcknowledge = async (violationId) => {
    try {
      await acknowledgeViolation(violationId);
      toast.success("Violation acknowledged");
      fetchViolations();
      fetchStats();
    } catch {
      toast.error("Failed to acknowledge violation");
    }
  };

  const filteredViolations = violations?.filter((v) => {
    if (filter === "all") return true;
    if (filter === "unacknowledged") return !v.acknowledged;
    return v.type === filter;
  });

  if (loading && !violations) {
    return (
      <div className='flex items-center justify-center h-64'>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>API Contracts</h1>
          <p className='text-muted-foreground'>
            Monitor contract violations and schema compliance
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-card border border-border rounded-xl p-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-destructive/10 rounded-lg'>
              <AlertTriangle className='h-5 w-5 text-destructive' />
            </div>
            <div>
              <p className='text-2xl font-bold'>
                {stats?.totalViolations || 0}
              </p>
              <p className='text-sm text-muted-foreground'>Total Violations</p>
            </div>
          </div>
        </div>
        <div className='bg-card border border-border rounded-xl p-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-amber-500/10 rounded-lg'>
              <AlertTriangle className='h-5 w-5 text-amber-500' />
            </div>
            <div>
              <p className='text-2xl font-bold'>{stats?.unacknowledged || 0}</p>
              <p className='text-sm text-muted-foreground'>Unacknowledged</p>
            </div>
          </div>
        </div>
        <div className='bg-card border border-border rounded-xl p-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-blue-500/10 rounded-lg'>
              <Check className='h-5 w-5 text-blue-500' />
            </div>
            <div>
              <p className='text-2xl font-bold'>{stats?.schemasTracked || 0}</p>
              <p className='text-sm text-muted-foreground'>Schemas Tracked</p>
            </div>
          </div>
        </div>
        <div className='bg-card border border-border rounded-xl p-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-green-500/10 rounded-lg'>
              <Check className='h-5 w-5 text-green-500' />
            </div>
            <div>
              <p className='text-2xl font-bold'>
                {stats?.complianceRate?.toFixed(1) || 0}%
              </p>
              <p className='text-sm text-muted-foreground'>Compliance Rate</p>
            </div>
          </div>
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <Filter className='h-4 w-4 text-muted-foreground' />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className='px-3 py-2 bg-muted border border-border rounded-lg text-sm'
          >
            <option value='all'>All Violations</option>
            <option value='unacknowledged'>Unacknowledged</option>
            <option value='schema_mismatch'>Schema Mismatch</option>
            <option value='missing_field'>Missing Field</option>
            <option value='type_mismatch'>Type Mismatch</option>
            <option value='extra_field'>Extra Field</option>
          </select>
        </div>
      </div>

      {error && (
        <div className='p-4 bg-destructive/10 text-destructive rounded-lg'>
          {error}
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <ViolationList
            violations={filteredViolations || []}
            onAcknowledge={handleAcknowledge}
            onViewSchema={(apiId) => {
              setSelectedApi(apiId);
              setShowSchema(true);
            }}
          />
        </div>

        <div>
          {showSchema && selectedApi ? (
            <SchemaEditor
              apiId={selectedApi}
              onClose={() => {
                setShowSchema(false);
                setSelectedApi(null);
              }}
            />
          ) : (
            <div className='bg-card border border-border rounded-xl p-6 text-center'>
              <p className='text-muted-foreground'>
                Select a violation to view the expected schema
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contracts;
