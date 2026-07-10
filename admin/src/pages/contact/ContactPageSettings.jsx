import { useEffect, useState } from "react";
import { getContactPageSettings, updateContactPageSettings } from "../../api/contactApi";

const inputCls = "w-full rounded-lg border border-white/20 bg-[var(--admin-card)] px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]";
const labelCls = "mb-1 block text-sm text-white/80";
const sectionCls = "rounded-xl border border-white/10 bg-[var(--admin-bg)] p-4 space-y-3";

const EMPTY = {
  hero_badge: "", hero_heading: "", hero_highlight: "", hero_description: "",
  seo_meta_description: "",
  form_title: "", name_placeholder: "", email_placeholder: "", phone_placeholder: "",
  subject_placeholder: "", message_placeholder: "", submit_button_text: "",
  availability_text: "", contact_heading: "", contact_description: "",
  whatsapp_number: "", phone_number: "", email: "",
  locations: [{ address: "", google_map_url: "" }],
  facebook_url: "", instagram_url: "", youtube_url: "", tiktok_url: "",
};

const parseLocations = (locStr) => {
  if (!locStr) return [{ address: "", google_map_url: "" }];
  if (Array.isArray(locStr)) {
    return locStr.length > 0 ? locStr : [{ address: "", google_map_url: "" }];
  }
  try {
    const parsed = JSON.parse(locStr);
    return Array.isArray(parsed) ? parsed : [{ address: "", google_map_url: "" }];
  } catch {
    return [{ address: locStr, google_map_url: "" }];
  }
};

const stringifyLocations = (locations) => {
  return JSON.stringify(locations.filter((l) => l.address || l.google_map_url));
};

export default function ContactPageSettings() {
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toast, setToast]   = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContactPageSettings()
      .then((res) => {
        const d = res?.data?.data || {};
        setForm({
          hero_badge:           d.hero_badge           || "",
          hero_heading:         d.hero_heading         || "",
          hero_highlight:       d.hero_highlight       || "",
          hero_description:     d.hero_description     || "",
          seo_meta_description: d.seo_meta_description || "",
          form_title:           d.form_title           || "",
          name_placeholder:     d.name_placeholder     || "",
          email_placeholder:    d.email_placeholder    || "",
          phone_placeholder:    d.phone_placeholder    || "",
          subject_placeholder:  d.subject_placeholder  || "",
          message_placeholder:  d.message_placeholder  || "",
          submit_button_text:   d.submit_button_text   || "",
          availability_text:    d.availability_text    || "",
          contact_heading:      d.contact_heading      || "",
          contact_description:  d.contact_description  || "",
          whatsapp_number:      d.whatsapp_number      || "",
          phone_number:         d.phone_number         || "",
          email:                d.email                || "",
          locations:            parseLocations(d.locations || d.address),
          facebook_url:         d.facebook_url         || "",
          instagram_url:        d.instagram_url        || "",
          youtube_url:          d.youtube_url          || "",
          tiktok_url:           d.tiktok_url           || "",
        });
      })
      .catch(() => setError("Failed to load contact page settings."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const dataToSave = {
        ...form,
        locations: stringifyLocations(form.locations),
      };
      await updateContactPageSettings(dataToSave);
      setToast("Contact page settings saved!");
    } catch {
      setError("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-white/70">Loading…</p>;

  return (
    <section className="mx-auto max-w-3xl space-y-5">
      <header>
        <h2 className="text-3xl font-bold text-white">Contact Page Settings</h2>
        <p className="mt-1 text-sm text-white/65">
          Edit every dynamic section of the Contact Us page — hero, form labels, contact info, and social links.
        </p>
      </header>

      {toast ? <div className="rounded-xl bg-green-600/80 px-4 py-2.5 text-sm font-medium text-white">{toast}</div> : null}
      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div> : null}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-[var(--admin-bg)] p-6">

        {/* SEO */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">SEO</h3>
          <div>
            <label className={labelCls}>SEO Meta Description</label>
            <textarea
              rows={3}
              className={inputCls}
              value={form.seo_meta_description}
              onChange={(e) => setField("seo_meta_description", e.target.value)}
              placeholder="e.g., Contact Arion Organic Food for pure honey, desi ghee, and shilajit. Call, WhatsApp, or visit us in Islamabad, Pakistan."
            />
            <p className="mt-1 text-[10px] text-white/50">
              {form.seo_meta_description?.length || 0}/160 characters (recommended)
            </p>
          </div>
        </div>

        {/* Hero Section */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Hero Section</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Badge Text</label>
              <input className={inputCls} value={form.hero_badge} onChange={(e) => setField("hero_badge", e.target.value)} placeholder="GET IN TOUCH" />
            </div>
            <div>
              <label className={labelCls}>Main Heading</label>
              <input className={inputCls} value={form.hero_heading} onChange={(e) => setField("hero_heading", e.target.value)} placeholder="Contact Arion Organic" />
            </div>
            <div>
              <label className={labelCls}>Highlighted Word(s)</label>
              <input className={inputCls} value={form.hero_highlight} onChange={(e) => setField("hero_highlight", e.target.value)} placeholder="Arion Organic" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea rows={3} className={inputCls} value={form.hero_description} onChange={(e) => setField("hero_description", e.target.value)} placeholder="Questions about our products?…" />
          </div>
        </div>

        {/* Contact Form Labels */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Contact Form</h3>
          <div>
            <label className={labelCls}>Form Title</label>
            <input className={inputCls} value={form.form_title} onChange={(e) => setField("form_title", e.target.value)} placeholder="SEND US A MESSAGE" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Name Field Label</label>
              <input className={inputCls} value={form.name_placeholder} onChange={(e) => setField("name_placeholder", e.target.value)} placeholder="Full Name" />
            </div>
            <div>
              <label className={labelCls}>Email Field Label</label>
              <input className={inputCls} value={form.email_placeholder} onChange={(e) => setField("email_placeholder", e.target.value)} placeholder="Email Address" />
            </div>
            <div>
              <label className={labelCls}>Phone Field Label</label>
              <input className={inputCls} value={form.phone_placeholder} onChange={(e) => setField("phone_placeholder", e.target.value)} placeholder="Phone Number" />
            </div>
            <div>
              <label className={labelCls}>Subject Field Label</label>
              <input className={inputCls} value={form.subject_placeholder} onChange={(e) => setField("subject_placeholder", e.target.value)} placeholder="Subject" />
            </div>
            <div>
              <label className={labelCls}>Message Field Label</label>
              <input className={inputCls} value={form.message_placeholder} onChange={(e) => setField("message_placeholder", e.target.value)} placeholder="Your Message" />
            </div>
            <div>
              <label className={labelCls}>Submit Button Text</label>
              <input className={inputCls} value={form.submit_button_text} onChange={(e) => setField("submit_button_text", e.target.value)} placeholder="Send Message" />
            </div>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Contact Info Card</h3>
          <div>
            <label className={labelCls}>Availability Text</label>
            <input className={inputCls} value={form.availability_text} onChange={(e) => setField("availability_text", e.target.value)} placeholder="Available Mon – Sat, 9am – 6pm" />
          </div>
          <div>
            <label className={labelCls}>Card Heading</label>
            <input className={inputCls} value={form.contact_heading} onChange={(e) => setField("contact_heading", e.target.value)} placeholder="We'd love to hear from you" />
          </div>
          <div>
            <label className={labelCls}>Card Description</label>
            <textarea rows={2} className={inputCls} value={form.contact_description} onChange={(e) => setField("contact_description", e.target.value)} placeholder="Reach out through any channel below…" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>WhatsApp Number</label>
              <input className={inputCls} value={form.whatsapp_number} onChange={(e) => setField("whatsapp_number", e.target.value)} placeholder="+92 333 8399480" />
            </div>
            <div>
              <label className={labelCls}>Phone Number</label>
              <input className={inputCls} value={form.phone_number} onChange={(e) => setField("phone_number", e.target.value)} placeholder="+92 333 8399480" />
            </div>
            <div>
              <label className={labelCls}>Email Address</label>
              <input type="email" className={inputCls} value={form.email} onChange={(e) => setField("email", e.target.value)} placeholder="info@arionorganic.com" />
            </div>
          </div>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="font-semibold text-white/90">Locations / Addresses</label>
              <button
                type="button"
                onClick={() => setField("locations", [...form.locations, { address: "", google_map_url: "" }])}
                className="rounded-lg bg-[var(--admin-primary)] px-3 py-1.5 text-sm font-semibold text-black hover:bg-[var(--admin-primary-strong)]"
              >
                + Add Location
              </button>
            </div>
            <div className="space-y-4">
              {form.locations.map((location, index) => (
                <div key={`location-${index}`} className="rounded-lg border border-white/10 bg-[var(--admin-card)] p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white/70">Location {index + 1}</span>
                    {form.locations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setField("locations", form.locations.filter((_, i) => i !== index))}
                        className="rounded-lg border border-red-500 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 hover:bg-red-500/20"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Address</label>
                    <textarea
                      rows={2}
                      className={inputCls}
                      value={location.address}
                      onChange={(e) =>
                        setField("locations", form.locations.map((loc, i) => (i === index ? { ...loc, address: e.target.value } : loc)))
                      }
                      placeholder="Office 22, 4th Floor, Pakland City Center…"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Google Maps URL</label>
                    <input
                      className={inputCls}
                      value={location.google_map_url}
                      onChange={(e) =>
                        setField("locations", form.locations.map((loc, i) => (i === index ? { ...loc, google_map_url: e.target.value } : loc)))
                      }
                      placeholder="https://maps.google.com/…"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className={sectionCls}>
          <h3 className="font-semibold text-white/90">Social Media Links</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Facebook URL</label>
              <input className={inputCls} value={form.facebook_url} onChange={(e) => setField("facebook_url", e.target.value)} placeholder="https://facebook.com/…" />
            </div>
            <div>
              <label className={labelCls}>Instagram URL</label>
              <input className={inputCls} value={form.instagram_url} onChange={(e) => setField("instagram_url", e.target.value)} placeholder="https://instagram.com/…" />
            </div>
            <div>
              <label className={labelCls}>YouTube URL</label>
              <input className={inputCls} value={form.youtube_url} onChange={(e) => setField("youtube_url", e.target.value)} placeholder="https://youtube.com/…" />
            </div>
            <div>
              <label className={labelCls}>TikTok URL</label>
              <input className={inputCls} value={form.tiktok_url} onChange={(e) => setField("tiktok_url", e.target.value)} placeholder="https://tiktok.com/@…" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[var(--admin-primary)] px-6 py-2.5 font-semibold text-black hover:bg-[var(--admin-primary-strong)] disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
