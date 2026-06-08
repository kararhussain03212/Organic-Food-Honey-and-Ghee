import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createCoreValue, getCoreValues, updateCoreValue } from "../../api/aboutApi";

const inputCls = "w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]";
const labelCls = "mb-1 block text-sm font-medium text-white/80";

const empty = () => ({ value_number: "", icon: "", title: "", description: "", button_text: "", color: "#496348", sort_order: 1, is_active: true });

export default function CoreValueForm() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const isEdit    = Boolean(id);
  const [form, setForm]     = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) { setLoading(false); return; }
    getCoreValues().then((res) => {
      const d = res?.data?.data;
      const item = Array.isArray(d) ? d.find((x) => String(x.id) === String(id)) : null;
      if (item) setForm({ value_number: item.value_number || "", icon: item.icon || "", title: item.title || "", description: item.description || "", button_text: item.button_text || "", color: item.color || "#496348", sort_order: item.sort_order ?? 1, is_active: item.is_active === 1 || item.is_active === true });
    }).catch(() => setError("Failed to load.")).finally(() => setLoading(false));
  }, [id, isEdit]);

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required."); return; }
    setError("");
    setSaving(true);
    try {
      const payload = { ...form, is_active: form.is_active ? 1 : 0 };
      if (isEdit) await updateCoreValue(id, payload);
      else await createCoreValue(payload);
      navigate("/about/core-values");
    } catch {
      setError("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-white/60">Loading…</p>;

  return (
    <section className="mx-auto max-w-2xl">
      <h2 className="mb-4 text-2xl font-bold text-white">{isEdit ? "Edit Core Value" : "Add Core Value"}</h2>
      {error ? <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div> : null}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-6">
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Number</label><input className={inputCls} value={form.value_number} onChange={(e) => setField("value_number", e.target.value)} placeholder="01" /></div>
          <div><label className={labelCls}>Icon (emoji)</label><input className={inputCls} value={form.icon} onChange={(e) => setField("icon", e.target.value)} placeholder="🌿" /></div>
        </div>
        <div><label className={labelCls}>Title *</label><input required className={inputCls} value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="Purity First" /></div>
        <div><label className={labelCls}>Description</label><textarea rows={4} className={inputCls} value={form.description} onChange={(e) => setField("description", e.target.value)} /></div>
        {/* <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Button Text (optional)</label><input className={inputCls} value={form.button_text} onChange={(e) => setField("button_text", e.target.value)} placeholder="Learn More" /></div>
          <div>
            <label className={labelCls}>Accent Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={form.color} onChange={(e) => setField("color", e.target.value)} className="h-9 w-12 cursor-pointer rounded border border-white/20 bg-transparent" />
              <input className={inputCls} value={form.color} onChange={(e) => setField("color", e.target.value)} placeholder="#496348" />
            </div>
          </div>
        </div> */}
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>Sort Order</label><input type="number" min="1" className={inputCls} value={form.sort_order} onChange={(e) => setField("sort_order", Number(e.target.value))} /></div>
          <div className="flex items-end pb-1">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-white/80">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setField("is_active", e.target.checked)} className="h-4 w-4" />
              Show on frontend
            </label>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="rounded-lg bg-[var(--admin-primary)] px-5 py-2 font-semibold text-black hover:bg-[var(--admin-primary-strong)] disabled:opacity-60">{saving ? "Saving…" : isEdit ? "Update" : "Create"}</button>
          <button type="button" onClick={() => navigate("/about/core-values")} className="rounded-lg border border-white/20 px-5 py-2 text-white/90 hover:bg-white/10">Cancel</button>
        </div>
      </form>
    </section>
  );
}
