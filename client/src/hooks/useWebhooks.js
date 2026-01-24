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

  const fetchById = useCallback(async (id) => {
    if (!id) {
      setError("Webhook ID is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await webhookService.getById(id);
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
    async (id, isActive) => {
      if (!id) {
        throw new Error("Webhook ID is required");
      }
      setLoading(true);
      setError(null);
      try {
        const data = await webhookService.toggle(id, isActive);
        setWebhooks((prev) =>
          prev.map((w) =>
            w.uniqueId === id
              ? { ...w, isActive: data.data?.isActive ?? isActive }
              : w,
          ),
        );
        if (currentWebhook?.uniqueId === id) {
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
        // eslint-disable-next-line
      } finally {
        setLoading(false);
      }
    },
    [currentWebhook],
  );

  const clearPayloads = useCallback(
    async (id) => {
      if (!id) {
        throw new Error("Webhook ID is required");
      }
      setLoading(true);
      setError(null);
      try {
        const data = await webhookService.clearPayloads(id);
        if (currentWebhook?.uniqueId === id) {
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

  const deleteWebhook = useCallback(async (id) => {
    if (!id) {
      throw new Error("Webhook ID is required");
    }
    setLoading(true);
    setError(null);
    try {
      const data = await webhookService.deleteWebhook(id);
      setWebhooks((prev) => prev.filter((w) => w.uniqueId !== id));
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
    fetchById,
    create,
    toggle,
    clearPayloads,
    deleteWebhook,
  };
};

export default useWebhooks;
