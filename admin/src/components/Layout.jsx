import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import fallbackLogo from "../assets/images/web_logo.png";
import { getBackendRoot } from "../api/runtimeApi";
import { getSettings } from "../api/settingApi";

const NAV = [
  { path: "/dashboard",         label: "Dashboard" },
  { path: "/users",             label: "User Management", adminOnly: true },
  { path: "/sliders",           label: "Hero Slides" },
  { path: "/products",          label: "Products" },
  { path: "/blogs",             label: "Blogs" },
  { path: "/testimonials",      label: "Testimonials" },
  { path: "/settings/navbar",   label: "Navbar" },
  { path: "/settings/footer",   label: "Footer" },
  // About Us
  { path: "/about", label: "About Us", group: "about" },
  { path: "/about/hero",          label: "Hero Section",    child: true, childGroup: "about" },
  { path: "/about/story",         label: "Our Story",       child: true, childGroup: "about" },
  { path: "/about/problems",      label: "Why We Exist",    child: true, childGroup: "about" },
  { path: "/about/mission",       label: "Mission Section", child: true, childGroup: "about" },
  { path: "/about/core-values",   label: "Core Values",     child: true, childGroup: "about" },
  { path: "/about/comparison",    label: "Comparison",      child: true, childGroup: "about" },
  { path: "/about/cta",           label: "CTA Section",     child: true, childGroup: "about" },
  // Home Settings
  { path: "/settings/home",              label: "Home" },
  { path: "/settings/home-about",        label: "Home - Our Story",    child: true, childGroup: "home" },
  { path: "/settings/home-company",      label: "Home - Collection",   child: true, childGroup: "home" },
  { path: "/settings/home-commitment",   label: "Home - Commitment",   child: true, childGroup: "home" },
  { path: "/settings/home-testimonials", label: "Home - Testimonials", child: true, childGroup: "home" },
  { path: "/settings/home-authentic",    label: "Home - Authentic",    child: true, childGroup: "home" },
  // Other Settings
  { path: "/settings/product",  label: "Product Page" },
  { path: "/settings/blog",     label: "Blog Page" },
  { path: "/contact-settings",  label: "Contact Page" },
];

const PAGE_TITLES = {
  "/":                               "Dashboard",
  "/dashboard":                      "Dashboard",
  "/sliders":                        "Hero Slides",
  "/sliders/new":                    "Add Hero Slide",
  "/products":                       "Products",
  "/products/new":                   "Add Product",
  "/commitment":                     "Commitment Items",
  "/commitment/new":                 "Add Commitment Item",
  "/blogs":                          "Blogs",
  "/blogs/new":                      "Add Blog",
  "/testimonials":                   "Testimonials",
  "/testimonials/new":               "Add Testimonial",
  "/contact-messages":               "Contact Messages",
  "/contact-settings":               "Contact Page Settings",
  "/settings/navbar":                "Navbar Settings",
  "/settings/home":                  "Home Settings",
  "/settings/home-about":            "Home - Our Story",
  "/settings/home-company":          "Home - Collection",
  "/settings/home-commitment":       "Home - Commitment",
  "/settings/home-testimonials":     "Home - Testimonials",
  "/settings/home-authentic":        "Home - Authentic",
  "/settings/footer":                "Footer Settings",
  "/settings/product":               "Product Page Settings",
  "/settings/blog":                  "Blog Page Settings",
  "/profile":                        "Admin Profile",
  "/users":                          "User Management",
  "/addresses":                      "Customer Addresses",
};

/* nav-link class helpers */
const cls = {
  link: (active) =>
    `mb-0.5 flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm transition-colors ${
      active
        ? "border border-[var(--admin-border-amber)] bg-[var(--admin-sidebar-hover)] font-semibold text-[var(--admin-accent)]"
        : "text-[var(--admin-muted)] hover:bg-[var(--admin-sidebar-hover)] hover:text-white"
    }`,
  child: (active) =>
    `flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
      active
        ? "border border-[var(--admin-border-amber)] bg-[var(--admin-sidebar-hover)] font-semibold text-[var(--admin-accent)]"
        : "text-[var(--admin-muted)] hover:bg-[var(--admin-sidebar-hover)] hover:text-white"
    }`,
  drop: (active) =>
    `flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm transition-colors ${
      active
        ? "border border-[var(--admin-border-amber)] bg-[var(--admin-sidebar-hover)] font-semibold text-[var(--admin-accent)]"
        : "text-[var(--admin-muted)] hover:bg-[var(--admin-sidebar-hover)] hover:text-white"
    }`,
};

export default function Layout({ children }) {
  const [sidebarOpen,      setSidebarOpen]      = useState(false);
  const [homeManual,       setHomeManual]        = useState(false);
  const [aboutManual,      setAboutManual]       = useState(false);
  const [logoutOpen,       setLogoutOpen]        = useState(false);
  const [siteLogo,         setSiteLogo]          = useState(fallbackLogo);

  const { user, logout } = useAuth();
  const isAdmin  = user?.role === "admin";
  const location = useLocation();
  const navigate = useNavigate();

  /* ── derive dropdown open state from route (no setState-in-effect) */
  const homeOpen  = homeManual  || location.pathname.startsWith("/settings/home");
  const aboutOpen = aboutManual || location.pathname.startsWith("/about/");

  /* ── fetch logo from site settings once ── */
  useEffect(() => {
    getSettings()
      .then((res) => {
        const s = res?.data?.data ?? res?.data ?? {};
        const logo = s.navbar_logo || s.nav_logo || "";
        if (logo && /^https?:\/\//i.test(logo)) setSiteLogo(logo);
      })
      .catch(() => {});
  }, []);

  /* ── body scroll lock on mobile overlay ── */
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  /* ── Escape key closes logout dialog ── */
  useEffect(() => {
    if (!logoutOpen) return undefined;
    const onKey = (e) => { if (e.key === "Escape") setLogoutOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [logoutOpen]);

  const pageTitle = useMemo(() => {
    if (PAGE_TITLES[location.pathname]) return PAGE_TITLES[location.pathname];
    if (location.pathname.startsWith("/sliders/edit"))           return "Edit Hero Slide";
    if (location.pathname.startsWith("/products/edit"))          return "Edit Product";
    if (location.pathname.startsWith("/commitment/edit"))        return "Edit Commitment Item";
    if (location.pathname.startsWith("/blogs/edit"))             return "Edit Blog";
    if (location.pathname.startsWith("/testimonials/edit"))      return "Edit Testimonial";
    if (location.pathname.startsWith("/about/problems/edit"))    return "Edit Problem Card";
    if (location.pathname.startsWith("/about/core-values/edit")) return "Edit Core Value";
    if (location.pathname === "/about/hero")           return "About - Hero Section";
    if (location.pathname === "/about/story")          return "About - Our Story";
    if (location.pathname === "/about/problems")       return "About - Problem Cards";
    if (location.pathname === "/about/problems/new")   return "Add Problem Card";
    if (location.pathname === "/about/mission")        return "About - Mission Section";
    if (location.pathname === "/about/core-values")    return "About - Core Values";
    if (location.pathname === "/about/core-values/new")return "Add Core Value";
    if (location.pathname === "/about/comparison")     return "About - Comparison";
    if (location.pathname === "/about/cta")            return "About - CTA Section";
    return "Dashboard";
  }, [location.pathname]);

  const isActive = (path) =>
    path === "/dashboard"
      ? location.pathname === "/" || location.pathname === "/dashboard"
      : location.pathname.startsWith(path);

  const closeSidebar = () => setSidebarOpen(false);

  const resolvePhoto = (value) => {
    const raw = String(value || "").trim();
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    const root = getBackendRoot();
    return raw.startsWith("/") ? `${root}${raw}` : `${root}/uploads/${raw}`;
  };

  const photoUrl = resolvePhoto(user?.profile_photo);

  return (
    <div className="admin-theme flex min-h-screen w-full bg-[var(--admin-bg)] text-white">

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ══ SIDEBAR ══════════════════════════════════════════ */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-[100] flex w-64 max-w-[85vw] flex-col
          border-r border-[var(--admin-border)] bg-[var(--admin-sidebar)]
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        `}
      >
        {/* Brand logo */}
        <div className="flex items-center gap-2 border-b border-[var(--admin-border)] px-3 py-3.5">
          <Link
            to="/dashboard"
            onClick={closeSidebar}
            className="group flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-3 py-2.5 transition-all hover:border-[var(--admin-border-amber)] hover:shadow-[0_0_16px_rgba(224,184,92,0.15)]"
          >
            <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-green-deep)] shadow-[0_4px_14px_rgba(73,99,72,0.5)]">
              <img
                src="/public/logo/General trading white storke.png"
                alt="Swift Sign"
                className="h-full w-full object-cover"
                onError={(e) => { e.currentTarget.src = fallbackLogo; }}
              />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[var(--admin-muted)]">Admin Panel</p>
              <p className="truncate text-sm font-bold text-white transition-colors group-hover:text-[var(--admin-accent)]">
                Swift Sign
              </p>
            </div>
          </Link>

          {/* Mobile close */}
          <button
            type="button"
            onClick={closeSidebar}
            className="flex-shrink-0 rounded-lg p-1.5 text-[var(--admin-muted)] hover:bg-[var(--admin-sidebar-hover)] hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <span className="pi pi-times" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2.5 pb-4">
          <p className="mb-1 mt-2 px-3 text-[9px] font-bold uppercase tracking-widest text-[var(--admin-muted)]">
            Main
          </p>

          {NAV.filter((item) => !item.adminOnly || isAdmin).map((item) => {
            /* About Us dropdown */
            if (item.group === "about") {
              const active = location.pathname.startsWith("/about/");
              return (
                <div key="about-drop" className="mb-0.5">
                  <button type="button" onClick={() => setAboutManual((p) => !p)} className={cls.drop(active)}>
                    <span>{item.label}</span>
                    <span className={`pi ${aboutOpen ? "pi-chevron-up" : "pi-chevron-down"} text-[10px] opacity-60`} />
                  </button>
                  {aboutOpen && (
                    <div className="ml-3 mt-0.5 space-y-0.5">
                      {NAV.filter((e) => e.child && e.childGroup === "about").map((e) => (
                        <Link
                          key={e.path}
                          to={e.path}
                          onClick={closeSidebar}
                          className={cls.child(location.pathname === e.path || location.pathname.startsWith(e.path + "/"))}
                        >
                          {e.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            /* Home Settings dropdown */
            if (item.path === "/settings/home") {
              return (
                <div key="home-drop" className="mb-0.5">
                  <button type="button" onClick={() => setHomeManual((p) => !p)} className={cls.drop(isActive("/settings/home"))}>
                    <span>{item.label}</span>
                    <span className={`pi ${homeOpen ? "pi-chevron-up" : "pi-chevron-down"} text-[10px] opacity-60`} />
                  </button>
                  {homeOpen && (
                    <div className="ml-3 mt-0.5 space-y-0.5">
                      {NAV.filter((e) => e.child && e.childGroup === "home").map((e) => (
                        <Link key={e.path} to={e.path} onClick={closeSidebar} className={cls.child(isActive(e.path))}>
                          {e.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            if (item.child) return null;

            return (
              <Link key={item.path} to={item.path} onClick={closeSidebar} className={cls.link(isActive(item.path))}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-[var(--admin-border)] p-2.5">
          <Link
            to="/profile"
            onClick={closeSidebar}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--admin-sidebar-hover)]"
          >
            {photoUrl ? (
              <img src={photoUrl} alt={user?.name} className="h-8 w-8 flex-shrink-0 rounded-full object-cover ring-2 ring-[var(--admin-border-amber)]" />
            ) : (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--admin-primary)] to-[var(--admin-accent)] text-xs font-bold ring-2 ring-[var(--admin-border-amber)]">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{user?.name || "Admin"}</p>
              <p className="text-xs capitalize text-[var(--admin-muted)]">{user?.role || "user"}</p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLogoutOpen(true); }}
              className="flex-shrink-0 rounded-lg p-1.5 text-[var(--admin-muted)] hover:bg-[var(--admin-sidebar-hover)] hover:text-white"
              aria-label="Logout"
            >
              <span className="pi pi-sign-out text-sm" />
            </button>
          </Link>
        </div>
      </aside>

      {/* ══ MAIN AREA ════════════════════════════════════════ */}
      <div className="flex min-w-0 flex-1 flex-col lg:ml-64">
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex min-h-14 items-center gap-3 border-b border-[var(--admin-border)] bg-[var(--admin-card)]/90 px-4 py-2.5 backdrop-blur-lg sm:min-h-16 sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex-shrink-0 rounded-lg p-2 text-[var(--admin-muted)] transition-colors hover:bg-[var(--admin-sidebar-hover)] hover:text-white lg:hidden"
            aria-label="Open menu"
          >
            <span className="pi pi-bars text-base" />
          </button>

          <h1 className="min-w-0 flex-1 truncate text-base font-bold text-white sm:text-lg">{pageTitle}</h1>

          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="rounded-lg bg-[var(--admin-primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--admin-primary-strong)]"
          >
            Logout
          </button>
        </header>

        <main className="flex-1 overflow-x-hidden p-4 sm:p-5 lg:p-6">{children}</main>
      </div>

      {/* ══ LOGOUT DIALOG ════════════════════════════════════ */}
      {logoutOpen && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-[var(--admin-border-amber)] bg-[var(--admin-card)] p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--admin-primary-light)]">
                <span className="pi pi-sign-out text-[var(--admin-primary)]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Logout</h3>
                <p className="text-xs text-[var(--admin-muted)]">You will be returned to the login page.</p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setLogoutOpen(false)}
                className="rounded-lg border border-[var(--admin-border)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--admin-card-elevated)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => { setLogoutOpen(false); logout(); navigate("/login"); }}
                className="rounded-lg bg-[var(--admin-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--admin-primary-strong)]"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
