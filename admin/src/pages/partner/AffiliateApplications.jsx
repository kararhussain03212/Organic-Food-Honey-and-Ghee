import { useEffect, useState, useCallback } from "react";
import { getAffiliateApplications, updateApplicationStatus, deleteAffiliateApplication } from "../../api/partnerApi";

const STATUS_STYLES = {
  new:      { bg: "bg-blue-500/15",   text: "text-blue-400",   border: "border-blue-500/30",   label: "New"      },
  reviewed: { bg: "bg-amber-500/15",  text: "text-amber-400",  border: "border-amber-500/30",  label: "Reviewed" },
  approved: { bg: "bg-green-500/15",  text: "text-green-400",  border: "border-green-500/30",  label: "Approved" },
  rejected: { bg: "bg-red-500/15",    text: "text-red-400",    border: "border-red-500/30",    label: "Rejected" },
};

const STATUSES = ["new", "reviewed", "approved", "rejected"];

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.new;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${s.bg} ${s.text} ${s.border}`}>
      {s.label}
    </span>
  );
}

export default function AffiliateApplications() {
  const [applications, setApplications] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(null);
  const [busy, setBusy] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, per_page: 20 };
      if (filter) params.status = filter;
      const res = await getAffiliateApplications(params);
      const payload = res?.data ?? res;
      setApplications(Array.isArray(payload?.data) ? payload.data : []);
      setMeta(payload?.meta ?? null);
    } catch {
      setError("Failed to load affiliate applications.");
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [filter]);

  const handleStatusChange = async (id, status) => {
    setBusy(id);
    try {
      await updateApplicationStatus(id, status);
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch {
      setError("Failed to update status.");
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    setBusy(id);
    try {
      await deleteAffiliateApplication(id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
      if (expanded === id) setExpanded(null);
    } catch {
      setError("Failed to delete application.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Affiliate Applications</h2>
          <p className="mt-0.5 text-sm text-[var(--admin-muted)]">Applications submitted via the Career page form.</p>
        </div>
        <div className="flex items-center gap-2">
          {["", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                filter === s
                  ? "border-[var(--admin-border-amber)] bg-[var(--admin-primary)] text-black"
                  : "border-[var(--admin-border)] bg-[var(--admin-card)] text-[var(--admin-muted)] hover:text-white"
              }`}
            >
              {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      <div className="overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)]">
        {loading ? (
          <div className="py-16 text-center text-sm text-[var(--admin-muted)]">Loading applications…</div>
        ) : applications.length === 0 ? (
          <div className="py-16 text-center text-sm text-[var(--admin-muted)]">No applications found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--admin-border)] text-left text-xs uppercase tracking-widest text-[var(--admin-muted)]">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3 hidden sm:table-cell">Phone</th>
                <th className="px-4 py-3 hidden md:table-cell">City</th>
                <th className="px-4 py-3 hidden md:table-cell">Applying As</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 hidden lg:table-cell">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <>
                  <tr
                    key={app.id}
                    className={`border-b border-[var(--admin-border)] transition hover:bg-[var(--admin-bg)] ${app.status === "new" ? "font-semibold" : ""}`}
                  >
                    <td className="px-4 py-3 text-white">
                      <button className="text-left hover:text-[var(--admin-primary)]" onClick={() => setExpanded(expanded === app.id ? null : app.id)}>
                        {app.full_name}
                      </button>
                    </td>
                    <td className="px-4 py-3 hidden text-[var(--admin-muted)] sm:table-cell">{app.phone}</td>
                    <td className="px-4 py-3 hidden text-[var(--admin-muted)] md:table-cell">{app.city}</td>
                    <td className="px-4 py-3 hidden text-[var(--admin-muted)] md:table-cell">{app.applicant_type}</td>
                    <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                    <td className="px-4 py-3 hidden text-[var(--admin-muted)] lg:table-cell">
                      {app.created_at ? new Date(app.created_at).toLocaleDateString("en-PK") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={app.status}
                          disabled={busy === app.id}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-2 py-1 text-xs text-white"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleDelete(app.id)}
                          disabled={busy === app.id}
                          className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 hover:bg-red-500/20"
                          title="Delete"
                        >
                          <span className="pi pi-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expanded === app.id && (
                    <tr key={`${app.id}-expanded`} className="border-b border-[var(--admin-border)] bg-[var(--admin-bg)]">
                      <td colSpan={7} className="px-5 py-4">
                        <div className="space-y-2 text-sm">
                          <p className="text-[var(--admin-muted)]"><strong className="text-white">Phone:</strong> {app.phone}</p>
                          <p className="text-[var(--admin-muted)]"><strong className="text-white">City:</strong> {app.city}</p>
                          <p className="text-[var(--admin-muted)]"><strong className="text-white">Social handle:</strong> {app.social_handle || "Not provided"}</p>
                          <p className="text-[var(--admin-muted)]"><strong className="text-white">Applying as:</strong> {app.applicant_type}</p>
                          <p className="whitespace-pre-wrap text-[var(--admin-muted)]"><strong className="text-white">Why join:</strong><br />{app.reason}</p>
                          <p className="text-xs text-[var(--admin-muted)]">
                            Received: {app.created_at ? new Date(app.created_at).toLocaleString("en-PK") : "—"}
                          </p>
                          <div className="flex gap-2 pt-1">
                            <a
                              href={`https://wa.me/${String(app.phone || "").replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${app.full_name}, thank you for applying to the Arion affiliate program!`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-400 hover:bg-green-500/20"
                            >
                              WhatsApp
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {meta && meta.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-card)] px-3 py-1.5 text-sm text-[var(--admin-muted)] disabled:opacity-40 hover:text-white"
          >
            ← Prev
          </button>
          <span className="text-sm text-[var(--admin-muted)]">Page {page} of {meta.total_pages}</span>
          <button
            onClick={() => setPage((p) => Math.min(meta.total_pages, p + 1))}
            disabled={page === meta.total_pages}
            className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-card)] px-3 py-1.5 text-sm text-[var(--admin-muted)] disabled:opacity-40 hover:text-white"
          >
            Next →
          </button>
        </div>
      )}
    </section>
  );
}
