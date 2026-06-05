import axios from "./axios";

export async function getContactMessages(params = {}) {
  const { data } = await axios.get("/admin/contact", { params });
  return data;
}

export async function markContactRead(id) {
  const { data } = await axios.patch(`/admin/contact/${id}/read`);
  return data;
}

export async function deleteContactMessage(id) {
  const { data } = await axios.delete(`/admin/contact/${id}`);
  return data;
}
