import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTeamMembers, updateTeamMember, deleteTeamMember, reorderTeamMembers } from "../../api/partnerApi";
import { getBackendRoot } from "../../api/runtimeApi";

const FALLBACK_PHOTO = `data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'><rect width='300' height='300' fill='#171717'/><text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle' fill='#ffffff' font-family='Arial,sans-serif' font-size='30'>Photo</text></svg>",
)}`;

export default function TeamMemberList() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reordering, setReordering] = useState(false);

  const apiRoot = useMemo(() => getBackendRoot(), []);

  const resolveImage = (value) => {
    if (!value) return FALLBACK_PHOTO;
    if (value.startsWith("http")) return value;
    if (value.startsWith("/uploads/")) return apiRoot + value;
    if (value.startsWith("/")) return apiRoot.replace(/\/backend$/, "") + value;
    return apiRoot + "/uploads/" + value;
  };

  const load = async () => {
    try {
      const res = await getTeamMembers();
      const payload = res?.data?.data;
      const rows = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
      setMembers(rows);
    } catch {
      setError("Failed to load team members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleToggleActive = async (item) => {
    try {
      const nextActive = item.is_active ? 0 : 1;
      const { data } = await updateTeamMember(item.id, { is_active: nextActive });
      setMembers((prev) => prev.map((m) => (m.id === item.id ? (data?.data ?? { ...m, is_active: nextActive }) : m)));
    } catch (err) {
      if (err?.response?.status === 401) { navigate("/login", { replace: true }); return; }
      setError("Failed to update member status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this team member?")) return;
    try {
      await deleteTeamMember(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || "Delete failed.");
    }
  };

  const handleMove = async (index, direction) => {
    const to = index + direction;
    if (to < 0 || to >= members.length) return;

    const next = [...members];
    const [item] = next.splice(index, 1);
    next.splice(to, 0, item);
    const withOrder = next.map((m, i) => ({ ...m, sort_order: i + 1 }));
    setMembers(withOrder);

    try {
      setReordering(true);
      await reorderTeamMembers(withOrder.map((m) => ({ id: m.id, sort_order: m.sort_order })));
    } catch {
      setError("Failed to save new order.");
      load();
    } finally {
      setReordering(false);
    }
  };

  if (loading) return <p className="text-white/70">Loading team members…</p>;

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Team Members</h2>
          <p className="text-sm text-white/65">Regional sales agents shown on the Career page.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/team-members/new")}
          className="inline-flex w-fit rounded-xl bg-[var(--admin-primary)] px-5 py-2.5 text-black hover:bg-[var(--admin-primary-strong)]"
        >
          + Add Team Member
        </button>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>
      ) : null}

      {members.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[var(--admin-bg)] p-6 text-white/70">
          No team members found. Add your first team member.
        </div>
      ) : (
        <div className="grid gap-4">
          {members.map((item, index) => (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--admin-bg)]">
              <div className="p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="mb-3 flex items-center gap-3">
                      <img
                        src={resolveImage(item.photo)}
                        alt={item.name || "Team member"}
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_PHOTO; }}
                        className="h-14 w-14 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-white">{item.name}</h3>
                        <p className="text-sm text-white/65">{item.region || "—"}</p>
                      </div>
                    </div>
                    <p className="break-words text-sm text-white/75">{item.quote || "No quote"}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-md bg-white/10 px-2 py-1 text-white/80">WhatsApp: {item.whatsapp_number || "—"}</span>
                      <span className="rounded-md bg-white/10 px-2 py-1 text-white/80">Order: {Number(item.sort_order || 0)}</span>
                    </div>
                  </div>

                  <div className="flex w-full flex-wrap items-start gap-2 sm:w-auto">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleMove(index, -1)}
                        disabled={index === 0 || reordering}
                        className="rounded-lg border border-white/20 px-3 py-2 text-sm text-white/80 disabled:opacity-30 hover:bg-white/10"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(index, 1)}
                        disabled={index === members.length - 1 || reordering}
                        className="rounded-lg border border-white/20 px-3 py-2 text-sm text-white/80 disabled:opacity-30 hover:bg-white/10"
                        title="Move down"
                      >
                        ↓
                      </button>
                    </div>
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
                      onClick={() => navigate(`/team-members/edit/${item.id}`)}
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
