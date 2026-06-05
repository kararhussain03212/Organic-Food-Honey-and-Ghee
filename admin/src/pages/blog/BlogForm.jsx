import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Calendar } from "primereact/calendar";
import { createBlog, getBlog, updateBlog } from "../../api/blogApi";
import ImageUpload from "../../components/ImageUpload";
import RichTextEditor from "../../components/RichTextEditor";
import { uploadImage } from "../../api/uploadApi";
import { getBackendRoot } from "../../api/runtimeApi";

const initialForm = {
  title: "",
  slug: "",
  category: "shilajit-wellness",
  excerpt: "",
  content: "",
  author: "Arion Wellness Team",
  publishedAt: null,
  readTime: null,
  sortOrder: 1,
  isPublished: true,
  imageFile: null,
  imagePreview: "",
};

const decodeHtmlEntities = (value) =>
  String(value ?? "")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'");

const toDateValue = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return null;
  const normalized = raw.replace(" ", "T");
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const toSqlDateTime = (value) => {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return null;
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, "0");
  const d = String(value.getDate()).padStart(2, "0");
  return `${y}-${m}-${d} 00:00:00`;
};

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const apiRoot = useMemo(() => getBackendRoot(), []);

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toImageUrl = useCallback(
    (value) => {
      const raw = String(value || "");
      if (!raw) return "";
      if (raw.startsWith("http")) return raw;
      if (raw.startsWith("/uploads/")) return apiRoot + raw;
      if (raw.startsWith("/")) return raw;
      return apiRoot + "/uploads/" + raw;
    },
    [apiRoot],
  );

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!isEditMode) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const res = await getBlog(id);
        const item = res.data?.data || {};
        setForm({
          title:       decodeHtmlEntities(item.title    || ""),
          slug:        decodeHtmlEntities(item.slug     || ""),
          category:    decodeHtmlEntities(item.category || "shilajit-wellness"),
          excerpt:     decodeHtmlEntities(item.excerpt  || ""),
          content:     decodeHtmlEntities(item.content  || ""),
          author:      decodeHtmlEntities(item.author   || "Arion Wellness Team"),
          publishedAt: toDateValue(item.published_at),
          readTime:    item.read_time ? Number(item.read_time) : null,
          sortOrder:   Number(item.sort_order ?? 1),
          isPublished: item.is_published === 1 || item.is_published === true,
          imageFile:   null,
          imagePreview: toImageUrl(item.image || ""),
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load blog.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, isEditMode, toImageUrl]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.title.trim()) return setError("Title is required.");

    try {
      setSaving(true);
      let imagePath = "";

      if (form.imageFile) {
        const oldPath = isEditMode && form.imagePreview ? form.imagePreview.replace(apiRoot, "") : "";
        imagePath = await uploadImage(form.imageFile, "blogs", oldPath);
      } else if (form.imagePreview) {
        imagePath = form.imagePreview.replace(apiRoot, "");
      }

      const payload = {
        title:        form.title.trim(),
        slug:         form.slug.trim(),
        category:     form.category.trim(),
        excerpt:      form.excerpt.trim(),
        content:      form.content,
        image:        imagePath,
        author:       form.author.trim(),
        published_at: toSqlDateTime(form.publishedAt),
        read_time:    form.readTime ? Number(form.readTime) : null,
        sort_order:   Number(form.sortOrder || 1),
        is_published: form.isPublished ? 1 : 0,
      };

      if (isEditMode) await updateBlog(id, payload);
      else await createBlog(payload);

      navigate("/blogs");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white/70">Loading blog...</div>;

  return (
    <section className="mx-auto max-w-5xl">
      <h2 className="mb-4 text-2xl font-bold text-white">{isEditMode ? "Edit Blog" : "Add Blog"}</h2>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-white/80">Title</label>
            <input value={form.title} onChange={(e) => setField("title", e.target.value)} required className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/80">Slug</label>
            <input value={form.slug} onChange={(e) => setField("slug", e.target.value)} placeholder="auto-generated-if-empty" className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/80">Category</label>
            <input value={form.category} onChange={(e) => setField("category", e.target.value)} className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/80">Author</label>
            <input value={form.author} onChange={(e) => setField("author", e.target.value)} className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/80">Published At</label>
            <Calendar
              value={form.publishedAt}
              onChange={(e) => setField("publishedAt", e.value || null)}
              showIcon
              monthNavigator
              yearNavigator
              yearRange="2000:2100"
              dateFormat="mm/dd/yy"
              panelClassName="admin-calendar-panel"
              placeholder="Select publish date and time"
              className="w-full"
              inputClassName="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-white/80">Excerpt</label>
          <textarea rows={3} value={form.excerpt} onChange={(e) => setField("excerpt", e.target.value)} className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white" />
        </div>

        <RichTextEditor value={form.content} onChange={(value) => setField("content", value)} label="Blog Content (Rich Text)" />

        <ImageUpload
          value={form.imagePreview}
          onFileSelect={(file) => setField("imageFile", file)}
          label="Upload Blog Featured Image"
          helperText="This image will appear in home blog section and blog detail header."
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-white/80">Read Time (minutes)</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={form.readTime || ""}
                onChange={(e) => setField("readTime", e.target.value ? Number(e.target.value) : null)}
                placeholder="Leave empty to calculate from content"
                className="flex-1 rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
              />
              <button
                type="button"
                onClick={() => {
                  const plainText = form.content.replace(/<[^>]*>/g, "").trim();
                  const words = plainText.split(/\s+/).filter(w => w.length > 0).length;
                  const minutes = Math.ceil(words / 200) || 1;
                  setField("readTime", minutes);
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                title="Calculate read time from content"
              >
                Auto
              </button>
            </div>
          </div>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-sm text-white/80">Sort Order</label>
              <input type="number" min="1" value={form.sortOrder} onChange={(e) => setField("sortOrder", Number(e.target.value))} className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white" />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-white/85">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setField("isPublished", e.target.checked)}
                className="h-4 w-4"
              />
              Publish
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="submit" disabled={saving} className="rounded-lg bg-[var(--admin-primary)] px-5 py-2 text-black hover:bg-[var(--admin-primary-strong)] disabled:opacity-60">
            {saving ? "Saving..." : isEditMode ? "Update" : "Create"}
          </button>
          <button type="button" onClick={() => navigate("/blogs")} className="rounded-lg border border-white/20 px-5 py-2 text-white/90 hover:bg-white/10">
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
