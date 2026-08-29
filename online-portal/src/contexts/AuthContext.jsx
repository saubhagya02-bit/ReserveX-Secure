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

  useEffect(() => {
    if (!state.isLoading) return;
    const timer = setTimeout(() => {
      console.warn(
        "[auth] SDK isLoading did not resolve after",
        SDK_TIMEOUT_MS,
        "ms — proceeding without waiting on it further.",
      );
      setSdkStalled(true);
    }, SDK_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [state.isLoading]);

  const fetchBackendUser = useCallback(async () => {
    if (fetchInFlight.current) return;
    fetchInFlight.current = true;
    try {
      setLoading(true);
      const response = await httpRequest({
        url: `${BASE_URL}/users/me`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      setBackendUser(response.data);
      hasFetched.current = true;
    } catch (err) {
      console.error("fetchBackendUser error:", err?.response?.status);
      setBackendUser(null);
      hasFetched.current = true;
    } finally {
      setLoading(false);
      fetchInFlight.current = false;
    }
  }, [httpRequest]);

  useEffect(() => {
    if (state.isAuthenticated && !hasFetched.current) {
      fetchBackendUser();
    } else if (!state.isAuthenticated) {
      setBackendUser(null);
      hasFetched.current = false;
      setLoading(false);
    }
  }, [state.isAuthenticated, fetchBackendUser]);

  const login = () => signIn();
  const logout = () => {
    hasFetched.current = false;
    signOut();
  };

  const refreshUser = async () => {
    hasFetched.current = false;
    await fetchBackendUser();
  };

  const user = useMemo(
    () =>
      state.isAuthenticated
        ? {
            username: state.username || "",
            email: state.email || "",
            displayName: state.displayName || state.username || "",
            noOfCurrentBookings: backendUser?.noOfCurrentBookings ?? 0,
            businessName:
              backendUser?.businessName ||
              state.displayName ||
              state.username ||
              "",
          }
        : null,
    [
      state.isAuthenticated,
      state.username,
      state.email,
      state.displayName,
      backendUser,
    ],
  );

  const contextValue = useMemo(
    () => ({
      isAuthenticated: state.isAuthenticated,
      isLoading: (state.isLoading && !sdkStalled) || loading,
      user,
      login,
      logout,
      httpRequest,
      refreshUser,
    }),
    [
      state.isAuthenticated,
      state.isLoading,
      sdkStalled,
      loading,
      user,
      httpRequest,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
