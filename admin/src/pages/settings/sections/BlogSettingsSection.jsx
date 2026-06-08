import ImageUpload from "../../../components/ImageUpload";

const inputClass =
  "w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-sm text-[var(--admin-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--admin-accent)]";
const labelClass = "pt-1 text-sm font-semibold text-[var(--admin-ink)]";
const rowClass =
  "grid grid-cols-1 gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] p-3 md:grid-cols-[220px_1fr] md:items-start";

function Field({ label, hint, children }) {
  return (
    <div className={rowClass}>
      <div>
        <p className={labelClass}>{label}</p>
        {hint && <p className="mt-0.5 text-xs text-[var(--admin-muted)]">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

export default function BlogSettingsSection({ form, setField, toImageUrl, uploadToSetting }) {
  return (
    <div className="space-y-3">
      {/* ── Hero Text ────────────────────────────────── */}
      <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--admin-muted)]">
        Hero Section
      </h3>

      <Field label="Badge Text" hint='Small tag above the heading — e.g. "Wellness Journal"'>
        <input
          type="text"
          value={form.blog_badge_text || ""}
          onChange={(e) => setField("blog_badge_text", e.target.value)}
          className={inputClass}
          placeholder="Wellness Journal"
        />
      </Field>

      <Field label="Hero Title" hint="First part of the large heading">
        <input
          type="text"
          value={form.blog_hero_title || ""}
          onChange={(e) => setField("blog_hero_title", e.target.value)}
          className={inputClass}
          placeholder="Nourish Your Mind &"
        />
      </Field>

      <Field label="Title Accent" hint="Highlighted word(s) rendered in the accent colour">
        <input
          type="text"
          value={form.blog_hero_title_accent || ""}
          onChange={(e) => setField("blog_hero_title_accent", e.target.value)}
          className={inputClass}
          placeholder="Body"
        />
      </Field>

      <Field label="Description" hint="Subtitle paragraph below the heading">
        <textarea
          rows={3}
          value={form.blog_hero_description || ""}
          onChange={(e) => setField("blog_hero_description", e.target.value)}
          className={inputClass}
          placeholder="Explore healthy living, natural nutrition…"
        />
      </Field>

      <Field label="Search Placeholder" hint="Placeholder text inside the hero search bar">
        <input
          type="text"
          value={form.blog_search_placeholder || ""}
          onChange={(e) => setField("blog_search_placeholder", e.target.value)}
          className={inputClass}
          placeholder="Search articles, topics, ingredients..."
        />
      </Field>

      {/* ── Hero Image ────────────────────────────────── */}
      {/* <h3 className="pt-2 text-xs font-semibold uppercase tracking-widest text-[var(--admin-muted)]">
        Hero Image
      </h3> */}

      {/* <div className={rowClass}>
        <div>
          <p className={labelClass}>Blog Hero Image</p>
          <p className="mt-0.5 text-xs text-[var(--admin-muted)]">Banner image for the Blog page header</p>
        </div>
        <ImageUpload
          value={toImageUrl(form.blog_page_hero_image)}
          onFileSelect={(file) => uploadToSetting("blog_page_hero_image", file, "settings")}
          label="Upload Blog Hero Image"
          helperText="Recommended: wide landscape, min 1200 px wide"
        />
      </div> */}
    </div>
  );
}
