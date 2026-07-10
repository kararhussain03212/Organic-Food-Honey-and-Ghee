import { useCallback, useEffect, useMemo, useState } from "react";
import { getAboutHero, updateAboutHero } from "../../api/aboutApi";
import { uploadImage } from "../../api/uploadApi";
import { getBackendRoot } from "../../api/runtimeApi";
import ImageUpload from "../../components/ImageUpload";

const inputCls = "w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]";
const labelCls = "mb-1 block text-sm text-white/80";
const sectionCls = "rounded-xl border border-white/10 bg-[var(--admin-bg)] p-4 space-y-3";

export default function HeroSectionAdmin() {
  const apiRoot = useMemo(() => getBackendRoot(), []);
  const [form, setForm] = useState({
    badge_text: "", hero_title: "", hero_highlight_text: "",
    hero_subtitle: "", hero_quote: "", hero_background_image: "",
    seo_description: "",
  });
  const [imageFile, setImageFile]     = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving]           = useState(false);
  const [toast, setToast]             = useState("");
  const [error, setError]             = useState("");

  const toImageUrl = useCallback((v) => {
    if (!v) return "";
    if (v.startsWith("http")) return v;
    if (v.startsWith("/uploads/")) return apiRoot + v;
    return v;
  }, [apiRoot]);

  useEffect(() => {
    getAboutHero().then((res) => {
      const d = res?.data?.data || {};
      setForm({
        badge_text: d.badge_text || "", hero_title: d.hero_title || "",
        hero_highlight_text: d.hero_highlight_text || "", hero_subtitle: d.hero_subtitle || "",
        hero_quote: d.hero_quote || "", hero_background_image: d.hero_background_image || "",
        seo_description: d.seo_description || "",
      });
      setImagePreview(toImageUrl(d.hero_background_image || ""));
    }).catch(() => setError("Failed to load hero section."));
  }, [toImageUrl]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      let imgPath = form.hero_background_image;
      if (imageFile) {
        imgPath = await uploadImage(imageFile, "about", imgPath.replace(apiRoot, ""));
      }
      await updateAboutHero({ ...form, hero_background_image: imgPath });
      setToast("Hero section saved!");
    } catch {
      setError("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <header>
        <h2 className="text-3xl font-bold text-white">Hero Section</h2>
        <p className="mt-1 text-sm text-white/65">Edit the About Us page hero banner — badge, title, subtitle, quote and background image.</p>
      </header>

      {toast ? <div className="rounded-xl bg-green-600/80 px-4 py-2.5 text-sm font-medium text-white">{toast}</div> : null}
      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div> : null}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-6">

        {/* SEO */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">SEO</h3>
          <div>
            <label className={labelCls}>SEO Description</label>
            <textarea rows={2} className={inputCls} value={form.seo_description} onChange={(e) => setField("seo_description", e.target.value)} />
          </div>
        </div>

        {/* Quote & Background */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Quote &amp; Background</h3>
          <div>
            <label className={labelCls}>Hero Quote</label>
            <textarea rows={3} className={inputCls} value={form.hero_quote} onChange={(e) => setField("hero_quote", e.target.value)} placeholder="Bringing nature's finest directly to your table…" />
          </div>
          <div>
            <label className={labelCls}>Background Image</label>
            <ImageUpload value={imagePreview} onFileSelect={(f) => setImageFile(f)} label="Upload Hero Background" helperText="Recommended: 1920×1080 or wider" />
          </div>
        </div>

        {/* Page Content */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Page Content</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Badge Text</label>
              <input className={inputCls} value={form.badge_text} onChange={(e) => setField("badge_text", e.target.value)} placeholder="OUR STORY" />
            </div>
            <div>
              <label className={labelCls}>Hero Title</label>
              <input className={inputCls} value={form.hero_title} onChange={(e) => setField("hero_title", e.target.value)} placeholder="About Arion" />
            </div>
            <div>
              <label className={labelCls}>Highlighted Word(s)</label>
              <input className={inputCls} value={form.hero_highlight_text} onChange={(e) => setField("hero_highlight_text", e.target.value)} placeholder="Arion" />
            </div>
            <div>
              <label className={labelCls}>Subtitle</label>
              <input className={inputCls} value={form.hero_subtitle} onChange={(e) => setField("hero_subtitle", e.target.value)} placeholder="Pure, Natural, Authentic" />
            </div>
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
