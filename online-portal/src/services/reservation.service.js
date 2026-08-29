const BASE_URL = "https://localhost:8443/api";

export const createReservation = async (selectedStalls, httpRequest) => {
  const stallIds = (selectedStalls || []).map((s) => s?.id ?? s?.stall_id ?? s);
  try {
    const response = await httpRequest({
      url: `${BASE_URL}/reservations`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: { stall_ids: stallIds },
    });
    return response.data;
  } catch (err) {
    console.error("createReservation error:", err);
    throw err?.response?.data?.message || "Failed to create reservation";
  }
};

export const getMyReservations = async (httpRequest) => {
  try {
    const response = await httpRequest({
      url: `${BASE_URL}/reservations/my`,
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (err) {
    console.error("getMyReservations error:", err);
    throw err?.response?.data?.message || "Failed to fetch reservations";
  }
};

export const updateReservationGenres = async (genrePayload, httpRequest) => {
  try {
    const response = await httpRequest({
      url: `${BASE_URL}/genres`,
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      data: genrePayload,
    });
    return response.data;
  } catch (err) {
    throw err?.response?.data?.message || "Failed to update genres";
  }
};
