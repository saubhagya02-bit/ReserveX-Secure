import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useAuthContext } from "@asgardeo/auth-react";

export const AuthContext = createContext();

const BASE_URL = "https://localhost:8443/api";
const SDK_TIMEOUT_MS = 4000;

export const AuthProvider = ({ children }) => {
  const { state, signIn, signOut, httpRequest } = useAuthContext();

  const [backendUser, setBackendUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sdkStalled, setSdkStalled] = useState(false);

  const hasFetched = useRef(false);
  const fetchInFlight = useRef(false);

  // ASGARDEO SDK TIMEOUT

  useEffect(() => {
    if (!state.isLoading) {
      setSdkStalled(false);
      return;
    }

    const timer = setTimeout(() => {
      console.warn(
        "[auth] Asgardeo SDK isLoading did not resolve after",
        SDK_TIMEOUT_MS,
        "ms.",
      );

      setSdkStalled(true);
    }, SDK_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [state.isLoading]);

  // FETCH BACKEND USER
  // ONLINE PORTAL = VENDOR ONLY

  const fetchBackendUser = useCallback(async () => {
    if (fetchInFlight.current) {
      return;
    }

    fetchInFlight.current = true;

    try {
      setLoading(true);

      const response = await httpRequest({
        url: `${BASE_URL}/users/me`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const userData = response.data;

      console.log("[auth] Backend user:", userData);

      // ========================================================
      // IMPORTANT:
      // ONLINE PORTAL IS ONLY FOR VENDORS
      // ========================================================

      if (userData?.role !== "VENDOR") {
        console.warn(
          "[auth] Non-vendor attempted to access Online Portal:",
          userData?.role,
        );

        setBackendUser(null);
        hasFetched.current = false;

        alert(
          "Access Denied: This portal is for Vendors only. Please use the Admin Portal.",
        );

        await signOut();

        return;
      }

      // ========================================================
      // VALID VENDOR
      // ========================================================

      setBackendUser(userData);
      hasFetched.current = true;
    } catch (err) {
      console.error(
        "[auth] fetchBackendUser error:",
        err?.response?.status,
        err?.response?.data || err,
      );

      setBackendUser(null);
      hasFetched.current = true;
    } finally {
      setLoading(false);
      fetchInFlight.current = false;
    }
  }, [httpRequest, signOut]);

  // AUTHENTICATION STATE

  useEffect(() => {
    if (state.isAuthenticated && !hasFetched.current) {
      fetchBackendUser();
    } else if (!state.isAuthenticated) {
      setBackendUser(null);
      hasFetched.current = false;
      setLoading(false);
    }
  }, [state.isAuthenticated, fetchBackendUser]);

  // LOGIN

  const login = useCallback(() => {
    signIn();
  }, [signIn]);

  // LOGOUT

  const logout = useCallback(async () => {
    hasFetched.current = false;
    fetchInFlight.current = false;
    setBackendUser(null);

    await signOut();
  }, [signOut]);

  // REFRESH USER

  const refreshUser = useCallback(async () => {
    hasFetched.current = false;

    await fetchBackendUser();
  }, [fetchBackendUser]);

  // API REQUEST HELPER

  const apiRequest = useCallback(
    async (path, method = "GET", data = null) => {
      const config = {
        url: `${BASE_URL}${path}`,
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (data !== null && data !== undefined) {
        config.data = data;
      }

      const response = await httpRequest(config);

      return response.data;
    },
    [httpRequest],
  );

  // USER OBJECT

  const user = useMemo(() => {
    if (!state.isAuthenticated) {
      return null;
    }

    return {
      username: state.username || "",
      email: state.email || "",

      displayName: state.displayName || state.username || "",

      sub: state.username || "",

      // Backend information
      id: backendUser?.id,

      role: backendUser?.role || null,

      businessName:
        backendUser?.businessName || state.displayName || state.username || "",

      noOfCurrentBookings: backendUser?.noOfCurrentBookings ?? 0,
    };
  }, [
    state.isAuthenticated,
    state.username,
    state.email,
    state.displayName,
    backendUser,
  ]);

  // CONTEXT VALUE

  const contextValue = useMemo(
    () => ({
      isAuthenticated: state.isAuthenticated,

      isLoading: (state.isLoading && !sdkStalled) || loading,

      user,

      login,
      logout,

      httpRequest,
      apiRequest,

      refreshUser,
    }),
    [
      state.isAuthenticated,
      state.isLoading,
      sdkStalled,
      loading,
      user,
      login,
      logout,
      httpRequest,
      apiRequest,
      refreshUser,
    ],
  );

  // PROVIDER

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
