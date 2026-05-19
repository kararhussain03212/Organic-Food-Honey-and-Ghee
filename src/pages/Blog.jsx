import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  blogs,
  categories,
  recentPosts,
  popularPosts,
  allTags,
  POSTS_PER_PAGE,
} from "../data/blogData";
import "../styles/Blog.css";

/* ─── tiny helpers ─────────────────────────────── */
function CategoryBadge({ categoryId }) {
  const cat = categories.find((c) => c.id === categoryId);
  return cat ? (
    <span className="bl-badge" data-cat={categoryId}>
      {cat.icon} {cat.label}
    </span>
  ) : null;
}

/* ─── Blog Card ───────────────────────────────── */
function BlogCard({ post, featured }) {
  const navigate = useNavigate();
  return (
    <article className={`bl-card${featured ? " bl-card--featured" : ""}`}>
      <div className="bl-card-img-wrap">
        <img src={post.image} alt={post.title} className="bl-card-img" loading="lazy" />
        {featured && <span className="bl-featured-badge">⭐ Featured</span>}
        <div className="bl-card-img-overlay" />
      </div>
      <div className="bl-card-body">
        <CategoryBadge categoryId={post.category} />
        <h3 className="bl-card-title">{post.title}</h3>
        <p className="bl-card-excerpt">{post.excerpt}</p>
        <div className="bl-card-meta">
          <div className="bl-card-author">
            <span className="bl-author-avatar">
              {post.author.charAt(0)}
            </span>
            <div>
              <span className="bl-author-name">{post.author}</span>
              <span className="bl-author-role">{post.authorRole}</span>
            </div>
          </div>
          <div className="bl-card-info">
            <span className="bl-card-date">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {post.date}
            </span>
            <span className="bl-card-time">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {post.readTime}
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
  return (
    <div className="bl-side-post">
      <img src={post.image} alt={post.title} className="bl-side-post-img" loading="lazy" />
      <div className="bl-side-post-body">
        <span className="bl-side-post-cat">{categories.find(c => c.id === post.category)?.icon} {categories.find(c => c.id === post.category)?.label}</span>
        <p className="bl-side-post-title">{post.title}</p>
        <span className="bl-side-post-meta">{post.date} · {post.readTime}</span>
      </div>
    </div>
  );
}

/* ─── Sidebar ──────────────────────────────────── */
function Sidebar({ activeCategory, setActiveCategory, searchQuery, setSearchQuery }) {
  const [openSection, setOpenSection] = useState(null);
  const toggleSection = (key) => setOpenSection((p) => (p === key ? null : key));
  const [email, setEmail] = useState("");

  const sections = [
    { key: "recent", label: "Recent Posts" },
    { key: "popular", label: "Popular Posts" },
    { key: "categories", label: "Categories" },
    { key: "tags", label: "Tags" },
    { key: "newsletter", label: "Newsletter" },
  ];

  return (
    <aside className="bl-sidebar">
      {/* Search widget */}
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

      {/* Accordion sections — always open on desktop, collapsible on mobile */}
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
                {recentPosts.map((p) => <SidePostRow key={p.id} post={p} />)}
              </div>
            )}
            {sec.key === "popular" && (
              <div className="bl-side-posts-list">
                {popularPosts.map((p) => <SidePostRow key={p.id} post={p} />)}
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
                      <span>{cat.icon} {cat.label}</span>
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
            {sec.key === "newsletter" && (
              <div className="bl-newsletter">
                <p className="bl-newsletter-desc">Get weekly wellness tips and organic living guides delivered to your inbox.</p>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bl-newsletter-input"
                />
                <button className="bl-newsletter-btn">Subscribe →</button>
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
      <button
        className="bl-page-btn"
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
      >
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
      <button
        className="bl-page-btn"
        disabled={currentPage === totalPages}
        onClick={() => onChange(currentPage + 1)}
      >
        Next →
      </button>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────── */
export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => { setVisible(true); }, []);

  // Reset to page 1 on filter change
  useEffect(() => { setCurrentPage(1); }, [activeCategory, searchQuery]);

  const filtered = useMemo(() => {
    return blogs.filter((b) => {
      const matchCat = activeCategory === "all" || b.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q)) ||
        b.author.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const featuredPost = blogs.find((b) => b.featured);

  return (
    <main className="bl-page">
      {/* Background decorations */}
      <div className="bl-bg-blob bl-bg-blob-1" />
      <div className="bl-bg-blob bl-bg-blob-2" />

      {/* ── Hero ───────────────────────────────── */}
      <section className={`bl-hero${visible ? " visible" : ""}`} ref={heroRef}>
        <div className="bl-hero-inner">
          <div className="bl-hero-text">
            <div className="bl-eyebrow">
              <span>✦</span> Wellness Journal
            </div>
            <h1 className="bl-hero-title">
              Nourish Your <span className="bl-hero-accent">Mind & Body</span>
            </h1>
            <p className="bl-hero-subtitle">
              Explore healthy living, natural nutrition, traditional wellness,
              and organic lifestyle knowledge — curated by our expert team.
            </p>
          </div>

          {/* Hero search */}
          <div className="bl-hero-search-wrap">
            <div className="bl-hero-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                placeholder="Search articles, topics, ingredients…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bl-hero-search-input"
              />
              {searchQuery && (
                <button className="bl-search-clear" onClick={() => setSearchQuery("")}>✕</button>
              )}
            </div>
          </div>

          {/* Category pills */}
          <div className="bl-hero-pills">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`bl-pill${activeCategory === cat.id ? " active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span>{cat.icon}</span>
                {cat.label}
                <span className="bl-pill-count">{cat.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Article ───────────────────── */}
      {featuredPost && activeCategory === "all" && !searchQuery && (
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
                <CategoryBadge categoryId={featuredPost.category} />
                <h2 className="bl-featured-title">{featuredPost.title}</h2>
                <p className="bl-featured-excerpt">{featuredPost.excerpt}</p>
                <div className="bl-featured-meta">
                  <span className="bl-author-avatar">{featuredPost.author.charAt(0)}</span>
                  <div>
                    <div className="bl-author-name">{featuredPost.author}</div>
                    <div className="bl-author-role">{featuredPost.authorRole} · {featuredPost.date} · {featuredPost.readTime}</div>
                  </div>
                </div>
                <button className="bl-featured-btn" onClick={() => navigate(`/blog/${featuredPost.slug}`) }>
                  Read Full Article
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* ── Category Cards ─────────────────────── */}
      {/* {activeCategory === "all" && !searchQuery && (
        <section className="bl-cats-section">
          <div className="bl-cats-inner">
            <div className="bl-section-label">Browse by Topic</div>
            <h2 className="bl-section-title">Explore Our Wellness Categories</h2>
            <div className="bl-cats-grid">
              {categories.filter(c => c.id !== "all").map((cat, i) => (
                <button
                  key={cat.id}
                  className="bl-cat-card"
                  onClick={() => setActiveCategory(cat.id)}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="bl-cat-card-icon">{cat.icon}</div>
                  <div className="bl-cat-card-content">
                    <h3 className="bl-cat-card-title">{cat.label}</h3>
                    <p className="bl-cat-card-desc">{cat.desc}</p>
                  </div>
                  <span className="bl-cat-card-count">{cat.count} articles</span>
                  <div className="bl-cat-card-arrow">→</div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )} */}

      {/* ── Blog Listing + Sidebar ─────────────── */}
      <section className="bl-listing-section">
        <div className="bl-listing-inner">
          {/* Left: articles */}
          <div className="bl-listing-main">
            <div className="bl-listing-header">
              <h2 className="bl-listing-heading">
                {activeCategory === "all"
                  ? "All Articles"
                  : categories.find((c) => c.id === activeCategory)?.label}
                <span className="bl-listing-count"> ({filtered.length})</span>
              </h2>
              {(searchQuery || activeCategory !== "all") && (
                <button
                  className="bl-clear-filters"
                  onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
                >
                  ✕ Clear filters
                </button>
              )}
            </div>

            {paginated.length === 0 ? (
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
                  <BlogCard key={post.id} post={post} featured={post.featured && currentPage === 1} />
                ))}
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChange={setCurrentPage}
            />
          </div>

          {/* Right: sidebar */}
          <Sidebar
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
