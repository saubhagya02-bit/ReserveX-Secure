import axios from "axios";// for sending HTTP requests

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: BASE_URL,// custom instance of axios with a base URL
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {// interceptor to add the JWT token to the Authorization header of each request
  const token = localStorage.getItem("jwt_token");// retrieve the token from local storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default api;

// token is automatically attached 


