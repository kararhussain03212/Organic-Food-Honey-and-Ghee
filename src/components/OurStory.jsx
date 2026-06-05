import { useEffect, useRef, useState } from "react";
import { getSettings, parseJsonField } from "../api/apiClient";

const DEFAULTS = {
  heading: "Pure From the Hive,",
  headingAccent: "Straight to Your Table",
  eyebrow: "About Us",
  text: "Our family has been dedicated to bringing you the purest, most authentic organic products. From hand-harvested mountain honey to traditionally made desi ghee — every product carries our promise of purity, quality, and generational craftsmanship.",
  image: "/story_farm.png",
  bullets: [
    "100% natural — no additives, no preservatives",
    "Sourced directly from trusted organic sources",
    "Traditional methods passed through generations",
  ],
};

export default function OurStory() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(DEFAULTS);

  useEffect(() => {
    getSettings().then((s) => {
      if (!s || !s.home_story_heading) return;
      setData({
        heading: s.home_story_heading || DEFAULTS.heading,
        headingAccent: DEFAULTS.headingAccent,
        eyebrow: "About Us",
        text: s.home_story_text || DEFAULTS.text,
        image: s.home_story_image || DEFAULTS.image,
        bullets: parseJsonField(s.home_story_bullets, DEFAULTS.bullets),
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

        {/* LEFT — Single Hexagonal image */}
        <div className={`story2-hex-wrap ${visible ? "story2-fade-left" : "story2-hidden"}`}>
          <img src={data.image} alt="Our Story" className="story2-single-img" />
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

          <a href="#products" className="story2-btn">
            Explore Our Products
          </a>
        </div>
      </div>
    </section>
  );
}
