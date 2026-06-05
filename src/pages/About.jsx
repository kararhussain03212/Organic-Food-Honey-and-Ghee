import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSettings, parseJsonField } from "../api/apiClient";
import "../styles/About.css";

/* ─── Static fallback data ──────────────────────── */
const STATIC = {
  story: {
    headline: "How It All Began",
    paragraphs: [
      "Arion was founded by a family who watched the food they trusted slowly disappear from shelves, replaced by colourful packaging and invisible chemicals.",
      "We set out to change that. Not loudly, not with slogans, but quietly — the way good food has always worked. One pure product, one trusted source, one honest jar at a time.",
      "Today, every Arion product carries that same original conviction: that the best food is the least interfered with, and that the wisdom of our grandmothers was never something to improve upon — only to protect.",
    ],
    keywords: ["pure", "honest", "traditional", "trusted"],
  },
  timeline: [
    { step: "01", icon: "🌾", title: "Loss of Natural Food Quality", desc: "Industrial sourcing and mass production eroded the nutritional depth of everyday foods across generations." },
    { step: "02", icon: "⚗️", title: "Rise of Artificial Products", desc: "Preservatives, additives, and synthetic flavours became the norm — prioritising shelf life over human life." },
    { step: "03", icon: "💡", title: "Health Awareness Growing", desc: "A global shift in consciousness began. People started asking harder questions about what they were actually eating." },
    { step: "04", icon: "🫙", title: "Return to Pure Traditions", desc: "Arion was born here — to honour what was lost and return it, with trust and full transparency, to your table." },
  ],
  mission: [
    { icon: "🌿", title: "Purity First", desc: "We prioritise natural, unprocessed ingredients. Nothing enters our products that we would not give our own children.", color: "#496348" },
    { icon: "🧡", title: "Trust & Transparency", desc: "What you see is what you get — no hidden compromises, no ambiguous labels, no grey areas.", color: "#C7A66B" },
    { icon: "🌾", title: "Traditional Wisdom", desc: "Inspired by generations of natural healing practices refined across centuries of lived experience.", color: "#5B5248" },
    { icon: "🏥", title: "Modern Wellness", desc: "Blending time-tested tradition with contemporary nutritional science for measurably better living.", color: "#496348" },
  ],
  traditional: [
    "Desi cooking methods passed down through generations",
    "Heritage practices without shortcuts",
    "Slow processes that preserve nutritional integrity",
  ],
  modern: [
    "Scientific nutrition profiling and lab testing",
    "Rigorous quality benchmarks at every stage",
    "Clean, hygienic production environments",
    "Traceable supply chains with full accountability",
  ],
  hero: { title: "About Arion", subtitle: "A journey rooted in tradition, purity, and modern wellness.", quote: "Arion was born from a belief that food is not just nourishment — it is memory, healing, and life itself.", image: "/slide5.jpg" },
};

/* ─── useInView hook ────────────────────────────── */
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.12, ...options }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ─── 1. Hero ────────────────────────────────────── */
function HeroSection({ hero }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);
  return (
    <section className="ab-hero">
      <img src={hero.image || "/slide5.jpg"} alt="Hero background" className="ab-hero-img" />
      <div className="ab-hero-overlay" />
      <div className="ab-shape ab-shape-1" />
      <div className="ab-shape ab-shape-2" />
      <div className="ab-shape ab-shape-3" />
      <div className={`ab-hero-content${visible ? " visible" : ""}`}>
        <div className="ab-eyebrow">✦ Our Story</div>
        <h1 className="ab-hero-title">About <span className="ab-gold">Arion</span></h1>
        <p className="ab-hero-sub">{hero.subtitle}</p>
        <blockquote className="ab-hero-quote">"{hero.quote}"</blockquote>
      </div>
    </section>
  );
}

/* ─── 2. Our Story ───────────────────────────────── */
function StorySection({ story }) {
  const [ref, inView] = useInView();
  const highlightText = (text) => {
    const kw = story.keywords;
    const parts = text.split(new RegExp(`(${kw.join("|")})`, "gi"));
    return parts.map((p, i) =>
      kw.includes(p.toLowerCase()) ? <strong key={i} className="ab-kw">{p}</strong> : p
    );
  };
  return (
    <section className="ab-story" ref={ref}>
      <div className="ab-container">
        <div className={`ab-story-grid${inView ? " visible" : ""}`}>
          <div className="ab-story-collage">
            <div className="ab-collage-main">
              <img src="/story_honey.png" alt="Our pure organic products" className="ab-collage-img" />
            </div>
            <div className="ab-collage-stack">
              <div className="ab-collage-sm">
                <img src="/ghee.jpeg " alt="Natural sourcing" className="ab-collage-img" />
              </div>
              <div className="ab-collage-sm">
                <img src="/story_founder.png" alt="Our founder" className="ab-collage-img" />
              </div>
            </div>
          </div>
          <div className="ab-story-text">
            <div className="ab-section-label">Our Story</div>
            <h2 className="ab-section-title">{story.headline}</h2>
            {story.paragraphs.map((p, i) => (
              <p key={i} className="ab-story-para" style={{ transitionDelay: `${i * 0.15}s` }}>
                {highlightText(p)}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 3. Timeline ────────────────────────────────── */
function TimelineSection({ timeline }) {
  const [ref, inView] = useInView();
  return (
    <section className="ab-timeline-section" ref={ref}>
      <div className="ab-container">
        <div className={`ab-section-header${inView ? " visible" : ""}`}>
          <div className="ab-section-label">The Problem We Solved</div>
          <h2 className="ab-section-title">Why Arion Exists</h2>
          <p className="ab-section-sub">Understanding the problem is what gave us the clarity to build something truly different.</p>
        </div>
        <div className="ab-timeline-grid">
          {timeline.map((item, i) => (
            <div key={item.step} className={`ab-timeline-card${inView ? " visible" : ""}`} style={{ transitionDelay: `${i * 0.12}s` }}>
              <div className="ab-tl-step">{item.step}</div>
              <div className="ab-tl-icon">{item.icon}</div>
              <h3 className="ab-tl-title">{item.title}</h3>
              <p className="ab-tl-desc">{item.desc}</p>
              <div className="ab-tl-glow" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 4. Mission ─────────────────────────────────── */
function MissionSection({ mission }) {
  const [ref, inView] = useInView();
  return (
    <section className="ab-mission" ref={ref}>
      <div className="ab-mission-strip">
        <div className="ab-container">
          <div className={`ab-mission-header${inView ? " visible" : ""}`}>
            <div className="ab-mission-header-text">
              <span className="ab-mission-kicker">✦ What We Stand For</span>
              <h2 className="ab-mission-heading">Our Core Mission</h2>
            </div>
            <p className="ab-mission-header-desc">
              Every decision we make is guided by four uncompromising principles that have shaped Arion since the very beginning.
            </p>
          </div>
        </div>
      </div>
      <div className="ab-container">
        <div className="ab-mission-grid">
          {mission.map((card, i) => (
            <div key={card.title} className={`ab-mc${inView ? " visible" : ""}`} style={{ transitionDelay: `${i * 0.13}s` }}>
              <div className="ab-mc-num">0{i + 1}</div>
              <div className="ab-mc-top">
                <div className="ab-mc-icon-badge">{card.icon}</div>
                <div className="ab-mc-accent-line" style={{ "--accent": card.color }} />
              </div>
              <h3 className="ab-mc-title">{card.title}</h3>
              <p className="ab-mc-desc">{card.desc}</p>
              <div className="ab-mc-tag">Core Value 0{i + 1}</div>
              <div className="ab-mc-glow" style={{ "--accent": card.color }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 5. Duality ─────────────────────────────────── */
function DualitySection({ traditional, modern }) {
  const [ref, inView] = useInView();
  return (
    <section className="ab-duality" ref={ref}>
      <div className="ab-container">
        <div className={`ab-duality-wrap${inView ? " visible" : ""}`}>
          <div className="ab-dual-panel ab-dual-traditional">
            <div className="ab-dual-icon">🌿</div>
            <h3 className="ab-dual-title">Traditional Purity</h3>
            <ul className="ab-dual-list">
              {traditional.map((item, i) => <li key={i}><span className="ab-dual-dot" />{item}</li>)}
            </ul>
          </div>
          <div className="ab-dual-divider">
            <div className="ab-dual-plus">+</div>
          </div>
          <div className="ab-dual-panel ab-dual-modern">
            <div className="ab-dual-icon">🔬</div>
            <h3 className="ab-dual-title">Modern Wellness</h3>
            <ul className="ab-dual-list">
              {modern.map((item, i) => <li key={i}><span className="ab-dual-dot ab-dual-dot--gold" />{item}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 6. CTA ─────────────────────────────────────── */
function AboutCTA() {
  const [ref, inView] = useInView();
  const navigate = useNavigate();
  return (
    <section className="ab-cta" ref={ref}>
      <div className="ab-cta-overlay" />
      <div className="ab-cta-grain" />
      {[...Array(8)].map((_, i) => (
        <div key={i} className="ab-particle" style={{ "--delay": `${i * 0.4}s`, "--x": `${10 + i * 11}%` }} />
      ))}
      <div className={`ab-cta-content${inView ? " visible" : ""}`}>
        <div className="ab-eyebrow ab-eyebrow--light">✦ Join the Arion Family</div>
        <h2 className="ab-cta-title">Experience the Arion Difference</h2>
        <p className="ab-cta-sub">Pure ingredients. Honest sourcing. Real wellness.</p>
        <button className="ab-cta-btn" onClick={() => navigate("/products")}>
          Explore Our Products
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────── */
export default function About() {
  const [data, setData] = useState(STATIC);

  useEffect(() => {
    getSettings().then((s) => {
      if (!s || !s.about_story_headline) return;
      setData({
        hero: {
          title:    s.about_hero_title    || STATIC.hero.title,
          subtitle: s.about_hero_subtitle || STATIC.hero.subtitle,
          quote:    s.about_hero_quote    || STATIC.hero.quote,
          image:    s.about_hero_image    || STATIC.hero.image,
        },
        story: {
          headline:   s.about_story_headline || STATIC.story.headline,
          paragraphs: parseJsonField(s.about_story_paragraphs, STATIC.story.paragraphs),
          keywords:   parseJsonField(s.about_story_keywords,   STATIC.story.keywords),
        },
        timeline:    parseJsonField(s.about_timeline, STATIC.timeline),
        mission:     parseJsonField(s.about_mission,  STATIC.mission),
        traditional: parseJsonField(s.about_traditional, STATIC.traditional),
        modern:      parseJsonField(s.about_modern,      STATIC.modern),
      });
    });
  }, []);

  return (
    <main className="ab-page">
      <HeroSection    hero={data.hero} />
      <StorySection   story={data.story} />
      <TimelineSection timeline={data.timeline} />
      <MissionSection  mission={data.mission} />
      <DualitySection  traditional={data.traditional} modern={data.modern} />
      <AboutCTA />
    </main>
  );
}
