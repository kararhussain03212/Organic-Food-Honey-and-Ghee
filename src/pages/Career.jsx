import { useState, useRef, useEffect, useMemo } from "react";
import "../styles/Career.css";
import {
  getSettings,
  getPartnerPage,
  getTeamMembers,
  postAffiliateApplication,
  isSectionActive,
  parseJsonField,
} from "../api/apiClient";
import { getBackendRoot } from "../api/runtimeApi";

const resolvePhoto = (value, apiRoot) => {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  if (value.startsWith("/uploads/")) return apiRoot + value;
  if (value.startsWith("/")) return apiRoot.replace(/\/backend$/, "") + value;
  return apiRoot + "/uploads/" + value;
};

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function HeroSection({ content }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="cr-hero">
      <div className="cr-hero-shapes">
        <div className="cr-shape cr-shape-1" />
        <div className="cr-shape cr-shape-2" />
        <div className="cr-shape cr-shape-3" />
      </div>
      <div className={`cr-hero-content${visible ? " visible" : ""}`}>
        {content.hero_badge && (
          <div className="cr-eyebrow">{content.hero_badge}</div>
        )}
        <h1 className="cr-hero-title">
          {content.hero_heading}
          {content.hero_heading_accent && (
            <>
              {" "}
              <span className="cr-gold">{content.hero_heading_accent}</span>
            </>
          )}
        </h1>
        {content.hero_description && (
          <p className="cr-hero-sub">{content.hero_description}</p>
        )}
      </div>
    </section>
  );
}

// Server field names → local form field names, for inline error mapping.
const SERVER_FIELD_MAP = {
  full_name: "name",
  phone: "phone",
  city: "city",
  social_handle: "handle",
  applicant_type: "category",
  reason: "message",
};

function AffiliateSection({ content }) {
  const [ref, inView] = useInView();

  const steps = useMemo(
    () => parseJsonField(content.how_it_works, []),
    [content.how_it_works],
  );
  const bullets = useMemo(
    () => parseJsonField(content.what_you_get, []),
    [content.what_you_get],
  );
  const applicantTypes = useMemo(
    () => parseJsonField(content.applicant_types, []),
    [content.applicant_types],
  );

  // Content is fully loaded before this component mounts, so the first
  // configured applicant type is available as the initial selection.
  const [form, setForm] = useState(() => ({
    name: "",
    phone: "",
    city: "",
    handle: "",
    category: applicantTypes[0] || "",
    message: "",
  }));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((errs) => ({ ...errs, [field]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required.";
    if (!form.phone.trim()) errs.phone = "Phone/WhatsApp is required.";
    if (!form.city.trim()) errs.city = "City is required.";
    if (!form.message.trim())
      errs.message = "Please tell us why you want to join.";
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
      await postAffiliateApplication({
        full_name: form.name,
        phone: form.phone,
        city: form.city,
        social_handle: form.handle,
        applicant_type: form.category,
        reason: form.message,
      });
      setStatus("success");
      setForm({
        name: "",
        phone: "",
        city: "",
        handle: "",
        category: applicantTypes[0] || "",
        message: "",
      });
    } catch (err) {
      if (err.fields) {
        const serverErrs = {};
        Object.entries(err.fields).forEach(([key, msg]) => {
          serverErrs[SERVER_FIELD_MAP[key] || key] = msg;
        });
        setErrors(serverErrs);
        setStatus("idle");
      } else {
        setStatus("error");
      }
    }
  };

  const resetForm = () => {
    setStatus("idle");
    setErrors({});
  };

  if (status === "success") {
    return (
      <section className="cr-affiliate" ref={ref}>
        <div className="cr-container">
          <div className={`cr-section-header${inView ? " visible" : ""}`}>
            <div className="cr-section-label">{content.program_badge}</div>
            <h2 className="cr-section-title">{content.program_heading}</h2>
            <p className="cr-section-sub">{content.program_subheading}</p>
          </div>
          <div className={`cr-success-card${inView ? " visible" : ""}`}>
            <div className="cr-success-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className="cr-success-title">Application Received!</h3>
            <p className="cr-success-desc">
              Thank you for your interest in joining Arion. Our team will reach
              out on WhatsApp within 24–48 hours to confirm your application.
            </p>
            <button className="cr-btn" onClick={resetForm}>
              Submit Another Application
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="cr-affiliate" ref={ref}>
      <div className="cr-container">
        <div className={`cr-section-header${inView ? " visible" : ""}`}>
          <div className="cr-section-label">{content.program_badge}</div>
          <h2 className="cr-section-title">{content.program_heading}</h2>
          <p className="cr-section-sub">{content.program_subheading}</p>
        </div>

        <div className={`cr-affiliate-content${inView ? " visible" : ""}`}>
          <div className="cr-affiliate-info">
            {content.who_its_for && (
              <div className="cr-info-block">
                <h3>{content.who_its_for_title}</h3>
                <p>{content.who_its_for}</p>
              </div>
            )}

            {steps.length > 0 && (
              <div className="cr-info-block">
                <h3>{content.how_it_works_title}</h3>
                <ol>
                  {steps.map((step, i) => (
                    <li key={i}>
                      <strong>{step.label}</strong> — {step.description}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {bullets.length > 0 && (
              <div className="cr-info-block">
                <h3>{content.what_you_get_title}</h3>
                <ul>
                  {bullets.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <form className="cr-form" onSubmit={handleSubmit} noValidate>
            <div className="cr-form-title">{content.form_title}</div>

            <div className="cr-form-field">
              <input
                type="text"
                placeholder={content.placeholder_full_name}
                value={form.name}
                onChange={set("name")}
                className={errors.name ? "error" : ""}
              />
              {errors.name && <span className="cr-error">{errors.name}</span>}
            </div>

            <div className="cr-form-field">
              <input
                type="tel"
                placeholder={content.placeholder_phone}
                value={form.phone}
                onChange={set("phone")}
                className={errors.phone ? "error" : ""}
              />
              {errors.phone && <span className="cr-error">{errors.phone}</span>}
            </div>

            <div className="cr-form-field">
              <input
                type="text"
                placeholder={content.placeholder_city}
                value={form.city}
                onChange={set("city")}
                className={errors.city ? "error" : ""}
              />
              {errors.city && <span className="cr-error">{errors.city}</span>}
            </div>

            <div className="cr-form-field">
              <input
                type="text"
                placeholder={content.placeholder_handle}
                value={form.handle}
                onChange={set("handle")}
              />
            </div>

            {applicantTypes.length > 0 && (
              <div className="cr-form-field">
                <label className="cr-category-label">I am applying as:</label>
                <div className="cr-radio-group">
                  {applicantTypes.map((opt) => (
                    <label key={opt} className="cr-radio">
                      <input
                        type="radio"
                        name="category"
                        value={opt}
                        checked={form.category === opt}
                        onChange={set("category")}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
                {errors.category && (
                  <span className="cr-error">{errors.category}</span>
                )}
              </div>
            )}

            <div className="cr-form-field">
              <textarea
                placeholder={content.placeholder_reason}
                rows="4"
                value={form.message}
                onChange={set("message")}
                className={errors.message ? "error" : ""}
              />
              {errors.message && (
                <span className="cr-error">{errors.message}</span>
              )}
            </div>

            {status === "error" && (
              <div className="cr-alert-error">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Something went wrong. Please try again.
              </div>
            )}

            <button
              type="submit"
              className={`cr-btn cr-btn--submit${status === "loading" ? " cr-btn--loading" : ""}`}
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <>
                  <span className="cr-spinner" />
                  Submitting…
                </>
              ) : (
                <>Submit Application</>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function AgentCard({ agent, inView, index }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`cr-agent-card${inView ? " visible" : ""}`}
      style={{ transitionDelay: `${index * 0.08}s` }}
    >
      {agent.photo && !imageError ? (
        <img
          src={agent.photo}
          alt={agent.name}
          className="cr-agent-image"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      ) : (
        <div className="cr-agent-image-fallback">
          <div className="cr-agent-initials">
            {agent.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
        </div>
      )}
      <h3 className="cr-agent-name">{agent.name}</h3>
      <p className="cr-agent-region">{agent.region}</p>
      <blockquote className="cr-agent-quote">"{agent.quote}"</blockquote>
      <a
        href={`https://wa.me/${String(agent.whatsapp_number || "").replace(/\D/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="cr-agent-cta"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10a9.958 9.958 0 0 1-5.084-1.383L2 22l1.414-4.836A9.958 9.958 0 0 1 2 12 10 10 0 0 1 12 2zm0 2a8 8 0 1 0 0 16A8 8 0 0 0 12 4z" />
        </svg>
        Chat on WhatsApp
      </a>
    </div>
  );
}

function AgentsSection({ content, agents }) {
  const [ref, inView] = useInView();

  if (agents.length === 0) return null;

  return (
    <section className="cr-agents" ref={ref}>
      <div className="cr-container">
        <div className={`cr-section-header${inView ? " visible" : ""}`}>
          <div className="cr-section-label">{content.team_badge}</div>
          <h2 className="cr-section-title">{content.team_heading}</h2>
          <p className="cr-section-sub">{content.team_subheading}</p>
        </div>

        <div className="cr-agents-grid">
          {agents.map((agent, i) => (
            <AgentCard key={agent.id} agent={agent} inView={inView} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Career() {
  const [pageActive, setPageActive] = useState(true);
  const [content, setContent] = useState(null);
  const [agents, setAgents] = useState([]);
  const apiRoot = useMemo(() => getBackendRoot(), []);

  useEffect(() => {
    Promise.all([getSettings(), getPartnerPage(), getTeamMembers()])
      .then(([s, page, members]) => {
        setPageActive(isSectionActive(s, "career"));
        setContent(page && Object.keys(page).length > 0 ? page : null);
        setAgents(
          (Array.isArray(members) ? members : []).map((m) => ({
            ...m,
            photo: resolvePhoto(m.photo, apiRoot),
          })),
        );
      })
      .catch(() => {});
  }, [apiRoot]);

  if (!pageActive || !content) return null;

  return (
    <main className="cr-page">
      <HeroSection content={content} />
      <AffiliateSection content={content} />
      <AgentsSection content={content} agents={agents} />
    </main>
  );
}
