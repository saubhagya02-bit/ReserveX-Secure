import api from "./api";
import { mockStalls } from "../common/mockData";

// Temporary mock mode — switch to real API by calling `api` instead.
const USE_MOCK_DATA = false;

/**
 * Return an array of stall objects. When in mock mode this returns
 * data from `mockData`, otherwise it calls the backend endpoint.
 */
export const getAllStalls = async () => {
  // if (USE_MOCK_DATA) {
  //   return new Promise((resolve) => setTimeout(() => resolve(mockStalls), 300));
  // }

  try {
    const res = await api.get(`/stalls`);
    console.log(res);
    // Prefer an explicit data list when returned by the API
    if (res.data && Array.isArray(res.data)) return res.data;
    if (res.data && res.data.data && Array.isArray(res.data.data)) return res.data.data;
    return [];
  } catch (err) {
    console.error("getAllStalls error:", err);
    throw err?.response?.data?.message || "Failed to fetch stalls";
  }

};
//Get All Stalls
