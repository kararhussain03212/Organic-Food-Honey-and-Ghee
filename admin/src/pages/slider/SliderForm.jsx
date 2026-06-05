import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageUpload from "../../components/ImageUpload";
import { createSlider, getSlider, updateSlider } from "../../api/sliderApi";
import { uploadImage } from "../../api/uploadApi";
import { getBackendRoot } from "../../api/runtimeApi";

const getInitialForm = () => ({
  kicker: "Arion Organic Food",
  title: "",
  subtitle: "",
  button_text: "Shop Now",
  button_link: "/products",
  secondary_button_text: "Our Story",
  secondary_button_link: "/about",
  sort_order: 1,
  is_active: true,
  media_type: "image",   // "image" | "video"
  imageFile: null,
  imagePreview: "",
  video_url: "",
});

export default function SliderForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [form, setForm]       = useState(getInitialForm);

  const apiRoot = useMemo(() => getBackendRoot(), []);

  const toImageUrl = useCallback((value) => {
    if (!value) return "";
    if (value.startsWith("http")) return value;
    if (value.startsWith("/uploads/")) return apiRoot + value;
    if (value.startsWith("/")) return value;
    return `${apiRoot}/uploads/${value}`;
  }, [apiRoot]);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!isEditMode) { setForm(getInitialForm()); setLoading(false); return; }
    (async () => {
      try {
        const res = await getSlider(id);
        const item = res.data?.data ?? {};
        setForm({
          kicker:                item.kicker               || "Arion Organic Food",
          title:                 item.title                || "",
          subtitle:              item.subtitle             || "",
          button_text:           item.button_text          || "Shop Now",
          button_link:           item.button_link          || "/products",
          secondary_button_text: item.secondary_button_text || "Our Story",
          secondary_button_link: item.secondary_button_link || "/about",
          sort_order:            Number(item.sort_order ?? 1),
          is_active:             item.is_active === 1 || item.is_active === true,
          media_type:            item.video_url ? "video" : "image",
          imageFile:             null,
          imagePreview:          toImageUrl(item.image || ""),
          video_url:             item.video_url || "",
        });
      } catch {
        setError("Failed to load slider.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEditMode, toImageUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (form.media_type === "video" && !form.video_url.trim()) {
      setError("Please enter a video URL."); return;
    }

    try {
      setSaving(true);

      const payload = {
        kicker:                form.kicker.trim() || "Arion Organic Food",
        title:                 form.title.trim(),
        subtitle:              form.subtitle.trim(),
        button_text:           form.button_text.trim() || "Shop Now",
        button_link:           form.button_link.trim() || "/products",
        secondary_button_text: form.secondary_button_text.trim() || "Our Story",
        secondary_button_link: form.secondary_button_link.trim() || "/about",
        sort_order:            Number(form.sort_order || 1),
        is_active:             form.is_active ? 1 : 0,
        video_url:             form.media_type === "video" ? form.video_url.trim() : "",
      };

      if (form.media_type === "image") {
        if (form.imageFile) {
          const oldPath = isEditMode && form.imagePreview ? form.imagePreview.replace(apiRoot, "") : "";
          payload.image = await uploadImage(form.imageFile, "hero", oldPath);
        } else if (form.imagePreview) {
          payload.image = form.imagePreview.replace(apiRoot, "");
        }
      }

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

  if (loading) return <div className="text-white/70">Loading slider…</div>;

  const inputCls = "w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white";
  const labelCls = "mb-1 block text-sm text-white/80";

  return (
    <section className="mx-auto max-w-3xl">
      <h2 className="mb-4 text-2xl font-bold text-white">
        {isEditMode ? "Edit Hero Slide" : "Add Hero Slide"}
      </h2>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-6">

        {/* Kicker */}
        <div>
          <label className={labelCls}>Label / Kicker</label>
          <input value={form.kicker} onChange={(e) => setField("kicker", e.target.value)} className={inputCls} placeholder="Arion Organic Food" />
        </div>

        {/* Title */}
        <div>
          <label className={labelCls}>Title *</label>
          <input value={form.title} onChange={(e) => setField("title", e.target.value)} required className={inputCls} placeholder="Pure by Nature - Proven by Integrity." />
        </div>

        {/* Subtitle */}
        <div>
          <label className={labelCls}>Subtitle</label>
          <textarea rows={3} value={form.subtitle} onChange={(e) => setField("subtitle", e.target.value)} className={inputCls} placeholder="Discover Natural Arion Honey, Ghee, and Shilajit." />
        </div>

        {/* Primary Button */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelCls}>Primary Button Text</label>
            <input value={form.button_text} onChange={(e) => setField("button_text", e.target.value)} className={inputCls} placeholder="Shop Now" />
          </div>
          <div>
            <label className={labelCls}>Primary Button Link</label>
            <input value={form.button_link} onChange={(e) => setField("button_link", e.target.value)} className={inputCls} placeholder="/products" />
          </div>
        </div>

        {/* Secondary Button */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelCls}>Secondary Button Text</label>
            <input value={form.secondary_button_text} onChange={(e) => setField("secondary_button_text", e.target.value)} className={inputCls} placeholder="Our Story" />
          </div>
          <div>
            <label className={labelCls}>Secondary Button Link</label>
            <input value={form.secondary_button_link} onChange={(e) => setField("secondary_button_link", e.target.value)} className={inputCls} placeholder="/about" />
          </div>
        </div>

        {/* Sort & Active */}
        <div className="flex items-center gap-6">
          <div>
            <label className={labelCls}>Sort Order</label>
            <input type="number" min="1" value={form.sort_order} onChange={(e) => setField("sort_order", Number(e.target.value))} className="w-24 rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white" />
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-white/80 mt-5">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setField("is_active", e.target.checked)} className="h-4 w-4" />
            Show on frontend
          </label>
        </div>

        {/* Media type toggle */}
        <div>
          <label className={labelCls}>Background Media</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setField("media_type", "image")}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${form.media_type === "image" ? "border-[var(--admin-primary)] bg-[var(--admin-primary)] text-black" : "border-white/20 text-white/70 hover:border-white/40"}`}
            >
              Image
            </button>
            <button
              type="button"
              onClick={() => setField("media_type", "video")}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${form.media_type === "video" ? "border-[var(--admin-primary)] bg-[var(--admin-primary)] text-black" : "border-white/20 text-white/70 hover:border-white/40"}`}
            >
              Video URL
            </button>
          </div>
        </div>

        {form.media_type === "image" ? (
          <ImageUpload
            value={form.imagePreview}
            onFileSelect={(file) => setField("imageFile", file)}
            label="Upload Slide Image"
            helperText={isEditMode ? "Upload to replace the current background image" : "Optional background image for this slide"}
          />
        ) : (
          <div>
            <label className={labelCls}>Video URL (mp4 or YouTube embed)</label>
            <input
              type="url"
              value={form.video_url}
              onChange={(e) => setField("video_url", e.target.value)}
              placeholder="https://example.com/video.mp4"
              className={inputCls}
            />
            <p className="mt-1 text-xs text-white/40">Use a direct .mp4 link or a YouTube embed URL.</p>
          </div>
        )}

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
