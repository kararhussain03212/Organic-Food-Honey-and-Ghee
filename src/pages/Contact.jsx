import { useState, useRef, useEffect } from "react";
import "../styles/Contact.css";

/* ─────────────────────────────────────────
   Reusable floating-label input
───────────────────────────────────────── */
function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  icon,
  required,
  as,
  rows,
  options,
}) {
  const Tag = as || "input";
  const hasValue = value && value.toString().trim() !== "";
  const baseClass = as === "select" ? "cu-field-select" : "cu-field-input";

  return (
    <div className={`cu-field${error ? " cu-field--error" : ""}`}>
      <div className="cu-field-icon">{icon}</div>
      {Tag === "select" ? (
        <select
          id={id}
          className={baseClass}
          value={value}
          onChange={onChange}
          required={required}
        >
          <option value=""></option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : Tag === "textarea" ? (
        <textarea
          id={id}
          className="cu-field-textarea"
          value={value}
          onChange={onChange}
          required={required}
          rows={rows || 5}
          placeholder=" "
        />
      ) : (
        <input
          id={id}
          type={type}
          className={baseClass}
          value={value}
          onChange={onChange}
          required={required}
          placeholder=" "
        />
      )}
      <label
        htmlFor={id}
        className={`cu-field-label${hasValue ? " cu-field-label--float" : ""}`}
      >
        {label}
        {required && <span className="cu-required">*</span>}
      </label>
      {error && <span className="cu-field-error">{error}</span>}
    </div>
  );
}

/* ─────────────────────────────────────────
   Subject options
───────────────────────────────────────── */
const SUBJECTS = [
  { value: "order", label: "Order Inquiry" },
  { value: "product", label: "Product Question" },
  { value: "wholesale", label: "Wholesale / Bulk" },
  { value: "complaint", label: "Complaint" },
  { value: "feedback", label: "Feedback" },
  { value: "other", label: "Other" },
];

/* ─────────────────────────────────────────
   Social Icons
───────────────────────────────────────── */
const socials = [
  {
    key: "facebook",
    href: "https://facebook.com",
    label: "Facebook",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    key: "instagram",
    href: "https://instagram.com",
    label: "Instagram",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "whatsapp",
    href: "https://wa.me/923001234567",
    label: "WhatsApp",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10a9.958 9.958 0 0 1-5.084-1.383L2 22l1.414-4.836A9.958 9.958 0 0 1 2 12 10 10 0 0 1 12 2zm0 2a8 8 0 1 0 0 16A8 8 0 0 0 12 4z" />
      </svg>
    ),
  },
];

/* ─────────────────────────────────────────
   Contact Form Component
───────────────────────────────────────── */
function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required.";
    if (!form.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (form.phone && !/^[+\d\s\-()]{7,20}$/.test(form.phone)) {
      errs.phone = "Please enter a valid phone number.";
    }
    if (!form.subject) errs.subject = "Please choose a subject.";
    if (!form.message.trim()) {
      errs.message = "Message cannot be empty.";
    } else if (form.message.trim().length < 10) {
      errs.message = "Message must be at least 10 characters.";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error("Network error");
      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const resetForm = () => {
    setStatus("idle");
    setErrors({});
  };

  if (status === "success") {
    return (
      <div className="cu-success">
        <div className="cu-success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h3 className="cu-success-title">Message Sent!</h3>
        <p className="cu-success-desc">
          Thank you for reaching out. Our team will get back to you within
          24&nbsp;hours.
        </p>
        <button className="cu-btn" onClick={resetForm}>
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form className="cu-form" onSubmit={handleSubmit} noValidate>
      <div className="cu-form-row">
        <FloatingInput
          id="cu-name"
          label="Full Name"
          value={form.name}
          onChange={set("name")}
          error={errors.name}
          required
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
        />
        <FloatingInput
          id="cu-email"
          label="Email Address"
          type="email"
          value={form.email}
          onChange={set("email")}
          error={errors.email}
          required
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          }
        />
      </div>

      <div className="cu-form-row">
        <FloatingInput
          id="cu-phone"
          label="Phone Number"
          type="tel"
          value={form.phone}
          onChange={set("phone")}
          error={errors.phone}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.43 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 5.55 5.55l.96-1.56a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          }
        />
        <FloatingInput
          id="cu-subject"
          label="Subject"
          as="select"
          value={form.subject}
          onChange={set("subject")}
          error={errors.subject}
          required
          options={SUBJECTS}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          }
        />
      </div>

      <FloatingInput
        id="cu-message"
        label="Your Message"
        as="textarea"
        rows={5}
        value={form.message}
        onChange={set("message")}
        error={errors.message}
        required
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ marginTop: "0.9rem" }}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        }
      />

      {status === "error" && (
        <div className="cu-alert-error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Something went wrong. Please try again or contact us directly.
        </div>
      )}

      <button
        type="submit"
        className={`cu-btn cu-btn--submit${status === "loading" ? " cu-btn--loading" : ""}`}
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <>
            <span className="cu-spinner" />
            Sending…
          </>
        ) : (
          <>
            Send Message
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}

/* ─────────────────────────────────────────
   Company Info Card
───────────────────────────────────────── */
function InfoCard() {
  return (
    <div className="cu-info-card">
      {/* Decorative blobs */}
      <div className="cu-info-blob cu-info-blob-1" />
      <div className="cu-info-blob cu-info-blob-2" />

      {/* Header */}
      <div className="cu-info-header">
        <div className="cu-info-badge">
          <span className="cu-badge-dot" />
          Available Mon – Sat, 9am – 6pm
        </div>
        <h3 className="cu-info-title">We'd love to hear from you</h3>
        <p className="cu-info-subtitle">
          Reach out through any channel below and our dedicated team will respond
          promptly.
        </p>
      </div>

      {/* Contact Items */}
      <div className="cu-info-items">
        {/* WhatsApp */}
        <div className="cu-info-item">
          <div className="cu-info-item-icon cu-info-item-icon--green">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10a9.958 9.958 0 0 1-5.084-1.383L2 22l1.414-4.836A9.958 9.958 0 0 1 2 12 10 10 0 0 1 12 2zm0 2a8 8 0 1 0 0 16A8 8 0 0 0 12 4z" />
            </svg>
          </div>
          <div className="cu-info-item-body">
            <span className="cu-info-item-label">WhatsApp</span>
            <span className="cu-info-item-value">+92 300 123 4567</span>
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="cu-info-cta cu-info-cta--green"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14 }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10a9.958 9.958 0 0 1-5.084-1.383L2 22l1.414-4.836A9.958 9.958 0 0 1 2 12 10 10 0 0 1 12 2zm0 2a8 8 0 1 0 0 16A8 8 0 0 0 12 4z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Phone */}
        <div className="cu-info-item">
          <div className="cu-info-item-icon cu-info-item-icon--gold">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.43 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 5.55 5.55l.96-1.56a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>
          <div className="cu-info-item-body">
            <span className="cu-info-item-label">Phone</span>
            <a href="tel:+923001234567" className="cu-info-item-value cu-info-item-link">
              +92 300 123 4567
            </a>
            <a href="tel:+924235678901" className="cu-info-item-value cu-info-item-link cu-info-item-secondary">
              +92 42 3567 8901
            </a>
          </div>
        </div>

        {/* Email */}
        <div className="cu-info-item">
          <div className="cu-info-item-icon cu-info-item-icon--brown">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div className="cu-info-item-body">
            <span className="cu-info-item-label">Email</span>
            <a href="mailto:support@arionorganic.com" className="cu-info-item-value cu-info-item-link">
              support@arionorganic.com
            </a>
            <a href="mailto:info@arionorganic.com" className="cu-info-item-value cu-info-item-link cu-info-item-secondary">
              info@arionorganic.com
            </a>
          </div>
        </div>

        {/* Address */}
        <div className="cu-info-item">
          <div className="cu-info-item-icon cu-info-item-icon--sage">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="cu-info-item-body">
            <span className="cu-info-item-label">Address</span>
            <span className="cu-info-item-value">
              12-B Commercial Area, DHA Phase 5
            </span>
            <span className="cu-info-item-value cu-info-item-secondary">
              Lahore, Punjab 54792, Pakistan
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="cu-info-divider" />

      {/* Social Links */}
      <div className="cu-info-socials">
        <span className="cu-info-socials-label">Follow Us</span>
        <div className="cu-info-socials-icons">
          {socials.map((s) => (
            <a
              key={s.key}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="cu-social-icon"
            >
              {s.svg}
            </a>
          ))}
        </div>
      </div>

      {/* Trust Badge */}
      {/* <div className="cu-trust-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
        <span>100% Secure &amp; Private — We never share your information.</span>
      </div> */}
    </div>
  );
}

/* ─────────────────────────────────────────
   Page Entry Point
───────────────────────────────────────── */
export default function Contact() {
  const pageRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <section className="cu-page" ref={pageRef}>
      {/* Background decorations */}
      <div className="cu-bg-blob cu-bg-blob-1" />
      <div className="cu-bg-blob cu-bg-blob-2" />
      <div className="cu-bg-blob cu-bg-blob-3" />

      <div className={`cu-container${visible ? " cu-container--visible" : ""}`}>
        {/* Page header */}
        <header className="cu-page-header">
          <div className="cu-eyebrow">
            <span className="cu-eyebrow-dot">✦</span>
            Get In Touch
          </div>
          <h1 className="cu-page-title">
            Contact <span className="cu-title-accent">Arion Organic</span>
          </h1>
          <p className="cu-page-subtitle">
            Questions about our products? Bulk orders? Feedback? We're here for
            you — always.
          </p>
        </header>

        {/* Two-column layout */}
        <div className="cu-layout">
          {/* Left — Form */}
          <div className="cu-form-panel">
            <div className="cu-panel-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Send Us a Message
            </div>
            <ContactForm />
          </div>

          {/* Right — Info */}
          <div className="cu-info-panel">
            <InfoCard />
          </div>
        </div>
      </div>
    </section>
  );
}
