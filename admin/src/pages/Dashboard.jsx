import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import axios from "../api/axios";
import { getSettings } from "../api/settingApi";

const QUICK = [
  { label: "Add Product",      to: "/products/new",      icon: "pi-box",         color: "#5cb96a" },
  { label: "New Hero Slide",   to: "/sliders/new",       icon: "pi-images",      color: "#e0b85c" },
  { label: "New Blog Post",    to: "/blogs/new",         icon: "pi-file-edit",   color: "#5cb96a" },
  { label: "New Testimonial",  to: "/testimonials/new",  icon: "pi-comments",    color: "#e0b85c" },
  { label: "View Orders",      to: "/orders",            icon: "pi-shopping-cart", color: "#5cb96a" },
  { label: "Site Settings",    to: "/settings/navbar",   icon: "pi-cog",         color: "#e0b85c" },
];

const STAT_META = [
  { key: "hero",           label: "Hero Slides",   to: "/sliders",         icon: "pi-images",   glow: "rgba(92,185,106,0.18)"  },
  { key: "products",       label: "Products",      to: "/products",        icon: "pi-box",      glow: "rgba(224,184,92,0.18)"  },
  { key: "testimonials",   label: "Testimonials",  to: "/testimonials",    icon: "pi-comments", glow: "rgba(92,185,106,0.18)"  },
  { key: "blog",           label: "Blog Posts",    to: "/blogs",           icon: "pi-file-edit",glow: "rgba(224,184,92,0.18)"  },
];

const CURRENCY = new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 });

const ORDER_STATUS_STYLE = {
  new:       { label: "New",       cls: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  confirmed: { label: "Confirmed", cls: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  delivered: { label: "Delivered", cls: "bg-green-500/15 text-green-300 border-green-500/30" },
  cancelled: { label: "Cancelled", cls: "bg-red-500/15 text-red-300 border-red-500/30" },
};

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diffMs = Date.now() - new Date(dateStr.replace(" ", "T")).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr.replace(" ", "T")).toLocaleDateString();
}

function parseItems(items) {
  if (Array.isArray(items)) return items;
  if (typeof items === "string") {
    try {
      const parsed = JSON.parse(items);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function StatCard({ meta, value, loading }) {
  return (
    <Link
      to={meta.to}
      className="group relative overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--admin-border-amber)] hover:shadow-[0_8px_32px_rgba(92,185,106,0.12)]"
    >
      {/* glow blob */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle, ${meta.glow} 0%, transparent 70%)` }}
      />

      <div className="flex items-start justify-between gap-3">
        <div
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--admin-border)] bg-[var(--admin-sidebar-hover)]"
        >
          <span
            className={`pi ${meta.icon} text-lg`}
            style={{ color: meta.key === "products" || meta.key === "blog" ? "var(--admin-accent)" : "var(--admin-primary)" }}
          />
        </div>
        <span className="pi pi-arrow-right text-xs text-[var(--admin-muted)] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
      </div>

      <p className="mt-4 text-3xl font-extrabold tracking-tight text-white">
        {loading ? <span className="inline-block h-8 w-10 animate-pulse rounded-lg bg-white/10" /> : value}
      </p>
      <p className="mt-1 text-sm font-medium text-[var(--admin-muted)]">{meta.label}</p>
    </Link>
  );
}

function HighlightCard({ label, value, icon, glow, loading, to, sub }) {
  const Wrapper = to ? Link : "div";
  return (
    <Wrapper
      to={to}
      className="group relative overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--admin-border-amber)] hover:shadow-[0_8px_32px_rgba(92,185,106,0.12)]"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-70 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 70%)` }}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--admin-border)] bg-[var(--admin-sidebar-hover)]">
          <span className={`pi ${icon} text-lg`} style={{ color: "var(--admin-primary)" }} />
        </div>
        {to && <span className="pi pi-arrow-right text-xs text-[var(--admin-muted)] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />}
      </div>
      <p className="mt-4 text-3xl font-extrabold tracking-tight text-white">
        {loading ? <span className="inline-block h-8 w-20 animate-pulse rounded-lg bg-white/10" /> : value}
      </p>
      <p className="mt-1 text-sm font-medium text-[var(--admin-muted)]">{label}</p>
      {sub ? <p className="mt-0.5 text-xs text-[var(--admin-muted)]/70">{sub}</p> : null}
    </Wrapper>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [counts,   setCounts]   = useState({
    hero: 0, products: 0, testimonials: 0, blog: 0,
    contact_unread: 0, orders: 0, orders_new: 0, revenue: 0, revenue_today: 0,
  });
  const [recentOrders,   setRecentOrders]   = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [outOfStock,     setOutOfStock]     = useState([]);
  const [siteName, setSiteName] = useState("Arion Organic");

  useEffect(() => {
    axios.get("/admin/dashboard")
      .then((res) => {
        const payload = res?.data?.data ?? res?.data ?? {};
        const c = payload.counts ?? {};
        setCounts({
          hero:           Number(c.hero            ?? 0),
          products:       Number(c.products        ?? 0),
          testimonials:   Number(c.testimonials    ?? 0),
          blog:           Number(c.blog            ?? 0),
          contact_unread: Number(c.contact_unread  ?? 0),
          orders:         Number(c.orders          ?? 0),
          orders_new:     Number(c.orders_new      ?? 0),
          revenue:        Number(c.revenue         ?? 0),
          revenue_today:  Number(c.revenue_today   ?? 0),
        });
        setRecentOrders(Array.isArray(payload.recent_orders) ? payload.recent_orders : []);
        setRecentMessages(Array.isArray(payload.recent_messages) ? payload.recent_messages : []);
        setOutOfStock(Array.isArray(payload.out_of_stock) ? payload.out_of_stock : []);
      })
      .catch(() => setError("Failed to load dashboard stats."))
      .finally(() => setLoading(false));

    getSettings()
      .then((res) => {
        const s = res?.data?.data ?? res?.data ?? {};
        if (s.navbar_brand_title) setSiteName(s.navbar_brand_title);
      })
      .catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">

      {/* ── HERO BANNER ──────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--admin-border-amber)]/40 bg-gradient-to-br from-[var(--brand-green-deep)] via-[var(--brand-green)] to-[#2a4a32]">
        {/* decorative circles */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(224,184,92,0.22)_0%,transparent_65%)]" />
        <div className="pointer-events-none absolute -bottom-12 left-8 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(92,185,106,0.18)_0%,transparent_70%)]" />
        <div className="pointer-events-none absolute right-48 bottom-0 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04)_0%,transparent_70%)]" />

        <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          {/* Text side */}
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--admin-accent)]/30 bg-[var(--admin-accent)]/10 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--admin-primary)]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--admin-accent)]">
                Control Center
              </span>
            </div>
            <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl">
              {greeting},{" "}
              <span className="text-[var(--admin-accent)]">{user?.name?.split(" ")[0] || "Admin"}</span>
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/65 sm:text-base">
              Welcome to the <span className="font-semibold text-white/90">{siteName}</span> admin panel.
              Here&apos;s what&apos;s happening across your store today.
            </p>

            {/* Mini stats row */}
            <div className="mt-5 flex flex-wrap gap-3">
              {[
                { label: "New Orders",   val: counts.orders_new,     icon: "pi-shopping-cart" },
                { label: "Unread Msgs",  val: counts.contact_unread, icon: "pi-envelope" },
                { label: "Products",     val: counts.products,       icon: "pi-box" },
              ].map(({ label, val, icon }) => (
                <div key={label} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 backdrop-blur-sm">
                  <span className={`pi ${icon} text-sm text-[var(--admin-accent)]`} />
                  <span className="text-lg font-bold text-white">{loading ? "–" : val}</span>
                  <span className="text-xs text-white/50">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue side */}
          <div className="flex-shrink-0 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Total Revenue</p>
            <p className="mt-1 text-3xl font-extrabold text-white">
              {loading ? "–" : CURRENCY.format(counts.revenue)}
            </p>
            <p className="mt-1 text-xs text-[var(--admin-accent)]">
              {loading ? "" : `+${CURRENCY.format(counts.revenue_today)} today`}
            </p>
          </div>
        </div>
      </div>

      {/* ── ERROR ────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <span className="pi pi-exclamation-triangle" />
          {error}
        </div>
      )}

      {/* ── PRIMARY BUSINESS METRICS ─────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <HighlightCard
          label="Total Orders" value={loading ? "" : counts.orders} icon="pi-shopping-cart"
          glow="rgba(92,185,106,0.2)" loading={loading} to="/orders"
          sub={loading ? "" : `${counts.orders_new} awaiting confirmation`}
        />
        <HighlightCard
          label="Total Revenue" value={loading ? "" : CURRENCY.format(counts.revenue)} icon="pi-wallet"
          glow="rgba(224,184,92,0.2)" loading={loading} to="/orders"
          sub={loading ? "" : `${CURRENCY.format(counts.revenue_today)} earned today`}
        />
        <HighlightCard
          label="Unread Messages" value={loading ? "" : counts.contact_unread} icon="pi-envelope"
          glow="rgba(92,185,106,0.2)" loading={loading} to="/contact-messages"
          sub="Customer enquiries waiting on a reply"
        />
        <HighlightCard
          label="Out of Stock" value={loading ? "" : outOfStock.length} icon="pi-exclamation-triangle"
          glow="rgba(224,92,92,0.2)" loading={loading} to="/products"
          sub="Products needing restock"
        />
      </div>

      {/* ── CONTENT STAT CARDS ───────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {STAT_META.map((meta) => (
          <StatCard key={meta.key} meta={meta} value={counts[meta.key]} loading={loading} />
        ))}
      </div>

      {/* ── RECENT ORDERS + MESSAGES ─────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* Recent Orders */}
        <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Recent Orders</h3>
              <p className="text-sm text-[var(--admin-muted)]">Latest checkouts from the storefront.</p>
            </div>
            <Link to="/orders" className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--admin-primary-light)] transition-colors hover:bg-[var(--admin-primary)]/25">
              <span className="pi pi-arrow-right text-sm text-[var(--admin-primary)]" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-white/5" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-4 py-6 text-center text-sm text-[var(--admin-muted)]">
              No orders yet.
            </p>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((order) => {
                const items = parseItems(order.items);
                const status = ORDER_STATUS_STYLE[order.status] || ORDER_STATUS_STYLE.new;
                return (
                  <Link
                    key={order.id}
                    to="/orders"
                    className="flex items-center gap-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-4 py-3 transition-colors hover:border-[var(--admin-border-amber)] hover:bg-[var(--admin-sidebar-hover)]"
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--admin-primary-light)]">
                      <span className="pi pi-shopping-cart text-sm text-[var(--admin-primary)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-white">{order.customer_name}</p>
                        <span className={`flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${status.cls}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="truncate text-xs text-[var(--admin-muted)]">
                        {order.order_number} · {items.length} item{items.length === 1 ? "" : "s"} · {timeAgo(order.created_at)}
                      </p>
                    </div>
                    <p className="flex-shrink-0 text-sm font-bold text-white">
                      {CURRENCY.format(Number(order.subtotal || 0))}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Recent Messages</h3>
              <p className="text-sm text-[var(--admin-muted)]">Latest contact form submissions.</p>
            </div>
            <Link to="/contact-messages" className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--admin-primary-light)] transition-colors hover:bg-[var(--admin-primary)]/25">
              <span className="pi pi-arrow-right text-sm text-[var(--admin-primary)]" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-white/5" />
              ))}
            </div>
          ) : recentMessages.length === 0 ? (
            <p className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-4 py-6 text-center text-sm text-[var(--admin-muted)]">
              No messages yet.
            </p>
          ) : (
            <div className="space-y-2">
              {recentMessages.map((msg) => (
                <Link
                  key={msg.id}
                  to="/contact-messages"
                  className="flex items-start gap-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-4 py-3 transition-colors hover:border-[var(--admin-border-amber)] hover:bg-[var(--admin-sidebar-hover)]"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--admin-primary-light)]">
                    <span className="pi pi-envelope text-sm text-[var(--admin-primary)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-white">{msg.name}</p>
                      {msg.status === "unread" && (
                        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--admin-accent)]" />
                      )}
                    </div>
                    <p className="truncate text-xs text-[var(--admin-muted)]">
                      {msg.subject || "No subject"} · {timeAgo(msg.created_at)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── QUICK ACTIONS + CONTENT OVERVIEW ─────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* Quick Actions */}
        <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Quick Actions</h3>
              <p className="text-sm text-[var(--admin-muted)]">Jump to common tasks instantly.</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--admin-primary-light)]">
              <span className="pi pi-bolt text-sm text-[var(--admin-primary)]" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {QUICK.map((q) => (
              <Link
                key={q.to}
                to={q.to}
                className="group flex items-center gap-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-4 py-3 text-sm font-medium text-white transition-all hover:border-[var(--admin-border-amber)] hover:bg-[var(--admin-sidebar-hover)]"
              >
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors"
                  style={{ background: `${q.color}18` }}
                >
                  <span className={`pi ${q.icon} text-sm`} style={{ color: q.color }} />
                </div>
                <span className="flex-1 text-sm">{q.label}</span>
                <span className="pi pi-arrow-right text-[10px] text-[var(--admin-muted)] transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>

        {/* Content Overview */}
        <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Content Overview</h3>
              <p className="text-sm text-[var(--admin-muted)]">Live totals across all modules.</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--admin-primary-light)]">
              <span className="pi pi-chart-bar text-sm text-[var(--admin-primary)]" />
            </div>
          </div>

          <div className="space-y-2.5">
            {STAT_META.map((meta, i) => {
              const val = counts[meta.key];
              const maxVal = Math.max(...STAT_META.map((m) => counts[m.key]), 1);
              const pct = loading ? 0 : Math.max(4, Math.round((val / maxVal) * 100));
              const barColor = i % 2 === 0 ? "var(--admin-primary)" : "var(--admin-accent)";
              return (
                <div key={meta.key} className="flex items-center gap-3">
                  <div className="flex w-28 flex-shrink-0 items-center gap-2">
                    <span className={`pi ${meta.icon} text-xs`} style={{ color: barColor }} />
                    <span className="truncate text-xs text-[var(--admin-muted)]">{meta.label}</span>
                  </div>
                  <div className="flex-1 overflow-hidden rounded-full bg-[var(--admin-bg)] h-2">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: barColor }}
                    />
                  </div>
                  <span className="w-6 flex-shrink-0 text-right text-sm font-bold text-white">
                    {loading ? "–" : val}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Status info */}
          <div className="mt-5 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-4 py-3">
            <p className="text-sm font-semibold text-white">{siteName}</p>
            <p className="mt-1 text-xs text-[var(--admin-muted)]">Admin panel · all systems operational</p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[var(--admin-primary)]/30 bg-[var(--admin-primary-light)] px-2.5 py-1 text-[10px] font-semibold text-[var(--admin-primary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--admin-primary)]" />
              Live
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
