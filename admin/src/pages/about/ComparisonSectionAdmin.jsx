import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAboutComparison, updateAboutComparison,
  getComparisonCards, createComparisonCard, updateComparisonCard, deleteComparisonCard,
} from "../../api/aboutApi";

const inputCls = "w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]";
const labelCls = "mb-1 block text-sm text-white/80";
const sectionCls = "rounded-xl border border-white/10 bg-[var(--admin-bg)] p-4 space-y-3";

const emptyCard = () => ({ comparison_type: "traditional", icon: "", title: "", point_1: "", point_2: "", point_3: "", point_4: "", sort_order: 1, is_active: true });

function CardModal({ card, onClose, onSave }) {
  const [form, setForm]     = useState(card || emptyCard());
  const [saving, setSaving] = useState(false);
  const setField = (k, v)   => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); onClose(); } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[var(--admin-card)] p-6 shadow-2xl">
        <h3 className="mb-4 text-xl font-bold text-white">{card?.id ? "Edit Card" : "Add Card"}</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Type</label>
              <select className={inputCls} value={form.comparison_type} onChange={(e) => setField("comparison_type", e.target.value)}>
                <option value="traditional">Traditional</option>
                <option value="modern">Modern</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Icon (emoji)</label>
              <input className={inputCls} value={form.icon} onChange={(e) => setField("icon", e.target.value)} placeholder="🌿" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Title *</label>
            <input required className={inputCls} value={form.title} onChange={(e) => setField("title", e.target.value)} />
          </div>
          {["point_1", "point_2", "point_3", "point_4"].map((k, i) => (
            <div key={k}>
              <label className={labelCls}>Point {i + 1}</label>
              <input className={inputCls} value={form[k]} onChange={(e) => setField(k, e.target.value)} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Sort Order</label>
              <input type="number" min="1" className={inputCls} value={form.sort_order} onChange={(e) => setField("sort_order", Number(e.target.value))} />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-white/80">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setField("is_active", e.target.checked)} className="h-4 w-4" />
                Active
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-lg bg-[var(--admin-primary)] px-4 py-2 text-sm font-semibold text-black disabled:opacity-60">
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ComparisonSectionAdmin() {
  const navigate = useNavigate();
  const [header, setHeader]   = useState({ section_title: "", section_subtitle: "" });
  const [cards, setCards]     = useState([]);
  const [modal, setModal]     = useState(null);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState("");
  const [error, setError]     = useState("");

  useEffect(() => {
    Promise.all([getAboutComparison(), getComparisonCards()]).then(([hRes, cRes]) => {
      const h = hRes?.data?.data || {};
      setHeader({ section_title: h.section_title || "", section_subtitle: h.section_subtitle || "" });
      const d = cRes?.data?.data;
      setCards(Array.isArray(d) ? d : []);
    }).catch(() => setError("Failed to load."));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const saveHeader = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await updateAboutComparison(header); setToast("Header saved!"); }
    catch { setError("Save failed."); }
    finally { setSaving(false); }
  };

  const handleSaveCard = async (form) => {
    const payload = { ...form, is_active: form.is_active ? 1 : 0 };
    if (form.id) {
      const { data } = await updateComparisonCard(form.id, payload);
      setCards((p) => p.map((x) => (x.id === data?.data?.id ? data.data : x)));
    } else {
      const { data } = await createComparisonCard(payload);
      if (data?.data) setCards((p) => [...p, data.data]);
    }
    setToast("Card saved!");
  };

  const handleDeleteCard = async (id) => {
    if (!window.confirm("Delete this card?")) return;
    try { await deleteComparisonCard(id); setCards((p) => p.filter((x) => x.id !== id)); }
    catch { setError("Delete failed."); }
  };

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Comparison Section</h2>
          <p className="text-sm text-white/65">Edit the section header and manage Traditional vs Modern comparison cards.</p>
        </div>
      </header>

      {toast ? (
        <div className="rounded-xl bg-green-600/80 px-4 py-2.5 text-sm font-medium text-white">{toast}</div>
      ) : null}
      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
      ) : null}

      {/* Section Header */}
      <form onSubmit={saveHeader} className="space-y-4 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-6">
        <h3 className="font-semibold text-white/90">Section Header</h3>
        <div className={sectionCls}>
          <div>
            <label className={labelCls}>Section Title</label>
            <input className={inputCls} value={header.section_title} onChange={(e) => setHeader((p) => ({ ...p, section_title: e.target.value }))} placeholder="The Arion Difference" />
          </div>
          <div>
            <label className={labelCls}>Section Subtitle</label>
            <input className={inputCls} value={header.section_subtitle} onChange={(e) => setHeader((p) => ({ ...p, section_subtitle: e.target.value }))} placeholder="Where ancient wisdom meets modern science." />
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="rounded-lg bg-[var(--admin-primary)] px-5 py-2 font-semibold text-black hover:bg-[var(--admin-primary-strong)] disabled:opacity-60">
            {saving ? "Saving…" : "Save Header"}
          </button>
        </div>
      </form>

      {/* Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Comparison Cards</h3>
            <p className="text-sm text-white/65">Traditional and Modern panels shown side by side.</p>
          </div>
          <button
            type="button"
            onClick={() => setModal("new")}
            className="inline-flex w-fit rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 font-semibold text-black hover:bg-[var(--admin-primary-strong)]"
          >
            + Add Card
          </button>
        </div>

        {cards.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[var(--admin-bg)] p-6 text-white/70">No cards yet. Add your first card.</div>
        ) : (
          <div className="grid gap-4">
            {cards.map((card) => (
              <article key={card.id} className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--admin-bg)]">
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--admin-card-elevated)] text-2xl">
                        {card.icon || "●"}
                      </div>
                      <div>
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${card.comparison_type === "modern" ? "bg-blue-500/20 text-blue-300" : "bg-[var(--admin-primary)]/20 text-[var(--admin-primary)]"}`}>
                            {card.comparison_type}
                          </span>
                          <h3 className="text-xl font-bold text-white">{card.title}</h3>
                        </div>
                        <p className="text-sm text-white/65 line-clamp-1">
                          {[card.point_1, card.point_2, card.point_3].filter(Boolean).join(" · ")}
                        </p>
                        <div className="mt-2 text-xs text-white/40">Sort: {card.sort_order ?? 0}</div>
                      </div>
                    </div>
                    <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setModal(card)}
                        className="rounded-lg bg-[#1f8b4c] px-4 py-2 text-sm text-white hover:bg-[var(--admin-primary-strong)]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCard(card.id)}
                        className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {modal ? (
        <CardModal
          card={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSaveCard}
        />
      ) : null}
    </section>
  );
}
