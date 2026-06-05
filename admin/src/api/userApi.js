import api from "./axios";

export const getUsers = (params = {}) => api.get("/admin/users", { params });
export const getUserById = (id) => api.get(`/admin/users/${id}`);
export const createUser = (payload) => api.post("/admin/users", payload);
export const updateUser = (id, payload) => api.put(`/admin/users/${id}`, payload);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
