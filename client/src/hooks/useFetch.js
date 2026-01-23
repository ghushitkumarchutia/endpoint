import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";

const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (asyncFn, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const data = await asyncFn(...args);
      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Something went wrong";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, request };
};

export default useFetch;
