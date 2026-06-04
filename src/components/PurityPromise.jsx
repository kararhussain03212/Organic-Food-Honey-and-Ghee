import { useEffect, useRef, useState } from "react";

const promises = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
        <path d="M8 12l3 3 5-5"/>
      </svg>
    ),
    tag: "100% Natural",
    title: "Naturally Sourced Quality",
    desc: "Every product begins its journey in pristine natural environments—no shortcuts, no compromises. We trace every ingredient from source to shelf.",
    color: "#4a7c59",
    bg: "rgba(74,124,89,0.08)",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <path d="M9 22V12h6v10"/>
      </svg>
    ),
    tag: "sources Fresh",
    title: "Traditional Purity",
    desc: "Rooted in generations of artisan knowledge, our methods honor the land. Time-tested traditions preserve the natural goodness in every jar.",
    color: "#b8860b",
    bg: "rgba(184,134,11,0.08)",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 12l2 2 4-4"/>
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    tag: "Chemical Free",
    title: "No Artificial Compromise",
    desc: "Zero preservatives, zero additives, zero artificial flavors. Pure as nature intended—what you see is exactly what goes in.",
    color: "#8b4513",
    bg: "rgba(139,69,19,0.08)",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    tag: "Premium Quality",
    title: "Our Quality Commitment",
    desc: "Rigorous testing at every stage of production. Our quality promise isn't just a label—it's the foundation everything we do is built upon.",
    color: "#2e6b4f",
    bg: "rgba(46,107,79,0.08)",
  },
];

const badges = ["100% Natural", "Chemical Free", "sources Fresh", "Premium Quality"];

export default function PurityPromise() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [activeBadge, setActiveBadge] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveBadge((p) => (p + 1) % badges.length), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="purity-section" ref={sectionRef}>
      {/* Organic background blobs */}
      <div className="purity-blob purity-blob-1" />
      <div className="purity-blob purity-blob-2" />
      <div className="purity-blob purity-blob-3" />

      <div className="purity-inner">
        {/* Header */}
        <div className={`purity-header ${visible ? "fade-up" : "fade-hidden"}`}>
          <div className="purity-eyebrow">
            <span className="purity-leaf">🌿</span>
            Our Commitment to You
          </div>
          <h2 className="purity-heading">
            We Take Quality <span className="purity-accent">Seriously.</span>
          </h2>
          <p className="purity-subtext">
            Every product we craft carries our unyielding promise — pure, honest,
            and made with the reverence nature deserves.
          </p>

          {/* Animated badge strip */}
          <div className="badge-strip">
            {badges.map((b, i) => (
              <span
                key={b}
                className={`purity-badge ${i === activeBadge ? "purity-badge-active" : ""}`}
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        <div className="purity-grid">
          {promises.map((p, i) => (
            <div
              key={p.title}
              className={`purity-card ${visible ? "fade-up" : "fade-hidden"}`}
              style={{ transitionDelay: `${0.15 + i * 0.12}s`, "--card-accent": p.color, "--card-bg": p.bg }}
            >
              <div className="purity-card-glow" />
              <div className="purity-icon-wrap" style={{ background: p.bg, color: p.color }}>
                {p.icon}
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

        {/* Bottom trust strip */}
        {/* <div className={`purity-trust-strip ${visible ? "fade-up" : "fade-hidden"}`} style={{ transitionDelay: "0.7s" }}>
          {[
            { num: "100%", label: "Pure Ingredients" },
            { num: "0", label: "Artificial Additives" },
            { num: "15+", label: "Years of Heritage" },
            { num: "50k+", label: "Happy Families" },
          ].map((s) => (
            <div className="purity-stat" key={s.label}>
              <span className="purity-stat-num">{s.num}</span>
              <span className="purity-stat-label">{s.label}</span>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
}
