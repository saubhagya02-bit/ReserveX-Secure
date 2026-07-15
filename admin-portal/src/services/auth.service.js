import API from "./api";

/**
 * Employee login. Use email as username.
 * Backend returns JWT; store token in localStorage after login.
 */
export const login = async (email, password) => {
  return API.post("/auth/login", { email, password });
};

export const logout = () => {
  localStorage.removeItem("token");
};
