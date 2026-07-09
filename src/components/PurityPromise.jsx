import { useEffect, useRef, useState, useMemo } from "react";
import { getSettings, getCommitmentItems } from "../api/apiClient";
import { getBackendRoot } from "../api/runtimeApi";

const COLORS = [
  { color: "#4a7c59", bg: "rgba(74,124,89,0.08)" },
  { color: "#b8860b", bg: "rgba(184,134,11,0.08)" },
  { color: "#8b4513", bg: "rgba(139,69,19,0.08)" },
  { color: "#2e6b4f", bg: "rgba(46,107,79,0.08)" },
];

const DEFAULT_HEADER = {
  eyebrow: "Our Promise",
  heading: "Purity You Can",
  headingAccent: "Trust",
  subtext: "Every product we offer is carefully sourced, traditionally crafted, and rigorously tested — bringing the finest of nature directly to your home.",
  btnText: "",
  btnLink: "",
};

const DEFAULT_PROMISES = [
  { icon: "leaf", tag: "100% Organic", title: "Certified Organic", desc: "All our products are certified organic with no artificial additives, preservatives, or chemicals." },
  { icon: "shield", tag: "Lab Tested", title: "Quality Assured", desc: "Rigorous lab testing ensures every batch meets the highest purity and safety standards." },
  { icon: "award", tag: "Ethically Sourced", title: "Sustainably Sourced", desc: "We partner with trusted farms to bring you products that are good for you and the planet." },
  { icon: "heart", tag: "Family Trusted", title: "Family Trusted", desc: "Crafted with the same care we would give our own family — pure, honest, and wholesome." },
];

const resolveIconUrl = (value, apiRoot) => {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  if (value.startsWith("/uploads/")) return apiRoot + value;
  if (value.startsWith("/")) return apiRoot + value;
  return apiRoot + "/uploads/" + value;
};

function SvgIcon({ name, color, size = 28 }) {
  const s = { width: size, height: size, flexShrink: 0 };
  const p = { fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

  switch (name) {
    case "check-circle":
      return <svg viewBox="0 0 24 24" style={s} {...p}><circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" /></svg>;
    case "shield":
      return <svg viewBox="0 0 24 24" style={s} {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
    case "house":
      return <svg viewBox="0 0 24 24" style={s} {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
    case "leaf":
      return <svg viewBox="0 0 24 24" style={s} {...p}><path d="M17 8C8 10 5.9 16.17 3.82 19.5c.2.6.4 1.2.8 1.5A12 12 0 0 0 22 10C22 10 20 8 17 8z" /><path d="M3.82 19.5l5.7-5.7" /></svg>;
    case "star":
      return <svg viewBox="0 0 24 24" style={s} {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
    case "heart":
      return <svg viewBox="0 0 24 24" style={s} {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;
    case "droplet":
      return <svg viewBox="0 0 24 24" style={s} {...p}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>;
    case "award":
      return <svg viewBox="0 0 24 24" style={s} {...p}><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>;
    case "check":
      return <svg viewBox="0 0 24 24" style={s} {...p} strokeWidth={2.5}><polyline points="20 6 9 17 4 12" /></svg>;
    default:
      return null;
  }
}

export default function PurityPromise() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [activeBadge, setActiveBadge] = useState(0);
  const [promises, setPromises] = useState([]);
  const [header, setHeader] = useState(null);
  const apiRoot = useMemo(() => getBackendRoot(), []);

  useEffect(() => {
    Promise.all([getSettings(), getCommitmentItems()]).then(([s, items]) => {
      if (s && s.home_commitment_heading) {
        setHeader({
          eyebrow: s.home_commitment_eyebrow,
          heading: s.home_commitment_heading,
          headingAccent: s.home_commitment_heading_accent,
          subtext: s.home_commitment_subtext,
          btnText: s.home_commitment_btn_text,
          btnLink: s.home_commitment_btn_link,
        });
      }

      if (Array.isArray(items) && items.length > 0) {
        setPromises(
          items.map((item, i) => ({
            icon: item.icon || "check-circle",
            icon_url: item.icon_url ? resolveIconUrl(item.icon_url, apiRoot) : null,
            tag: item.tag || item.title || "",
            title: item.title || "",
            desc: item.description || "",
            ...COLORS[i % COLORS.length],
          }))
        );
      }
    }).catch(() => {});
  }, [apiRoot]);

  const displayHeader = header || DEFAULT_HEADER;
  const displayPromises = promises.length > 0
    ? promises
    : DEFAULT_PROMISES.map((p, i) => ({ ...p, icon_url: null, ...COLORS[i % COLORS.length] }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (displayPromises.length <= 1) return;
    const t = setInterval(() => setActiveBadge((p) => (p + 1) % displayPromises.length), 2000);
    return () => clearInterval(t);
  }, [displayPromises.length]);

  return (
    <section className="purity-section" ref={sectionRef}>
      <div className="purity-blob purity-blob-1" />
      <div className="purity-blob purity-blob-2" />
      <div className="purity-blob purity-blob-3" />

      <div className="purity-inner">
        <div className={`purity-header ${visible ? "fade-up" : "fade-hidden"}`}>
          <div className="purity-eyebrow">
            <span className="purity-leaf">🌿</span>
            {displayHeader.eyebrow}
          </div>
          <h2 className="purity-heading">
            {displayHeader.heading} <span className="purity-accent">{displayHeader.headingAccent}</span>
          </h2>
          <p className="purity-subtext">{displayHeader.subtext}</p>

          <div className="badge-strip">
            {displayPromises.map((p, i) => (
              <span key={p.tag + i} className={`purity-badge ${i === activeBadge ? "purity-badge-active" : ""}`}>
                {p.tag}
              </span>
            ))}
          </div>
        </div>

        <div className="purity-grid">
          {displayPromises.map((p, i) => (
            <div
              key={p.title + i}
              className={`purity-card ${visible ? "fade-up" : "fade-hidden"}`}
              style={{ transitionDelay: `${0.15 + i * 0.12}s`, "--card-accent": p.color, "--card-bg": p.bg }}
            >
              <div className="purity-card-glow" />
              <div className="purity-icon-wrap" style={{ background: p.bg, color: p.color }}>
                {p.icon_url ? (
                  <img src={p.icon_url} alt={p.icon_alt_text || p.title} title={p.desc} style={{ width: "1.8rem", height: "1.8rem", objectFit: "contain" }} />
                ) : (
                  <SvgIcon name={p.icon} color={p.color} size={28} />
                )}
              </div>
              <div className="purity-card-tag" style={{ color: p.color }}>
                ✦ {p.tag}
              </div>
              <h3 className="purity-card-title">{p.title}</h3>
              <p className="purity-card-desc">{p.desc}</p>
              <div className="purity-card-bar" style={{ background: p.color }} />
            </div>
          ))}
        </div>

        {/* {header.btnText && (
          <div className={`purity-cta-wrap ${visible ? "fade-up" : "fade-hidden"}`} style={{ transitionDelay: "0.6s" }}>
            <a href={header.btnLink || "#"} className="story2-btn">
              {header.btnText}
            </a>
          </div>
        )} */}
      </div>
    </section>
  );
}
