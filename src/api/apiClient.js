import { products as staticProducts } from "../data/productsData";
import { blogs as staticBlogs } from "../data/blogData";

const BASE_URL = (import.meta.env.VITE_API_URL || "/backend").replace(/\/$/, "");

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
    return Array.isArray(result) ? result : (result?.data ?? staticProducts);
  } catch {
    return staticProducts;
  }
}

export async function getProductBySlug(slug) {
  try {
    return await fetchApi(`/api/public/products/${encodeURIComponent(slug)}`);
  } catch {
    const { products } = await import("../data/productsData");
    return products.find((p) => p.slug === slug) ?? null;
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

export async function getBlogs(params = {}) {
  try {
    const qs = new URLSearchParams({ paginate: "0", ...params }).toString();
    const result = await fetchApi(`/api/public/blog?${qs}`);
    return Array.isArray(result) ? result : (result?.data ?? staticBlogs);
  } catch {
    return staticBlogs;
  }
}

export async function getBlogBySlug(slug) {
  try {
    return await fetchApi(`/api/public/blog/${encodeURIComponent(slug)}`);
  } catch {
    const { blogs } = await import("../data/blogData");
    return blogs.find((b) => b.slug === slug) ?? null;
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

export async function postContact(data) {
  return fetchApi("/api/public/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function parseJsonField(value, fallback = []) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) {
    try { return JSON.parse(value); } catch { return fallback; }
  }
  return fallback;
}
