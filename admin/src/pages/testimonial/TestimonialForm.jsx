import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageUpload from "../../components/ImageUpload";
import {
  createTestimonial,
  getTestimonial,
  updateTestimonial,
} from "../../api/testimonialApi";
import { uploadImage } from "../../api/uploadApi";
import { getBackendRoot } from "../../api/runtimeApi";

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getInitialForm = () => ({
  name: "",
  role: "Verified Customer",
  quote: "",
  rating: 5,
  product: "",
  sort_order: 1,
  is_active: true,
  imageFile: null,
  imagePreview: "",
  imageAltText: "",
});

export default function TestimonialForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(getInitialForm);
  const [slugTouched, setSlugTouched] = useState(false);

  const apiRoot = useMemo(() => getBackendRoot(), []);

  const toImageUrl = useCallback(
    (value) => {
      if (!value) return "";
      if (value.startsWith("http")) return value;
      if (value.startsWith("/uploads/")) return apiRoot + value;
      if (value.startsWith("/")) return apiRoot.replace(/\/backend$/, "") + value;
      return apiRoot + "/uploads/" + value;
    },
    [apiRoot],
  );

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!isEditMode) {
      setForm(getInitialForm());
      setSlugTouched(false);
      setLoading(false);
      setError("");
      return;
    }

    const loadTestimonial = async () => {
      try {
        const res = await getTestimonial(id);
        const item = res?.data?.data || {};

        setForm({
          name:         item.name    || "",
          role:         item.role    || "Verified Customer",
          quote:        item.quote   || "",
          rating:       Number(item.rating     ?? 5),
          product:      item.product || "",
          sort_order:   Number(item.sort_order ?? 1),
          is_active:    item.is_active === 1 || item.is_active === true,
          imageFile:    null,
          imagePreview: toImageUrl(item.avatar || ""),
          imageAltText: item.avatar_alt_text || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load testimonial.");
      } finally {
        setLoading(false);
      }
    };

    loadTestimonial();
  }, [id, isEditMode, toImageUrl]);

  const handleNameChange = (value) => {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }));
  };

  const handleSlugChange = (value) => {
    setSlugTouched(true);
    setField("slug", slugify(value));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) { setError("Customer name is required."); return; }
    if (!form.quote.trim()) { setError("Quote is required."); return; }

    try {
      setSaving(true);

      let avatarUrl = "";
      if (form.imageFile) {
        const oldPath = isEditMode && form.imagePreview ? form.imagePreview.replace(apiRoot, "") : "";
        avatarUrl = await uploadImage(form.imageFile, "testimonials", oldPath);
      } else if (form.imagePreview) {
        avatarUrl = form.imagePreview.replace(apiRoot, "");
      }

      const payload = {
        name:              form.name.trim(),
        role:              form.role.trim()    || "Verified Customer",
        quote:             form.quote.trim(),
        rating:            Number(form.rating  || 5),
        product:           form.product.trim(),
        sort_order:        Number(form.sort_order || 1),
        is_active:         form.is_active ? 1 : 0,
        avatar_alt_text:   form.imageAltText.trim(),
      };

      if (avatarUrl) payload.avatar = avatarUrl;

      if (isEditMode) await updateTestimonial(id, payload);
      else await createTestimonial(payload);

      navigate("/testimonials");
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) {
        setError("Session expired or invalid. Please login again.");
        navigate("/login", { replace: true });
        return;
      }
      setError(err?.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white/70">Loading testimonial...</div>;
  }

  return (
    <section className="mx-auto max-w-4xl">
      <h2 className="mb-4 text-2xl font-bold text-white">
        {isEditMode ? "Edit Testimonial" : "Add Testimonial"}
      </h2>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
          {error}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-6"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-white/80">Customer Name *</label>
            <input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              required
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/80">Role</label>
            <input
              value={form.role}
              onChange={(e) => setField("role", e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/80">Product (referenced)</label>
            <input
              value={form.product}
              onChange={(e) => setField("product", e.target.value)}
              placeholder="e.g. Pure Desi Ghee"
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-white/80">Quote *</label>
          <textarea
            rows={5}
            value={form.quote}
            onChange={(e) => setField("quote", e.target.value)}
            required
            className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-white/80">Rating (0 to 5)</label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.5"
              value={form.rating}
              onChange={(e) => setField("rating", Number(e.target.value))}
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/80">Sort Order</label>
            <input
              type="number"
              min="1"
              value={form.sort_order}
              onChange={(e) => setField("sort_order", Number(e.target.value))}
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-white/85">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setField("is_active", e.target.checked)}
            className="h-4 w-4"
          />
          Show on frontend
        </label>

        <ImageUpload
          value={form.imagePreview}
          altText={form.imageAltText}
          onFileSelect={(file) => setField("imageFile", file)}
          onAltTextChange={(text) => setField("imageAltText", text)}
          label="Upload Avatar"
          helperText="Optional customer photo"
          includeAltText={true}
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[var(--admin-primary)] px-5 py-2 text-black hover:bg-[var(--admin-primary-strong)] disabled:opacity-60"
          >
            {saving ? "Saving..." : isEditMode ? "Update" : "Create"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/testimonials")}
            className="rounded-lg border border-white/20 px-5 py-2 text-white/90 hover:bg-white/10"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
