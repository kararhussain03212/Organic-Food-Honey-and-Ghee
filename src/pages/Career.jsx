import { useState, useRef, useEffect, useMemo } from "react";
import "../styles/Career.css";
import { getSettings, isSectionActive } from "../api/apiClient";

const AGENTS = [
  { id: 1, name: "Azam Muhammad", region: "Gilgit Baltistan", quote: "Here to help you find the right product for your family.", whatsapp: "+923425551234", image: "https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 2, name: "Dr. Iftikhar", region: "Dubai, UAE", quote: "Your trusted wellness partner in the Gulf.", whatsapp: "+971501234567", image: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { id: 3, name: "Wasif Abbas", region: "Khyber Pakhtunkhwa", quote: "Bringing pure products to KPK families.", whatsapp: "+923115551234", image: "https://picsum.photos/240/240?random=3" },
  { id: 4, name: "Zahir Abbas", region: "Khyber Pakhtunkhwa", quote: "Quality wellness, delivered to your doorstep.", whatsapp: "+923335551234", image: "https://picsum.photos/240/240?random=4" },
  { id: 5, name: "Ismail", region: "Islamabad", quote: "Connect with Arion's trusted representative.", whatsapp: "+923005551234", image: "https://picsum.photos/240/240?random=5" },
  { id: 6, name: "Punjabi Saeed", region: "Punjab", quote: "Serving Punjab with authentic, natural products.", whatsapp: "+923215551234", image: "https://picsum.photos/240/240?random=6" },
];

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function HeroSection() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);

  return (
    <section className="cr-hero">
      <div className="cr-hero-shapes">
        <div className="cr-shape cr-shape-1" />
        <div className="cr-shape cr-shape-2" />
        <div className="cr-shape cr-shape-3" />
      </div>
      <div className={`cr-hero-content${visible ? " visible" : ""}`}>
        <div className="cr-eyebrow">✦ Join the Movement</div>
        <h1 className="cr-hero-title">Join the <span className="cr-gold">Arion Family</span></h1>
        <p className="cr-hero-sub">We're building more than a brand — a trusted name in natural wellness across Pakistan. If you believe in purity, honesty, and healthier living, there's a place for you here.</p>
      </div>
    </section>
  );
}

function AffiliateSection() {
  const [ref, inView] = useInView();
  const [form, setForm] = useState({
    name: "", phone: "", city: "", handle: "", category: "Individual", message: ""
  });
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
    if (!form.message.trim()) errs.message = "Please tell us why you want to join.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus("loading");
    try {
      const { postContact } = await import("../api/apiClient");
      await postContact({
        name: form.name,
        phone: form.phone,
        subject: `Affiliate Application - ${form.category}`,
        message: `City: ${form.city}\nCategory: ${form.category}\nHandle: ${form.handle || "Not provided"}\n\nWhy join: ${form.message}`
      });
      setStatus("success");
      setForm({ name: "", phone: "", city: "", handle: "", category: "Individual", message: "" });
    } catch (err) {
      setStatus("error");
    }
  };

  const resetForm = () => { setStatus("idle"); setErrors({}); };

  if (status === "success") {
    return (
      <section className="cr-affiliate" ref={ref}>
        <div className="cr-container">
          <div className={`cr-section-header${inView ? " visible" : ""}`}>
            <div className="cr-section-label">Arion Affiliate Program</div>
            <h2 className="cr-section-title">Partner with Us</h2>
            <p className="cr-section-sub">Earn by sharing products you'd recommend to your own family.</p>
          </div>
          <div className={`cr-success-card${inView ? " visible" : ""}`}>
            <div className="cr-success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className="cr-success-title">Application Received!</h3>
            <p className="cr-success-desc">Thank you for your interest in joining Arion. Our team will reach out on WhatsApp within 24–48 hours to confirm your application.</p>
            <button className="cr-btn" onClick={resetForm}>Submit Another Application</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="cr-affiliate" ref={ref}>
      <div className="cr-container">
        <div className={`cr-section-header${inView ? " visible" : ""}`}>
          <div className="cr-section-label">Arion Affiliate Program</div>
          <h2 className="cr-section-title">Partner with Us</h2>
          <p className="cr-section-sub">Earn by sharing products you'd recommend to your own family.</p>
        </div>

        <div className={`cr-affiliate-content${inView ? " visible" : ""}`}>
          <div className="cr-affiliate-info">
            <div className="cr-info-block">
              <h3>Who it's for</h3>
              <p>Resellers, wellness advocates, Teachers, fitness coaches, and social influencers who want to earn while promoting authentic, naturally sourced products.</p>
            </div>

            <div className="cr-info-block">
              <h3>How it works</h3>
              <ol>
                <li><strong>Apply</strong> — Fill the form with your details.</li>
                <li><strong>Get onboarded</strong> — We share your unique code, product info, and marketing material.</li>
                <li><strong>Start earning</strong> — Earn commission on every sale through your reference or link.</li>
              </ol>
            </div>

            <div className="cr-info-block">
              <h3>What you get</h3>
              <ul>
                <li>Competitive commission per sale</li>
                <li>Marketing materials and product photos</li>
                <li>Priority WhatsApp support from our team</li>
                <li>Early access to new products</li>
                <li>Monthly payouts, no minimum sales pressure</li>
              </ul>
            </div>
          </div>

          <form className="cr-form" onSubmit={handleSubmit} noValidate>
            <div className="cr-form-title">Apply Now</div>

            <div className="cr-form-field">
              <input type="text" placeholder="Full Name" value={form.name} onChange={set("name")} className={errors.name ? "error" : ""} />
              {errors.name && <span className="cr-error">{errors.name}</span>}
            </div>

            <div className="cr-form-field">
              <input type="tel" placeholder="Phone / WhatsApp Number" value={form.phone} onChange={set("phone")} className={errors.phone ? "error" : ""} />
              {errors.phone && <span className="cr-error">{errors.phone}</span>}
            </div>

            <div className="cr-form-field">
              <input type="text" placeholder="City" value={form.city} onChange={set("city")} className={errors.city ? "error" : ""} />
              {errors.city && <span className="cr-error">{errors.city}</span>}
            </div>

            <div className="cr-form-field">
              <input type="text" placeholder="Instagram / Facebook / TikTok handle (optional)" value={form.handle} onChange={set("handle")} />
            </div>

            <div className="cr-form-field">
              <label className="cr-category-label">I am applying as:</label>
              <div className="cr-radio-group">
                {["Individual", "Reseller", "Influencer", "Fitness/Wellness Coach"].map((opt) => (
                  <label key={opt} className="cr-radio">
                    <input type="radio" name="category" value={opt} checked={form.category === opt} onChange={set("category")} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="cr-form-field">
              <textarea placeholder="Why do you want to join Arion? (short answer)" rows="4" value={form.message} onChange={set("message")} className={errors.message ? "error" : ""} />
              {errors.message && <span className="cr-error">{errors.message}</span>}
            </div>

            {status === "error" && (
              <div className="cr-alert-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Something went wrong. Please try again.
              </div>
            )}

            <button type="submit" className={`cr-btn cr-btn--submit${status === "loading" ? " cr-btn--loading" : ""}`} disabled={status === "loading"}>
              {status === "loading" ? (<><span className="cr-spinner" />Submitting…</>) : <>Submit Application</>}
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
    <div className={`cr-agent-card${inView ? " visible" : ""}`} style={{ transitionDelay: `${index * 0.08}s` }}>
      {!imageError ? (
        <img
          src={agent.image}
          alt={agent.name}
          className="cr-agent-image"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      ) : (
        <div className="cr-agent-image-fallback">
          <div className="cr-agent-initials">{agent.name.split(' ').map(n => n[0]).join('')}</div>
        </div>
      )}
      <h3 className="cr-agent-name">{agent.name}</h3>
      <p className="cr-agent-region">{agent.region}</p>
      <blockquote className="cr-agent-quote">"{agent.quote}"</blockquote>
      <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="cr-agent-cta">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10a9.958 9.958 0 0 1-5.084-1.383L2 22l1.414-4.836A9.958 9.958 0 0 1 2 12 10 10 0 0 1 12 2zm0 2a8 8 0 1 0 0 16A8 8 0 0 0 12 4z" />
        </svg>
        Chat on WhatsApp
      </a>
    </div>
  );
}

function AgentsSection() {
  const [ref, inView] = useInView();

  return (
    <section className="cr-agents" ref={ref}>
      <div className="cr-container">
        <div className={`cr-section-header${inView ? " visible" : ""}`}>
          <div className="cr-section-label">Meet Our Team</div>
          <h2 className="cr-section-title">Talk to a Real Person, Not a Bot</h2>
          <p className="cr-section-sub">Our regional sales agents are here to help you order, ask questions, or set up bulk/reseller purchases — directly on WhatsApp.</p>
        </div>

        <div className="cr-agents-grid">
          {AGENTS.map((agent, i) => (
            <AgentCard key={agent.id} agent={agent} inView={inView} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Career() {
  const [pageActive, setPageActive] = useState(true);

  useEffect(() => {
    getSettings().then((s) => setPageActive(isSectionActive(s, "career"))).catch(() => {});
  }, []);

  if (!pageActive) return null;

  return (
    <main className="cr-page">
      <HeroSection />
      <AffiliateSection />
      <AgentsSection />
    </main>
  );
}
