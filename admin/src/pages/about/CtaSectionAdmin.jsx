import { useCallback, useEffect, useMemo, useState } from "react";
import { getAboutCta, updateAboutCta } from "../../api/aboutApi";
import { uploadImage } from "../../api/uploadApi";
import { getBackendRoot } from "../../api/runtimeApi";
import ImageUpload from "../../components/ImageUpload";

const inputCls = "w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]";
const labelCls = "mb-1 block text-sm text-white/80";
const sectionCls = "rounded-xl border border-white/10 bg-[var(--admin-bg)] p-4 space-y-3";

export default function CtaSectionAdmin() {
  const apiRoot = useMemo(() => getBackendRoot(), []);
  const [form, setForm] = useState({
    badge_text: "", title: "", subtitle: "",
    button_text: "", button_link: "", background_image: "",
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
    getAboutCta().then((res) => {
      const d = res?.data?.data || {};
      setForm({
        badge_text: d.badge_text || "", title: d.title || "",
        subtitle: d.subtitle || "", button_text: d.button_text || "",
        button_link: d.button_link || "", background_image: d.background_image || "",
      });
      setImagePreview(toImageUrl(d.background_image || ""));
    }).catch(() => setError("Failed to load CTA section."));
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
      let imgPath = form.background_image;
      if (imageFile) {
        imgPath = await uploadImage(imageFile, "about", imgPath.replace(apiRoot, ""));
      }
      await updateAboutCta({ ...form, background_image: imgPath });
      setToast("CTA section saved!");
    } catch {
      setError("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <header>
        <h2 className="text-3xl font-bold text-white">CTA Section</h2>
        <p className="mt-1 text-sm text-white/65">Edit the call-to-action banner at the bottom of the About Us page.</p>
      </header>

      {toast ? <div className="rounded-xl bg-green-600/80 px-4 py-2.5 text-sm font-medium text-white">{toast}</div> : null}
      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div> : null}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-6">

        {/* CTA Text */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">CTA Content</h3>
          <div>
            <label className={labelCls}>Badge Text</label>
            <input className={inputCls} value={form.badge_text} onChange={(e) => setField("badge_text", e.target.value)} placeholder="Join The Arion Family" />
          </div>
          <div>
            <label className={labelCls}>Title</label>
            <input className={inputCls} value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="Experience The Arion Difference" />
          </div>
          <div>
            <label className={labelCls}>Subtitle</label>
            <textarea rows={2} className={inputCls} value={form.subtitle} onChange={(e) => setField("subtitle", e.target.value)} placeholder="Pure ingredients. Honest sourcing. Real wellness." />
          </div>
        </div>

        {/* Button */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Button</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Button Text</label>
              <input className={inputCls} value={form.button_text} onChange={(e) => setField("button_text", e.target.value)} placeholder="Explore Our Products" />
            </div>
            <div>
              <label className={labelCls}>Button Link</label>
              <input className={inputCls} value={form.button_link} onChange={(e) => setField("button_link", e.target.value)} placeholder="/products" />
            </div>
          </div>
        </div>

        {/* Background */}
        {/* <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Background Image</h3>
          <p className="text-xs text-white/40">Optional full-width background image for the CTA banner.</p>
          <ImageUpload
            value={imagePreview}
            onFileSelect={(f) => setImageFile(f)}
            label="Upload CTA Background"
            helperText="Recommended: 1920×600 or wider"
          />
        </div> */}

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={saving} className="rounded-lg bg-[var(--admin-primary)] px-6 py-2.5 font-semibold text-black hover:bg-[var(--admin-primary-strong)] disabled:opacity-60">
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
