import api from "./axios";

export const getSettings = () => api.get("/admin/settings?paginate=0");
export const updateSettings = (payload) => api.put("/admin/settings", payload);
