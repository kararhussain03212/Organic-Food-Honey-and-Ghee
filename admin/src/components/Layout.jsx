import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import foodLogo from "../assets/images/web_logo.png";
import { normalizeUserRole } from "../modules/users/constants";
import { getBackendRoot } from "../api/runtimeApi";

const navItems = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/users", label: "User Management", adminOnly: true },
  { path: "/sliders", label: "Hero Slides" },
  { path: "/products", label: "Products" },
  { path: "/blogs", label: "Blogs" },
  { path: "/testimonials", label: "Testimonials" },
  { path: "/settings/navbar", label: "Navbar" },
  { path: "/settings/footer", label: "Footer" },
  // About Us Management
  { path: "/about", label: "About Us", group: "aboutMgmt" },
  {
    path: "/about/hero",
    label: "Hero Section",
    child: true,
    childGroup: "aboutMgmt",
  },
  {
    path: "/about/story",
    label: "Our Story",
    child: true,
    childGroup: "aboutMgmt",
  },
  {
    path: "/about/problems",
    label: "Why We Exist",
    child: true,
    childGroup: "aboutMgmt",
  },
  {
    path: "/about/mission",
    label: "Mission Section",
    child: true,
    childGroup: "aboutMgmt",
  },
  {
    path: "/about/core-values",
    label: "Core Values",
    child: true,
    childGroup: "aboutMgmt",
  },
  {
    path: "/about/comparison",
    label: "Comparison",
    child: true,
    childGroup: "aboutMgmt",
  },
  {
    path: "/about/cta",
    label: "CTA Section",
    child: true,
    childGroup: "aboutMgmt",
  },
  // Settings

  { path: "/settings/home", label: "Home" },
  {
    path: "/settings/home-about",
    label: "Home - Our Story",
    child: true,
    childGroup: "home",
  },
  {
    path: "/settings/home-company",
    label: "Home - Collection",
    child: true,
    childGroup: "home",
  },
  {
    path: "/settings/home-commitment",
    label: "Home - Commitment",
    child: true,
    childGroup: "home",
  },
  {
    path: "/settings/home-testimonials",
    label: "Home - Testimonials",
    child: true,
    childGroup: "home",
  },
  {
    path: "/settings/home-authentic",
    label: "Home - Authentic",
    child: true,
    childGroup: "home",
  },
  { path: "/settings/product", label: "Product Page" },
  { path: "/settings/blog", label: "Blog Page" },
  // { path: "/settings/contact",  label: "Contact & WhatsApp" },
  { path: "/contact-settings", label: "Contact Page" },

];

const pageTitleMap = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/sliders": "Hero Slides",
  "/sliders/new": "Add Hero Slide",
  "/products": "Products",
  "/products/new": "Add Product",
  "/commitment": "Commitment Items",
  "/commitment/new": "Add Commitment Item",
  "/blogs": "Blogs",
  "/blogs/new": "Add Blog",
  "/testimonials": "Testimonials",
  "/testimonials/new": "Add Testimonial",
  "/contact-messages": "Contact Messages",
  "/contact-settings": "Contact Page Settings",
  "/settings": "Site Settings",
  "/settings/navbar": "Navbar Settings",
  "/settings/home": "Home Settings",
  "/settings/home-about": "Home - Our Story Settings",
  "/settings/home-company": "Home - Collection Settings",
  "/settings/home-commitment": "Home - Commitment Settings",
  "/settings/home-testimonials": "Home - Testimonials Settings",
  "/settings/home-authentic": "Home - Authentic Settings",
  "/settings/home-blog": "Home - Blog Settings",
  "/settings/footer": "Footer Settings",
  "/settings/product": "Product Page Settings",
  "/settings/blog": "Blog Page Settings",
  "/settings/contact": "Contact & WhatsApp Settings",
  "/settings/about": "About Page Settings",
  "/settings/about-hero": "About - Hero Settings",
  "/settings/about-info": "About - Story Settings",
  "/settings/about-company": "About - Timeline Settings",
  "/settings/about-category": "About - Mission Settings",
  "/settings/about-process": "About - Duality Settings",
  "/profile": "Admin Profile",
  "/users": "User Management",
};

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [homeDropdownOpen, setHomeDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [aboutMgmtOpen, setAboutMgmtOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { user, logout } = useAuth();
  const isAdmin = normalizeUserRole(user?.role) === "admin";
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitle = useMemo(() => {
    if (pageTitleMap[location.pathname]) {
      return pageTitleMap[location.pathname];
    }
    if (location.pathname.startsWith("/sliders/edit")) return "Edit Hero Slide";
    if (location.pathname.startsWith("/products/edit")) return "Edit Product";
    if (location.pathname.startsWith("/commitment/edit")) return "Edit Commitment Item";
    if (location.pathname.startsWith("/blogs/edit")) return "Edit Blog";
    if (location.pathname.startsWith("/testimonials/edit")) return "Edit Testimonial";
    if (location.pathname.startsWith("/about/problems/edit")) return "Edit Problem Card";
    if (location.pathname.startsWith("/about/core-values/edit")) return "Edit Core Value";
    if (location.pathname === "/about/hero") return "About - Hero Section";
    if (location.pathname === "/about/story") return "About - Our Story";
    if (location.pathname === "/about/problems") return "About - Problem Cards";
    if (location.pathname === "/about/problems/new") return "Add Problem Card";
    if (location.pathname === "/about/mission") return "About - Mission Section";
    if (location.pathname === "/about/core-values") return "About - Core Values";
    if (location.pathname === "/about/core-values/new") return "Add Core Value";
    if (location.pathname === "/about/comparison") return "About - Comparison Section";
    if (location.pathname === "/about/cta") return "About - CTA Section";
    return "Dashboard";
  }, [location.pathname]);

  const isActivePath = (path) =>
    path === "/dashboard"
      ? location.pathname === "/" || location.pathname === "/dashboard"
      : location.pathname.startsWith(path);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.startsWith("/settings/home")) {
      setHomeDropdownOpen(true);
    }
    if (location.pathname.startsWith("/settings/about")) {
      setAboutDropdownOpen(true);
    }
    if (location.pathname.startsWith("/about/")) {
      setAboutMgmtOpen(true);
    }
  }, [location.pathname]);

  const requestLogout = () => {
    setLogoutDialogOpen(true);
  };

  const closeLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  const handleLogout = () => {
    setLogoutDialogOpen(false);
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (!logoutDialogOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setLogoutDialogOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [logoutDialogOpen]);

  const resolveProfilePhoto = (value) => {
    const raw = String(value || "").trim();
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    const apiRoot = getBackendRoot();
    if (!apiRoot) return raw;
    if (raw.startsWith("/")) return `${apiRoot}${raw}`;
    return `${apiRoot}/uploads/${raw}`;
  };

  const userPhotoUrl = resolveProfilePhoto(user?.profile_photo);

  return (
    <div className="admin-theme flex min-h-screen w-full bg-[var(--admin-bg)] text-[var(--admin-ink)]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[90] bg-[var(--admin-primary)] text-blacklack/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-[100] flex w-[260px] max-w-[85vw] flex-col
          border-r border-[var(--admin-border)] bg-[var(--admin-sidebar)]
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="border-b border-[var(--admin-border)] px-5 py-5">
          <Link to="/dashboard" onClick={() => setSidebarOpen(false)} className="group flex items-center gap-3 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] px-3 py-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#f9cf36] via-[#e8a313] to-[#b86f00] shadow-[0_8px_24px_rgba(232,163,19,0.3)]">
              <img src={foodLogo} alt="Arion Organic Food" className="h-9 w-9 rounded-lg object-cover" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--admin-muted)]">Admin Panel</p>
              <p className="text-base font-bold text-white group-hover:text-[var(--admin-primary)]">Arion Organic</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3">
          <p className="mt-2 px-3 py-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--admin-muted)]">
            Main
          </p>
          {navItems.filter((item) => !item.adminOnly || isAdmin).map((item) => (
            item.group === "aboutMgmt" ? (
              <div key="aboutMgmt" className="mb-0.5">
                <button
                  type="button"
                  onClick={() => setAboutMgmtOpen((prev) => !prev)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm duration-200 ${
                    location.pathname.startsWith("/about/")
                      ? "border border-[var(--admin-border-amber)] bg-[var(--admin-sidebar-hover)] text-[var(--admin-primary)] font-semibold"
                      : "text-[var(--admin-muted)] hover:bg-[var(--admin-sidebar-hover)] hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={`pi ${aboutMgmtOpen ? "pi-chevron-up" : "pi-chevron-down"} text-xs`} />
                </button>
                {aboutMgmtOpen ? (
                  <div className="mt-1 space-y-0.5">
                    {navItems
                      .filter((entry) => entry.child && entry.childGroup === "aboutMgmt")
                      .map((entry) => (
                        <Link
                          key={entry.path}
                          to={entry.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`ml-3 flex items-center gap-3 rounded-xl px-3 py-2 text-sm duration-200 ${
                            location.pathname === entry.path || location.pathname.startsWith(entry.path + "/")
                              ? "border border-[var(--admin-border-amber)] bg-[var(--admin-sidebar-hover)] text-[var(--admin-primary)] font-semibold"
                              : "text-[var(--admin-muted)] hover:bg-[var(--admin-sidebar-hover)] hover:text-white"
                          }`}
                        >
                          {entry.label}
                        </Link>
                      ))}
                  </div>
                ) : null}
              </div>
            ) : item.path === "/settings/home" ? (
              <div key={item.path} className="mb-0.5">
                <button
                  type="button"
                  onClick={() => setHomeDropdownOpen((prev) => !prev)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm duration-200 ${
                    isActivePath("/settings/home")
                      ? "border border-[var(--admin-border-amber)] bg-[var(--admin-sidebar-hover)] text-[var(--admin-primary)] font-semibold"
                      : "text-[var(--admin-muted)] hover:bg-[var(--admin-sidebar-hover)] hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={`pi ${homeDropdownOpen ? "pi-chevron-up" : "pi-chevron-down"} text-xs`} />
                </button>
                {homeDropdownOpen ? (
                  <div className="mt-1 space-y-0.5">
                    {navItems
                      .filter((entry) => entry.child && entry.childGroup === "home")
                      .map((entry) => (
                        <Link
                          key={entry.path}
                          to={entry.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`ml-3 flex items-center gap-3 rounded-xl px-3 py-2 text-sm duration-200 ${
                            isActivePath(entry.path)
                              ? "border border-[var(--admin-border-amber)] bg-[var(--admin-sidebar-hover)] text-[var(--admin-primary)] font-semibold"
                              : "text-[var(--admin-muted)] hover:bg-[var(--admin-sidebar-hover)] hover:text-white"
                          }`}
                        >
                          {entry.label}
                        </Link>
                      ))}
                  </div>
                ) : null}
              </div>
            ) : item.path === "/settings/about" ? (
              <div key={item.path} className="mb-0.5">
                <button
                  type="button"
                  onClick={() => setAboutDropdownOpen((prev) => !prev)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm duration-200 ${
                    isActivePath("/settings/about")
                      ? "border border-[var(--admin-border-amber)] bg-[var(--admin-sidebar-hover)] text-[var(--admin-primary)] font-semibold"
                      : "text-[var(--admin-muted)] hover:bg-[var(--admin-sidebar-hover)] hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={`pi ${aboutDropdownOpen ? "pi-chevron-up" : "pi-chevron-down"} text-xs`} />
                </button>
                {aboutDropdownOpen ? (
                  <div className="mt-1 space-y-0.5">
                    {navItems
                      .filter((entry) => entry.child && entry.childGroup === "about")
                      .map((entry) => (
                        <Link
                          key={entry.path}
                          to={entry.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`ml-3 flex items-center gap-3 rounded-xl px-3 py-2 text-sm duration-200 ${
                            isActivePath(entry.path)
                              ? "border border-[var(--admin-border-amber)] bg-[var(--admin-sidebar-hover)] text-[var(--admin-primary)] font-semibold"
                              : "text-[var(--admin-muted)] hover:bg-[var(--admin-sidebar-hover)] hover:text-white"
                          }`}
                        >
                          {entry.label}
                        </Link>
                      ))}
                  </div>
                ) : null}
              </div>
            ) : item.child ? null : (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`mb-0.5 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm duration-200 ${
                  isActivePath(item.path)
                    ? "border border-[var(--admin-border-amber)] bg-[var(--admin-sidebar-hover)] text-[var(--admin-primary)] font-semibold"
                    : "text-[var(--admin-muted)] hover:bg-[var(--admin-sidebar-hover)] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            )
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-[var(--admin-border)] p-3">
          <Link
            to="/profile"
            onClick={() => setSidebarOpen(false)}
            className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[var(--admin-sidebar-hover)]"
          >
            {userPhotoUrl ? (
              <img
                src={userPhotoUrl}
                alt={user?.name || "User"}
                className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--admin-primary)] to-[var(--admin-primary-strong)] text-xs font-bold text-white">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-[var(--admin-muted)]">
                {user?.role?.replace("_", " ") || "User"}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                requestLogout();
              }}
              className="text-sm text-[var(--admin-muted)] hover:text-white"
              aria-label="Logout"
            >
              <span className="pi pi-sign-out" aria-hidden="true" />
            </button>
          </Link>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col lg:ml-[260px]">
        {/* Top header */}
        <header className="sticky top-0 z-40 flex min-h-16 items-center gap-3 border-b border-[var(--admin-border)] bg-[var(--admin-card)] px-4 py-3 sm:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-[var(--admin-muted)] hover:bg-[var(--admin-sidebar-hover)] hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <span className="pi pi-bars text-base" aria-hidden="true" />
          </button>

          <h1 className="min-w-0 flex-1 truncate text-base font-bold text-white sm:text-lg">
            {pageTitle}
          </h1>

          <button
            type="button"
            onClick={requestLogout}
            className="rounded-lg border border-[var(--admin-border-amber)] bg-[var(--admin-primary)] px-3 py-1.5 text-sm font-semibold text-black hover:bg-[var(--admin-amber)] sm:px-3.5"
          >
            Logout
          </button>
        </header>

        <main className="flex-1 p-4 text-white sm:p-6">{children}</main>
      </div>

      {logoutDialogOpen ? (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/65 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--admin-border-amber)] bg-[var(--admin-card)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
            <h3 className="text-xl font-bold text-white">Logout</h3>
            <p className="mt-3 text-sm leading-6 text-white/75">
              Are you sure you want to logout from the admin panel?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeLogoutDialog}
                className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg-deep)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--admin-card-elevated)]"
              >
                No
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-[var(--admin-border-amber)] bg-[var(--admin-primary)] px-4 py-2 text-sm font-semibold text-black hover:bg-[var(--admin-primary-strong)]"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
