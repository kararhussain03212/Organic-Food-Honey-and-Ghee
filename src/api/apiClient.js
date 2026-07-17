const BASE_URL = (import.meta.env.VITE_API_URL || "/backend").replace(/\/$/, "");
const BACKEND_ROOT = BASE_URL.replace(/\/api$/i, "");

function resolveUploadUrl(path) {
  if (!path || typeof path !== "string") return path;
  if (path.startsWith("/uploads/")) return BACKEND_ROOT + path;
  return path;
}

function normalizeBlog(blog) {
  if (!blog || typeof blog !== "object") return blog;
  return { ...blog, image: resolveUploadUrl(blog.image) };
}

async function fetchApi(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Request failed: ${res.status}`);
  }
  const json = await res.json();
  return json?.data ?? json;
}

export async function getProducts() {
  try {
    const result = await fetchApi("/api/public/products?paginate=0");
    return Array.isArray(result) ? result : (result?.data ?? []);
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug) {
  try {
    return await fetchApi(`/api/public/products/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

export async function getTestimonials() {
  try {
    const result = await fetchApi("/api/public/testimonials?paginate=0");
    return Array.isArray(result) ? result : (result?.data ?? []);
  } catch {
    return [];
  }
}

export async function getCommitmentItems() {
  try {
    const result = await fetchApi("/api/public/commitment-items?paginate=0");
    return Array.isArray(result) ? result : (result?.data ?? []);
  } catch {
    return [];
  }
}

export async function getBlogSettings() {
  try {
    const result = await fetchApi("/api/public/blog/settings");
    return result ?? {};
  } catch {
    return {};
  }
}

export async function searchBlogs(q) {
  try {
    const result = await fetchApi(`/api/public/blog/search?q=${encodeURIComponent(q)}`);
    return Array.isArray(result) ? result : (result?.data ?? []);
  } catch {
    return [];
  }
}

export async function getBlogs(params = {}) {
  try {
    const qs = new URLSearchParams({ paginate: "0", ...params }).toString();
    const result = await fetchApi(`/api/public/blog?${qs}`);
    const blogs = Array.isArray(result) ? result : (result?.data ?? []);
    return blogs.map(normalizeBlog);
  } catch {
    return [];
  }
}

export async function getBlogBySlug(slug) {
  try {
    const result = await fetchApi(`/api/public/blog/${encodeURIComponent(slug)}`);
    return normalizeBlog(result);
  } catch {
    return null;
  }
}

export async function getSettings() {
  try {
    const result = await fetchApi("/api/public/settings?paginate=0");
    if (Array.isArray(result)) {
      return result.reduce((acc, row) => {
        acc[row.key] = row.value;
        return acc;
      }, {});
    }
    return result ?? {};
  } catch {
    return {};
  }
}

// ── Live settings store ─────────────────────────────────────────────────────
// All components share one settings fetch and get pushed updates while the
// page is open, so admin edits show up without a manual refresh.
const SETTINGS_POLL_MS = 10000;
let settingsCache = null;
let settingsInflight = null;
let settingsPollTimer = null;
const settingsListeners = new Set();

async function refreshSettings() {
  if (settingsInflight) return settingsInflight;
  settingsInflight = getSettings()
    .then((next) => {
      settingsInflight = null;
      if (!next || !Object.keys(next).length) return settingsCache;
      if (JSON.stringify(next) !== JSON.stringify(settingsCache)) {
        settingsCache = next;
        settingsListeners.forEach((listener) => {
          try { listener(settingsCache); } catch { /* listener error must not break others */ }
        });
      }
      return settingsCache;
    })
    .catch(() => {
      settingsInflight = null;
      return settingsCache;
    });
  return settingsInflight;
}

function startSettingsPolling() {
  if (settingsPollTimer || typeof window === "undefined") return;
  settingsPollTimer = setInterval(() => {
    if (typeof document !== "undefined" && document.hidden) return;
    refreshSettings();
  }, SETTINGS_POLL_MS);
  // Catch up immediately when the tab becomes visible again.
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) refreshSettings();
  });
}

// Calls `listener` with the settings map as soon as it's available, and again
// whenever a poll detects the settings changed. Returns an unsubscribe fn.
export function subscribeSettings(listener) {
  settingsListeners.add(listener);
  if (settingsCache) {
    listener(settingsCache);
  } else {
    refreshSettings().then((s) => {
      if (s && settingsListeners.has(listener)) listener(s);
    });
  }
  startSettingsPolling();
  return () => settingsListeners.delete(listener);
}

export async function getHeroSlides() {
  try {
    const result = await fetchApi("/api/public/hero?paginate=0");
    return Array.isArray(result) ? result : (result?.data ?? []);
  } catch {
    return [];
  }
}

export async function getContactPage() {
  try {
    const result = await fetchApi("/api/public/contact-page");
    return result ?? {};
  } catch {
    return {};
  }
}

export async function getProductPage() {
  try {
    const result = await fetchApi("/api/public/product-page");
    return result ?? {};
  } catch {
    return {};
  }
}

export async function getPartnerPage() {
  try {
    const result = await fetchApi("/api/public/partner-page");
    return result ?? {};
  } catch {
    return {};
  }
}

export async function getTeamMembers() {
  try {
    const result = await fetchApi("/api/public/team-members");
    return Array.isArray(result) ? result : (result?.data ?? []);
  } catch {
    return [];
  }
}

// Throws an Error with .fields (per-field messages) on 422 so the form can
// show inline server-side validation errors.
export async function postAffiliateApplication(data) {
  const res = await fetch(`${BASE_URL}/api/public/affiliate-applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(body?.error || `Request failed: ${res.status}`);
    err.fields = body?.fields || null;
    err.status = res.status;
    throw err;
  }
  return body?.data ?? body;
}

// Creates an order and returns the generated order number, or null if the
// API is unavailable — the WhatsApp message is still sent without a number.
export async function postOrder(data) {
  try {
    const result = await fetchApi("/api/public/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return result?.order_number ?? null;
  } catch {
    return null;
  }
}

export async function postContact(data) {
  return fetchApi("/api/public/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Admin saves per-section visibility as settings keys like "section_status_navbar".
// A section is visible unless its status is explicitly inactive.
export function isSectionActive(settings, key) {
  const value = String(settings?.[`section_status_${key}`] ?? "active").toLowerCase();
  return value !== "inactive" && value !== "unactive";
}

export function parseJsonField(value, fallback = []) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) {
    try { return JSON.parse(value); } catch { return fallback; }
  }
  return fallback;
}

// Address API
export async function getAddresses() {
  try {
    const result = await fetchApi("/api/addresses");
    return Array.isArray(result) ? result : (result?.data ?? []);
  } catch {
    return [];
  }
}

export async function getAddress(id) {
  try {
    return await fetchApi(`/api/addresses/${id}`);
  } catch {
    return null;
  }
}

export async function createAddress(data) {
  return fetchApi("/api/addresses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAddress(id, data) {
  return fetchApi(`/api/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteAddress(id) {
  return fetchApi(`/api/addresses/${id}`, {
    method: "DELETE",
  });
}
