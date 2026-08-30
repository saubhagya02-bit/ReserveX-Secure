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

  // Used when a vendor tries to enter the Admin Portal
  const [accessDenied, setAccessDenied] = useState(false);

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
        "[admin-auth] Asgardeo SDK isLoading did not resolve after",
        SDK_TIMEOUT_MS,
        "ms.",
      );

      setSdkStalled(true);
    }, SDK_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [state.isLoading]);

  // FETCH BACKEND USER
  // ADMIN PORTAL = ORGANIZER ONLY
  const fetchBackendUser = useCallback(async () => {
    if (fetchInFlight.current) {
      return;
    }

    fetchInFlight.current = true;

    try {
      setLoading(true);
      setAccessDenied(false);

      const response = await httpRequest({
        url: `${BASE_URL}/users/me`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const userData = response.data;

      console.log("[admin-auth] Backend user:", userData);

      // ADMIN PORTAL ROLE CHECK
      // ONLY EMPLOYEE / ORGANIZER IS ALLOWED
      // VENDOR / NON-ORGANIZER DETECTED
      if (userData?.role !== "EMPLOYEE") {
        console.warn(
          "[admin-auth] Non-organizer attempted to access Admin Portal:",
          userData?.role,
        );

        sessionStorage.setItem(
          "portalAccessError",
          "Your account does not have permission to access the Admin Portal. Please sign in with an Organizer account.",
        );

        sessionStorage.setItem("portalAccessType", "organizer-only");

        setBackendUser(null);
        hasFetched.current = false;

        // Asgardeo handles the redirect
        await signOut();

        return;
      }

      // VALID ORGANIZER
      console.log("[admin-auth] Organizer authenticated successfully.");

      setBackendUser(userData);
      setAccessDenied(false);
      hasFetched.current = true;
    } catch (err) {
      console.error(
        "[admin-auth] fetchBackendUser error:",
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
    if (state.isLoading) {
      return;
    }

    if (state.isAuthenticated && !hasFetched.current) {
      fetchBackendUser();
      return;
    }

    if (!state.isAuthenticated) {
      setBackendUser(null);
      hasFetched.current = false;
      fetchInFlight.current = false;
      setLoading(false);
    }
  }, [state.isAuthenticated, state.isLoading, fetchBackendUser]);

  // LOGIN
  const login = useCallback(() => {
    setAccessDenied(false);
    signIn();
  }, [signIn]);

  // LOGOUT
  const logout = useCallback(async () => {
    hasFetched.current = false;
    fetchInFlight.current = false;

    setBackendUser(null);
    setAccessDenied(false);

    try {
      await signOut();
    } catch (error) {
      console.error("[admin-auth] Logout error:", error);
    }
  }, [signOut]);

  // REFRESH USER
  const refreshUser = useCallback(async () => {
    hasFetched.current = false;
    setAccessDenied(false);

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
    if (!state.isAuthenticated || !backendUser) {
      return null;
    }

    return {
      username: state.username || "",
      email: state.email || "",

      displayName: state.displayName || state.username || "",

      sub: state.username || "",

      id: backendUser.id,

      role: backendUser.role,

      businessName:
        backendUser.businessName || state.displayName || state.username || "",

      noOfCurrentBookings: backendUser.noOfCurrentBookings ?? 0,
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

      accessDenied,

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
      accessDenied,
      login,
      logout,
      httpRequest,
      apiRequest,
      refreshUser,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
