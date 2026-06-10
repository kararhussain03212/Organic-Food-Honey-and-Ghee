import { useEffect, useRef, useState, useMemo } from "react";
import { getSettings, parseJsonField } from "../api/apiClient";
import { getBackendRoot } from "../api/runtimeApi";

const DEFAULT_DATA = {
  eyebrow: "About Us",
  heading: "Pure From the Hive,",
  headingAccent: "Straight to Your Table",
  text: "Arion Organic Food is dedicated to bringing you the purest, most authentic organic products. From our family farms to your home, every product is crafted with care, integrity, and a commitment to natural goodness.",
  image: "",
  bullets: [
    "100% Organic Certified",
    "No artificial additives or preservatives",
    "Sustainably sourced from trusted farms",
    "Rigorously tested for purity and quality",
  ],
  btnText: "Explore Our Products",
  btnLink: "/products",
};

export default function OurStory() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(null);
  const apiRoot = useMemo(() => getBackendRoot(), []);

  const toImageUrl = (val) => {
    if (!val) return "";
    if (val.startsWith("http")) return val;
    if (val.startsWith("/uploads/")) return apiRoot + val;
    return val; // local frontend asset (e.g. /story_farm.png)
  };

  useEffect(() => {
    getSettings().then((s) => {
      if (s && s.home_story_heading) {
        setData({
          eyebrow: s.home_story_eyebrow,
          heading: s.home_story_heading,
          headingAccent: s.home_story_heading_accent,
          text: s.home_story_text,
          image: s.home_story_image,
          bullets: parseJsonField(s.home_story_bullets, []),
          btnText: s.home_story_btn_text,
          btnLink: s.home_story_btn_link,
        });
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const displayData = data || DEFAULT_DATA;

  return (
    <section className="story2-section" id="our-story" ref={sectionRef}>
      <div className="story2-inner">

        {/* LEFT — Single image */}
        <div className={`story2-hex-wrap ${visible ? "story2-fade-left" : "story2-hidden"}`}>
          {displayData.image && <img src={toImageUrl(displayData.image)} alt="Our Story" className="story2-single-img" />}
        </div>

        {/* RIGHT — Content */}
        <div className={`story2-content ${visible ? "story2-fade-right" : "story2-hidden"}`}>
          {displayData.eyebrow && (
            <div className="story2-eyebrow">
              <span className="story2-bee-icon">🍯</span>
              {displayData.eyebrow}
            </div>
          )}

          {displayData.heading && (
            <h2 className="story2-heading">
              {displayData.heading}<br />
              {displayData.headingAccent && <span className="story2-accent">{displayData.headingAccent}</span>}
            </h2>
          )}

          {displayData.text && <p className="story2-desc">{displayData.text}</p>}

          {displayData.bullets && displayData.bullets.length > 0 && (
            <ul className="story2-bullets">
              {displayData.bullets.map((bullet, i) => (
                <li key={i}>
                  <span className="story2-bullet-dot" />
                  {bullet}
                </li>
              ))}
            </ul>
          )}

          {displayData.btnText && displayData.btnLink && (
            <a href={displayData.btnLink} className="story2-btn">
              {displayData.btnText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
