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
