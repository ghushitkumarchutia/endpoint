import { createContext, useState, useEffect, useCallback, useRef } from "react";
import authService from "../services/authService";
import { cancelAllRequests } from "../services/api";

const AuthContext = createContext(null);

const isValidTokenFormat = (token) => {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  return parts.length === 3 && parts.every((part) => part.length > 0);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);

  const isMounted = useRef(true);

  const safeSetState = useCallback((setter, value) => {
    if (isMounted.current) {
      setter(value);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;

    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token || !isValidTokenFormat(token)) {
        if (token) localStorage.removeItem("token");
        safeSetState(setLoading, false);
        return;
      }

      try {
        const data = await authService.getMe();

        if (data?.user) {
          safeSetState(setUser, data.user);
          safeSetState(setIsAuthenticated, true);
          safeSetState(setAuthError, null);
        } else {
          throw new Error("Invalid user data received");
        }
      } catch (error) {
        if (error.message !== "Request cancelled") {
          console.error("Auth check failed:", error.message);
        }
        localStorage.removeItem("token");
        safeSetState(setUser, null);
        safeSetState(setIsAuthenticated, false);
      } finally {
        safeSetState(setLoading, false);
      }
    };

    checkAuth();

    return () => {
      isMounted.current = false;
    };
  }, [safeSetState]);

  const login = useCallback(
    async (credentials) => {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("Email and password are required");
      }

      setAuthError(null);

      try {
        const data = await authService.login(credentials);

        if (!data?.token || !data?.user) {
          throw new Error("Invalid response from server");
        }

        localStorage.setItem("token", data.token);
        safeSetState(setUser, data.user);
        safeSetState(setIsAuthenticated, true);
        return data;
      } catch (error) {
        safeSetState(setAuthError, error.message);
        throw error;
      }
    },
    [safeSetState],
  );

  const register = useCallback(
    async (userData) => {
      if (!userData?.email || !userData?.password || !userData?.name) {
        throw new Error("Name, email, and password are required");
      }

      setAuthError(null);

      try {
        const data = await authService.register(userData);

        if (!data?.token || !data?.user) {
          throw new Error("Invalid response from server");
        }

        localStorage.setItem("token", data.token);
        safeSetState(setUser, data.user);
        safeSetState(setIsAuthenticated, true);
        return data;
      } catch (error) {
        safeSetState(setAuthError, error.message);
        throw error;
      }
    },
    [safeSetState],
  );

  const logout = useCallback((redirectPath = "/login") => {
    cancelAllRequests();

    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);

    if (typeof window !== "undefined") {
      window.location.replace(redirectPath);
    }
  }, []);

  const updateProfile = useCallback(
    async (userData) => {
      if (!userData || typeof userData !== "object") {
        throw new Error("Invalid profile data");
      }

      try {
        const data = await authService.updateProfile(userData);

        if (data?.user) {
          safeSetState(setUser, data.user);
        }
        return data;
      } catch (error) {
        safeSetState(setAuthError, error.message);
        throw error;
      }
    },
    [safeSetState],
  );

  const refreshUser = useCallback(async () => {
    try {
      const data = await authService.getMe();
      if (data?.user) {
        safeSetState(setUser, data.user);
        return data.user;
      }
      return null;
    } catch (error) {
      console.error("Failed to refresh user:", error.message);
      return null;
    }
  }, [safeSetState]);

  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  const contextValue = {
    user,
    loading,
    isAuthenticated,
    authError,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
