const trimSlash = (value) => String(value || "").replace(/\/+$/, "");

function getOrigin() {
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

export function getBackendRoot() {
  const envApiBase = trimSlash(import.meta.env.VITE_API_URL);
  if (envApiBase) return envApiBase.replace(/\/api$/i, "");
  if (import.meta.env.DEV) return "http://localhost/Organic%20Food/backend";

  const origin = getOrigin();
  if (!origin) return "/backend";
  return `${origin}/backend`;
}

export function getApiBase() {
  const envApiBase = trimSlash(import.meta.env.VITE_API_URL);
  if (envApiBase) return envApiBase;
  return `${getBackendRoot()}/api`;
}
