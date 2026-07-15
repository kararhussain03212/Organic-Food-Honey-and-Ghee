import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageUpload from "../../components/ImageUpload";
import { createTeamMember, getTeamMember, updateTeamMember } from "../../api/partnerApi";
import { uploadImage } from "../../api/uploadApi";
import { getBackendRoot } from "../../api/runtimeApi";

const getInitialForm = () => ({
  name: "",
  region: "",
  quote: "",
  whatsapp_number: "",
  sort_order: 1,
  is_active: true,
  imageFile: null,
  imagePreview: "",
});

export default function TeamMemberForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(getInitialForm);

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
      setError("");
      return;
    }

    const loadMember = async () => {
      try {
        const res = await getTeamMember(id);
        const item = res?.data?.data || {};
        setForm({
          name: item.name || "",
          region: item.region || "",
          quote: item.quote || "",
          whatsapp_number: item.whatsapp_number || "",
          sort_order: Number(item.sort_order ?? 1),
          is_active: item.is_active === 1 || item.is_active === true,
          imageFile: null,
          imagePreview: toImageUrl(item.photo || ""),
        });
      } catch {
        setError("Failed to load team member.");
      } finally {
        setLoading(false);
      }
    };

    loadMember();
  }, [id, isEditMode, toImageUrl]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) { setError("Name is required."); return; }
    if (form.whatsapp_number.trim() && !/^[0-9+\-\s()]{7,20}$/.test(form.whatsapp_number.trim())) {
      setError("WhatsApp number looks invalid. Use digits with optional +, e.g. +923001234567.");
      return;
    }

    try {
      setSaving(true);

      let photoUrl = "";
      if (form.imageFile) {
        const oldPath = isEditMode && form.imagePreview ? form.imagePreview.replace(apiRoot, "") : "";
        photoUrl = await uploadImage(form.imageFile, "team", oldPath);
      } else if (form.imagePreview) {
        photoUrl = form.imagePreview.replace(apiRoot, "");
      }

      const payload = {
        name: form.name.trim(),
        region: form.region.trim(),
        quote: form.quote.trim(),
        whatsapp_number: form.whatsapp_number.trim(),
        sort_order: Number(form.sort_order || 1),
        is_active: form.is_active ? 1 : 0,
        photo: photoUrl,
      };

      if (isEditMode) await updateTeamMember(id, payload);
      else await createTeamMember(payload);

      navigate("/team-members");
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      setError(err?.response?.data?.message || err?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white/70">Loading team member…</div>;

  return (
    <section className="mx-auto max-w-4xl">
      <h2 className="mb-4 text-2xl font-bold text-white">
        {isEditMode ? "Edit Team Member" : "Add Team Member"}
      </h2>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-white/80">Name *</label>
            <input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              required
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/80">Region / Location</label>
            <input
              value={form.region}
              onChange={(e) => setField("region", e.target.value)}
              placeholder="e.g. Khyber Pakhtunkhwa"
              className="w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-white/80">WhatsApp Number</label>
            <input
              value={form.whatsapp_number}
              onChange={(e) => setField("whatsapp_number", e.target.value)}
              placeholder="+923001234567"
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

        <div>
          <label className="mb-1 block text-sm text-white/80">Quote</label>
          <textarea
            rows={3}
            value={form.quote}
            onChange={(e) => setField("quote", e.target.value)}
            placeholder="Short quote shown on the card"
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

        <ImageUpload
          value={form.imagePreview}
          onFileSelect={(file) => setField("imageFile", file)}
          label="Upload Photo"
          helperText="Team member photo shown on the card"
          includeAltText={false}
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[var(--admin-primary)] px-5 py-2 text-black hover:bg-[var(--admin-primary-strong)] disabled:opacity-60"
          >
            {saving ? "Saving…" : isEditMode ? "Update" : "Create"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/team-members")}
            className="rounded-lg border border-white/20 px-5 py-2 text-white/90 hover:bg-white/10"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
