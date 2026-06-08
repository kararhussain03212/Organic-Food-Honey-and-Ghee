import { useEffect, useRef, useState, useMemo } from "react";
import { getSettings, parseJsonField } from "../api/apiClient";
import { getBackendRoot } from "../api/runtimeApi";

const DEFAULTS = {
  eyebrow: "About Us",
  heading: "Our Story",
  headingAccent: "Straight to Your Table",
  text: "From the pristine valleys of Pakistan, we bring you the purest organic products.",
  image: "/story_farm.png",
  bullets: [
    "100% natural — no additives, no preservatives",
    "Sourced directly from trusted organic sources",
    "Traditional methods passed through generations",
  ],
  btnText: "Explore Our Products",
  btnLink: "#products",
};

export default function OurStory() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(DEFAULTS);
  const apiRoot = useMemo(() => getBackendRoot(), []);

  const toImageUrl = (val) => {
    if (!val) return "";
    if (val.startsWith("http")) return val;
    if (val.startsWith("/uploads/")) return apiRoot + val;
    return val; // local frontend asset (e.g. /story_farm.png)
  };

  useEffect(() => {
    getSettings().then((s) => {
      if (!s) return;
      setData({
        eyebrow: s.home_story_eyebrow || DEFAULTS.eyebrow,
        heading: s.home_story_heading || DEFAULTS.heading,
        headingAccent: s.home_story_heading_accent || DEFAULTS.headingAccent,
        text: s.home_story_text || DEFAULTS.text,
        image: s.home_story_image || DEFAULTS.image,
        bullets: parseJsonField(s.home_story_bullets, DEFAULTS.bullets),
        btnText: s.home_story_btn_text || DEFAULTS.btnText,
        btnLink: s.home_story_btn_link || DEFAULTS.btnLink,
      });
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

  return (
    <section className="story2-section" id="our-story" ref={sectionRef}>
      <div className="story2-inner">

        {/* LEFT — Single image */}
        <div className={`story2-hex-wrap ${visible ? "story2-fade-left" : "story2-hidden"}`}>
          <img src={toImageUrl(data.image)} alt="Our Story" className="story2-single-img" />
        </div>

        {/* RIGHT — Content */}
        <div className={`story2-content ${visible ? "story2-fade-right" : "story2-hidden"}`}>
          <div className="story2-eyebrow">
            <span className="story2-bee-icon">🍯</span>
            {data.eyebrow}
          </div>

          <h2 className="story2-heading">
            {data.heading}<br />
            <span className="story2-accent">{data.headingAccent}</span>
          </h2>

          <p className="story2-desc">{data.text}</p>

          <ul className="story2-bullets">
            {data.bullets.map((bullet, i) => (
              <li key={i}>
                <span className="story2-bullet-dot" />
                {bullet}
              </li>
            ))}
          </ul>

          <a href={data.btnLink} className="story2-btn">
            {data.btnText}
          </a>
        </div>
      </div>
    </section>
  );
}
