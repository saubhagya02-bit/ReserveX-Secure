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

  // IMPORTANT
  const [roleChecked, setRoleChecked] = useState(false);
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
      console.warn("[online-auth] Asgardeo SDK loading timeout");

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
      setRoleChecked(false);
      setAccessDenied(false);

      const response = await httpRequest({
        url: `${BASE_URL}/users/me`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const userData = response.data;

      console.log("[online-auth] Backend user:", userData);

      // ROLE CHECK
      if (userData?.role !== "VENDOR") {
        console.warn("[online-auth] Access denied. User role:", userData?.role);

        setBackendUser(userData);
        setAccessDenied(true);

        setRoleChecked(true);

        return;
      }

      // VALID VENDOR
      console.log("[online-auth] Vendor access granted");

      setBackendUser(userData);
      setAccessDenied(false);
      setRoleChecked(true);
      hasFetched.current = true;
    } catch (err) {
      console.error(
        "[online-auth] fetchBackendUser error:",
        err?.response?.status,
        err?.response?.data || err,
      );

      setBackendUser(null);
      setAccessDenied(true);
      setRoleChecked(true);
    } finally {
      setLoading(false);
      fetchInFlight.current = false;
    }
  }, [httpRequest]);

  // AUTH STATE
  useEffect(() => {
    if (state.isLoading) {
      return;
    }

    // User logged in
    if (state.isAuthenticated) {
      if (!hasFetched.current) {
        fetchBackendUser();
      }

      return;
    }

    // User logged out
    setBackendUser(null);
    setAccessDenied(false);
    setRoleChecked(false);
    hasFetched.current = false;
    setLoading(false);
  }, [state.isAuthenticated, state.isLoading, fetchBackendUser]);

  // LOGIN
  const login = useCallback(() => {
    setAccessDenied(false);
    setRoleChecked(false);
    setBackendUser(null);
    hasFetched.current = false;

    signIn();
  }, [signIn]);

  // LOGOUT
  const logout = useCallback(async () => {
    hasFetched.current = false;
    fetchInFlight.current = false;

    setBackendUser(null);
    setAccessDenied(false);
    setRoleChecked(false);

    await signOut();
  }, [signOut]);

  // REFRESH USER
  const refreshUser = useCallback(async () => {
    hasFetched.current = false;

    await fetchBackendUser();
  }, [fetchBackendUser]);

  // API REQUEST
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

  // CONTEXT
  const contextValue = useMemo(
    () => ({
      isAuthenticated: state.isAuthenticated,

      isLoading: (state.isLoading && !sdkStalled) || loading,

      user,

      accessDenied,
      roleChecked,

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
      roleChecked,
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
