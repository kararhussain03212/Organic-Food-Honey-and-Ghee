import { useState, useRef, useEffect, useMemo } from "react";
import "../styles/Contact.css";
import { AiFillTikTok } from "react-icons/ai";
import { IoLogoYoutube } from "react-icons/io5";
import { getContactPage } from "../api/apiClient";

const SOCIAL_SVGS = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  ),
  youtube:  <IoLogoYoutube />,
  tiktok:   <AiFillTikTok />,
};

function FloatingInput({ id, label, type = "text", value, onChange, error, icon, required, as, rows }) {
  const Tag = as || "input";
  const hasValue = value && value.toString().trim() !== "";

  return (
    <div className={`cu-field${error ? " cu-field--error" : ""}`}>
      <div className="cu-field-icon">{icon}</div>
      {Tag === "textarea" ? (
        <textarea id={id} className="cu-field-textarea" value={value} onChange={onChange} required={required} rows={rows || 5} placeholder=" " />
      ) : (
        <input id={id} type={type} className="cu-field-input" value={value} onChange={onChange} required={required} placeholder=" " />
      )}
      <label htmlFor={id} className={`cu-field-label${hasValue ? " cu-field-label--float" : ""}`}>
        {label}{required && <span className="cu-required">*</span>}
      </label>
      {error && <span className="cu-field-error">{error}</span>}
    </div>
  );
}

function ContactForm({ settings }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((errs) => ({ ...errs, [field]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())    errs.name    = "Full name is required.";
    if (!form.email.trim())   errs.email   = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Please enter a valid email address.";
    if (form.phone && !/^[+\d\s\-()]{7,20}$/.test(form.phone)) errs.phone = "Please enter a valid phone number.";
    if (!form.subject.trim()) errs.subject = "Subject is required.";
    if (!form.message.trim()) errs.message = "Message cannot be empty.";
    else if (form.message.trim().length < 10) errs.message = "Message must be at least 10 characters.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus("loading");
    setErrorMessage("");
    try {
      const { postContact } = await import("../api/apiClient");
      await postContact({ name: form.name, email: form.email, phone: form.phone, subject: form.subject, message: form.message });
      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setErrorMessage(err?.message || "Something went wrong.");
      setStatus("error");
    }
  };

  const resetForm = () => { setStatus("idle"); setErrors({}); setErrorMessage(""); };

  if (status === "success") {
    return (
      <div className="cu-success">
        <div className="cu-success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h3 className="cu-success-title">Message Sent!</h3>
        <p className="cu-success-desc">Thank you for reaching out. Our team will get back to you within 24&nbsp;hours.</p>
        <button className="cu-btn" onClick={resetForm}>Send Another Message</button>
      </div>
    );
  }

  return (
    <form className="cu-form" onSubmit={handleSubmit} noValidate>
      <div className="cu-form-row">
        <FloatingInput id="cu-name" label={settings.name_placeholder || "Full Name"} value={form.name} onChange={set("name")} error={errors.name} required icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>} />
        <FloatingInput id="cu-email" label={settings.email_placeholder || "Email Address"} type="email" value={form.email} onChange={set("email")} error={errors.email} required icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>} />
      </div>
      <div className="cu-form-row">
        <FloatingInput id="cu-phone" label={settings.phone_placeholder || "Phone Number"} type="tel" value={form.phone} onChange={set("phone")} error={errors.phone} icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.43 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 5.55 5.55l.96-1.56a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>} />
        <FloatingInput id="cu-subject" label={settings.subject_placeholder || "Subject"} value={form.subject} onChange={set("subject")} error={errors.subject} required icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>} />
      </div>
      <FloatingInput id="cu-message" label={settings.message_placeholder || "Your Message"} as="textarea" rows={5} value={form.message} onChange={set("message")} error={errors.message} required icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ marginTop: "0.9rem" }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>} />

      {status === "error" && (
        <div className="cu-alert-error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {errorMessage || "Something went wrong. Please try again or contact us directly."}
        </div>
      )}

      <button type="submit" className={`cu-btn cu-btn--submit${status === "loading" ? " cu-btn--loading" : ""}`} disabled={status === "loading"}>
        {status === "loading" ? (<><span className="cu-spinner" />Sending…</>) : (<>{settings.submit_button_text || "Send Message"}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></>)}
      </button>
    </form>
  );
}

function InfoCard({ settings }) {
  const email    = settings.email;
  const whatsapp = settings.whatsapp_number;
  const phone    = settings.phone_number;
  const gmailUrl = email ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}` : null;
  const waNumber = whatsapp ? whatsapp.replace(/\D/g, "") : null;

  const locations = useMemo(() => {
    if (settings.locations && Array.isArray(settings.locations) && settings.locations.length > 0) {
      return settings.locations.filter((loc) => loc.address || loc.google_map_url);
    }
    if (settings.address || settings.google_map_url) {
      return [{ address: settings.address, google_map_url: settings.google_map_url || "" }];
    }
    return [];
  }, [settings]);

  const socials = useMemo(() => {
    const list = [];
    if (settings.facebook_url)  list.push({ key: "facebook",  href: settings.facebook_url,  label: "Facebook",  svg: SOCIAL_SVGS.facebook });
    if (settings.instagram_url) list.push({ key: "instagram", href: settings.instagram_url, label: "Instagram", svg: SOCIAL_SVGS.instagram });
    if (settings.youtube_url)   list.push({ key: "youtube",   href: settings.youtube_url,   label: "YouTube",   svg: SOCIAL_SVGS.youtube });
    if (settings.tiktok_url)    list.push({ key: "tiktok",    href: settings.tiktok_url,    label: "TikTok",    svg: SOCIAL_SVGS.tiktok });
    return list;
  }, [settings]);

  return (
    <div className="cu-info-card">
      <div className="cu-info-blob cu-info-blob-1" />
      <div className="cu-info-blob cu-info-blob-2" />

      <div className="cu-info-header">
        {settings.availability_text && (
          <div className="cu-info-badge">
            <span className="cu-badge-dot" />
            {settings.availability_text}
          </div>
        )}
        {settings.contact_heading && <h3 className="cu-info-title">{settings.contact_heading}</h3>}
        {settings.contact_description && <p className="cu-info-subtitle">{settings.contact_description}</p>}
      </div>

      <div className="cu-info-items">
        {whatsapp && (
          <div className="cu-info-item">
            <div className="cu-info-item-icon cu-info-item-icon--green">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10a9.958 9.958 0 0 1-5.084-1.383L2 22l1.414-4.836A9.958 9.958 0 0 1 2 12 10 10 0 0 1 12 2zm0 2a8 8 0 1 0 0 16A8 8 0 0 0 12 4z" />
              </svg>
            </div>
            <div className="cu-info-item-body">
              <span className="cu-info-item-label">WhatsApp</span>
              <span className="cu-info-item-value">{whatsapp}</span>
              {waNumber && (
                <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="cu-info-cta cu-info-cta--green">
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14 }}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10a9.958 9.958 0 0 1-5.084-1.383L2 22l1.414-4.836A9.958 9.958 0 0 1 2 12 10 10 0 0 1 12 2zm0 2a8 8 0 1 0 0 16A8 8 0 0 0 12 4z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              )}
            </div>
          </div>
        )}

        {phone && (
          <div className="cu-info-item">
            <div className="cu-info-item-icon cu-info-item-icon--gold">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.43 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 5.55 5.55l.96-1.56a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div className="cu-info-item-body">
              <span className="cu-info-item-label">Phone</span>
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="cu-info-item-value cu-info-item-link">{phone}</a>
            </div>
          </div>
        )}

        {email && (
          <div className="cu-info-item">
            <div className="cu-info-item-icon cu-info-item-icon--brown">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div className="cu-info-item-body">
              <span className="cu-info-item-label">Email</span>
              <a href={gmailUrl} target="_blank" rel="noopener noreferrer" className="cu-info-item-value cu-info-item-link">{email}</a>
            </div>
          </div>
        )}

        {locations.map((loc, idx) => {
          const mapsUrl = loc.google_map_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`;
          return (
            <div key={idx} className="cu-info-item">
              <div className="cu-info-item-icon cu-info-item-icon--sage">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="cu-info-item-body">
                <span className="cu-info-item-label">{locations.length > 1 ? `Address ${idx + 1}` : "Address"}</span>
                <a className="cu-info-item-value cu-info-item-link" href={mapsUrl} target="_blank" rel="noopener noreferrer">{loc.address}</a>
              </div>
            </div>
          );
        })}
      </div>

      {socials.length > 0 && (
        <>
          <div className="cu-info-divider" />
          <div className="cu-info-socials">
            <span className="cu-info-socials-label">Follow Us</span>
            <div className="cu-info-socials-icons">
              {socials.map((s) => (
                <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="cu-social-icon">
                  {s.svg}
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function Contact() {
  const pageRef = useRef(null);
  const [visible, setVisible]   = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    getContactPage().then((d) => {
      if (d && d.hero_heading) setSettings(d);
    }).catch(() => {});
  }, []);

  const headingParts = useMemo(() => {
    if (!settings) return [];
    const { hero_heading: heading, hero_highlight: highlight } = settings;
    if (!highlight || !heading || !heading.includes(highlight)) return [{ text: heading || "", hl: false }];
    const idx = heading.indexOf(highlight);
    return [
      { text: heading.slice(0, idx),                 hl: false },
      { text: highlight,                              hl: true  },
      { text: heading.slice(idx + highlight.length), hl: false },
    ];
  }, [settings]);

  if (!settings) return null;

  return (
    <section className="cu-page" ref={pageRef}>
      <div className="cu-bg-blob cu-bg-blob-1" />
      <div className="cu-bg-blob cu-bg-blob-2" />
      <div className="cu-bg-blob cu-bg-blob-3" />

      <div className={`cu-container${visible ? " cu-container--visible" : ""}`}>
        <header className="cu-page-header">
          {settings.hero_badge && (
            <div className="cu-eyebrow">
              <span className="cu-eyebrow-dot">✦</span>
              {settings.hero_badge}
            </div>
          )}
          {settings.hero_heading && (
            <h1 className="cu-page-title">
              {headingParts.map((p, i) =>
                p.hl ? <span key={i} className="cu-title-accent">{p.text}</span> : p.text
              )}
            </h1>
          )}
          {settings.hero_description && <p className="cu-page-subtitle">{settings.hero_description}</p>}
        </header>

        <div className="cu-layout">
          <div className="cu-form-panel">
            <div className="cu-panel-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {settings.form_title || "SEND US A MESSAGE"}
            </div>
            <ContactForm settings={settings} />
          </div>

          <div className="cu-info-panel">
            <InfoCard settings={settings} />
          </div>
        </div>
      </div>
    </section>
  );
}
