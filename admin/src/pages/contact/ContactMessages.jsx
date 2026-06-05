import { useEffect, useState, useCallback } from "react";
import { getContactMessages, markContactRead, deleteContactMessage } from "../../api/contactApi";

const STATUS_STYLES = {
  unread:  { bg: "bg-red-500/15",   text: "text-red-400",   border: "border-red-500/30",   label: "Unread"  },
  read:    { bg: "bg-zinc-500/15",  text: "text-zinc-400",  border: "border-zinc-500/30",  label: "Read"    },
  replied: { bg: "bg-green-500/15", text: "text-green-400", border: "border-green-500/30", label: "Replied" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.read;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${s.bg} ${s.text} ${s.border}`}>
      {s.label}
    </span>
  );
}

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [meta, setMeta]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [filter, setFilter]     = useState("");
  const [page, setPage]         = useState(1);
  const [expanded, setExpanded] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, per_page: 20 };
      if (filter) params.status = filter;
      const res = await getContactMessages(params);
      const payload = res?.data ?? res;
      setMessages(Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []));
      setMeta(payload?.meta ?? null);
    } catch {
      setError("Failed to load contact messages.");
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [filter]);

  const handleMarkRead = async (id) => {
    try {
      await markContactRead(id);
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status: "read" } : m));
    } catch {
      setError("Failed to mark as read.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    setDeleting(id);
    try {
      await deleteContactMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (expanded === id) setExpanded(null);
    } catch {
      setError("Failed to delete message.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <section className="space-y-5">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Contact Messages</h2>
          <p className="mt-0.5 text-sm text-[var(--admin-muted)]">Messages submitted via the Contact Us form.</p>
        </div>
        <div className="flex items-center gap-2">
          {["", "unread", "read", "replied"].map((s) => (
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
        <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)]">
        {loading ? (
          <div className="py-16 text-center text-sm text-[var(--admin-muted)]">Loading messages…</div>
        ) : messages.length === 0 ? (
          <div className="py-16 text-center text-sm text-[var(--admin-muted)]">No messages found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--admin-border)] text-left text-xs uppercase tracking-widest text-[var(--admin-muted)]">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3 hidden sm:table-cell">Email</th>
                <th className="px-4 py-3 hidden md:table-cell">Subject</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 hidden lg:table-cell">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <>
                  <tr
                    key={msg.id}
                    className={`border-b border-[var(--admin-border)] transition hover:bg-[var(--admin-bg)] ${msg.status === "unread" ? "font-semibold" : ""}`}
                  >
                    <td className="px-4 py-3 text-white">
                      <button className="text-left hover:text-[var(--admin-primary)]" onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}>
                        {msg.name}
                      </button>
                    </td>
                    <td className="px-4 py-3 hidden text-[var(--admin-muted)] sm:table-cell">{msg.email}</td>
                    <td className="px-4 py-3 hidden max-w-[200px] truncate text-[var(--admin-muted)] md:table-cell">{msg.subject}</td>
                    <td className="px-4 py-3"><StatusBadge status={msg.status} /></td>
                    <td className="px-4 py-3 hidden text-[var(--admin-muted)] lg:table-cell">
                      {msg.created_at ? new Date(msg.created_at).toLocaleDateString("en-PK") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {msg.status === "unread" && (
                          <button
                            onClick={() => handleMarkRead(msg.id)}
                            className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-2.5 py-1 text-xs font-medium text-[var(--admin-muted)] hover:text-white"
                            title="Mark as read"
                          >
                            <span className="pi pi-eye" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(msg.id)}
                          disabled={deleting === msg.id}
                          className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 hover:bg-red-500/20"
                          title="Delete"
                        >
                          <span className="pi pi-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expanded === msg.id && (
                    <tr key={`${msg.id}-expanded`} className="border-b border-[var(--admin-border)] bg-[var(--admin-bg)]">
                      <td colSpan={6} className="px-5 py-4">
                        <div className="space-y-2 text-sm">
                          {msg.phone && <p className="text-[var(--admin-muted)]"><strong className="text-white">Phone:</strong> {msg.phone}</p>}
                          <p className="text-[var(--admin-muted)]"><strong className="text-white">Subject:</strong> {msg.subject}</p>
                          <p className="whitespace-pre-wrap text-[var(--admin-muted)]"><strong className="text-white">Message:</strong><br />{msg.message}</p>
                          <p className="text-xs text-[var(--admin-muted)]">
                            Received: {msg.created_at ? new Date(msg.created_at).toLocaleString("en-PK") : "—"}
                          </p>
                          <div className="flex gap-2 pt-1">
                            <a
                              href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                              className="rounded-lg border border-[var(--admin-border-amber)] bg-[var(--admin-primary)] px-3 py-1.5 text-xs font-semibold text-black hover:bg-[var(--admin-amber)]"
                            >
                              Reply via Email
                            </a>
                            {msg.phone && (
                              <a
                                href={`https://wa.me/${msg.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${msg.name}, regarding your query: "${msg.subject}"`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-400 hover:bg-green-500/20"
                              >
                                WhatsApp
                              </a>
                            )}
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

      {/* Pagination */}
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
