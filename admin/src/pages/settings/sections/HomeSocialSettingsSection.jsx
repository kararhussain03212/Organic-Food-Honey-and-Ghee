import VideoUpload from "../../../components/VideoUpload";

const inputClass =
  "w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-sm text-[var(--admin-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--admin-accent)]";
const labelClass = "pt-1 text-sm font-semibold text-[var(--admin-ink)]";
const rowClass =
  "grid grid-cols-1 gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] p-3 md:grid-cols-[220px_1fr] md:items-start";

const ICON_OPTIONS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "twitter", label: "Twitter / X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "pinterest", label: "Pinterest" },
];

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

export default function HomeSocialSettingsSection({
  form,
  setField,
  socialIcons,
  setSocialIcons,
  socialVideos,
  setSocialVideos,
  uploadSocialVideo,
  removeSocialIcon,
  removeSocialVideo,
}) {
  const updateIcon = (index, patch) =>
    setSocialIcons((prev) => prev.map((x, i) => (i === index ? { ...x, ...patch } : x)));

  const updateVideo = (index, patch) =>
    setSocialVideos((prev) => prev.map((x, i) => (i === index ? { ...x, ...patch } : x)));

  return (
    <div className="space-y-3">
      {/* ── Text Content ───────────────────────────────── */}
      <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--admin-muted)]">
        Text Content
      </h3>

      <Field label="Eyebrow Label" hint='Small tag above the heading — e.g. "Social Feed"'>
        <input
          type="text"
          value={form.home_social_eyebrow || ""}
          onChange={(e) => setField("home_social_eyebrow", e.target.value)}
          className={inputClass}
          placeholder="Social Feed"
        />
      </Field>

      <Field label="Main Heading">
        <input
          type="text"
          value={form.home_social_heading || ""}
          onChange={(e) => setField("home_social_heading", e.target.value)}
          className={inputClass}
          placeholder="Follow us on social media"
        />
      </Field>

      <Field label="Description" hint="Paragraph shown below the social icons">
        <textarea
          rows={3}
          value={form.home_social_subtext || ""}
          onChange={(e) => setField("home_social_subtext", e.target.value)}
          className={inputClass}
          placeholder="Get a behind-the-scenes look at our organic honey harvesting…"
        />
      </Field>

      {/* ── Social Icons ───────────────────────────────── */}
      <h3 className="pt-2 text-xs font-semibold uppercase tracking-widest text-[var(--admin-muted)]">
        Social Icons
      </h3>

      <div className="space-y-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] p-4">
        {socialIcons.map((item, index) => (
          <div
            key={`social-icon-${index}`}
            className="grid grid-cols-1 items-center gap-2 md:grid-cols-[160px_1fr_auto]"
          >
            <select
              value={item.icon || "instagram"}
              onChange={(e) => updateIcon(index, { icon: e.target.value })}
              className={inputClass}
            >
              {ICON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={item.url || ""}
              onChange={(e) =>
                updateIcon(index, {
                  url: e.target.value,
                  label: item.label || ICON_OPTIONS.find((o) => o.value === item.icon)?.label || "",
                })
              }
              className={inputClass}
              placeholder="https://www.instagram.com/yourprofile"
            />
            <button
              type="button"
              onClick={() => removeSocialIcon(index)}
              className="shrink-0 rounded-lg border border-red-500 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setSocialIcons((prev) => [...prev, { label: "", url: "", icon: "instagram" }])
          }
          className="mt-1 rounded-lg bg-[var(--admin-accent)] px-3 py-2 text-sm font-semibold text-black hover:bg-[var(--admin-accent-strong)]"
        >
          + Add Social Icon
        </button>
      </div>

      {/* ── Feed Videos ────────────────────────────────── */}
      <h3 className="pt-2 text-xs font-semibold uppercase tracking-widest text-[var(--admin-muted)]">
        Feed Videos
      </h3>

      <div className="space-y-3">
        {socialVideos.map((video, index) => (
          <div
            key={`social-video-${index}`}
            className="space-y-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card-elevated)] p-4"
          >
            <div className="flex items-center justify-between">
              <p className={labelClass}>Video {index + 1}</p>
              <button
                type="button"
                onClick={() => removeSocialVideo(index)}
                className="rounded-lg border border-red-500 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-red-500/20"
              >
                Remove
              </button>
            </div>

            <VideoUpload
              value={video.src}
              onFileSelect={(file) => uploadSocialVideo(index, file)}
              label={`Upload Feed Video ${index + 1}`}
              helperText="MP4 or WebM, vertical reel format recommended"
            />

            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <div>
                <p className="mb-1 text-xs text-[var(--admin-muted)]">Likes (display text)</p>
                <input
                  type="text"
                  value={video.likes || ""}
                  onChange={(e) => updateVideo(index, { likes: e.target.value })}
                  className={inputClass}
                  placeholder="1.8k"
                />
              </div>
              <div>
                <p className="mb-1 text-xs text-[var(--admin-muted)]">Comments (display text)</p>
                <input
                  type="text"
                  value={video.comments || ""}
                  onChange={(e) => updateVideo(index, { comments: e.target.value })}
                  className={inputClass}
                  placeholder="142"
                />
              </div>
              <div>
                <p className="mb-1 text-xs text-[var(--admin-muted)]">Reel Link (opens on click)</p>
                <input
                  type="text"
                  value={video.link || ""}
                  onChange={(e) => updateVideo(index, { link: e.target.value })}
                  className={inputClass}
                  placeholder="https://www.instagram.com/reel/…"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setSocialVideos((prev) => [...prev, { src: "", likes: "", comments: "", link: "" }])
          }
          className="rounded-lg bg-[var(--admin-accent)] px-3 py-2 text-sm font-semibold text-black hover:bg-[var(--admin-accent-strong)]"
        >
          + Add Video
        </button>
      </div>
    </div>
  );
}
