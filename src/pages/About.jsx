import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSettings, isSectionActive } from "../api/apiClient";
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

  const title  = hero.hero_title;
  const hlWord = hero.hero_highlight_text;
  const bgImg  = toImageUrl(hero.hero_background_image);

  const titleParts = useMemo(() => {
    if (!hlWord || !title || !title.includes(hlWord)) return [{ text: title || "", highlight: false }];
    const idx = title.indexOf(hlWord);
    return [
      { text: title.slice(0, idx), highlight: false },
      { text: hlWord, highlight: true },
      { text: title.slice(idx + hlWord.length), highlight: false },
    ];
  }, [title, hlWord]);

  return (
    <section className="ab-hero">
      {bgImg && <img src={bgImg} alt="Hero background" className="ab-hero-img" />}
      <div className="ab-hero-overlay" />
      <div className="ab-shape ab-shape-1" />
      <div className="ab-shape ab-shape-2" />
      <div className="ab-shape ab-shape-3" />
      <div className={`ab-hero-content${visible ? " visible" : ""}`}>
        {hero.badge_text && <div className="ab-eyebrow">✦ {hero.badge_text}</div>}
        {title && (
          <h1 className="ab-hero-title">
            {titleParts.map((p, i) => p.highlight ? <span key={i} className="ab-gold">{p.text}</span> : p.text)}
          </h1>
        )}
        {hero.hero_subtitle && <p className="ab-hero-sub">{hero.hero_subtitle}</p>}
        {hero.hero_quote && <blockquote className="ab-hero-quote">"{hero.hero_quote}"</blockquote>}
      </div>
    </section>
  );
}

/* ─── 2. Story ───────────────────────────────────────── */
function StorySection({ story }) {
  const [ref, inView] = useInView();
  const paragraphs = [story.description_1, story.description_2, story.description_3].filter(Boolean);
  const img1 = toImageUrl(story.image_1);
  const img2 = toImageUrl(story.image_2);
  const img3 = toImageUrl(story.image_3);

  return (
    <section className="ab-story" ref={ref}>
      <div className="ab-container">
        <div className={`ab-story-grid${inView ? " visible" : ""}`}>
          <div className="ab-story-collage">
            <div className="ab-collage-main">
              {img1 && <img src={img1} alt="Our products" className="ab-collage-img" />}
            </div>
            <div className="ab-collage-stack">
              <div className="ab-collage-sm">{img2 && <img src={img2} alt="Sourcing" className="ab-collage-img" />}</div>
              <div className="ab-collage-sm">{img3 && <img src={img3} alt="Founder" className="ab-collage-img" />}</div>
            </div>
          </div>
          <div className="ab-story-text">
            {story.section_badge && <div className="ab-section-label">{story.section_badge}</div>}
            {story.title && <h2 className="ab-section-title">{story.title}</h2>}
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
function TimelineSection({ problems, header }) {
  const [ref, inView] = useInView();
  return (
    <section className="ab-timeline-section" ref={ref}>
      <div className="ab-container">
        <div className={`ab-section-header${inView ? " visible" : ""}`}>
          {header?.section_label && <div className="ab-section-label">{header.section_label}</div>}
          {header?.section_title && <h2 className="ab-section-title">{header.section_title}</h2>}
          {header?.section_subtitle && <p className="ab-section-sub">{header.section_subtitle}</p>}
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
              {mission.badge && <span className="ab-mission-kicker">{mission.badge}</span>}
              {mission.title && <h2 className="ab-mission-heading">{mission.title}</h2>}
            </div>
            {mission.description && <p className="ab-mission-header-desc">{mission.description}</p>}
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
  const { header = {}, cards = [] } = comparison;

  const traditional = cards.filter((c) => c.comparison_type === "traditional");
  const modern      = cards.filter((c) => c.comparison_type === "modern");

  const getPoints = (card) =>
    [card.point_1, card.point_2, card.point_3, card.point_4].filter(Boolean);

  const renderPanel = (card, isModern) => (
    <div className={`ab-dual-panel ${isModern ? "ab-dual-modern" : "ab-dual-traditional"}`}>
      {card.icon && <div className="ab-dual-icon">{card.icon}</div>}
      {card.title && <h3 className="ab-dual-title">{card.title}</h3>}
      <ul className="ab-dual-list">
        {getPoints(card).map((pt, i) => (
          <li key={i}><span className={`ab-dual-dot${isModern ? " ab-dual-dot--gold" : ""}`} />{pt}</li>
        ))}
      </ul>
    </div>
  );

  if (!traditional.length && !modern.length) return null;

  return (
    <section className="ab-duality" ref={ref}>
      <div className="ab-container">
        <div className={`ab-section-header${inView ? " visible" : ""}`}>
          {header.section_title && <h2 className="ab-section-title">{header.section_title}</h2>}
          {header.section_subtitle && <p className="ab-section-sub">{header.section_subtitle}</p>}
        </div>
        <div className={`ab-duality-wrap${inView ? " visible" : ""}`}>
          {traditional[0] && renderPanel(traditional[0], false)}
          {traditional[0] && modern[0] && <div className="ab-dual-divider"><div className="ab-dual-plus">+</div></div>}
          {modern[0] && renderPanel(modern[0], true)}
        </div>
      </div>
    </section>
  );
}

/* ─── 6. CTA ─────────────────────────────────────────── */
function AboutCTA({ cta }) {
  const [ref, inView] = useInView();
  const navigate = useNavigate();
  const bgImg = toImageUrl(cta.background_image);
  const btnLink = cta.button_link || "/products";

  return (
    <section className="ab-cta" ref={ref} style={bgImg ? { backgroundImage: `url(${bgImg})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}>
      <div className="ab-cta-overlay" />
      <div className="ab-cta-grain" />
      {[...Array(8)].map((_, i) => (
        <div key={i} className="ab-particle" style={{ "--delay": `${i * 0.4}s`, "--x": `${10 + i * 11}%` }} />
      ))}
      <div className={`ab-cta-content${inView ? " visible" : ""}`}>
        {cta.badge_text && <div className="ab-eyebrow ab-eyebrow--light">✦ {cta.badge_text}</div>}
        {cta.title && <h2 className="ab-cta-title">{cta.title}</h2>}
        {cta.subtitle && <p className="ab-cta-sub">{cta.subtitle}</p>}
        {cta.button_text && (
          <button className="ab-cta-btn" onClick={() => navigate(btnLink.startsWith("/") ? btnLink : "/" + btnLink)}>
            {cta.button_text}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export default function About() {
  const [data, setData] = useState(null);
  const [pageActive, setPageActive] = useState(true);

  useEffect(() => {
    getSettings().then((s) => setPageActive(isSectionActive(s, "about"))).catch(() => {});
    fetchAboutPage().then((d) => {
      if (!d || !d.hero) return;
      setData({
        hero:        d.hero,
        story:       d.story,
        problems:    Array.isArray(d.problems) ? d.problems : [],
        problemsHeader: d.problems_header || {},
        mission:     d.mission || {},
        core_values: Array.isArray(d.core_values) ? d.core_values : [],
        comparison:  d.comparison || { header: {}, cards: [] },
        cta:         d.cta || {},
      });
    }).catch(() => {});
  }, []);

  if (!pageActive || !data) return null;

  return (
    <main className="ab-page">
      {data.hero && <HeroSection hero={data.hero} />}
      {data.story && <StorySection story={data.story} />}
      {data.problems && data.problems.length > 0 && (
        <TimelineSection problems={data.problems} header={data.problemsHeader} />
      )}
      {data.mission && data.core_values && data.core_values.length > 0 && (
        <MissionSection mission={data.mission} coreValues={data.core_values} />
      )}
      {data.comparison && <DualitySection comparison={data.comparison} />}
      {data.cta && <AboutCTA cta={data.cta} />}
    </main>
  );
}
