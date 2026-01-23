import { useState, useCallback } from "react";
import webhookService from "../services/webhookService";

const useWebhooks = () => {
  const [webhooks, setWebhooks] = useState([]);
  const [currentWebhook, setCurrentWebhook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await webhookService.getAll();
      setWebhooks(data.data || []);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch webhooks");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByUniqueId = useCallback(async (uniqueId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await webhookService.getByUniqueId(uniqueId);
      setCurrentWebhook(data.data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch webhook");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (webhookData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await webhookService.create(webhookData);
      setWebhooks((prev) => [data.data, ...prev]);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create webhook");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggle = useCallback(
    async (uniqueId, isActive) => {
      setLoading(true);
      setError(null);
      try {
        const data = await webhookService.toggle(uniqueId, isActive);
        setWebhooks((prev) =>
          prev.map((w) =>
            w.uniqueId === uniqueId
              ? { ...w, isActive: data.data.isActive }
              : w,
          ),
        );
        if (currentWebhook?.uniqueId === uniqueId) {
          setCurrentWebhook((prev) => ({
            ...prev,
            isActive: data.data.isActive,
          }));
        }
        return data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to toggle webhook");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentWebhook],
  );

  const clearPayloads = useCallback(
    async (uniqueId) => {
      setLoading(true);
      setError(null);
      try {
        const data = await webhookService.clearPayloads(uniqueId);
        if (currentWebhook?.uniqueId === uniqueId) {
          setCurrentWebhook((prev) => ({ ...prev, payloads: [] }));
        }
        return data;
      } catch (err) {
        setError(err.response?.data?.message || "Failed to clear payloads");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentWebhook],
  );

  const deleteWebhook = useCallback(async (uniqueId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await webhookService.deleteWebhook(uniqueId);
      setWebhooks((prev) => prev.filter((w) => w.uniqueId !== uniqueId));
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete webhook");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    webhooks,
    currentWebhook,
    loading,
    error,
    fetchAll,
    fetchByUniqueId,
    create,
    toggle,
    clearPayloads,
    deleteWebhook,
  };
};

export default useWebhooks;
