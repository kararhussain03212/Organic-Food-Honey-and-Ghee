import { useEffect, useState, useCallback } from "react";
import { getOrders, updateOrderStatus, deleteOrder } from "../../api/orderApi";

const STATUS_STYLES = {
  new:       { bg: "bg-blue-500/15",  text: "text-blue-400",  border: "border-blue-500/30",  label: "New"       },
  confirmed: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30", label: "Confirmed" },
  delivered: { bg: "bg-green-500/15", text: "text-green-400", border: "border-green-500/30", label: "Delivered" },
  cancelled: { bg: "bg-red-500/15",   text: "text-red-400",   border: "border-red-500/30",   label: "Cancelled" },
};

const STATUSES = ["new", "confirmed", "delivered", "cancelled"];

const parseItems = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) {
    try { return JSON.parse(value); } catch { return []; }
  }
  return [];
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.new;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${s.bg} ${s.text} ${s.border}`}>
      {s.label}
    </span>
  );
}

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(null);
  const [busy, setBusy] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, per_page: 20 };
      if (filter) params.status = filter;
      if (search.trim()) params.search = search.trim();
      const res = await getOrders(params);
      const payload = res?.data ?? res;
      setOrders(Array.isArray(payload?.data) ? payload.data : []);
      setMeta(payload?.meta ?? null);
    } catch {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, [page, filter, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [filter, search]);

  const handleStatusChange = async (id, status) => {
    setBusy(id);
    try {
      await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch {
      setError("Failed to update order status.");
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    setBusy(id);
    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      if (expanded === id) setExpanded(null);
    } catch {
      setError("Failed to delete order.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Orders</h2>
          <p className="mt-0.5 text-sm text-[var(--admin-muted)]">Orders placed via WhatsApp checkout on the website.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search # / name / phone"
            className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-card)] px-3 py-1.5 text-sm text-white placeholder:text-[var(--admin-muted)]"
          />
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
          <div className="py-16 text-center text-sm text-[var(--admin-muted)]">Loading orders…</div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-sm text-[var(--admin-muted)]">No orders found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--admin-border)] text-left text-xs uppercase tracking-widest text-[var(--admin-muted)]">
                <th className="px-4 py-3">Order #</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3 hidden sm:table-cell">Phone</th>
                <th className="px-4 py-3 hidden md:table-cell">City</th>
                <th className="px-4 py-3 hidden md:table-cell">Subtotal</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 hidden lg:table-cell">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const items = parseItems(order.items);
                return (
                  <>
                    <tr
                      key={order.id}
                      className={`border-b border-[var(--admin-border)] transition hover:bg-[var(--admin-bg)] ${order.status === "new" ? "font-semibold" : ""}`}
                    >
                      <td className="px-4 py-3 text-white">
                        <button className="text-left hover:text-[var(--admin-primary)]" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                          {order.order_number}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-white">{order.customer_name}</td>
                      <td className="px-4 py-3 hidden text-[var(--admin-muted)] sm:table-cell">{order.phone}</td>
                      <td className="px-4 py-3 hidden text-[var(--admin-muted)] md:table-cell">{order.city}</td>
                      <td className="px-4 py-3 hidden text-[var(--admin-muted)] md:table-cell">Rs {Number(order.subtotal).toLocaleString()}</td>
                      <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                      <td className="px-4 py-3 hidden text-[var(--admin-muted)] lg:table-cell">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString("en-PK") : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            disabled={busy === order.id}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-2 py-1 text-xs text-white"
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleDelete(order.id)}
                            disabled={busy === order.id}
                            className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 hover:bg-red-500/20"
                            title="Delete"
                          >
                            <span className="pi pi-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expanded === order.id && (
                      <tr key={`${order.id}-expanded`} className="border-b border-[var(--admin-border)] bg-[var(--admin-bg)]">
                        <td colSpan={8} className="px-5 py-4">
                          <div className="space-y-2 text-sm">
                            <p className="text-[var(--admin-muted)]">
                              <strong className="text-white">Address:</strong> {order.address}
                              {order.apartment ? `, ${order.apartment}` : ""}, {order.city}
                              {order.postal_code ? ` — ${order.postal_code}` : ""}
                            </p>
                            <div>
                              <strong className="text-white">Items:</strong>
                              <ul className="mt-1 space-y-1">
                                {items.map((item, i) => (
                                  <li key={i} className="text-[var(--admin-muted)]">
                                    • {item.name}{item.variant ? ` (${item.variant})` : ""}{item.code ? ` [Code: ${item.code}]` : ""} × {item.qty} — Rs {Number(item.price).toLocaleString()}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <p className="text-[var(--admin-muted)]"><strong className="text-white">Subtotal:</strong> Rs {Number(order.subtotal).toLocaleString()}</p>
                            <p className="text-xs text-[var(--admin-muted)]">
                              Placed: {order.created_at ? new Date(order.created_at).toLocaleString("en-PK") : "—"}
                            </p>
                            <div className="flex gap-2 pt-1">
                              <a
                                href={`https://wa.me/${String(order.phone || "").replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${order.customer_name}, regarding your order ${order.order_number}:`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-400 hover:bg-green-500/20"
                              >
                                WhatsApp Customer
                              </a>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
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
