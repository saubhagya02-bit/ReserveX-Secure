import axios from "axios";

const BASE_URL = "https://localhost:8443/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

export default api;

export const createAuthApi = (token) =>
  axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    timeout: 10000,
  });
