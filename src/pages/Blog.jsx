import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getBlogs, getBlogSettings, getSettings, parseJsonField, isSectionActive } from "../api/apiClient";
import { SEOHelmet } from "../seo/SEOHelmet";
import { getSEOData } from "../seo/seoData";
import "../styles/Blog.css";


const POSTS_PER_PAGE = 6;

/* ─── Calculate read time (200 words per minute) ── */
function calculateReadTime(htmlContent) {
  const plainText = String(htmlContent || "").replace(/<[^>]*>/g, "").trim();
  const words = plainText.split(/\s+/).filter(w => w.length > 0).length;
  const minutes = Math.ceil(words / 200);
  return Math.max(1, minutes);
}

/* ─── tiny helpers ─────────────────────────────── */
function BlogCard({ post, featured }) {
  const navigate = useNavigate();
  const readTime = post.read_time || calculateReadTime(post.content);
  return (
    <article className={`bl-card${featured ? " bl-card--featured" : ""}`}>
      <div className="bl-card-img-wrap">
        <img src={post.image} alt={post.title} className="bl-card-img" loading="lazy" />
        {featured && <span className="bl-featured-badge">⭐ Featured</span>}
        <div className="bl-card-img-overlay" />
      </div>
      <div className="bl-card-body">
        <h3 className="bl-card-title">{post.title}</h3>
        <p className="bl-card-excerpt">{post.excerpt}</p>
        <div className="bl-card-meta">
          <div className="bl-card-author">
            <span className="bl-author-avatar">{(post.author || "A").charAt(0)}</span>
            <div>
              <span className="bl-author-name">{post.author}</span>
              <span className="bl-author-role">{post.authorRole}</span>
            </div>
          </div>
          <div className="bl-card-info">
            {post.published_at || post.date ? (
              <span className="bl-card-date">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {post.date || new Date(post.published_at).toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" })}
              </span>
            ) : null}
            <span className="bl-card-time">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {readTime} min read
            </span>
          </div>
        </div>
        <button className="bl-read-more" onClick={() => navigate(`/blog/${post.slug}`)}>
          Read Article
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>
    </article>
  );
}

/* ─── Sidebar Post Row ─────────────────────────── */
function SidePostRow({ post }) {
  const readTime = post.read_time || calculateReadTime(post.content);
  const postDate = post.date || (post.published_at ? new Date(post.published_at).toLocaleDateString() : "");
  return (
    <div className="bl-side-post">
      <img src={post.image} alt={post.title} className="bl-side-post-img" loading="lazy" />
      <div className="bl-side-post-body">
        <p className="bl-side-post-title">{post.title}</p>
        <span className="bl-side-post-meta">
          {postDate} • {readTime} min
        </span>
      </div>
    </div>
  );
}

/* ─── Sidebar ──────────────────────────────────── */
function Sidebar({ categories, allTags, recentPosts, activeCategory, setActiveCategory, searchQuery, setSearchQuery }) {
  const [openSection, setOpenSection] = useState(null);
  const toggleSection = (key) => setOpenSection((p) => (p === key ? null : key));

  const sections = [
    { key: "recent", label: "Recent Posts" },
    { key: "categories", label: "Categories" },
    { key: "tags", label: "Tags" },
  ];

  return (
    <aside className="bl-sidebar">
      <div className="bl-side-widget">
        <h4 className="bl-side-widget-title">Search Articles</h4>
        <div className="bl-side-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            placeholder="Search wellness topics…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bl-side-search-input"
          />
        </div>
      </div>

      {sections.map((sec) => (
        <div className="bl-side-widget bl-side-accordion" key={sec.key}>
          <button
            className="bl-side-accordion-toggle"
            onClick={() => toggleSection(sec.key)}
            aria-expanded={openSection === sec.key}
          >
            <h4 className="bl-side-widget-title">{sec.label}</h4>
            <svg
              className={`bl-side-chevron${openSection === sec.key ? " open" : ""}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          <div className={`bl-side-accordion-body${openSection === sec.key ? " open" : ""}`}>
            {sec.key === "recent" && (
              <div className="bl-side-posts-list">
                {recentPosts.slice(0, 5).map((p) => <SidePostRow key={p.id} post={p} />)}
              </div>
            )}
            {sec.key === "categories" && (
              <ul className="bl-side-cats">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      className={`bl-side-cat-btn${activeCategory === cat.id ? " active" : ""}`}
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      <span>{cat.label}</span>
                      <span className="bl-side-cat-count">{cat.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {sec.key === "tags" && (
              <div className="bl-side-tags">
                {allTags.map((tag) => (
                  <button key={tag} className="bl-side-tag" onClick={() => setSearchQuery(tag)}>
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </aside>
  );
}

/* ─── Pagination ───────────────────────────────── */
function Pagination({ currentPage, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="bl-pagination">
      <button className="bl-page-btn" disabled={currentPage === 1} onClick={() => onChange(currentPage - 1)}>
        ← Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          className={`bl-page-btn${p === currentPage ? " active" : ""}`}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      <button className="bl-page-btn" disabled={currentPage === totalPages} onClick={() => onChange(currentPage + 1)}>
        Next →
      </button>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────── */
export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [hero, setHero] = useState(null);
  const heroRef = useRef(null);

  const [pageActive, setPageActive] = useState(true);

  useEffect(() => { setVisible(true); }, []);

  useEffect(() => {
    getSettings().then((s) => setPageActive(isSectionActive(s, "blog"))).catch(() => {});
  }, []);

  useEffect(() => {
    getBlogSettings().then((s) => {
      if (s && (s.blog_hero_title || s.blog_badge_text)) {
        setHero({
          badgeText:         s.blog_badge_text,
          title:             s.blog_hero_title,
          titleAccent:       s.blog_hero_title_accent,
          description:       s.blog_hero_description,
          searchPlaceholder: s.blog_search_placeholder,
        });
      }
    });
  }, []);

  useEffect(() => {
    getBlogs().then((data) => {
      setBlogs(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  useEffect(() => { setCurrentPage(1); }, [activeCategory, searchQuery]);

  const categories = useMemo(() => {
    const cats = [{ id: "all", label: "All Articles", count: blogs.length }];
    const map = {};
    blogs.forEach((b) => {
      if (b.category) {
        map[b.category] = (map[b.category] || 0) + 1;
      }
    });
    Object.entries(map).forEach(([id, count]) => {
      cats.push({ id, label: id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), count });
    });
    return cats;
  }, [blogs]);

  const allTags = useMemo(() => {
    const set = new Set();
    blogs.forEach((b) => {
      parseJsonField(b.tags, []).forEach((t) => set.add(t));
    });
    return [...set];
  }, [blogs]);

  const recentPosts = useMemo(() => blogs.slice(0, 5), [blogs]);

  const filtered = useMemo(() => {
    return blogs.filter((b) => {
      const matchCat = activeCategory === "all" || b.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const tags = parseJsonField(b.tags, []);
      const matchSearch =
        !q ||
        (b.title || "").toLowerCase().includes(q) ||
        (b.excerpt || "").toLowerCase().includes(q) ||
        tags.some((t) => String(t).toLowerCase().includes(q)) ||
        (b.author || "").toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [blogs, activeCategory, searchQuery]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);
  const featuredPost = blogs.find((b) => b.featured || b.is_published);

  if (!pageActive) return null;

  const seo = getSEOData("blog");
  return (
    <main className="bl-page">
      <SEOHelmet
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
      />
      <div className="bl-bg-blob bl-bg-blob-1" />
      <div className="bl-bg-blob bl-bg-blob-2" />

      {/* ── Hero ───────────────────────────────── */}
      {hero && (
        <section className={`bl-hero${visible ? " visible" : ""}`} ref={heroRef}>
          <div className="bl-hero-inner">
            <div className="bl-hero-text">
              {hero.badgeText && <div className="bl-eyebrow"><span>✦</span> {hero.badgeText}</div>}
              {hero.title && (
                <h1 className="bl-hero-title">
                  {hero.title} {hero.titleAccent && <span className="bl-hero-accent">{hero.titleAccent}</span>}
                </h1>
              )}
              {hero.description && <p className="bl-hero-subtitle">{hero.description}</p>}
            </div>

            <div className="bl-hero-search-wrap">
              <div className="bl-hero-search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text"
                  placeholder={hero.searchPlaceholder || ""}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bl-hero-search-input"
                />
                {searchQuery && (
                  <button className="bl-search-clear" onClick={() => setSearchQuery("")}>✕</button>
                )}
              </div>
            </div>

            <div className="bl-hero-pills">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`bl-pill${activeCategory === cat.id ? " active" : ""}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label}
                  <span className="bl-pill-count">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Article ───────────────────── */}
      {!loading && featuredPost && activeCategory === "all" && !searchQuery && (
        <section className="bl-featured-section">
          <div className="bl-featured-inner">
            <div className="bl-section-label">⭐ Featured Article</div>
            <article className="bl-featured-card">
              <div className="bl-featured-img-wrap">
                <img src={featuredPost.image} alt={featuredPost.title} className="bl-featured-img" />
                <div className="bl-featured-img-overlay" />
                <span className="bl-featured-badge-lg">Featured</span>
              </div>
              <div className="bl-featured-body">
                <h2 className="bl-featured-title">{featuredPost.title}</h2>
                <p className="bl-featured-excerpt">{featuredPost.excerpt}</p>
                <div className="bl-featured-meta">
                  <span className="bl-author-avatar">{(featuredPost.author || "A").charAt(0)}</span>
                  <div>
                    <div className="bl-author-name">{featuredPost.author}</div>
                  </div>
                </div>
                <button className="bl-featured-btn" onClick={() => { const nav = document.querySelector(".bl-read-more"); if (nav) nav.click(); window.location.href = `/blog/${featuredPost.slug}`; }}>
                  Read Full Article
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* ── Blog Listing + Sidebar ─────────────── */}
      <section className="bl-listing-section">
        <div className="bl-listing-inner">
          <div className="bl-listing-main">
            <div className="bl-listing-header">
              <h2 className="bl-listing-heading">
                {activeCategory === "all" ? "All Articles" : categories.find((c) => c.id === activeCategory)?.label}
                {!loading && <span className="bl-listing-count"> ({filtered.length})</span>}
              </h2>
              {(searchQuery || activeCategory !== "all") && (
                <button className="bl-clear-filters" onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}>
                  ✕ Clear filters
                </button>
              )}
            </div>

            {loading ? (
              <div className="bl-grid">
                {Array.from({ length: 3 }, (_, i) => (
                  <article key={i} className="bl-card" style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
                    <div className="bl-card-img-wrap" style={{ background: "rgba(255,255,255,0.07)", minHeight: 200 }} />
                    <div className="bl-card-body">
                      <div style={{ height: 18, background: "rgba(255,255,255,0.07)", borderRadius: 6, marginBottom: 10 }} />
                      <div style={{ height: 12, width: "80%", background: "rgba(255,255,255,0.05)", borderRadius: 6 }} />
                    </div>
                  </article>
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <div className="bl-empty">
                <div className="bl-empty-icon">🔍</div>
                <h3>No articles found</h3>
                <p>Try a different search term or category.</p>
                <button className="bl-clear-filters" onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}>
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="bl-grid">
                {paginated.map((post) => (
                  <BlogCard key={post.id} post={post} featured={Boolean(post.featured) && currentPage === 1} />
                ))}
              </div>
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
          </div>

          <Sidebar
            categories={categories}
            allTags={allTags}
            recentPosts={recentPosts}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </section>
    </main>
  );
}
