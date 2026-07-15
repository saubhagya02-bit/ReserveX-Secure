import api from "./api";

/**
 * Fetch all stalls from the backend.
 */
export const fetchStalls = async () => {
  const { data } = await api.get("/stalls");
  return data || [];
};

/**
 * Check if a stall name is already taken.
 * @param {string} name - Stall name to check
 * @param {number|null} excludeId - When editing, exclude this stall ID from the check
 * @returns {Promise<{taken: boolean}>}
 */
export const checkStallName = async (name, excludeId = null) => {
  const params = { name: (name || "").trim() };
  if (excludeId != null) params.excludeId = excludeId;
  const { data } = await api.get("/stalls/check-name", { params });
  return data;
};

/**
 * Add a new stall.
 * @param {{name: string, size: string, price: number}} payload
 */
export const addStall = async (payload) => {
  const { data } = await api.post("/stalls", {
    name: payload.name.trim(),
    size: (payload.size || "small").toLowerCase(),
    price: payload.price != null ? Number(payload.price) : 0,
    gridCol: payload.gridCol ?? 0,
    gridRow: payload.gridRow ?? 0,
  });
  return data;
};

/**
 * Update an existing stall.
 * @param {number} id - Stall ID
 * @param {{name: string, size: string, price: number}} payload
 */
export const updateStall = async (id, payload) => {
  const { data } = await api.put(`/stalls/${id}`, {
    name: payload.name.trim(),
    size: (payload.size || "small").toLowerCase(),
    price: payload.price != null ? Number(payload.price) : 0,
    gridCol: payload.gridCol ?? 0,
    gridRow: payload.gridRow ?? 0,
  });
  return data;
};

/**
 * Delete a stall. Backend handles reservation cleanup and vendor notifications.
 * @param {number} id - Stall ID
 */
export const deleteStall = async (id) => {
  await api.delete(`/stalls/${id}`);
};

/**
 * Unreserve a stall (change from Reserved to Available).
 * Backend handles reservation cleanup and vendor notifications.
 * @param {number} id - Stall ID
 */
export const unreserveStall = async (id) => {
  await api.put(`/stalls/${id}/unreserve`);
};
