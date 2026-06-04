import { useEffect, useRef, useState } from "react";


export default function OurStory() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

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
          <img src="/story_farm.png" alt="Our Story" className="story2-single-img" />
        </div>

        {/* RIGHT — Content */}
        <div className={`story2-content ${visible ? "story2-fade-right" : "story2-hidden"}`}>
          <div className="story2-eyebrow">
            <span className="story2-bee-icon">🍯</span>
            About Us
          </div>

          <h2 className="story2-heading">
            Pure From the Hive,<br />
            <span className="story2-accent">Straight to Your Table</span>
          </h2>

          <p className="story2-desc">
            Our family has been dedicated to bringing you the
            purest, most authentic organic products. From hand-harvested mountain
            honey to traditionally made desi ghee — every product carries our
            promise of purity, quality, and generational craftsmanship.
          </p>

          <ul className="story2-bullets">
            <li>
              <span className="story2-bullet-dot" />
              100% natural — no additives, no preservatives
            </li>
            <li>
              <span className="story2-bullet-dot" />
              Sourced directly from trusted organic sourcess
            </li>
            <li>
              <span className="story2-bullet-dot" />
              Traditional methods passed through generations
            </li>
          </ul>

          <a href="#products" className="story2-btn">
            Explore Our Products
          </a>
        </div>
      </div>
    </section>
  );
}
