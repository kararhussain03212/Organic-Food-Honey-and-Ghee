import axios from "./axios";

/* ── Contact Page Settings ─────────────────────────── */
export async function getContactPageSettings() {
  return axios.get("/admin/contact-page");
}

export async function updateContactPageSettings(data) {
  return axios.put("/admin/contact-page", data);
}

/* ── Contact Messages ──────────────────────────────── */
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
