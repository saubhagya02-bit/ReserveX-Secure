import api from "./api";

// Toggle to false to use real backend endpoints
const USE_MOCK = false;

/**
 * Create reservations for selected stalls.
 * Accepts an array of stall objects or an array of IDs.
 */
export const createReservation = async (selectedStalls) => {
  const stallIds = (selectedStalls || []).map((s) => s?.id ?? s?.stall_id ?? s);

  // if (USE_MOCK) {
  //   return new Promise((resolve) =>
  //     setTimeout(() => resolve({ message: "Reservation confirmed", stallIds }), 900),
  //   );
  // }

  try {
    const res = await api.post("/reservations", { stall_ids: stallIds });
    return res.data;
  } catch (err) {
    console.error("createReservation error:", err);
    throw err?.response?.data?.message || "Failed to create reservation";
  }
};

export const getMyReservations = async () => {
  // if (USE_MOCK) {
  //   return new Promise((resolve) => setTimeout(() => resolve([]), 300));
  // }

  try {
    const res = await api.get("/reservations/my");
    return res.data;
  } catch (err) {
    console.error("getMyReservations error:", err);
    throw err?.response?.data?.message || "Failed to fetch reservations";
  }
};

export const updateReservationGenres = async (genrePayload) => {
  try {
    const { data } = await api.put(`/genres`, genrePayload);
    return data;
  } catch (err) {
    throw err?.response?.data?.message || "Failed to update genres";
  }
};