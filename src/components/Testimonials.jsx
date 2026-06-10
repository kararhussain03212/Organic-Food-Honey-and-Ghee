import { useEffect, useRef, useState, useMemo } from "react";
import { getTestimonials, getSettings } from "../api/apiClient";
import { getBackendRoot } from "../api/runtimeApi";


function Stars({ rating }) {
  return (
    <div className="test-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} viewBox="0 0 24 24" className="test-star">
          <path fill={s <= rating ? "#c8a04a" : "#e0d8c8"} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

const resolveAvatar = (value, apiRoot) => {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  if (value.startsWith("/uploads/")) return apiRoot + value;
  if (value.startsWith("/")) return apiRoot.replace(/\/backend$/, "") + value;
  return apiRoot + "/uploads/" + value;
};

export default function Testimonials() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [header, setHeader] = useState(null);
  const apiRoot = useMemo(() => getBackendRoot(), []);

  useEffect(() => {
    Promise.all([getSettings(), getTestimonials()]).then(([s, items]) => {
      if (s && s.home_testimonials_heading) {
        setHeader({
          eyebrow: s.home_testimonials_eyebrow,
          heading: s.home_testimonials_heading,
          headingAccent: s.home_testimonials_heading_accent,
          subtext: s.home_testimonials_subtext,
        });
      }

      if (Array.isArray(items) && items.length > 0) {
        const active = items.filter((t) => t.is_active === 1 || t.is_active === true);
        if (active.length > 0) {
          setTestimonials(
            active.map((t) => ({
              id: t.id,
              name: t.name || "",
              role: t.role || "Verified Customer",
              avatar: resolveAvatar(t.avatar, apiRoot),
              rating: Number(t.rating ?? 5),
              quote: t.quote || "",
              product: t.product || "",
              verified: t.verified === 1 || t.verified === true,
            }))
          );
        }
      }
    });
  }, [apiRoot]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const t = setInterval(() => setCurrent((p) => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, [testimonials.length]);

  const prev = () => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((p) => (p + 1) % testimonials.length);

  if (!header || testimonials.length === 0) return null;

  return (
    <section className="test-section" ref={sectionRef}>
      <div className="test-blob test-blob-1" />
      <div className="test-blob test-blob-2" />

      <div className="test-inner">
        <div className={`test-header ${visible ? "fade-up" : "fade-hidden"}`}>
          {header.eyebrow && <div className="test-eyebrow">💬 {header.eyebrow}</div>}
          {header.heading && (
            <h2 className="test-heading">
              {header.heading} {header.headingAccent && <span className="test-accent">{header.headingAccent}</span>}
            </h2>
          )}
          {header.subtext && <p className="test-subtext">{header.subtext}</p>}
        </div>

        <div className={`test-carousel-wrap ${visible ? "fade-up" : "fade-hidden"}`} style={{ transitionDelay: "0.4s" }}>
          <div className="test-featured">
            {testimonials.map((t, i) => (
              <div
                key={t.id}
                className={`test-card ${i === current ? "test-card-active" : i === (current - 1 + testimonials.length) % testimonials.length ? "test-card-prev" : "test-card-hidden"}`}
              >
                <div className="test-card-glow" />
                <div className="test-quote-icon">"</div>
                <p className="test-quote">{t.quote}</p>
                <Stars rating={t.rating} />

                <div className="test-card-footer">
                  <div className="test-avatar-wrap">
                    <img src={t.avatar} alt={t.name} className="test-avatar" />
                    {t.verified && <div className="test-verified" title="Verified Customer">✓</div>}
                  </div>
                  <div>
                    <div className="test-name">{t.name}</div>
                    <div className="test-role">{t.role}</div>
                  </div>
                  {t.product && <div className="test-product-chip">{t.product}</div>}
                </div>
              </div>
            ))}
          </div>

          <div className="test-nav">
            <button className="test-nav-btn" onClick={prev} aria-label="Previous">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div className="test-dots">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`test-dot ${i === current ? "test-dot-active" : ""}`}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button className="test-nav-btn" onClick={next} aria-label="Next">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
