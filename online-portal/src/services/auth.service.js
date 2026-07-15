import api from "./api";

// Simple mock-friendly auth helpers used by pages and AuthContext
const USE_MOCK = false;

export const loginUser = async (email, password) => {
  // if (USE_MOCK) {
  //   // Return shape expected by LoginPage: { user, token }
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       if (email === "saman@example.com" && password === "123") {
  //         resolve({
  //           user: {
  //             user_id: 101,
  //             username: "saman_pub",
  //             business_name: "Saman Publishers",
  //             email: "saman@example.com",
  //             roles: "vendor",
  //             no_of_current_bookings: 0,
  //           },
  //           token: "mock-token-abc-123",
  //         });
  //       } else {
  //         reject("Invalid email or password");
  //       }
  //     }, 700);
  //   });
  // }

  try {
    const res = await api.post("/auth/login", {  username : email, password });
    const { token, user } = res.data;
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    return res.data;

  } catch (err) {
    console.error("loginUser error:", err);
    throw err?.response?.data?.message || "Login failed";
  }
};

export const registerUser = async (userData) => {
  // if (USE_MOCK) {
  //   return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 600));
  // }

  try {
    const res = await api.post("/auth/register", {
      email: userData.email,
      password: userData.password,
      businessName: userData.business_name,  // map snake to camel
      username: userData.username || userData.email
    });
    return res.data;
  } catch (err) {
    console.error("registerUser error:", err);
    throw err?.response?.data?.message || "Registration failed";
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getCurrentUser = async () => {
  try {
    const res = await api.get("/users/me");
    return res.data;
  } catch (err) {
    console.error("getCurrentUser error:", err);
    throw err?.response?.data?.message || "Failed to fetch user data";
  }
};
