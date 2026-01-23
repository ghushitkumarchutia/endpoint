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
      const msg =
        err.message ||
        err.response?.data?.message ||
        "Failed to fetch webhooks";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByUniqueId = useCallback(async (uniqueId) => {
    if (!uniqueId) {
      setError("Webhook ID is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await webhookService.getByUniqueId(uniqueId);
      setCurrentWebhook(data.data || null);
      return data;
    } catch (err) {
      const msg =
        err.message || err.response?.data?.message || "Failed to fetch webhook";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (webhookData) => {
    if (!webhookData || !webhookData.name) {
      throw new Error("Webhook data with name is required");
    }
    setLoading(true);
    setError(null);
    try {
      const data = await webhookService.create(webhookData);
      if (data.data) {
        setWebhooks((prev) => [data.data, ...prev]);
      }
      return data;
    } catch (err) {
      const msg =
        err.message ||
        err.response?.data?.message ||
        "Failed to create webhook";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggle = useCallback(
    async (uniqueId, isActive) => {
      if (!uniqueId) {
        throw new Error("Webhook ID is required");
      }
      setLoading(true);
      setError(null);
      try {
        const data = await webhookService.toggle(uniqueId, isActive);
        setWebhooks((prev) =>
          prev.map((w) =>
            w.uniqueId === uniqueId
              ? { ...w, isActive: data.data?.isActive ?? isActive }
              : w,
          ),
        );
        if (currentWebhook?.uniqueId === uniqueId) {
          setCurrentWebhook((prev) => ({
            ...prev,
            isActive: data.data?.isActive ?? isActive,
          }));
        }
        return data;
      } catch (err) {
        const msg =
          err.message ||
          err.response?.data?.message ||
          "Failed to toggle webhook";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentWebhook],
  );

  const clearPayloads = useCallback(
    async (uniqueId) => {
      if (!uniqueId) {
        throw new Error("Webhook ID is required");
      }
      setLoading(true);
      setError(null);
      try {
        const data = await webhookService.clearPayloads(uniqueId);
        if (currentWebhook?.uniqueId === uniqueId) {
          setCurrentWebhook((prev) => ({ ...prev, payloads: [] }));
        }
        return data;
      } catch (err) {
        const msg =
          err.message ||
          err.response?.data?.message ||
          "Failed to clear payloads";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentWebhook],
  );

  const deleteWebhook = useCallback(async (uniqueId) => {
    if (!uniqueId) {
      throw new Error("Webhook ID is required");
    }
    setLoading(true);
    setError(null);
    try {
      const data = await webhookService.deleteWebhook(uniqueId);
      setWebhooks((prev) => prev.filter((w) => w.uniqueId !== uniqueId));
      return data;
    } catch (err) {
      const msg =
        err.message ||
        err.response?.data?.message ||
        "Failed to delete webhook";
      setError(msg);
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
