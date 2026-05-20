import { useEffect, useRef, useState } from "react";

const floatingLeaves = [
  { id: 1, emoji: "🌿", style: { top: "8%", left: "5%", fontSize: "2.2rem", animationDelay: "0s", animationDuration: "6s" } },
  { id: 2, emoji: "🍃", style: { top: "20%", right: "8%", fontSize: "1.6rem", animationDelay: "1.2s", animationDuration: "7s" } },
  { id: 3, emoji: "🌿", style: { bottom: "25%", left: "12%", fontSize: "1.4rem", animationDelay: "0.8s", animationDuration: "8s" } },
  { id: 4, emoji: "🍀", style: { top: "60%", right: "5%", fontSize: "2rem", animationDelay: "2s", animationDuration: "6.5s" } },
  { id: 5, emoji: "🌱", style: { bottom: "10%", right: "20%", fontSize: "1.8rem", animationDelay: "1.5s", animationDuration: "7.5s" } },
  { id: 6, emoji: "🍃", style: { top: "40%", left: "3%", fontSize: "1.3rem", animationDelay: "0.4s", animationDuration: "9s" } },
];

// const trustIndicators = [
//   { icon: "🚚", label: "Free Delivery", sub: "On orders above Rs 2,000" },
//   { icon: "↩️", label: "Easy Returns", sub: "30-day return policy" },
//   { icon: "🛡️", label: "100% Genuine", sub: "Authenticity guaranteed" },
//   { icon: "⭐", label: "4.9 Rating", sub: "From 50,000+ customers" },
// ];

export default function CTASection() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="cta-section" ref={sectionRef}>
      {/* Floating leaves */}
      {floatingLeaves.map((leaf) => (
        <div key={leaf.id} className="cta-leaf" style={leaf.style}>
          {leaf.emoji}
        </div>
      ))}

      {/* Radial glows */}
      <div className="cta-glow cta-glow-1" />
      <div className="cta-glow cta-glow-2" />

      <div className="cta-inner">
        {/* Guarantee badge */}
        {/* <div className={`cta-guarantee ${visible ? "fade-up" : "fade-hidden"}`}>
          <span className="cta-guarantee-icon">🏆</span>
          <span>100% Satisfaction Guaranteed or Your Money Back</span>
        </div> */}

        <div className={`cta-content ${visible ? "fade-up" : "fade-hidden"}`} style={{ transitionDelay: "0.1s" }}>
          <div className="cta-eyebrow">🌿 Pure. Natural. Authentic.</div>
          <h2 className="cta-heading">
            Experience Real Purity<br />
            <span className="cta-accent">in Every Product</span>
          </h2>
          <p className="cta-subtext">
            Fresh, natural, and traditionally crafted products delivered to your home.
            No preservatives. No shortcuts. Just the honest goodness of nature.
          </p>

          <div className="cta-actions">
            <a href="#products" className="cta-primary-btn" id="cta-shop-now">
              <span>Shop Now</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="about" className="cta-secondary-btn" id="cta-our-story">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M10 9l5 3-5 3V9z" fill="currentColor"/>
              </svg>
              Our Story
            </a>
          </div>

          {/* Delivery info chips */}
          <div className="cta-delivery-row">
            <div className="cta-delivery-chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Authenticity Guaranteed
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        {/* <div className={`cta-trust ${visible ? "fade-up" : "fade-hidden"}`} style={{ transitionDelay: "0.3s" }}>
          {trustIndicators.map((t) => (
            <div className="cta-trust-card" key={t.label}>
              <span className="cta-trust-icon">{t.icon}</span>
              <div className="cta-trust-label">{t.label}</div>
              <div className="cta-trust-sub">{t.sub}</div>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
}
