import { useState, useEffect } from "react";
import {
  Webhook,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Copy,
  ExternalLink,
} from "lucide-react";
import useWebhooks from "../hooks/useWebhooks";
import WebhookTester from "../components/webhook/WebhookTester";
import WebhookHistory from "../components/webhook/WebhookHistory";
import ResponseViewer from "../components/webhook/ResponseViewer";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";

const Webhooks = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [selectedPayload, setSelectedPayload] = useState(null);
  const [newWebhook, setNewWebhook] = useState({ name: "", events: [] });

  const {
    webhooks,
    currentWebhook: webhookDetails,
    loading,
    error,
    fetchAll,
    fetchById,
    create,
    toggle,
    deleteWebhook,
  } = useWebhooks();

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedWebhook) {
      fetchById(selectedWebhook.uniqueId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWebhook]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newWebhook.name.trim()) {
      toast.error("Please enter a webhook name");
      return;
    }
    try {
      await create(newWebhook);
      toast.success("Webhook created");
      setShowCreate(false);
      setNewWebhook({ name: "", events: [] });
      fetchAll();
    } catch {
      toast.error("Failed to create webhook");
    }
  };

  const handleToggle = async (webhook) => {
    try {
      await toggle(webhook.uniqueId, !webhook.active);
      toast.success(webhook.active ? "Webhook disabled" : "Webhook enabled");
      fetchAll();
    } catch {
      toast.error("Failed to toggle webhook");
    }
  };

  const handleDelete = async (uniqueId) => {
    if (!window.confirm("Are you sure you want to delete this webhook?")) {
      return;
    }
    try {
      await deleteWebhook(uniqueId);
      toast.success("Webhook deleted");
      if (selectedWebhook?.uniqueId === uniqueId) {
        setSelectedWebhook(null);
      }
      fetchAll();
    } catch {
      toast.error("Failed to delete webhook");
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  const eventOptions = [
    "api.error",
    "api.latency_alert",
    "api.down",
    "sla.breach",
    "regression.detected",
    "anomaly.detected",
  ];

  if (loading && !webhooks) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader size='lg' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Webhooks</h1>
          <p className='text-muted-foreground'>
            Configure webhook endpoints for event notifications
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className='flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
        >
          <Plus className='h-4 w-4' />
          Create Webhook
        </button>
      </div>

      {showCreate && (
        <form
          onSubmit={handleCreate}
          className='p-4 bg-card border border-border rounded-xl space-y-4'
        >
          <h3 className='font-semibold'>New Webhook</h3>
          <div>
            <label className='text-sm text-muted-foreground block mb-1'>
              Name
            </label>
            <input
              type='text'
              value={newWebhook.name}
              onChange={(e) =>
                setNewWebhook({ ...newWebhook, name: e.target.value })
              }
              placeholder='My Webhook'
              className='w-full px-3 py-2 bg-muted border border-border rounded-lg'
            />
          </div>
          <div>
            <label className='text-sm text-muted-foreground block mb-1'>
              Events
            </label>
            <div className='flex flex-wrap gap-2'>
              {eventOptions.map((event) => (
                <label
                  key={event}
                  className='flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg cursor-pointer hover:bg-muted/80'
                >
                  <input
                    type='checkbox'
                    checked={newWebhook.events.includes(event)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewWebhook({
                          ...newWebhook,
                          events: [...newWebhook.events, event],
                        });
                      } else {
                        setNewWebhook({
                          ...newWebhook,
                          events: newWebhook.events.filter(
                            (ev) => ev !== event,
                          ),
                        });
                      }
                    }}
                    className='rounded'
                  />
                  <span className='text-sm'>{event}</span>
                </label>
              ))}
            </div>
          </div>
          <div className='flex justify-end gap-2'>
            <button
              type='button'
              onClick={() => setShowCreate(false)}
              className='px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors'
            >
              Create
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className='p-4 bg-destructive/10 text-destructive rounded-lg'>
          {error}
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='space-y-3'>
          <h3 className='font-semibold'>Your Webhooks</h3>
          {webhooks?.length > 0 ? (
            webhooks.map((webhook) => (
              <div
                key={webhook._id}
                onClick={() => setSelectedWebhook(webhook)}
                className={`p-4 bg-card border rounded-xl cursor-pointer transition-colors ${
                  selectedWebhook?._id === webhook._id
                    ? "border-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className='flex items-center justify-between mb-2'>
                  <span className='font-medium'>{webhook.name}</span>
                  <div className='flex items-center gap-1'>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(webhook);
                      }}
                      className='p-1 hover:bg-muted rounded'
                    >
                      {webhook.active ? (
                        <ToggleRight className='h-5 w-5 text-green-500' />
                      ) : (
                        <ToggleLeft className='h-5 w-5 text-muted-foreground' />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(webhook.uniqueId);
                      }}
                      className='p-1 hover:bg-destructive/10 text-destructive rounded'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                </div>
                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                  <code className='flex-1 truncate bg-muted px-2 py-1 rounded'>
                    {webhook.url}
                  </code>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyUrl(webhook.url);
                    }}
                    className='p-1 hover:bg-muted rounded'
                  >
                    <Copy className='h-3.5 w-3.5' />
                  </button>
                </div>
                {webhook.events?.length > 0 && (
                  <div className='flex flex-wrap gap-1 mt-2'>
                    {webhook.events.slice(0, 3).map((event) => (
                      <span
                        key={event}
                        className='px-1.5 py-0.5 text-xs bg-muted rounded'
                      >
                        {event}
                      </span>
                    ))}
                    {webhook.events.length > 3 && (
                      <span className='px-1.5 py-0.5 text-xs bg-muted rounded'>
                        +{webhook.events.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className='text-center py-8 text-muted-foreground bg-card border border-border rounded-xl'>
              <Webhook className='h-12 w-12 mx-auto mb-4 opacity-50' />
              <p>No webhooks configured</p>
            </div>
          )}
        </div>

        <div className='lg:col-span-2 space-y-4'>
          {selectedWebhook ? (
            <>
              <WebhookTester
                webhook={selectedWebhook}
                onTest={async () => {
                  return { success: true, message: "Test payload sent" };
                }}
              />

              <div className='bg-card border border-border rounded-xl p-4'>
                <h3 className='font-semibold mb-4'>Recent Payloads</h3>
                <WebhookHistory
                  payloads={webhookDetails?.payloads || []}
                  onSelect={setSelectedPayload}
                />
              </div>

              {selectedPayload && (
                <div className='bg-card border border-border rounded-xl p-4'>
                  <h3 className='font-semibold mb-4'>Response Details</h3>
                  <ResponseViewer response={selectedPayload.response} />
                </div>
              )}
            </>
          ) : (
            <div className='h-full flex items-center justify-center text-muted-foreground bg-card border border-border rounded-xl p-8'>
              <div className='text-center'>
                <Webhook className='h-12 w-12 mx-auto mb-4 opacity-50' />
                <p>Select a webhook to test and view history</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Webhooks;
