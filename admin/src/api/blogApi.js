import api from "./axios";

export const getBlogs = () => api.get("/admin/blog?paginate=0");
export const getBlog = (id) => api.get(`/admin/blog/${id}`);
export const createBlog = (payload) => api.post("/admin/blog", payload);
export const updateBlog = (id, payload) => api.put(`/admin/blog/${id}`, payload);
export const deleteBlog = (id) => api.delete(`/admin/blog/${id}`);
