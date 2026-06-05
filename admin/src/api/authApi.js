import api from "./axios";

export const loginApi = (payload) => api.post("/auth/login", payload);
export const meApi = () => api.get("/auth/me");
export const logoutApi = () => api.post("/auth/logout");
export const updateProfileApi = (payload) => api.put("/auth/profile", payload);
export const changePasswordApi = (payload) => api.put("/auth/password", payload);
