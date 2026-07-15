import { useEffect, useState } from "react";
import { getPartnerPageSettings, updatePartnerPageSettings } from "../../api/partnerApi";

const parseJson = (value, fallback = []) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) {
    try { return JSON.parse(value); } catch { return fallback; }
  }
  return fallback;
};

const inputCls = "w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white";
const labelCls = "mb-1 block text-sm text-white/80";

export default function PartnerPageSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    hero_badge: "", hero_heading: "", hero_heading_accent: "", hero_description: "",
    program_badge: "", program_heading: "", program_subheading: "", who_its_for: "",
    who_its_for_title: "", how_it_works_title: "", what_you_get_title: "",
    form_title: "",
    placeholder_full_name: "", placeholder_phone: "", placeholder_city: "",
    placeholder_handle: "", placeholder_reason: "",
    team_badge: "", team_heading: "", team_subheading: "",
  });
  const [steps, setSteps] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [applicantTypes, setApplicantTypes] = useState([]);

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  useEffect(() => {
    getPartnerPageSettings()
      .then((res) => {
        const data = res?.data?.data ?? {};
        setForm({
          hero_badge: data.hero_badge || "",
          hero_heading: data.hero_heading || "",
          hero_heading_accent: data.hero_heading_accent || "",
          hero_description: data.hero_description || "",
          program_badge: data.program_badge || "",
          program_heading: data.program_heading || "",
          program_subheading: data.program_subheading || "",
          who_its_for: data.who_its_for || "",
          who_its_for_title: data.who_its_for_title || "",
          how_it_works_title: data.how_it_works_title || "",
          what_you_get_title: data.what_you_get_title || "",
          form_title: data.form_title || "",
          placeholder_full_name: data.placeholder_full_name || "",
          placeholder_phone: data.placeholder_phone || "",
          placeholder_city: data.placeholder_city || "",
          placeholder_handle: data.placeholder_handle || "",
          placeholder_reason: data.placeholder_reason || "",
          team_badge: data.team_badge || "",
          team_heading: data.team_heading || "",
          team_subheading: data.team_subheading || "",
        });
        setSteps(parseJson(data.how_it_works));
        setBullets(parseJson(data.what_you_get));
        setApplicantTypes(parseJson(data.applicant_types));
      })
      .catch(() => setError("Failed to load partner page settings."))
      .finally(() => setLoading(false));
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Guard: never save an accidentally emptied page.
    if (!form.hero_heading.trim() && !form.program_heading.trim()) {
      setError("Hero heading or program heading is required.");
      return;
    }

    try {
      setSaving(true);
      await updatePartnerPageSettings({
        ...form,
        how_it_works: steps.filter((s) => s.label.trim() || s.description.trim()),
        what_you_get: bullets.filter((b) => b.trim()),
        applicant_types: applicantTypes.filter((t) => t.trim()),
      });
      setMessage("Partner page settings saved.");
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-white/70">Loading partner page settings…</p>;

  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <header>
        <h2 className="text-3xl font-bold text-white">Career / Partner Page</h2>
        <p className="text-sm text-white/65">Manage the Join the Arion Family page content.</p>
      </header>

      {message ? <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-300">{message}</div> : null}
      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">{error}</div> : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Hero ── */}
        <fieldset className="space-y-4 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-6">
          <legend className="px-2 text-lg font-semibold text-white">Hero Section</legend>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className={labelCls}>Badge</label>
              <input value={form.hero_badge} onChange={setField("hero_badge")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Heading</label>
              <input value={form.hero_heading} onChange={setField("hero_heading")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Heading Accent (gold)</label>
              <input value={form.hero_heading_accent} onChange={setField("hero_heading_accent")} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea rows={3} value={form.hero_description} onChange={setField("hero_description")} className={inputCls} />
          </div>
        </fieldset>

        {/* ── Program ── */}
        <fieldset className="space-y-4 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-6">
          <legend className="px-2 text-lg font-semibold text-white">Affiliate Program Section</legend>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className={labelCls}>Badge</label>
              <input value={form.program_badge} onChange={setField("program_badge")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Heading</label>
              <input value={form.program_heading} onChange={setField("program_heading")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Form Title</label>
              <input value={form.form_title} onChange={setField("form_title")} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Subheading</label>
            <input value={form.program_subheading} onChange={setField("program_subheading")} className={inputCls} />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className={labelCls}>"Who it's for" title</label>
              <input value={form.who_its_for_title} onChange={setField("who_its_for_title")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>"How it works" title</label>
              <input value={form.how_it_works_title} onChange={setField("how_it_works_title")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>"What you get" title</label>
              <input value={form.what_you_get_title} onChange={setField("what_you_get_title")} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>"Who it's for" text</label>
            <textarea rows={3} value={form.who_its_for} onChange={setField("who_its_for")} className={inputCls} />
          </div>

          {/* How it works steps */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={labelCls}>"How it works" steps</label>
              <button
                type="button"
                onClick={() => setSteps((prev) => [...prev, { label: "", description: "" }])}
                className="rounded-lg border border-white/20 px-3 py-1 text-sm text-white/85 hover:bg-white/10"
              >
                + Add Step
              </button>
            </div>
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-2 rounded-xl border border-white/10 bg-[var(--admin-card)] p-3">
                <span className="mt-2 text-sm text-white/50">{i + 1}.</span>
                <div className="grid flex-1 grid-cols-1 gap-2 md:grid-cols-[200px_1fr]">
                  <input
                    value={step.label}
                    onChange={(e) => setSteps((prev) => prev.map((s, j) => (j === i ? { ...s, label: e.target.value } : s)))}
                    placeholder="Label (e.g. Apply)"
                    className={inputCls}
                  />
                  <input
                    value={step.description}
                    onChange={(e) => setSteps((prev) => prev.map((s, j) => (j === i ? { ...s, description: e.target.value } : s)))}
                    placeholder="Description"
                    className={inputCls}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSteps((prev) => prev.filter((_, j) => j !== i))}
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-400 hover:bg-red-500/20"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* What you get bullets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={labelCls}>"What you get" bullets</label>
              <button
                type="button"
                onClick={() => setBullets((prev) => [...prev, ""])}
                className="rounded-lg border border-white/20 px-3 py-1 text-sm text-white/85 hover:bg-white/10"
              >
                + Add Bullet
              </button>
            </div>
            {bullets.map((bullet, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl border border-white/10 bg-[var(--admin-card)] p-3">
                <span className="text-sm text-white/50">•</span>
                <input
                  value={bullet}
                  onChange={(e) => setBullets((prev) => prev.map((b, j) => (j === i ? e.target.value : b)))}
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => setBullets((prev) => prev.filter((_, j) => j !== i))}
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-400 hover:bg-red-500/20"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Form placeholders */}
          <div className="space-y-2">
            <label className={labelCls}>Form field placeholders</label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-white/60">Full name field</label>
                <input value={form.placeholder_full_name} onChange={setField("placeholder_full_name")} className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/60">Phone field</label>
                <input value={form.placeholder_phone} onChange={setField("placeholder_phone")} className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/60">City field</label>
                <input value={form.placeholder_city} onChange={setField("placeholder_city")} className={inputCls} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/60">Social handle field</label>
                <input value={form.placeholder_handle} onChange={setField("placeholder_handle")} className={inputCls} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs text-white/60">"Why join" textarea</label>
                <input value={form.placeholder_reason} onChange={setField("placeholder_reason")} className={inputCls} />
              </div>
            </div>
          </div>

          {/* Applicant types */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className={labelCls}>"I am applying as" options</label>
              <button
                type="button"
                onClick={() => setApplicantTypes((prev) => [...prev, ""])}
                className="rounded-lg border border-white/20 px-3 py-1 text-sm text-white/85 hover:bg-white/10"
              >
                + Add Option
              </button>
            </div>
            {applicantTypes.map((opt, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl border border-white/10 bg-[var(--admin-card)] p-3">
                <input
                  value={opt}
                  onChange={(e) => setApplicantTypes((prev) => prev.map((o, j) => (j === i ? e.target.value : o)))}
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => setApplicantTypes((prev) => prev.filter((_, j) => j !== i))}
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-400 hover:bg-red-500/20"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </fieldset>

        {/* ── Team section header ── */}
        <fieldset className="space-y-4 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-6">
          <legend className="px-2 text-lg font-semibold text-white">Team Section Header</legend>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelCls}>Badge</label>
              <input value={form.team_badge} onChange={setField("team_badge")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Heading</label>
              <input value={form.team_heading} onChange={setField("team_heading")} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Subheading</label>
            <textarea rows={2} value={form.team_subheading} onChange={setField("team_subheading")} className={inputCls} />
          </div>
          <p className="text-xs text-white/50">Team member cards are managed on the Team Members page.</p>
        </fieldset>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[var(--admin-primary)] px-6 py-2.5 font-semibold text-black hover:bg-[var(--admin-primary-strong)] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </form>
    </section>
  );
}
