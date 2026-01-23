import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";

const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (asyncFn, ...args) => {
    if (typeof asyncFn !== "function") {
      throw new Error("First argument must be a function");
    }
    setLoading(true);
    setError(null);
    try {
      const data = await asyncFn(...args);
      return data;
    } catch (err) {
      const errorMessage =
        err.message || err.response?.data?.message || "Something went wrong";
      setError(errorMessage);

      if (errorMessage !== "Request cancelled") {
        toast.error(errorMessage);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { loading, error, request, clearError };
};

export default useFetch;
