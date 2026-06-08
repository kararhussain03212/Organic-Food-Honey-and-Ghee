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

export default function HomeAboutSettingsSection({
  form,
  setField,
  toImageUrl,
  uploadToSetting,
  storyBullets,
  setStoryBullets,
}) {
  return (
    <div className="space-y-3">
      {/* ── Text Content ───────────────────────────────── */}
      <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--admin-muted)]">
        Text Content
      </h3>

      <Field label="Eyebrow Label" hint='Small tag above the heading — e.g. "About Us"'>
        <input
          type="text"
          value={form.home_story_eyebrow || ""}
          onChange={(e) => setField("home_story_eyebrow", e.target.value)}
          className={inputClass}
          placeholder="About Us"
        />
      </Field>

      <Field label="Main Heading" hint="First line of the large heading">
        <input
          type="text"
          value={form.home_story_heading || ""}
          onChange={(e) => setField("home_story_heading", e.target.value)}
          className={inputClass}
          placeholder="Pure From the Hive,"
        />
      </Field>

      <Field label="Heading Accent" hint="Second line rendered in green">
        <input
          type="text"
          value={form.home_story_heading_accent || ""}
          onChange={(e) => setField("home_story_heading_accent", e.target.value)}
          className={inputClass}
          placeholder="Straight to Your Table"
        />
      </Field>

      <Field label="Description" hint="Paragraph shown below the heading">
        <textarea
          rows={3}
          value={form.home_story_text || ""}
          onChange={(e) => setField("home_story_text", e.target.value)}
          className={inputClass}
          placeholder="Our family has been dedicated to bringing you the purest, most authentic organic products…"
        />
      </Field>

      {/* ── Section Image ──────────────────────────────── */}
      <h3 className="pt-2 text-xs font-semibold uppercase tracking-widest text-[var(--admin-muted)]">
        Section Image
      </h3>

      <div className={rowClass}>
        <div>
          <p className={labelClass}>Story Photo</p>
          <p className="mt-0.5 text-xs text-[var(--admin-muted)]">
            Displayed on the left side of the section
          </p>
        </div>
        <ImageUpload
          value={toImageUrl(form.home_story_image)}
          onFileSelect={(file) => uploadToSetting("home_story_image", file, "settings")}
          label="Upload Story Image"
          helperText="Recommended: square or portrait, min 600 px wide"
        />
      </div>

      {/* ── Bullet Points ──────────────────────────────── */}
      <h3 className="pt-2 text-xs font-semibold uppercase tracking-widest text-[var(--admin-muted)]">
        Bullet Points
      </h3>

      <div className="space-y-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] p-4">
        {storyBullets.length === 0 ? (
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-[var(--admin-accent)]">●</span>
            <input
              type="text"
              value=""
              onChange={(e) => setStoryBullets([e.target.value])}
              className={inputClass}
              placeholder="Bullet point 1"
            />
          </div>
        ) : (
          storyBullets.map((bullet, index) => (
            <div key={`bullet-${index}`} className="flex items-center gap-2">
              <span className="shrink-0 text-[var(--admin-accent)]">●</span>
              <input
                type="text"
                value={bullet}
                onChange={(e) =>
                  setStoryBullets((prev) =>
                    prev.map((x, i) => (i === index ? e.target.value : x)),
                  )
                }
                className={inputClass}
                placeholder={`Bullet point ${index + 1}`}
              />
              <button
                type="button"
                onClick={() =>
                  setStoryBullets((prev) =>
                    prev.length > 1 ? prev.filter((_, i) => i !== index) : prev,
                  )
                }
                className="shrink-0 rounded-lg border border-red-500 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20"
              >
                Remove
              </button>
            </div>
          ))
        )}
        <button
          type="button"
          onClick={() => setStoryBullets((prev) => [...prev, ""])}
          className="mt-1 rounded-lg bg-[var(--admin-accent)] px-3 py-2 text-sm font-semibold text-black hover:bg-[var(--admin-accent-strong)]"
        >
          + Add Bullet
        </button>
      </div>

      {/* ── CTA Button ─────────────────────────────────── */}
      <h3 className="pt-2 text-xs font-semibold uppercase tracking-widest text-[var(--admin-muted)]">
        Call-to-Action Button
      </h3>

      <Field label="Button Text">
        <input
          type="text"
          value={form.home_story_btn_text || ""}
          onChange={(e) => setField("home_story_btn_text", e.target.value)}
          className={inputClass}
          placeholder="Explore Our Products"
        />
      </Field>

      <Field label="Button Link" hint="Use #products for an anchor, or a full path like /products">
        <input
          type="text"
          value={form.home_story_btn_link || ""}
          onChange={(e) => setField("home_story_btn_link", e.target.value)}
          className={inputClass}
          placeholder="#products"
        />
      </Field>
    </div>
  );
}
