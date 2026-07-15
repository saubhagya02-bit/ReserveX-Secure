import api from "./api";

export const submitContactForm = async (data) => {
    const response = await api.post("/contact", data);
    return response.data;
};
