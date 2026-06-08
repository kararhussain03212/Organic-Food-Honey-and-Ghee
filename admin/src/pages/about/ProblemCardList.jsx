import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteProblem, getProblems, updateProblem } from "../../api/aboutApi";

export default function ProblemCardList() {
  const navigate = useNavigate();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [toast, setToast]     = useState({ show: false, text: "" });

  useEffect(() => {
    if (!toast.show) return;
    const t = setTimeout(() => setToast({ show: false, text: "" }), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    getProblems()
      .then((res) => {
        const d = res?.data?.data;
        setItems(Array.isArray(d) ? d : []);
      })
      .catch(() => setError("Failed to load cards."))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (item) => {
    try {
      const next = item.is_active ? 0 : 1;
      const { data } = await updateProblem(item.id, { is_active: next });
      setItems((p) => p.map((x) => (x.id === data?.data?.id ? data.data : x)));
    } catch {
      setError("Update failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this card?")) return;
    try {
      await deleteProblem(id);
      setItems((p) => p.filter((x) => x.id !== id));
    } catch {
      setError("Delete failed.");
    }
  };

  if (loading) return <p className="text-white/70">Loading problem cards…</p>;

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Problem Cards</h2>
          <p className="text-sm text-white/65">Manage the "Why Arion Exists" section cards.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/about/problems/new")}
          className="inline-flex w-fit rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 font-semibold text-black hover:bg-[var(--admin-primary-strong)]"
        >
          + Add Card
        </button>
      </header>

      {toast.show ? (
        <div className="fixed right-5 top-5 z-[220] rounded-xl border border-red-400/30 bg-red-500/90 px-4 py-2 text-sm font-medium text-white shadow-lg">
          {toast.text}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>
      ) : null}

      {items.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[var(--admin-bg)] p-6 text-white/70">
          No cards found. Add your first card.
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--admin-bg)]">
              <div className="p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--admin-card-elevated)] text-2xl">
                      {item.icon || "✦"}
                    </div>
                    <div>
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[var(--admin-primary)]/20 px-2 py-0.5 text-xs font-bold text-[var(--admin-primary)]">
                          {item.card_number}
                        </span>
                        <h3 className="text-xl font-bold text-white">{item.title}</h3>
                      </div>
                      <p className="text-sm text-white/65 line-clamp-2">{item.description}</p>
                      <div className="mt-2 text-xs text-white/40">Sort Order: {item.sort_order ?? 0}</div>
                    </div>
                  </div>

                  <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleToggle(item)}
                      className={
                        item.is_active
                          ? "rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                          : "rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                      }
                    >
                      {item.is_active ? "Active" : "Inactive"}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/about/problems/edit/${item.id}`)}
                      className="rounded-lg bg-[#1f8b4c] px-4 py-2 text-sm text-white hover:bg-[var(--admin-primary-strong)]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
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
    </section>
  );
}
