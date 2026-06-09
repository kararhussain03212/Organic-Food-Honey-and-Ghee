import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCommitmentItem, getCommitmentItems, updateCommitmentItem } from "../../api/commitmentApi";
import { useAuth } from "../../context/useAuth";
import { hasPermission } from "../../modules/users/constants";
import { getBackendRoot } from "../../api/runtimeApi";
import { CommitmentIcon, ICON_OPTIONS } from "../../data/commitmentIcons";

const KNOWN_ICONS = new Set(ICON_OPTIONS.map((o) => o.key));

const FALLBACK_ICON = `data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' fill='#1a1a1a'/><text x='50%' y='55%' text-anchor='middle' dominant-baseline='middle' fill='#888' font-size='28'>✦</text></svg>",
)}`;

export default function CommitmentItemList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ show: false, text: "" });

  const canAdd    = hasPermission(user, "create_content");
  const canEdit   = hasPermission(user, "edit_content");
  const canDelete = hasPermission(user, "delete_content");
  const canPublish = hasPermission(user, "publish_content");

  const showNoPerm = (action) => setToast({ show: true, text: `You do not have permission to ${action}.` });

  const apiRoot = useMemo(() => getBackendRoot(), []);

  const resolveIcon = (value) => {
    if (!value) return FALLBACK_ICON;
    if (value.startsWith("http")) return value;
    if (value.startsWith("/uploads/")) return apiRoot + value;
    if (value.startsWith("/")) return apiRoot.replace(/\/backend$/, "") + value;
    return apiRoot + "/uploads/" + value;
  };

  useEffect(() => {
    if (!toast.show) return;
    const t = setTimeout(() => setToast({ show: false, text: "" }), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getCommitmentItems(1, 50);
        const payload = res?.data?.data;
        const rows = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];
        setItems(rows);
      } catch (err) {
        console.error(err);
        setError("Failed to load commitment items.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!canDelete) { showNoPerm("delete items"); return; }
    if (!window.confirm("Delete this commitment item?")) return;
    try {
      await deleteCommitmentItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Delete failed.");
    }
  };

  const handleToggleActive = async (item) => {
    if (!canPublish) { showNoPerm("toggle status"); return; }
    try {
      const nextActive = item.is_active ? 0 : 1;
      const { data } = await updateCommitmentItem(item.id, { is_active: nextActive });
      setItems((prev) =>
        prev.map((entry) => (entry.id === data?.data?.id ? data.data : entry)),
      );
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) { navigate("/login", { replace: true }); return; }
      setError("Failed to update status.");
    }
  };

  if (loading) return <p className="text-white/70">Loading commitment items...</p>;

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Our Commitment Items</h2>
          <p className="text-sm text-white/65">Manage the cards shown in the Our Commitment section.</p>
        </div>
        <button
          type="button"
          onClick={() => (canAdd ? navigate("/commitment/new") : showNoPerm("add items"))}
          className="inline-flex w-fit rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 text-black hover:bg-[var(--admin-primary-strong)]"
        >
          + Add Item
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
          No commitment items found. Add your first item.
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--admin-bg)]"
            >
              <div className="p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--admin-card-elevated)]">
                      {item.icon_url ? (
                        <img
                          src={resolveIcon(item.icon_url)}
                          alt={item.title}
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_ICON; }}
                          className="h-10 w-10 rounded-lg object-contain"
                        />
                      ) : KNOWN_ICONS.has(item.icon) ? (
                        <CommitmentIcon name={item.icon} size={28} color="var(--admin-primary)" />
                      ) : (
                        <span className="text-3xl">{item.icon || "✦"}</span>
                      )}
                    </div>
                    <div>
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-bold text-white">{item.title || "Untitled"}</h3>
                        {item.tag && (
                          <span className="rounded-full bg-[var(--admin-primary)]/20 px-2 py-0.5 text-xs font-semibold text-[var(--admin-primary)]">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/65 line-clamp-2">{item.description || "No description"}</p>
                      <div className="mt-2 text-xs text-white/40">Sort Order: {item.sort_order ?? 0}</div>
                    </div>
                  </div>

                  <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(item)}
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
                      onClick={() => (canEdit ? navigate(`/commitment/edit/${item.id}`) : showNoPerm("edit items"))}
                      className={`rounded-lg px-4 py-2 text-sm ${canEdit ? "bg-[#1f8b4c] text-white hover:bg-[var(--admin-primary-strong)]" : "border border-white/20 bg-white/10 text-white/60"}`}
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
