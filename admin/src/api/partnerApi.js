import api from "./axios";

/* ── Partner Page Settings (singleton) ─────────────── */
export const getPartnerPageSettings = () => api.get("/admin/partner-page");
export const updatePartnerPageSettings = (data) => api.put("/admin/partner-page", data);

/* ── Team Members ──────────────────────────────────── */
export const getTeamMembers = () =>
  api.get("/admin/team-members", { params: { paginate: 0 } });
export const getTeamMember = (id) => api.get(`/admin/team-members/${id}`);
export const createTeamMember = (payload) => api.post("/admin/team-members", payload);
export const updateTeamMember = (id, payload) => api.put(`/admin/team-members/${id}`, payload);
export const deleteTeamMember = (id) => api.delete(`/admin/team-members/${id}`);
export const reorderTeamMembers = (items) =>
  api.patch("/admin/team-members/reorder", { items });

/* ── Affiliate Applications ────────────────────────── */
export async function getAffiliateApplications(params = {}) {
  const { data } = await api.get("/admin/affiliate-applications", { params });
  return data;
}

export async function updateApplicationStatus(id, status) {
  const { data } = await api.patch(`/admin/affiliate-applications/${id}`, { status });
  return data;
}

export async function deleteAffiliateApplication(id) {
  const { data } = await api.delete(`/admin/affiliate-applications/${id}`);
  return data;
}
