import api from "./axios";

export const getCommitmentItems = (page = 1, perPage = 50) =>
  api.get("/admin/commitment-items", { params: { paginate: 1, page, per_page: perPage } });

export const getCommitmentItem = (id) =>
  api.get(`/admin/commitment-items/${id}`);

export const createCommitmentItem = (payload) =>
  api.post("/admin/commitment-items", payload);

export const updateCommitmentItem = (id, payload) =>
  api.put(`/admin/commitment-items/${id}`, payload);

export const deleteCommitmentItem = (id) =>
  api.delete(`/admin/commitment-items/${id}`);
