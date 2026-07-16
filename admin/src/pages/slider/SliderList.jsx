import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteSlider, getSliders, updateSlider } from "../../api/sliderApi";
import { getProducts } from "../../api/productApi";
import { useAuth } from "../../context/useAuth";
import { hasPermission } from "../../modules/users/constants";
import { getBackendRoot } from "../../api/runtimeApi";

const FALLBACK_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 700'><rect width='1200' height='700' fill='#171717'/><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' fill='#ffffff' font-family='Arial,sans-serif' font-size='58'>Slide</text></svg>",
)}`;

const parseJsonArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export default function SliderList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sliders, setSliders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, text: "" });

  const canAdd = hasPermission(user, "create_content");
  const canEdit = hasPermission(user, "edit_content");
  const canDelete = hasPermission(user, "delete_content");
  const canPublish = hasPermission(user, "publish_content");

  const showNoPerm = (action) => setToast({ show: true, text: `You do not have permission to ${action}.` });

  useEffect(() => {
    if (!toast.show) return;
    const t = setTimeout(() => setToast({ show: false, text: "" }), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const apiRoot = useMemo(() => getBackendRoot(), []);

  const resolveImage = (value) => {
    if (!value) return FALLBACK_IMAGE;
    if (value.startsWith("http")) return value;
    if (value.startsWith("/uploads/")) return apiRoot + value;
    if (value.startsWith("/")) return value;
    return apiRoot + "/uploads/" + value;
  };

  const productById = useMemo(() => {
    const map = new Map();
    products.forEach((p) => map.set(Number(p.id), p));
    return map;
  }, [products]);

  const loadAll = async () => {
    try {
      const [slidersRes, productsRes] = await Promise.all([getSliders(), getProducts()]);
      const rows = Array.isArray(slidersRes.data?.data) ? slidersRes.data.data : [];
      rows.sort((a, b) => Number(a.order_position || 0) - Number(b.order_position || 0));
      setSliders(rows);
      setProducts(Array.isArray(productsRes.data?.data) ? productsRes.data.data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load hero slides.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Resolve a slide's display values the same way the public API does:
  // slide override first, linked product second.
  const resolveSlide = (item) => {
    const product = item.product_id ? productById.get(Number(item.product_id)) : null;
    const productImages = parseJsonArray(product?.images);
    const firstImage = typeof productImages[0] === "object" ? productImages[0]?.url : productImages[0];
    return {
      product,
      title: item.title || product?.name || "Untitled Slide",
      description: item.subtitle || product?.short_desc || "No description",
      tags: parseJsonArray(item.tags).length > 0 ? parseJsonArray(item.tags) : parseJsonArray(product?.badges),
      image: item.image || firstImage || "",
      category: (product?.category || "").toUpperCase(),
    };
  };

  const activeSlides = sliders.filter((s) => s.is_active === 1 || s.is_active === true);

  const handleDelete = async (id) => {
    if (!canDelete) {
      showNoPerm("delete slides");
      return;
    }
    if (!window.confirm("Delete this slide?")) return;
    try {
      await deleteSlider(id);
      await loadAll();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Delete failed.");
    }
  };

  const handleToggleActive = async (item) => {
    if (!canPublish) {
      showNoPerm("publish slides");
      return;
    }
    try {
      const nextActive = item.is_active ? 0 : 1;
      const { data } = await updateSlider(item.id, { is_active: nextActive });
      setSliders((prev) =>
        prev.map((row) => (row.id === data?.data?.id ? data.data : row)),
      );
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      setError("Failed to update slide status.");
    }
  };


  if (loading) {
    return <p className="text-white/70">Loading hero slides...</p>;
  }

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Hero Slides</h2>
          <p className="text-sm text-white/65">
            Manage the rotating product slider on the website home page. Each slide is
            linked to a real product.
          </p>
          {/* Live-style preview of the frontend dot pagination */}
          <div className="mt-2 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {activeSlides.map((s) => (
                <span key={s.id} className="h-2.5 w-2.5 rounded-full bg-[var(--admin-primary)]" />
              ))}
              {activeSlides.length === 0 && (
                <span className="text-xs text-red-300">No active slides — the hero section will be hidden.</span>
              )}
            </div>
            {activeSlides.length > 0 && (
              <span className="text-xs text-white/60">
                {activeSlides.length} active slide{activeSlides.length === 1 ? "" : "s"} shown on the website
                ({sliders.length} total)
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => (canAdd ? navigate("/sliders/new") : showNoPerm("add slides"))}
          className="inline-flex w-fit rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 text-black hover:bg-[var(--admin-primary-strong)]"
        >
          + Add Slide
        </button>
      </header>

      {toast.show ? (
        <div className="fixed right-5 top-5 z-[220] rounded-xl border border-red-400/30 bg-red-500/90 px-4 py-2 text-sm font-medium text-white shadow-lg">
          {toast.text}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
          {error}
        </div>
      ) : null}

      {sliders.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[var(--admin-bg)] p-6 text-white/70">
          No slides found. Add your first slide.
        </div>
      ) : (
        <div className="grid gap-4">
          {sliders.map((item, index) => {
            const resolved = resolveSlide(item);
            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--admin-bg)]"
              >
                <div className="grid grid-cols-1 md:grid-cols-[220px_1fr]">
                  <img
                    src={resolveImage(resolved.image)}
                    alt={resolved.title}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    className="h-44 w-full bg-white/5 object-contain md:h-full"
                  />
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f4a340]">
                          {item.kicker || "Premium Selection"}
                        </p>
                        <h3 className="mt-1 break-words text-2xl font-bold text-white">
                          {resolved.title}
                        </h3>
                        <p className="mt-2 break-words text-sm text-white/70">
                          {resolved.description}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                          <span className="rounded-md bg-white/10 px-2 py-1 text-white/80">
                            #{index + 1} in rotation
                          </span>
                          <span className="rounded-md bg-white/10 px-2 py-1 text-white/80">
                            Product: {resolved.product ? resolved.product.name : "⚠ Not linked"}
                          </span>
                          {resolved.category ? (
                            <span className="rounded-md bg-white/10 px-2 py-1 text-white/80">
                              Category: {resolved.category}
                            </span>
                          ) : null}
                          {resolved.tags.map((tag) => (
                            <span key={tag} className="rounded-md bg-[var(--admin-primary)]/15 px-2 py-1 text-[var(--admin-primary)]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex w-full flex-wrap items-start gap-2 sm:w-auto">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item)}
                          className={
                            item.is_active
                              ? "rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                              : "rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                          }
                        >
                          {item.is_active ? "Active" : "Inactive"}
                        </button>
                        <button
                          type="button"
                          onClick={() => (canEdit ? navigate(`/sliders/edit/${item.id}`) : showNoPerm("edit slides"))}
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
