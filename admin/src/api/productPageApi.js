import api from "./axios";

export const getProductPageSettings = () => api.get("/admin/product-page");
export const updateProductPageSettings = (payload) => api.put("/admin/product-page", payload);
