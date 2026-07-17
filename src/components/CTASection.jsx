import { useEffect, useRef, useState } from "react";
import { subscribeSettings, isSectionActive } from "../api/apiClient";

const floatingLeaves = [
  { id: 1, emoji: "🌿", style: { top: "8%", left: "5%", fontSize: "2.2rem", animationDelay: "0s", animationDuration: "6s" } },
  { id: 2, emoji: "🍃", style: { top: "20%", right: "8%", fontSize: "1.6rem", animationDelay: "1.2s", animationDuration: "7s" } },
  { id: 3, emoji: "🌿", style: { bottom: "25%", left: "12%", fontSize: "1.4rem", animationDelay: "0.8s", animationDuration: "8s" } },
  { id: 4, emoji: "🍀", style: { top: "60%", right: "5%", fontSize: "2rem", animationDelay: "2s", animationDuration: "6.5s" } },
  { id: 5, emoji: "🌱", style: { bottom: "10%", right: "20%", fontSize: "1.8rem", animationDelay: "1.5s", animationDuration: "7.5s" } },
  { id: 6, emoji: "🍃", style: { top: "40%", left: "3%", fontSize: "1.3rem", animationDelay: "0.4s", animationDuration: "9s" } },
];


export default function CTASection() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    return subscribeSettings((s) => {
      setActive(isSectionActive(s, "home_authentic"));
      if (s && s.home_cta_heading) {
        setData({
          eyebrow: s.home_cta_eyebrow,
          heading: s.home_cta_heading,
          headingAccent: s.home_cta_heading_accent,
          subtext: s.home_cta_subtext,
          btnText: s.home_cta_btn_text,
          btnLink: s.home_cta_btn_link,
          btn2Text: s.home_cta_btn2_text,
          btn2Link: s.home_cta_btn2_link,
          badgeText: s.home_cta_badge_text,
        });
      }
    });
  }, []);

  useEffect(() => {
    // Re-attach once data arrives: before that the component renders null,
    // so sectionRef.current doesn't exist yet on the initial mount.
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [data]);

  if (!active || !data || !data.heading) return null;

  return (
    <section className="cta-section" ref={sectionRef}>
      {floatingLeaves.map((leaf) => (
        <div key={leaf.id} className="cta-leaf" style={leaf.style}>
          {leaf.emoji}
        </div>
      ))}

      <div className="cta-glow cta-glow-1" />
      <div className="cta-glow cta-glow-2" />

      <div className="cta-inner">
        <div className={`cta-content ${visible ? "fade-up" : "fade-hidden"}`} style={{ transitionDelay: "0.1s" }}>
          {data.eyebrow && <div className="cta-eyebrow">🌿 {data.eyebrow}</div>}
          {data.heading && (
            <h2 className="cta-heading">
              {data.heading}<br />
              {data.headingAccent && <span className="cta-accent">{data.headingAccent}</span>}
            </h2>
          )}
          {data.subtext && <p className="cta-subtext">{data.subtext}</p>}

          <div className="cta-actions">
            <a href={data.btnLink} className="cta-primary-btn" id="cta-shop-now">
              <span>{data.btnText}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href={data.btn2Link} className="cta-secondary-btn" id="cta-our-story">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M10 9l5 3-5 3V9z" fill="currentColor"/>
              </svg>
              {data.btn2Text}
            </a>
          </div>

          <div className="cta-delivery-row">
            <div className="cta-delivery-chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              {data.badgeText}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
