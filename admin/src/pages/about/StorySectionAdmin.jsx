import { useCallback, useEffect, useMemo, useState } from "react";
import { getAboutStory, updateAboutStory } from "../../api/aboutApi";
import { uploadImage } from "../../api/uploadApi";
import { getBackendRoot } from "../../api/runtimeApi";
import ImageUpload from "../../components/ImageUpload";

const inputCls = "w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]";
const labelCls = "mb-1 block text-sm text-white/80";
const sectionCls = "rounded-xl border border-white/10 bg-[var(--admin-bg)] p-4 space-y-3";

const EMPTY = { section_badge: "", title: "", description_1: "", description_2: "", description_3: "", image_1: "", image_2: "", image_3: "" };

export default function StorySectionAdmin() {
  const apiRoot = useMemo(() => getBackendRoot(), []);
  const [form, setForm]         = useState(EMPTY);
  const [files, setFiles]       = useState({ image_1: null, image_2: null, image_3: null });
  const [previews, setPreviews] = useState({ image_1: "", image_2: "", image_3: "" });
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState("");
  const [error, setError]       = useState("");

  const toImageUrl = useCallback((v) => {
    if (!v) return "";
    if (v.startsWith("http")) return v;
    if (v.startsWith("/uploads/")) return apiRoot + v;
    return v;
  }, [apiRoot]);

  useEffect(() => {
    getAboutStory().then((res) => {
      const d = res?.data?.data || {};
      setForm({
        section_badge: d.section_badge || "", title: d.title || "",
        description_1: d.description_1 || "", description_2: d.description_2 || "",
        description_3: d.description_3 || "", image_1: d.image_1 || "",
        image_2: d.image_2 || "", image_3: d.image_3 || "",
      });
      setPreviews({
        image_1: toImageUrl(d.image_1 || ""),
        image_2: toImageUrl(d.image_2 || ""),
        image_3: toImageUrl(d.image_3 || ""),
      });
    }).catch(() => setError("Failed to load story section."));
  }, [toImageUrl]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const setFile  = (k, f) => setFiles((p) => ({ ...p, [k]: f }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = { ...form };
      for (const key of ["image_1", "image_2", "image_3"]) {
        if (files[key]) {
          payload[key] = await uploadImage(files[key], "about", form[key].replace(apiRoot, ""));
        }
      }
      await updateAboutStory(payload);
      setToast("Story section saved!");
    } catch {
      setError("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <header>
        <h2 className="text-3xl font-bold text-white">Story Section</h2>
        <p className="mt-1 text-sm text-white/65">Edit the "How It All Began" section — badge, title, paragraphs and collage images.</p>
      </header>

      {toast ? <div className="rounded-xl bg-green-600/80 px-4 py-2.5 text-sm font-medium text-white">{toast}</div> : null}
      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div> : null}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-6">

        {/* Section Header */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Section Header</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Badge</label>
              <input className={inputCls} value={form.section_badge} onChange={(e) => setField("section_badge", e.target.value)} placeholder="Our Story" />
            </div>
            <div>
              <label className={labelCls}>Title</label>
              <input className={inputCls} value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="How It All Began" />
            </div>
          </div>
        </div>

        {/* Paragraphs */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Content</h3>
          <div>
            <label className={labelCls}>Paragraph 1</label>
            <textarea rows={3} className={inputCls} value={form.description_1} onChange={(e) => setField("description_1", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Paragraph 2</label>
            <textarea rows={3} className={inputCls} value={form.description_2} onChange={(e) => setField("description_2", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Paragraph 3</label>
            <textarea rows={3} className={inputCls} value={form.description_3} onChange={(e) => setField("description_3", e.target.value)} />
          </div>
        </div>

        {/* Images */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Collage Images</h3>
          <p className="text-xs text-white/40">Three images displayed in a side-by-side collage. Min 600 px wide recommended.</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {["image_1", "image_2", "image_3"].map((key, i) => (
              <div key={key}>
                <label className={labelCls}>Image {i + 1}</label>
                <ImageUpload value={previews[key]} onFileSelect={(f) => setFile(key, f)} label={`Upload Image ${i + 1}`} helperText="Min 600 px wide" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={saving} className="rounded-lg bg-[var(--admin-primary)] px-6 py-2.5 font-semibold text-black hover:bg-[var(--admin-primary-strong)] disabled:opacity-60">
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
