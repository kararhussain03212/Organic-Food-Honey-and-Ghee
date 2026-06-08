import { useEffect, useState } from "react";
import { getAboutMission, updateAboutMission } from "../../api/aboutApi";

const inputCls = "w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]";
const labelCls = "mb-1 block text-sm text-white/80";
const sectionCls = "rounded-xl border border-white/10 bg-[var(--admin-bg)] p-4 space-y-3";

export default function MissionSectionAdmin() {
  const [form, setForm]     = useState({ badge: "", title: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [toast, setToast]   = useState("");
  const [error, setError]   = useState("");

  useEffect(() => {
    getAboutMission().then((res) => {
      const d = res?.data?.data || {};
      setForm({ badge: d.badge || "", title: d.title || "", description: d.description || "" });
    }).catch(() => setError("Failed to load mission section."));
  }, []);

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
      await updateAboutMission(form);
      setToast("Mission section saved!");
    } catch {
      setError("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <header>
        <h2 className="text-3xl font-bold text-white">Mission Section</h2>
        <p className="mt-1 text-sm text-white/65">Edit the "Our Core Mission" intro — badge, heading and supporting description.</p>
      </header>

      {toast ? <div className="rounded-xl bg-green-600/80 px-4 py-2.5 text-sm font-medium text-white">{toast}</div> : null}
      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div> : null}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-6">

        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Mission Content</h3>
          <div>
            <label className={labelCls}>Badge</label>
            <input className={inputCls} value={form.badge} onChange={(e) => setField("badge", e.target.value)} placeholder="✦ What We Stand For" />
          </div>
          <div>
            <label className={labelCls}>Title</label>
            <input className={inputCls} value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="Our Core Mission" />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea rows={4} className={inputCls} value={form.description} onChange={(e) => setField("description", e.target.value)} placeholder="Every decision we make is guided by four uncompromising principles…" />
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
