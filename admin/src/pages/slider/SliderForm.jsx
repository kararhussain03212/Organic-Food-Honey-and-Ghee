import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createSlider, getSlider, updateSlider } from "../../api/sliderApi";
import { getProducts } from "../../api/productApi";

const getInitialForm = () => ({
  product_id: null,
  kicker: "Premium Selection",
  title: "",
  subtitle: "",
  tags: [],
  gradient: "",
  order_position: 1,
  is_active: true,
});

const toTagArray = (tags) => {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string" && tags.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(tags);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export default function SliderForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(getInitialForm);

  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef(null);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const addTag = () => {
    setField("tags", [...form.tags, ""]);
  };

  const removeTag = (index) => {
    setField("tags", form.tags.filter((_, i) => i !== index));
  };

  const updateTag = (index, value) => {
    const newTags = [...form.tags];
    newTags[index] = value;
    setField("tags", newTags);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await getProducts();
        const list = Array.isArray(res.data?.data) ? res.data.data : (res.data?.data?.data ?? []);
        setProducts(list);
      } catch {
        setProducts([]);
      }

      if (!isEditMode) {
        setForm(getInitialForm());
        setLoading(false);
        return;
      }

      try {
        const res = await getSlider(id);
        const item = res.data?.data ?? {};
        setForm({
          product_id: item.product_id ? Number(item.product_id) : null,
          kicker: item.kicker || "Premium Selection",
          title: item.title || "",
          subtitle: item.subtitle || "",
          tags: toTagArray(item.tags),
          gradient: item.gradient || "",
          order_position: Number(item.order_position ?? 1),
          is_active: item.is_active === 1 || item.is_active === true,
        });
      } catch {
        setError("Failed to load slide.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEditMode]);

  // Close product picker when clicking outside
  useEffect(() => {
    const onClick = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setPickerOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const selectedProduct = useMemo(
    () => products.find((p) => Number(p.id) === Number(form.product_id)) || null,
    [products, form.product_id],
  );

  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q) ||
        (p.slug || "").toLowerCase().includes(q),
    );
  }, [products, productSearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.product_id) {
      setError("Please select a product for this slide.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        product_id: form.product_id,
        kicker: form.kicker.trim() || "Premium Selection",
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        tags: form.tags.map((t) => t.trim()).filter(Boolean),
        gradient: form.gradient.trim(),
        order_position: Number(form.order_position || 1),
        sort_order: Number(form.order_position || 1),
        is_active: form.is_active ? 1 : 0,
      };

      if (isEditMode) await updateSlider(id, payload);
      else await createSlider(payload);

      navigate("/sliders");
    } catch (err) {
      if (err?.response?.status === 401) { navigate("/login", { replace: true }); return; }
      setError(err?.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white/70">Loading slide…</div>;

  const inputCls = "w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white";
  const labelCls = "mb-1 block text-sm text-white/80";
  const hintCls = "mt-1 block text-xs text-white/45";

  return (
    <section className="mx-auto max-w-3xl">
      <h2 className="mb-4 text-2xl font-bold text-white">
        {isEditMode ? "Edit Hero Slide" : "Add Hero Slide"}
      </h2>
      <p className="mb-4 text-sm text-white/60">
        Each slide is linked to a real product. Leave the override fields empty to
        automatically use the product&apos;s own name, description, badges, and image.
      </p>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-6">

        {/* Product picker (searchable) */}
        <div ref={pickerRef} className="relative">
          <label className={labelCls}>Product *</label>
          <button
            type="button"
            onClick={() => setPickerOpen((v) => !v)}
            className={`${inputCls} flex items-center justify-between text-left`}
          >
            <span className={selectedProduct ? "" : "text-white/40"}>
              {selectedProduct
                ? `${selectedProduct.name} — ${(selectedProduct.category || "").toUpperCase()}`
                : "Select a product…"}
            </span>
            <span className="text-white/50">▾</span>
          </button>
          {pickerOpen && (
            <div className="absolute z-30 mt-1 w-full rounded-lg border border-white/20 bg-[var(--admin-card)] shadow-xl">
              <input
                autoFocus
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full border-b border-white/10 bg-transparent px-3 py-2 text-white outline-none"
              />
              <div className="max-h-60 overflow-y-auto">
                {filteredProducts.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-white/50">No products match.</p>
                ) : (
                  filteredProducts.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setField("product_id", Number(p.id));
                        setPickerOpen(false);
                        setProductSearch("");
                      }}
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-white/10 ${Number(p.id) === Number(form.product_id) ? "bg-white/10 text-[var(--admin-primary)]" : "text-white"}`}
                    >
                      {p.name}
                      <span className="ml-2 text-xs text-white/45">{(p.category || "").toUpperCase()}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
          <span className={hintCls}>
            &quot;Add to Cart&quot;, &quot;View Product&quot;, and the category label always follow this product.
          </span>
        </div>

        {/* Kicker */}
        <div>
          <label className={labelCls}>Eyebrow Label</label>
          <input value={form.kicker} onChange={(e) => setField("kicker", e.target.value)} className={inputCls} placeholder="Premium Selection" />
        </div>

        {/* Title override */}
        <div>
          <label className={labelCls}>Title Override</label>
          <input value={form.title} onChange={(e) => setField("title", e.target.value)} className={inputCls} placeholder={selectedProduct ? selectedProduct.name : "Leave empty to use the product name"} />
          <span className={hintCls}>Leave empty to use the product name.</span>
        </div>

        {/* Description override */}
        <div>
          <label className={labelCls}>Description Override</label>
          <textarea rows={3} value={form.subtitle} onChange={(e) => setField("subtitle", e.target.value)} className={inputCls} placeholder={selectedProduct?.short_desc || "Leave empty to use the product short description"} />
          <span className={hintCls}>Leave empty to use the product short description.</span>
        </div>

        {/* Tags override */}
        <div>
          <label className={labelCls}>Tag Pills Override</label>
          <span className={hintCls}>Leave empty to use the product badges. The product size/variant pill is always appended.</span>
          <div className="mt-3 space-y-2">
            {form.tags.map((tag, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => updateTag(idx, e.target.value)}
                  placeholder={`Tag ${idx + 1}`}
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => removeTag(idx)}
                  className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTag}
              className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
            >
              + Add Tag
            </button>
          </div>
        </div>

        {/* Gradient */}
        <div>
          <label className={labelCls}>Center Circle Gradient (CSS)</label>
          <input value={form.gradient} onChange={(e) => setField("gradient", e.target.value)} className={inputCls} placeholder="radial-gradient(circle, #FCF5E5 0%, #E6C280 100%)" />
          <span className={hintCls}>Optional CSS background for the big circle behind the product image.</span>
        </div>

        {/* Sort & Active */}
        <div className="flex items-center gap-6">
          <div>
            <label className={labelCls}>Order</label>
            <input type="number" min="1" value={form.order_position} onChange={(e) => setField("order_position", Number(e.target.value))} className="w-24 rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white" />
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-white/80 mt-5">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setField("is_active", e.target.checked)} className="h-4 w-4" />
            Show on frontend
          </label>
        </div>

        {/* Submit */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" disabled={saving} className="rounded-lg bg-[var(--admin-primary)] px-5 py-2 text-black hover:bg-[var(--admin-primary-strong)] disabled:opacity-60">
            {saving ? "Saving…" : isEditMode ? "Update Slide" : "Create Slide"}
          </button>
          <button type="button" onClick={() => navigate("/sliders")} className="rounded-lg border border-white/20 px-5 py-2 text-white/90 hover:bg-white/10">
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
