import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageUpload from "../../components/ImageUpload";
import { createCommitmentItem, getCommitmentItem, updateCommitmentItem } from "../../api/commitmentApi";
import { uploadImage } from "../../api/uploadApi";
import { getBackendRoot } from "../../api/runtimeApi";
import { CommitmentIcon, ICON_OPTIONS } from "../../data/commitmentIcons";

const getInitialForm = () => ({
  icon: "",
  tag: "",
  title: "",
  description: "",
  sort_order: 1,
  is_active: true,
  iconFile: null,
  iconPreview: "",
  iconAltText: "",
});

export default function CommitmentItemForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading]   = useState(isEditMode);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState("");
  const [form, setForm]         = useState(getInitialForm);

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

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!isEditMode) {
      setForm(getInitialForm());
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const res = await getCommitmentItem(id);
        const item = res?.data?.data || {};
        setForm({
          icon:         item.icon         || "",
          tag:          item.tag          || "",
          title:        item.title        || "",
          description:  item.description  || "",
          sort_order:   Number(item.sort_order ?? 1),
          is_active:    item.is_active === 1 || item.is_active === true,
          iconFile:     null,
          iconPreview:  toImageUrl(item.icon_url || ""),
          iconAltText:  item.icon_alt_text || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load item.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, isEditMode, toImageUrl]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.title.trim()) { setError("Title is required."); return; }

    try {
      setSaving(true);

      let iconUrl = "";
      if (form.iconFile) {
        const oldPath = isEditMode && form.iconPreview ? form.iconPreview.replace(apiRoot, "") : "";
        iconUrl = await uploadImage(form.iconFile, "icons", oldPath);
      } else if (form.iconPreview) {
        iconUrl = form.iconPreview.replace(apiRoot, "");
      }

      const payload = {
        icon:            form.icon.trim(),
        tag:             form.tag.trim(),
        title:           form.title.trim(),
        description:     form.description.trim(),
        sort_order:      Number(form.sort_order || 1),
        is_active:       form.is_active ? 1 : 0,
        icon_alt_text:   form.iconAltText.trim(),
      };

      if (iconUrl) payload.icon_url = iconUrl;

      if (isEditMode) await updateCommitmentItem(id, payload);
      else await createCommitmentItem(payload);

      navigate("/commitment");
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) {
        setError("Session expired. Please login again.");
        navigate("/login", { replace: true });
        return;
      }
      setError(err?.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white/70">Loading...</div>;

  return (
    <section className="mx-auto max-w-4xl">
      <h2 className="mb-4 text-2xl font-bold text-white">
        {isEditMode ? "Edit Commitment Item" : "Add Commitment Item"}
      </h2>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-6">

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-white/80">Title *</label>
            <input
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              required
              placeholder="e.g. Naturally Sourced Quality"
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/80">Badge / Tag</label>
            <input
              value={form.tag}
              onChange={(e) => setField("tag", e.target.value)}
              placeholder="e.g. 100% Natural"
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-white/80">Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Short description for this commitment card..."
            className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/80">Icon</label>
          <p className="mb-3 text-xs text-white/40">Choose an icon for this card. Overridden by an uploaded image below.</p>
          <div className="flex flex-wrap gap-2">
            {ICON_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setField("icon", opt.key)}
                title={opt.label}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-colors ${
                  form.icon === opt.key
                    ? "border-[var(--admin-primary)] bg-[var(--admin-primary)]/15 text-[var(--admin-primary)]"
                    : "border-white/15 bg-white/5 text-white/60 hover:border-white/30 hover:text-white"
                }`}
              >
                <CommitmentIcon name={opt.key} size={22} color={form.icon === opt.key ? "var(--admin-primary)" : "currentColor"} />
                <span className="text-[10px] leading-none">{opt.label}</span>
              </button>
            ))}
          </div>
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

        <label className="flex cursor-pointer items-center gap-2 text-sm text-white/85">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setField("is_active", e.target.checked)}
            className="h-4 w-4"
          />
          Show on frontend
        </label>

        <div>
          <p className="mb-2 text-sm font-semibold text-white/80">Icon Image Upload</p>
          <p className="mb-2 text-xs text-white/40">Upload an image icon. This overrides the emoji icon above.</p>
          <ImageUpload
            value={form.iconPreview}
            altText={form.iconAltText}
            onFileSelect={(file) => setField("iconFile", file)}
            onAltTextChange={(text) => setField("iconAltText", text)}
            label="Upload Icon Image"
            helperText="PNG, JPG, SVG — shown as the card icon (overrides emoji)"
            includeAltText={true}
          />
        </div>

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
            onClick={() => navigate("/commitment")}
            className="rounded-lg border border-white/20 px-5 py-2 text-white/90 hover:bg-white/10"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
