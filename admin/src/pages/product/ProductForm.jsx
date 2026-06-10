import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageUpload from "../../components/ImageUpload";
import RichTextEditor from "../../components/RichTextEditor";
import { createProduct, getProduct, updateProduct } from "../../api/productApi";
import { uploadImage } from "../../api/uploadApi";
import { getBackendRoot } from "../../api/runtimeApi";

const CATEGORIES = ["ghee", "honey", "herbal"];
const BADGE_OPTIONS = ["Best Seller", "Organic", "Pure", "Limited Stock", "Premium Quality", "Gold Grade", "Trial Size", "New"];

function parseJson(value, fallback) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return value;
  if (typeof value === "string" && value.trim()) {
    try { return JSON.parse(value); } catch { return fallback; }
  }
  return fallback;
}

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const getInitialForm = () => ({
  name: "", slug: "", subtitle: "", category: "ghee", size: "",
  price: "", original_price: "", discount: "", rating: "5", reviews: "0",
  stock: true, featured: false,
  variants: [""],
  variant_prices: {},
  variant_original_prices: {},
  images: [],
  imageFiles: [],
  imageAltTexts: [],
  badges: [],
  short_desc: "",
  description: "",
  benefits: [""],
  ingredients: "",
  how_to_use: [{ step: "01", text: "" }],
  faqs: [{ q: "", a: "" }],
  tags: "",
  sort_order: 0,
  is_active: true,
});

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading]   = useState(isEditMode);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [form, setForm]         = useState(getInitialForm);

  const apiRoot = useMemo(() => getBackendRoot(), []);

  const toImageUrl = useCallback((v) => {
    if (!v) return "";
    if (v.startsWith("http")) return v;
    if (v.startsWith("/uploads/")) return apiRoot + v;
    if (v.startsWith("/")) return v;
    return `${apiRoot}/uploads/${v}`;
  }, [apiRoot]);

  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  useEffect(() => {
    if (!isEditMode) { setForm(getInitialForm()); setLoading(false); return; }
    (async () => {
      try {
        const res = await getProduct(id);
        const item = res?.data?.data ?? res?.data ?? {};
        const variants    = parseJson(item.variants,    []);
        const vPrices     = parseJson(item.variant_prices, {});
        const vOrigPrices = parseJson(item.variant_original_prices, {});
        const images      = parseJson(item.images, []);
        const badges      = parseJson(item.badges, []);
        const benefits    = parseJson(item.benefits, [""]);
        const howToUse    = parseJson(item.how_to_use, [{ step: "01", text: "" }]);
        const faqs        = parseJson(item.faqs, [{ q: "", a: "" }]);
        const tags        = parseJson(item.tags, []);

        const imageAltTexts = Array.isArray(images) ? images.map(img => {
          if (typeof img === 'object' && img?.alt_text) return img.alt_text;
          return '';
        }) : [];
        const imageUrls = Array.isArray(images) ? images.map(img => {
          if (typeof img === 'object' && img?.url) return toImageUrl(img.url);
          return toImageUrl(img);
        }) : [];

        setForm({
          name:                   item.name         || "",
          slug:                   item.slug         || "",
          subtitle:               item.subtitle     || "",
          category:               item.category     || "ghee",
          size:                   item.size         || "",
          price:                  item.price        != null ? String(item.price) : "",
          original_price:         item.original_price != null ? String(item.original_price) : "",
          discount:               item.discount     != null ? String(item.discount) : "",
          rating:                 item.rating       != null ? String(item.rating) : "5",
          reviews:                item.reviews      != null ? String(item.reviews) : "0",
          stock:                  item.stock === 1  || item.stock === true,
          featured:               item.featured === 1 || item.featured === true,
          variants:               variants.length   ? variants : [""],
          variant_prices:         vPrices,
          variant_original_prices: vOrigPrices,
          images:                 imageUrls,
          imageAltTexts:          imageAltTexts,
          imageFiles:             [],
          badges,
          short_desc:             item.short_desc   || "",
          description:            item.description  || "",
          benefits:               benefits.length   ? benefits : [""],
          ingredients:            item.ingredients  || "",
          how_to_use:             howToUse.length   ? howToUse : [{ step: "01", text: "" }],
          faqs:                   faqs.length       ? faqs     : [{ q: "", a: "" }],
          tags:                   Array.isArray(tags) ? tags.join(", ") : tags,
          sort_order:             Number(item.sort_order || 0),
          is_active:              item.is_active === 1 || item.is_active !== false,
        });
      } catch { setError("Failed to load product."); }
      finally { setLoading(false); }
    })();
  }, [id, isEditMode, toImageUrl]);

  // Auto-calculate discount percentage when price or original_price changes
  useEffect(() => {
    const price = Number(form.price || 0);
    const originalPrice = Number(form.original_price || 0);

    if (price > 0 && originalPrice > price) {
      const calculatedDiscount = Math.round(((originalPrice - price) / originalPrice) * 100);
      setField("discount", String(calculatedDiscount));
    }
  }, [form.price, form.original_price]);

  const handleNameChange = (val) => {
    setField("name", val);
    if (!isEditMode || !form.slug) setField("slug", slugify(val));
  };

  const handleVariantChange = (i, val) => {
    const updated = [...form.variants];
    updated[i] = val;
    setField("variants", updated);
  };

  const handleImageSelect = (file) => {
    const blobUrl = URL.createObjectURL(file);
    setForm((p) => ({
      ...p,
      images: [...p.images, blobUrl],
      imageFiles: [...p.imageFiles, file],
      imageAltTexts: [...p.imageAltTexts, ""],
    }));
  };

  const handleRemoveImage = (i) => {
    const url = form.images[i];
    if (url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
      const blobsBefore = form.images.slice(0, i).filter((u) => u.startsWith("blob:")).length;
      setForm((p) => ({
        ...p,
        images: p.images.filter((_, j) => j !== i),
        imageFiles: p.imageFiles.filter((_, j) => j !== blobsBefore),
        imageAltTexts: p.imageAltTexts.filter((_, j) => j !== i),
      }));
    } else {
      setForm((p) => ({
        ...p,
        images: p.images.filter((_, j) => j !== i),
        imageAltTexts: p.imageAltTexts.filter((_, j) => j !== i),
      }));
    }
  };

  const handleImageAltTextChange = (i, altText) => {
    setForm((p) => ({
      ...p,
      imageAltTexts: p.imageAltTexts.map((text, j) => j === i ? altText : text),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) { setError("Product name is required."); return; }
    if (!form.price)       { setError("Price is required."); return; }

    try {
      setSaving(true);

      // Upload new files; keep existing server URLs as-is, and bundle with alt text
      let fileIdx = 0;
      const uploadedImages = [];
      for (let i = 0; i < form.images.length; i++) {
        const url = form.images[i];
        const altText = form.imageAltTexts[i] || "";
        if (url.startsWith("blob:")) {
          const serverUrl = await uploadImage(form.imageFiles[fileIdx++], "products", "");
          uploadedImages.push({ url: serverUrl, alt_text: altText });
          URL.revokeObjectURL(url);
        } else {
          uploadedImages.push({ url, alt_text: altText });
        }
      }

      const variantArr = form.variants.filter((v) => v.trim());

      const payload = {
        name:          form.name.trim(),
        slug:          form.slug.trim() || slugify(form.name),
        subtitle:      form.subtitle.trim(),
        category:      form.category,
        size:          form.size.trim(),
        price:         Number(form.price || 0),
        original_price: form.original_price === "" ? null : Number(form.original_price),
        discount:      form.discount === "" ? null : Number(form.discount),
        rating:        Number(form.rating || 5),
        reviews:       Number(form.reviews || 0),
        stock:         form.stock ? 1 : 0,
        featured:      form.featured ? 1 : 0,
        variants:      JSON.stringify(variantArr),
        variant_prices:           JSON.stringify(form.variant_prices),
        variant_original_prices:  JSON.stringify(form.variant_original_prices),
        images:        JSON.stringify(uploadedImages),
        badges:        JSON.stringify(form.badges),
        short_desc:    form.short_desc.trim(),
        description:   form.description.trim(),
        benefits:      JSON.stringify(form.benefits.filter((b) => b.trim())),
        ingredients:   form.ingredients.trim(),
        how_to_use:    JSON.stringify(form.how_to_use.filter((h) => h.text.trim())),
        faqs:          JSON.stringify(form.faqs.filter((f) => f.q.trim())),
        tags:          JSON.stringify(form.tags.split(",").map((t) => t.trim()).filter(Boolean)),
        sort_order:    Number(form.sort_order || 0),
        is_active:     form.is_active ? 1 : 0,
      };

      if (isEditMode) await updateProduct(id, payload);
      else await createProduct(payload);

      navigate("/products");
    } catch (err) {
      if (err?.response?.status === 401) { navigate("/login", { replace: true }); return; }
      setError(err?.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white/70">Loading product…</div>;

  const inputCls = "w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white";
  const labelCls = "mb-1 block text-sm text-white/80";
  const sectionCls = "rounded-xl border border-white/10 bg-[var(--admin-bg)] p-4 space-y-3";

  return (
    <section className="mx-auto max-w-4xl">
      <h2 className="mb-4 text-2xl font-bold text-white">
        {isEditMode ? "Edit Product" : "Add Product"}
      </h2>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-6">

        {/* ── Basic Info ── */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Basic Info</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelCls}>Name *</label>
              <input value={form.name} onChange={(e) => handleNameChange(e.target.value)} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Slug</label>
              <input value={form.slug} onChange={(e) => setField("slug", e.target.value)} placeholder="auto-generated" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Subtitle</label>
              <input value={form.subtitle} onChange={(e) => setField("subtitle", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select value={form.category} onChange={(e) => setField("category", e.target.value)} className={inputCls}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Size</label>
              <input value={form.size} onChange={(e) => setField("size", e.target.value)} placeholder="500g" className={inputCls} />
            </div>
          </div>
        </div>

        {/* ── Pricing ── */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Pricing</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <label className={labelCls}>Price (Rs) *</label>
              <input type="number" min="0" value={form.price} onChange={(e) => setField("price", e.target.value)} required className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Original Price (Rs)</label>
              <input type="number" min="0" value={form.original_price} onChange={(e) => setField("original_price", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Discount (%)</label>
              <input type="number" min="0" max="100" value={form.discount} onChange={(e) => setField("discount", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Rating</label>
              <input type="number" min="1" max="5" step="0.1" value={form.rating} onChange={(e) => setField("rating", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Reviews Count</label>
              <input type="number" min="0" value={form.reviews} onChange={(e) => setField("reviews", e.target.value)} className={inputCls} />
            </div>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
              <input type="checkbox" checked={form.stock} onChange={(e) => setField("stock", e.target.checked)} className="h-4 w-4" />
              In Stock
            </label>
            <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setField("featured", e.target.checked)} className="h-4 w-4" />
              Featured Product
            </label>
          </div>
        </div>

        {/* ── Variants ── */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Variants (sizes / options)</h3>
          <p className="text-xs text-white/50">Add each variant label (e.g. 500g, 1kg). Set per-variant prices below.</p>
          {form.variants.map((v, i) => (
            <div key={i} className="flex gap-2">
              <input value={v} onChange={(e) => handleVariantChange(i, e.target.value)} placeholder="e.g. 500g" className={`${inputCls} flex-1`} />
              <input
                type="number" min="0"
                value={form.variant_prices[v] ?? ""}
                onChange={(e) => setField("variant_prices", { ...form.variant_prices, [v]: e.target.value })}
                placeholder="Price"
                className="w-28 rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
              />
              <input
                type="number" min="0"
                value={form.variant_original_prices[v] ?? ""}
                onChange={(e) => setField("variant_original_prices", { ...form.variant_original_prices, [v]: e.target.value })}
                placeholder="Orig. Price"
                className="w-32 rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
              />
              <button type="button" onClick={() => setField("variants", form.variants.filter((_, j) => j !== i))} className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-300 text-sm">✕</button>
            </div>
          ))}
          <button type="button" onClick={() => setField("variants", [...form.variants, ""])} className="rounded-lg border border-[var(--admin-border-amber)] bg-[var(--admin-primary)]/15 px-3 py-2 text-sm font-semibold text-[var(--admin-primary)]">+ Add Variant</button>
        </div>

        {/* ── Images ── */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Product Images</h3>

          {form.images.length > 0 && (
            <div className="space-y-4">
              {form.images.map((url, i) => (
                <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-white/70">Image #{i + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="rounded-lg bg-red-500/20 px-2 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/30"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="group relative mb-3 aspect-square overflow-hidden rounded-lg border border-white/10">
                    <img
                      src={url}
                      alt={form.imageAltTexts[i] || "Product image"}
                      className="h-full w-full object-cover"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    {url.startsWith("blob:") && (
                      <span className="absolute bottom-0 left-0 right-0 bg-black/60 py-0.5 text-center text-[10px] font-semibold text-amber-400">
                        New — not saved yet
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Alt Text (SEO & Accessibility)
                    </label>
                    <input
                      type="text"
                      value={form.imageAltTexts[i] || ""}
                      onChange={(e) => handleImageAltTextChange(i, e.target.value)}
                      placeholder="Describe this image for accessibility..."
                      maxLength="150"
                      className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/40 focus:border-[var(--admin-primary)] focus:outline-none"
                    />
                    <p className="mt-1 text-[10px] text-white/50">
                      {form.imageAltTexts[i]?.length || 0}/150 characters
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <ImageUpload
            value=""
            onFileSelect={handleImageSelect}
            label="Upload Product Image"
            helperText="PNG, JPG — upload one at a time, add as many as needed"
          />
        </div>

        {/* ── Badges ── */}
        {/* <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Badges</h3>
          <div className="flex flex-wrap gap-2">
            {BADGE_OPTIONS.map((b) => (
              <label key={b} className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${form.badges.includes(b) ? "border-[var(--admin-border-amber)] bg-[var(--admin-primary)] text-black" : "border-white/20 text-white/70 hover:border-white/40"}`}>
                <input type="checkbox" className="sr-only" checked={form.badges.includes(b)} onChange={(e) => setField("badges", e.target.checked ? [...form.badges, b] : form.badges.filter((x) => x !== b))} />
                {b}
              </label>
            ))}
          </div>
        </div> */}

        {/* ── Description ── */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Content</h3>
          <div>
            <label className={labelCls}>Short Description</label>
            <textarea rows={2} value={form.short_desc} onChange={(e) => setField("short_desc", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Full Description</label>
            <RichTextEditor value={form.description} onChange={(v) => setField("description", v)} />
          </div>
          <div>
            <label className={labelCls}>Ingredients</label>
            <textarea rows={2} value={form.ingredients} onChange={(e) => setField("ingredients", e.target.value)} className={inputCls} />
          </div>
        </div>

        {/* ── Benefits ── */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Benefits</h3>
          {form.benefits.map((b, i) => (
            <div key={i} className="flex gap-2">
              <input value={b} onChange={(e) => { const u = [...form.benefits]; u[i] = e.target.value; setField("benefits", u); }} placeholder="Benefit…" className={`${inputCls} flex-1`} />
              <button type="button" onClick={() => setField("benefits", form.benefits.filter((_, j) => j !== i))} className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-300 text-sm">✕</button>
            </div>
          ))}
          <button type="button" onClick={() => setField("benefits", [...form.benefits, ""])} className="rounded-lg border border-[var(--admin-border-amber)] bg-[var(--admin-primary)]/15 px-3 py-2 text-sm font-semibold text-[var(--admin-primary)]">+ Add Benefit</button>
        </div>

        {/* ── How To Use ── */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">How To Use</h3>
          {form.how_to_use.map((h, i) => (
            <div key={i} className="flex gap-2">
              <input value={h.step} onChange={(e) => { const u = [...form.how_to_use]; u[i] = { ...u[i], step: e.target.value }; setField("how_to_use", u); }} placeholder="01" className="w-16 rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white" />
              <input value={h.text} onChange={(e) => { const u = [...form.how_to_use]; u[i] = { ...u[i], text: e.target.value }; setField("how_to_use", u); }} placeholder="Step description…" className={`${inputCls} flex-1`} />
              <button type="button" onClick={() => setField("how_to_use", form.how_to_use.filter((_, j) => j !== i))} className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-300 text-sm">✕</button>
            </div>
          ))}
          <button type="button" onClick={() => setField("how_to_use", [...form.how_to_use, { step: String(form.how_to_use.length + 1).padStart(2, "0"), text: "" }])} className="rounded-lg border border-[var(--admin-border-amber)] bg-[var(--admin-primary)]/15 px-3 py-2 text-sm font-semibold text-[var(--admin-primary)]">+ Add Step</button>
        </div>

        {/* ── FAQs ── */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">FAQs</h3>
          {form.faqs.map((f, i) => (
            <div key={i} className="space-y-1.5 rounded-lg border border-white/10 p-3">
              <input value={f.q} onChange={(e) => { const u = [...form.faqs]; u[i] = { ...u[i], q: e.target.value }; setField("faqs", u); }} placeholder="Question…" className={inputCls} />
              <textarea rows={2} value={f.a} onChange={(e) => { const u = [...form.faqs]; u[i] = { ...u[i], a: e.target.value }; setField("faqs", u); }} placeholder="Answer…" className={inputCls} />
              <button type="button" onClick={() => setField("faqs", form.faqs.filter((_, j) => j !== i))} className="text-xs text-red-400">Remove FAQ</button>
            </div>
          ))}
          <button type="button" onClick={() => setField("faqs", [...form.faqs, { q: "", a: "" }])} className="rounded-lg border border-[var(--admin-border-amber)] bg-[var(--admin-primary)]/15 px-3 py-2 text-sm font-semibold text-[var(--admin-primary)]">+ Add FAQ</button>
        </div>

        {/* ── Tags & Sort ── */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Tags & Visibility</h3>
          <div>
            <label className={labelCls}>Tags (comma-separated)</label>
            <input value={form.tags} onChange={(e) => setField("tags", e.target.value)} placeholder="ghee, organic, desi, 500g" className={inputCls} />
          </div>
          <div className="flex gap-4 items-center flex-wrap">
            <div>
              <label className={labelCls}>Sort Order</label>
              <input type="number" min="0" value={form.sort_order} onChange={(e) => setField("sort_order", Number(e.target.value))} className="w-24 rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white" />
            </div>
            <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer mt-5">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setField("is_active", e.target.checked)} className="h-4 w-4" />
              Active (visible on frontend)
            </label>
          </div>
        </div>

        {/* ── Submit ── */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" disabled={saving} className="rounded-lg bg-[var(--admin-primary)] px-5 py-2 text-black hover:bg-[var(--admin-primary-strong)] disabled:opacity-60">
            {saving ? "Saving…" : isEditMode ? "Update Product" : "Create Product"}
          </button>
          <button type="button" onClick={() => navigate("/products")} className="rounded-lg border border-white/20 px-5 py-2 text-white/90 hover:bg-white/10">
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
