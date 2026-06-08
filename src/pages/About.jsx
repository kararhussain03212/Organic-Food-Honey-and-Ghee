import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/About.css";

const BASE_URL = (import.meta.env.VITE_API_URL || "/backend").replace(/\/$/, "");

async function fetchAboutPage() {
  const res = await fetch(`${BASE_URL}/api/public/about/page`);
  if (!res.ok) throw new Error("fetch failed");
  const json = await res.json();
  return json?.data ?? json;
}

function toImageUrl(v) {
  if (!v) return "";
  if (v.startsWith("http")) return v;
  if (v.startsWith("/uploads/")) return BASE_URL + v;
  return v;
}

/* ─── Static fallbacks ──────────────────────────────── */
const STATIC = {
  hero: {
    badge_text: "OUR STORY",
    hero_title: "About Arion",
    hero_highlight_text: "Arion",
    hero_subtitle: "Pure, Natural, Authentic",
    hero_quote: "Bringing nature's finest directly to your table since generations.",
    hero_background_image: "/slide5.jpg",
  },
  story: {
    section_badge: "Our Story",
    title: "How It All Began",
    description_1: "Arion was founded by a family who watched the food they trusted slowly disappear from shelves, replaced by colourful packaging and invisible chemicals.",
    description_2: "We set out to change that. Not loudly, not with slogans, but quietly — the way good food has always worked. One pure product, one trusted source, one honest jar at a time.",
    description_3: "Today, every Arion product carries that same original conviction: that the best food is the least interfered with, and that the wisdom of our grandmothers was never something to improve upon — only to protect.",
    image_1: "/story_honey.png",
    image_2: "/ghee.jpeg",
    image_3: "/story_founder.png",
  },
  problems: [
    { id: 1, card_number: "01", icon: "🌾", title: "Loss of Natural Food Quality", description: "Industrial sourcing and mass production eroded the nutritional depth of everyday foods across generations." },
    { id: 2, card_number: "02", icon: "⚗️", title: "Rise of Artificial Products",  description: "Preservatives, additives, and synthetic flavours became the norm — prioritising shelf life over human life." },
    { id: 3, card_number: "03", icon: "💡", title: "Health Awareness Growing",       description: "A global shift in consciousness began. People started asking harder questions about what they were actually eating." },
    { id: 4, card_number: "04", icon: "🫙", title: "Return to Pure Traditions",      description: "Arion was born here — to honour what was lost and return it, with trust and full transparency, to your table." },
  ],
  mission: { badge: "✦ What We Stand For", title: "Our Core Mission", description: "Every decision we make is guided by four uncompromising principles that have shaped Arion since the very beginning." },
  core_values: [
    { id: 1, value_number: "01", icon: "🌿", title: "Purity First",         description: "We prioritise natural, unprocessed ingredients. Nothing enters our products that we would not give our own children.", color: "#496348" },
    { id: 2, value_number: "02", icon: "🧡", title: "Trust & Transparency", description: "What you see is what you get — no hidden compromises, no ambiguous labels, no grey areas.", color: "#C7A66B" },
    { id: 3, value_number: "03", icon: "🌾", title: "Traditional Wisdom",   description: "Inspired by generations of natural healing practices refined across centuries of lived experience.", color: "#5B5248" },
    { id: 4, value_number: "04", icon: "🏥", title: "Modern Wellness",      description: "Blending time-tested tradition with contemporary nutritional science for measurably better living.", color: "#496348" },
  ],
  comparison: {
    header: { section_title: "The Arion Difference", section_subtitle: "Where ancient wisdom meets modern science." },
    cards: [
      { id: 1, comparison_type: "traditional", icon: "🌿", title: "Traditional Purity", point_1: "Desi cooking methods passed down through generations", point_2: "Heritage practices without shortcuts", point_3: "Slow processes that preserve nutritional integrity" },
      { id: 2, comparison_type: "modern",       icon: "🔬", title: "Modern Wellness",    point_1: "Scientific nutrition profiling and lab testing", point_2: "Rigorous quality benchmarks at every stage", point_3: "Clean, hygienic production environments", point_4: "Traceable supply chains with full accountability" },
    ],
  },
  cta: { badge_text: "Join The Arion Family", title: "Experience The Arion Difference", subtitle: "Pure ingredients. Honest sourcing. Real wellness.", button_text: "Explore Our Products", button_link: "/products" },
};

/* ─── useInView ─────────────────────────────────────── */
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

/* ─── 1. Hero ────────────────────────────────────────── */
function HeroSection({ hero }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);

  const title   = hero.hero_title   || STATIC.hero.hero_title;
  const hlWord  = hero.hero_highlight_text || STATIC.hero.hero_highlight_text;
  const badge   = hero.badge_text   || STATIC.hero.badge_text;
  const sub     = hero.hero_subtitle || STATIC.hero.hero_subtitle;
  const quote   = hero.hero_quote   || STATIC.hero.hero_quote;
  const bgImg   = toImageUrl(hero.hero_background_image) || STATIC.hero.hero_background_image;

  const titleParts = useMemo(() => {
    if (!hlWord || !title.includes(hlWord)) return [{ text: title, highlight: false }];
    const idx = title.indexOf(hlWord);
    return [
      { text: title.slice(0, idx), highlight: false },
      { text: hlWord, highlight: true },
      { text: title.slice(idx + hlWord.length), highlight: false },
    ];
  }, [title, hlWord]);

  return (
    <section className="ab-hero">
      <img src={bgImg} alt="Hero background" className="ab-hero-img" />
      <div className="ab-hero-overlay" />
      <div className="ab-shape ab-shape-1" />
      <div className="ab-shape ab-shape-2" />
      <div className="ab-shape ab-shape-3" />
      <div className={`ab-hero-content${visible ? " visible" : ""}`}>
        <div className="ab-eyebrow">✦ {badge}</div>
        <h1 className="ab-hero-title">
          {titleParts.map((p, i) => p.highlight ? <span key={i} className="ab-gold">{p.text}</span> : p.text)}
        </h1>
        <p className="ab-hero-sub">{sub}</p>
        <blockquote className="ab-hero-quote">"{quote}"</blockquote>
      </div>
    </section>
  );
}

/* ─── 2. Story ───────────────────────────────────────── */
function StorySection({ story }) {
  const [ref, inView] = useInView();
  const paragraphs = [story.description_1, story.description_2, story.description_3].filter(Boolean);

  return (
    <section className="ab-story" ref={ref}>
      <div className="ab-container">
        <div className={`ab-story-grid${inView ? " visible" : ""}`}>
          <div className="ab-story-collage">
            <div className="ab-collage-main">
              <img src={toImageUrl(story.image_1) || "/story_honey.png"} alt="Our products" className="ab-collage-img" />
            </div>
            <div className="ab-collage-stack">
              <div className="ab-collage-sm"><img src={toImageUrl(story.image_2) || "/ghee.jpeg"} alt="Sourcing" className="ab-collage-img" /></div>
              <div className="ab-collage-sm"><img src={toImageUrl(story.image_3) || "/story_founder.png"} alt="Founder" className="ab-collage-img" /></div>
            </div>
          </div>
          <div className="ab-story-text">
            <div className="ab-section-label">{story.section_badge || "Our Story"}</div>
            <h2 className="ab-section-title">{story.title || STATIC.story.title}</h2>
            {paragraphs.map((p, i) => (
              <p key={i} className="ab-story-para" style={{ transitionDelay: `${i * 0.15}s` }}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 3. Problems (Why We Exist) ─────────────────────── */
function TimelineSection({ problems }) {
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
          {problems.map((item, i) => (
            <div key={item.id} className={`ab-timeline-card${inView ? " visible" : ""}`} style={{ transitionDelay: `${i * 0.12}s` }}>
              <div className="ab-tl-step">{item.card_number || `0${i + 1}`}</div>
              <div className="ab-tl-icon">{item.icon}</div>
              <h3 className="ab-tl-title">{item.title}</h3>
              <p className="ab-tl-desc">{item.description}</p>
              <div className="ab-tl-glow" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 4. Mission + Core Values ───────────────────────── */
function MissionSection({ mission, coreValues }) {
  const [ref, inView] = useInView();
  return (
    <section className="ab-mission" ref={ref}>
      <div className="ab-mission-strip">
        <div className="ab-container">
          <div className={`ab-mission-header${inView ? " visible" : ""}`}>
            <div className="ab-mission-header-text">
              <span className="ab-mission-kicker">{mission.badge || STATIC.mission.badge}</span>
              <h2 className="ab-mission-heading">{mission.title || STATIC.mission.title}</h2>
            </div>
            <p className="ab-mission-header-desc">{mission.description || STATIC.mission.description}</p>
          </div>
        </div>
      </div>
      <div className="ab-container">
        <div className="ab-mission-grid">
          {coreValues.map((card, i) => (
            <div key={card.id} className={`ab-mc${inView ? " visible" : ""}`} style={{ transitionDelay: `${i * 0.13}s` }}>
              <div className="ab-mc-num">{card.value_number || `0${i + 1}`}</div>
              <div className="ab-mc-top">
                <div className="ab-mc-icon-badge">{card.icon}</div>
                <div className="ab-mc-accent-line" style={{ "--accent": card.color || "#496348" }} />
              </div>
              <h3 className="ab-mc-title">{card.title}</h3>
              <p className="ab-mc-desc">{card.description}</p>
              <div className="ab-mc-tag">Core Value {card.value_number || `0${i + 1}`}</div>
              <div className="ab-mc-glow" style={{ "--accent": card.color || "#496348" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 5. Comparison (Duality) ────────────────────────── */
function DualitySection({ comparison }) {
  const [ref, inView] = useInView();
  const { header = {}, cards } = comparison;

  const sectionTitle    = header.section_title    || STATIC.comparison.header.section_title;
  const sectionSubtitle = header.section_subtitle || STATIC.comparison.header.section_subtitle;

  const traditional = cards.filter((c) => c.comparison_type === "traditional");
  const modern      = cards.filter((c) => c.comparison_type === "modern");

  const getPoints = (card) =>
    [card.point_1, card.point_2, card.point_3, card.point_4].filter(Boolean);

  const renderPanel = (card, isModern) => (
    <div className={`ab-dual-panel ${isModern ? "ab-dual-modern" : "ab-dual-traditional"}`}>
      <div className="ab-dual-icon">{card.icon || (isModern ? "🔬" : "🌿")}</div>
      <h3 className="ab-dual-title">{card.title}</h3>
      <ul className="ab-dual-list">
        {getPoints(card).map((pt, i) => (
          <li key={i}><span className={`ab-dual-dot${isModern ? " ab-dual-dot--gold" : ""}`} />{pt}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <section className="ab-duality" ref={ref}>
      <div className="ab-container">
        <div className={`ab-section-header${inView ? " visible" : ""}`}>
          <h2 className="ab-section-title">{sectionTitle}</h2>
          {sectionSubtitle ? <p className="ab-section-sub">{sectionSubtitle}</p> : null}
        </div>
        <div className={`ab-duality-wrap${inView ? " visible" : ""}`}>
          {traditional[0] ? renderPanel(traditional[0], false) : (
            <div className="ab-dual-panel ab-dual-traditional">
              <div className="ab-dual-icon">🌿</div>
              <h3 className="ab-dual-title">Traditional Purity</h3>
              <ul className="ab-dual-list">{STATIC.comparison.cards[0].point_1 && [STATIC.comparison.cards[0].point_1, STATIC.comparison.cards[0].point_2, STATIC.comparison.cards[0].point_3].map((pt, i) => <li key={i}><span className="ab-dual-dot" />{pt}</li>)}</ul>
            </div>
          )}
          <div className="ab-dual-divider"><div className="ab-dual-plus">+</div></div>
          {modern[0] ? renderPanel(modern[0], true) : (
            <div className="ab-dual-panel ab-dual-modern">
              <div className="ab-dual-icon">🔬</div>
              <h3 className="ab-dual-title">Modern Wellness</h3>
              <ul className="ab-dual-list">{STATIC.comparison.cards[1] && [STATIC.comparison.cards[1].point_1, STATIC.comparison.cards[1].point_2, STATIC.comparison.cards[1].point_3, STATIC.comparison.cards[1].point_4].filter(Boolean).map((pt, i) => <li key={i}><span className="ab-dual-dot ab-dual-dot--gold" />{pt}</li>)}</ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── 6. CTA ─────────────────────────────────────────── */
function AboutCTA({ cta }) {
  const [ref, inView] = useInView();
  const navigate = useNavigate();
  const badge   = cta.badge_text  || STATIC.cta.badge_text;
  const title   = cta.title       || STATIC.cta.title;
  const sub     = cta.subtitle    || STATIC.cta.subtitle;
  const btnText = cta.button_text || STATIC.cta.button_text;
  const btnLink = cta.button_link || STATIC.cta.button_link;
  const bgImg   = toImageUrl(cta.background_image);

  return (
    <section className="ab-cta" ref={ref} style={bgImg ? { backgroundImage: `url(${bgImg})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}>
      <div className="ab-cta-overlay" />
      <div className="ab-cta-grain" />
      {[...Array(8)].map((_, i) => (
        <div key={i} className="ab-particle" style={{ "--delay": `${i * 0.4}s`, "--x": `${10 + i * 11}%` }} />
      ))}
      <div className={`ab-cta-content${inView ? " visible" : ""}`}>
        <div className="ab-eyebrow ab-eyebrow--light">✦ {badge}</div>
        <h2 className="ab-cta-title">{title}</h2>
        <p className="ab-cta-sub">{sub}</p>
        <button className="ab-cta-btn" onClick={() => navigate(btnLink.startsWith("/") ? btnLink : "/" + btnLink)}>
          {btnText}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export default function About() {
  const [data, setData] = useState(STATIC);

  useEffect(() => {
    fetchAboutPage().then((d) => {
      if (!d || !d.hero) return;
      setData({
        hero:        d.hero        || STATIC.hero,
        story:       d.story       || STATIC.story,
        problems:    Array.isArray(d.problems)    && d.problems.length    ? d.problems    : STATIC.problems,
        mission:     d.mission     || STATIC.mission,
        core_values: Array.isArray(d.core_values) && d.core_values.length ? d.core_values : STATIC.core_values,
        comparison:  d.comparison  || STATIC.comparison,
        cta:         d.cta         || STATIC.cta,
      });
    }).catch(() => {/* keep STATIC */});
  }, []);

  return (
    <main className="ab-page">
      <HeroSection    hero={data.hero} />
      <StorySection   story={data.story} />
      <TimelineSection problems={data.problems} />
      <MissionSection  mission={data.mission} coreValues={data.core_values} />
      <DualitySection  comparison={data.comparison} />
      <AboutCTA        cta={data.cta} />
    </main>
  );
}
