import api from "./axios";

export const getTestimonials = (page = 1, perPage = 20) =>
  api.get("/admin/testimonials", {
    params: { paginate: 1, page, per_page: perPage },
  });
export const getTestimonial = (id) => api.get(`/admin/testimonials/${id}`);
export const createTestimonial = (payload) => api.post("/admin/testimonials", payload);
export const updateTestimonial = (id, payload) => api.put(`/admin/testimonials/${id}`, payload);
export const deleteTestimonial = (id) => api.delete(`/admin/testimonials/${id}`);
