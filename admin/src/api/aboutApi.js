import api from "./axios";

// ── Single-record sections ──────────────────────────────
export const getAboutHero    = ()        => api.get("/admin/about/hero");
export const updateAboutHero = (payload) => api.put("/admin/about/hero", payload);

export const getAboutStory    = ()        => api.get("/admin/about/story");
export const updateAboutStory = (payload) => api.put("/admin/about/story", payload);

export const getAboutMission    = ()        => api.get("/admin/about/mission");
export const updateAboutMission = (payload) => api.put("/admin/about/mission", payload);

export const getAboutComparison    = ()        => api.get("/admin/about/comparison");
export const updateAboutComparison = (payload) => api.put("/admin/about/comparison", payload);

export const getAboutCta    = ()        => api.get("/admin/about/cta");
export const updateAboutCta = (payload) => api.put("/admin/about/cta", payload);

// ── Problem Cards (CRUD) ───────────────────────────────
export const getProblems    = ()         => api.get("/admin/about/problems");
export const createProblem  = (payload)  => api.post("/admin/about/problems", payload);
export const updateProblem  = (id, data) => api.put(`/admin/about/problems/${id}`, data);
export const deleteProblem  = (id)       => api.delete(`/admin/about/problems/${id}`);

// ── Core Values (CRUD) ─────────────────────────────────
export const getCoreValues   = ()         => api.get("/admin/about/core-values");
export const createCoreValue = (payload)  => api.post("/admin/about/core-values", payload);
export const updateCoreValue = (id, data) => api.put(`/admin/about/core-values/${id}`, data);
export const deleteCoreValue = (id)       => api.delete(`/admin/about/core-values/${id}`);

// ── Comparison Cards (CRUD) ────────────────────────────
export const getComparisonCards   = ()         => api.get("/admin/about/comparison-cards");
export const createComparisonCard = (payload)  => api.post("/admin/about/comparison-cards", payload);
export const updateComparisonCard = (id, data) => api.put(`/admin/about/comparison-cards/${id}`, data);
export const deleteComparisonCard = (id)       => api.delete(`/admin/about/comparison-cards/${id}`);
