import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteProduct, getProducts, updateProduct } from "../../api/productApi";
import { useAuth } from "../../context/useAuth";
import { hasPermission } from "../../modules/users/constants";
import { getBackendRoot } from "../../api/runtimeApi";

const FALLBACK_IMG = `data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 600'><rect width='900' height='600' fill='#171717'/><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' fill='#ffffff' font-family='Arial,sans-serif' font-size='48'>Product</text></svg>",
)}`;

function parseJsonField(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) {
    try { return JSON.parse(value); } catch { return []; }
  }
  return [];
}

function decodeHtml(str) {
  return String(str || "")
    .replace(/&amp;/g, "&")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export default function ProductList() {
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [toast, setToast]       = useState({ show: false, text: "" });

  const canAdd     = hasPermission(user, "create_content");
  const canEdit    = hasPermission(user, "edit_content");
  const canDelete  = hasPermission(user, "delete_content");
  const canPublish = hasPermission(user, "publish_content");

  const showNoPerm = (action) => setToast({ show: true, text: `You do not have permission to ${action}.` });

  useEffect(() => {
    if (!toast.show) return;
    const t = setTimeout(() => setToast({ show: false, text: "" }), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const apiRoot = useMemo(() => getBackendRoot(), []);

  // Derive public root from apiRoot: replace /backend with /public
  const publicRoot = apiRoot.replace(/\/backend$/, "/public");

  const resolveImage = (images) => {
    const arr = parseJsonField(images);
    const raw = arr[0];
    if (!raw) return FALLBACK_IMG;
    if (raw.startsWith("http")) return raw;
    if (raw.startsWith("/product-images/")) return publicRoot + raw;
    if (raw.startsWith("/uploads/")) return apiRoot + raw;
    if (raw.startsWith("/")) return publicRoot + raw;
    return `${apiRoot}/uploads/${raw}`;
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await getProducts();
        setProducts(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!canDelete) { showNoPerm("delete products"); return; }
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || "Delete failed.");
    }
  };

  const handleToggleActive = async (item) => {
    if (!canPublish) { showNoPerm("publish products"); return; }
    try {
      const nextActive = item.is_active ? 0 : 1;
      const { data } = await updateProduct(item.id, { is_active: nextActive });
      setProducts((prev) => prev.map((p) => p.id === data?.data?.id ? data.data : p));
    } catch (err) {
      if (err?.response?.status === 401) { navigate("/login", { replace: true }); return; }
      setError("Failed to update product status.");
    }
  };

  if (loading) return <p className="text-white/70">Loading products…</p>;

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Products</h2>
          <p className="text-sm text-white/65">Manage products shown on website.</p>
        </div>
        <button
          type="button"
          onClick={() => canAdd ? navigate("/products/new") : showNoPerm("add products")}
          className="inline-flex w-fit rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 text-black hover:bg-[var(--admin-primary-strong)]"
        >
          + Add Product
        </button>
      </header>

      {toast.show && (
        <div className="fixed right-5 top-5 z-[220] rounded-xl border border-red-400/30 bg-red-500/90 px-4 py-2 text-sm font-medium text-white shadow-lg">
          {toast.text}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>
      )}

      {products.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[var(--admin-bg)] p-6 text-white/70">
          No products found. Add your first product.
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map((item) => {
            const isActive = item.is_active === 1 || item.is_active === true;
            const badges   = parseJsonField(item.badges);
            const tags     = parseJsonField(item.tags);

            return (
              <article key={item.id} className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--admin-bg)]">
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr]">
                  <img
                    src={resolveImage(item.images)}
                    alt={item.name || "Product"}
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; }}
                    className="h-44 w-full object-cover md:h-full"
                  />
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-bold text-white">{item.name || "Untitled"}</h3>
                          {item.category && (
                            <span className="rounded-full bg-[var(--admin-primary)]/20 px-2 py-0.5 text-xs font-medium text-[var(--admin-primary)]">
                              {item.category}
                            </span>
                          )}
                          {item.size && (
                            <span className="rounded-full border border-white/20 px-2 py-0.5 text-xs text-white/60">
                              {item.size}
                            </span>
                          )}
                        </div>
                        {item.subtitle && (
                          <p className="mt-0.5 text-sm text-white/50">{item.subtitle}</p>
                        )}
                        <p className="mt-2 line-clamp-2 text-sm text-white/70">
                          {decodeHtml(item.short_desc || item.description || "No description")}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                          <span className="rounded-md bg-white/10 px-2 py-1 text-white/80">
                            PKR {Number(item.price || 0).toLocaleString()}
                          </span>
                          <span className="rounded-md bg-white/10 px-2 py-1 text-white/80">
                            Rating: {item.rating ?? "-"} ({item.reviews ?? 0} reviews)
                          </span>
                          {badges[0] && (
                            <span className="rounded-md bg-amber-500/20 px-2 py-1 text-amber-300">{badges[0]}</span>
                          )}
                          {tags[0] && (
                            <span className="rounded-md bg-white/10 px-2 py-1 text-white/60">#{tags[0]}</span>
                          )}
                          <span className="rounded-md bg-white/10 px-2 py-1 text-white/60">
                            Slug: {item.slug || "-"}
                          </span>
                        </div>
                      </div>

                      <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item)}
                          className={isActive
                            ? "rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                            : "rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </button>
                        <button
                          type="button"
                          onClick={() => canEdit ? navigate(`/products/edit/${item.id}`) : showNoPerm("edit products")}
                          className={`rounded-lg px-4 py-2 text-sm ${canEdit ? "bg-[#1f8b4c] text-white hover:bg-[var(--admin-primary-strong)]" : "border border-white/20 bg-white/10 text-white/60"}`}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
