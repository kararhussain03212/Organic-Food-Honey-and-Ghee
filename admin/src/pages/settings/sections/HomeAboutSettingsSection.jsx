import ImageUpload from "../../../components/ImageUpload";
import FieldRows from "./FieldRows";

export default function HomeAboutSettingsSection({
  fieldKeys,
  form,
  setField,
  toLabel,
  toImageUrl,
  uploadToSetting,
  aboutProperties,
  setAboutProperties,
  gheeCards,
  setGheeCards,
  uploadCardIcon,
}) {
  return (
    <>
      <FieldRows keys={fieldKeys} form={form} setField={setField} toLabel={toLabel} />

      <div className="grid grid-cols-1 gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] p-3 md:grid-cols-[280px_1fr] md:items-start">
        <label className="pt-2 text-sm font-semibold text-[var(--admin-ink)]">Home About Image</label>
        <ImageUpload
          value={toImageUrl(form.home_about_image)}
          onFileSelect={(file) => uploadToSetting("home_about_image", file, "settings")}
          label="Upload About Image"
          helperText="Used in Home About section"
        />
      </div>

      <div className="space-y-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] p-4">
        <h4 className="text-sm font-semibold text-[var(--admin-ink)]">About Properties</h4>
        {aboutProperties.map((item, index) => (
          <div key={`prop-${index}`} className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto]">
            <input
              type="text"
              value={item}
              onChange={(event) =>
                setAboutProperties((prev) => prev.map((x, i) => (i === index ? event.target.value : x)))
              }
              className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-[var(--admin-ink)]"
            />
            <button
              type="button"
              onClick={() => setAboutProperties((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))}
              className="rounded-lg border border-red-500 bg-red-500/10 px-3 py-2 font-medium text-red-400 hover:bg-red-500/20"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setAboutProperties((prev) => [...prev, ""])}
          className="rounded-lg bg-[var(--admin-accent)] px-3 py-2 text-sm font-semibold text-black hover:bg-[var(--admin-accent-strong)]"
        >
          + Add Property
        </button>
      </div>

      <div className="space-y-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] p-4">
        <h4 className="text-sm font-semibold text-[var(--admin-ink)]">Ghee Cards</h4>
        {gheeCards.map((item, index) => (
          <div key={`card-${index}`} className="space-y-3 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] p-3">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_auto]">
              <input
                type="text"
                placeholder="Icon key (cow/goat/buffalo)"
                value={item.icon}
                onChange={(event) =>
                  setGheeCards((prev) => prev.map((x, i) => (i === index ? { ...x, icon: event.target.value } : x)))
                }
                className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-[var(--admin-ink)]"
              />
              <input
                type="text"
                placeholder="Title"
                value={item.title}
                onChange={(event) =>
                  setGheeCards((prev) => prev.map((x, i) => (i === index ? { ...x, title: event.target.value } : x)))
                }
                className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-[var(--admin-ink)]"
              />
              <button
                type="button"
                onClick={() => setGheeCards((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))}
                className="rounded-lg border border-red-500 bg-red-500/10 px-3 py-2 font-medium text-red-400 hover:bg-red-500/20"
              >
                Remove
              </button>
            </div>
            <textarea
              rows={3}
              placeholder="Description"
              value={item.description}
              onChange={(event) =>
                setGheeCards((prev) =>
                  prev.map((x, i) => (i === index ? { ...x, description: event.target.value } : x)),
                )
              }
              className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-[var(--admin-ink)]"
            />
            <ImageUpload
              value={toImageUrl(item.icon_url)}
              onFileSelect={(file) => uploadCardIcon(index, file)}
              label="Upload Card Icon"
              helperText="Optional icon image for this card"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setGheeCards((prev) => [...prev, { icon: "cow", icon_url: "", title: "", description: "" }])}
          className="rounded-lg bg-[var(--admin-accent)] px-3 py-2 text-sm font-semibold text-black hover:bg-[var(--admin-accent-strong)]"
        >
          + Add Card
        </button>
      </div>
    </>
  );
}
