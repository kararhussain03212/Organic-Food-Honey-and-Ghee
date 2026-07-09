import ImageUpload from "../../../components/ImageUpload";
import FieldRows from "./FieldRows";

function LinkListEditor({ title, addLabel, items, setItems }) {
  return (
    <div className="space-y-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] p-4">
      <h4 className="text-sm font-semibold text-[var(--admin-ink)]">{title}</h4>
      {items.map((item, index) => (
        <div key={`link-${index}`} className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_auto]">
          <input
            type="text"
            placeholder="Label"
            value={item.label}
            onChange={(event) =>
              setItems((prev) => prev.map((x, i) => (i === index ? { ...x, label: event.target.value } : x)))
            }
            className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-[var(--admin-ink)]"
          />
          <input
            type="text"
            placeholder="Path"
            value={item.path}
            onChange={(event) =>
              setItems((prev) => prev.map((x, i) => (i === index ? { ...x, path: event.target.value } : x)))
            }
            className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-[var(--admin-ink)]"
          />
          <button
            type="button"
            onClick={() => setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))}
            className="rounded-lg border border-red-500 bg-red-500/10 px-3 py-2 font-medium text-red-400 hover:bg-red-500/20"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setItems((prev) => [...prev, { label: "", path: "" }])}
        className="rounded-lg bg-[var(--admin-accent)] px-3 py-2 text-sm font-semibold text-black hover:bg-[var(--admin-accent-strong)]"
      >
        + {addLabel}
      </button>
    </div>
  );
}

export default function FooterSettingsSection({
  fieldKeys,
  form,
  setField,
  toLabel,
  toImageUrl,
  uploadToSetting,
  footerLinks,
  setFooterLinks,
  footerQuickLinks,
  setFooterQuickLinks,
  footerSocialLinks,
  setFooterSocialLinks,
}) {
  const filteredFieldKeys = fieldKeys.filter((key) =>
    key !== "footer_logo_alt" &&
    !key.startsWith("footer_social_")
  );

  return (
    <>
      <FieldRows keys={filteredFieldKeys} form={form} setField={setField} toLabel={toLabel} />

      <div className="grid grid-cols-1 gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] p-3 md:grid-cols-[280px_1fr] md:items-start">
        <label className="pt-2 text-sm font-semibold text-[var(--admin-ink)]">Footer Logo</label>
        <div className="space-y-3">
          <ImageUpload
            value={toImageUrl(form.footer_logo)}
            onFileSelect={(file) => uploadToSetting("footer_logo", file, "settings")}
            label="Upload Footer Logo"
            helperText="PNG, JPG, SVG"
          />
          <input
            type="text"
            placeholder="Footer logo alt text"
            value={form.footer_logo_alt || ""}
            onChange={(event) => setField("footer_logo_alt", event.target.value)}
            className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2.5 text-sm text-[var(--admin-ink)] outline-none transition focus:border-[var(--admin-primary)]"
          />
        </div>
      </div>

      <LinkListEditor
        title="Footer Quick Links (left column)"
        addLabel="Add Quick Link"
        items={footerQuickLinks}
        setItems={setFooterQuickLinks}
      />

      <LinkListEditor
        title="Footer Policy Links (right column)"
        addLabel="Add Footer Link"
        items={footerLinks}
        setItems={setFooterLinks}
      />

      <div className="space-y-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] p-4">
        <h4 className="text-sm font-semibold text-[var(--admin-ink)]">Footer Social Links</h4>
        {footerSocialLinks.map((item, index) => (
          <div
            key={`footer-social-${index}`}
            className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-[minmax(150px,1fr)_minmax(180px,1.2fr)_minmax(120px,0.8fr)_100px] xl:items-center"
          >
            <input
              type="text"
              placeholder="Label"
              value={item.label}
              onChange={(event) =>
                setFooterSocialLinks((prev) => prev.map((x, i) => (i === index ? { ...x, label: event.target.value } : x)))
              }
              className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-[var(--admin-ink)]"
            />
            <input
              type="text"
              placeholder="URL"
              value={item.url}
              onChange={(event) =>
                setFooterSocialLinks((prev) => prev.map((x, i) => (i === index ? { ...x, url: event.target.value } : x)))
              }
              className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-[var(--admin-ink)]"
            />
            <input
              type="text"
              placeholder="Icon"
              value={item.icon}
              onChange={(event) =>
                setFooterSocialLinks((prev) => prev.map((x, i) => (i === index ? { ...x, icon: event.target.value } : x)))
              }
              className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-[var(--admin-ink)]"
            />
            <button
              type="button"
              onClick={() => setFooterSocialLinks((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))}
              className="w-full rounded-lg border border-red-500 bg-red-500/10 px-3 py-2 font-medium text-red-400 hover:bg-red-500/20 md:col-span-2 xl:col-span-1"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setFooterSocialLinks((prev) => [...prev, { label: "", url: "", icon: "facebook" }])}
          className="rounded-lg bg-[var(--admin-accent)] px-3 py-2 text-sm font-semibold text-black hover:bg-[var(--admin-accent-strong)]"
        >
          + Add Social Link
        </button>
      </div>
    </>
  );
}
