import api from "./axios";

export async function getOrders(params = {}) {
  const { data } = await api.get("/admin/orders", { params });
  return data;
}

export async function updateOrderStatus(id, status) {
  const { data } = await api.patch(`/admin/orders/${id}`, { status });
  return data;
}

export async function deleteOrder(id) {
  const { data } = await api.delete(`/admin/orders/${id}`);
  return data;
}
