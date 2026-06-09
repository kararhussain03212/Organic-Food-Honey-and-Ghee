import ImageUpload from "../../../components/ImageUpload";
import FieldRows from "./FieldRows";

export default function NavbarSettingsSection({
  fieldKeys,
  form,
  setField,
  toLabel,
  toImageUrl,
  uploadToSetting,
  navLinks,
  setNavLinks,
}) {
  const filteredFieldKeys = fieldKeys.filter(
    (key) => key !== "nav_logo_alt" && key !== "nav_cart_alt",
  );

  const updateLink = (index, key, value) => {
    setNavLinks((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  return (
    <div className="space-y-4">
      <FieldRows keys={filteredFieldKeys} form={form} setField={setField} toLabel={toLabel} />

      <div className="grid grid-cols-1 gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] p-3 md:grid-cols-[280px_1fr] md:items-start">
        <label className="pt-2 text-sm font-semibold text-[var(--admin-ink)]">Navbar Logo</label>
        <div className="space-y-3">
          <ImageUpload
            value={toImageUrl(form.nav_logo)}
            onFileSelect={(file) => uploadToSetting("nav_logo", file, "settings")}
            label="Upload Navbar Logo"
            helperText="PNG, JPG, SVG"
          />
          <input
            type="text"
            placeholder="Navbar logo alt text"
            value={form.nav_logo_alt || ""}
            onChange={(event) => setField("nav_logo_alt", event.target.value)}
            className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-sm text-[var(--admin-ink)] outline-none transition focus:border-[var(--admin-primary)]"
          />
        </div>
      </div>

      {/* <div className="grid grid-cols-1 gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] p-3 md:grid-cols-[280px_1fr] md:items-start">
        <label className="pt-2 text-sm font-semibold text-[var(--admin-ink)]">Cart Icon</label>
        <div className="space-y-3">
          <ImageUpload
            value={toImageUrl(form.nav_cart_icon)}
            onFileSelect={(file) => uploadToSetting("nav_cart_icon", file, "icons")}
            label="Upload Cart Icon"
            helperText="Optional. If empty, default cart icon is used."
          />
          <input
            type="text"
            placeholder="Cart icon alt text"
            value={form.nav_cart_alt || ""}
            onChange={(event) => setField("nav_cart_alt", event.target.value)}
            className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-sm text-[var(--admin-ink)] outline-none transition focus:border-[var(--admin-primary)]"
          />
        </div>
      </div> */}

      <div className="space-y-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-[var(--admin-ink)]">Navbar Links</h4>
          <span className="text-xs text-[var(--admin-muted)]">Set Label, Path/URL and target behavior</span>
        </div>

        <div className="hidden grid-cols-[1fr_1fr_180px_auto] gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--admin-muted)] md:grid">
          <span>Label</span>
          <span>Path / URL</span>
          <span>Target</span>
          <span>Action</span>
        </div>

        {navLinks.map((item, index) => (
          <div key={`nav-${index}`} className="grid grid-cols-1 gap-2 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] p-2 md:grid-cols-[1fr_1fr_180px_auto] md:items-center">
            <input
              type="text"
              placeholder="Home"
              value={item.label || ""}
              onChange={(event) => updateLink(index, "label", event.target.value)}
              className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] px-3 py-2 text-[var(--admin-ink)] outline-none transition focus:border-[var(--admin-primary)]"
            />
            <input
              type="text"
              placeholder="/about or https://example.com"
              value={item.path || ""}
              onChange={(event) => updateLink(index, "path", event.target.value)}
              className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] px-3 py-2 text-[var(--admin-ink)] outline-none transition focus:border-[var(--admin-primary)]"
            />
            <select
              value={item.target || "_self"}
              onChange={(event) => updateLink(index, "target", event.target.value)}
              className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] px-3 py-2 text-[var(--admin-ink)] outline-none transition focus:border-[var(--admin-primary)]"
            >
              <option value="_self">Same Tab (_self)</option>
              <option value="_blank">New Tab (_blank)</option>
            </select>
            <button
              type="button"
              onClick={() => setNavLinks((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))}
              className="rounded-lg border border-red-500 bg-red-500/10 px-3 py-2 font-medium text-red-400 hover:bg-red-500/20"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setNavLinks((prev) => [...prev, { label: "", path: "", target: "_self" }])}
          className="rounded-lg bg-[var(--admin-accent)] px-3 py-2 text-sm font-semibold text-black hover:bg-[var(--admin-accent-strong)]"
        >
          + Add Link
        </button>
      </div>
    </div>
  );
}
