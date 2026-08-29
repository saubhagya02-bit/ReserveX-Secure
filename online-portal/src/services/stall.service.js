import api from "./api";

/**
 * Return an array of stall objects from the backend.
 */
export const getAllStalls = async () => {
  try {
    const res = await api.get("/stalls");
    if (res.data && Array.isArray(res.data)) return res.data;
    if (res.data && res.data.data && Array.isArray(res.data.data))
      return res.data.data;
    return [];
  } catch (err) {
    console.error("getAllStalls error:", err);
    throw err?.response?.data?.message || "Failed to fetch stalls";
  }
};
