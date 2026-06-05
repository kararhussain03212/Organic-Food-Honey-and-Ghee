import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogBySlug, getBlogs, parseJsonField } from "../api/apiClient";
import "../styles/BlogDetail.css";

/* ─── Decode HTML entities from API response ──── */
function decodeHtml(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = String(html || "");
  return txt.value;
}

/* ─── Reading progress bar ─────────────────────── */
function ProgressBar() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setPct(total ? Math.round((scrolled / total) * 100) : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <div className="bd-progress" style={{ width: `${pct}%` }} aria-hidden="true" />;
}

/* ─── Social Share ─────────────────────────────── */
function SocialShare({ title }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  const platforms = [
    { label: "Facebook", color: "#1877f2", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
    { label: "X / Twitter", color: "#000", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
    { label: "WhatsApp", color: "#25d366", href: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`, icon: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10a9.958 9.958 0 0 1-5.084-1.383L2 22l1.414-4.836A9.958 9.958 0 0 1 2 12 10 10 0 0 1 12 2zm0 2a8 8 0 1 0 0 16A8 8 0 0 0 12 4z"/></svg> },
  ];
  return (
    <div className="bd-share">
      <div className="bd-share-label">Share this article</div>
      <div className="bd-share-btns">
        {platforms.map((p) => (
          <a key={p.label} href={p.href} target="_blank" rel="noopener noreferrer" className="bd-share-btn" title={p.label} style={{ "--share-color": p.color }}>
            {p.icon}<span>{p.label}</span>
          </a>
        ))}
        <button className="bd-share-btn bd-share-copy" onClick={copyLink} title="Copy link">
          {copied
            ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>}
          <span>{copied ? "Copied!" : "Copy Link"}</span>
        </button>
      </div>
    </div>
  );
}

/* ─── Related articles slider ──────────────────── */
function RelatedArticles({ related, navigate }) {
  const sliderRef = useRef(null);
  const scroll = (dir) => { if (sliderRef.current) sliderRef.current.scrollBy({ left: dir * 320, behavior: "smooth" }); };
  if (!related.length) return null;
  return (
    <section className="bd-related">
      <div className="bd-related-inner">
        <div className="bd-related-header">
          <div>
            <div className="bd-section-label">Continue Reading</div>
            <h2 className="bd-section-title">Related Articles</h2>
          </div>
          <div className="bd-slider-controls">
            <button className="bd-slider-btn" onClick={() => scroll(-1)} aria-label="Previous">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button className="bd-slider-btn" onClick={() => scroll(1)} aria-label="Next">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
        <div className="bd-slider" ref={sliderRef}>
          {related.map((post) => (
            <article key={post.id} className="bd-related-card" onClick={() => navigate(`/blog/${post.slug}`)}>
              <div className="bd-related-img-wrap">
                <img src={post.image} alt={post.title} className="bd-related-img" loading="lazy" />
              </div>
              <div className="bd-related-body">
                <h3 className="bd-related-title">{post.title}</h3>
                <p className="bd-related-excerpt">{post.excerpt}</p>
                <button className="bd-related-btn">
                  Read Article
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Sidebar ──────────────────────────────────── */
function Sidebar({ tags, recentPosts, navigate, allPosts }) {
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const categories = [...new Set(allPosts.map((p) => p.category).filter(Boolean))];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribing(true);
    setTimeout(() => {
      setEmail("");
      setSubscribing(false);
      alert("Thanks for subscribing!");
    }, 600);
  };

  return (
    <aside className="bd-sidebar">
      <div className="bd-side-widget">
        <h4 className="bd-side-title">Search Articles</h4>
        <div className="bd-side-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search topics…" className="bd-side-search-input" />
        </div>
      </div>

      {categories.length > 0 && (
        <div className="bd-side-widget">
          <h4 className="bd-side-title">Categories</h4>
          <div className="bd-side-categories">
            {categories.map((cat) => {
              const count = allPosts.filter((p) => p.category === cat).length;
              return (
                <div key={cat} className="bd-side-category" onClick={() => navigate("/blog")}>
                  <span>{cat}</span>
                  <span className="bd-side-category-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {recentPosts.length > 0 && (
        <div className="bd-side-widget">
          <h4 className="bd-side-title">Recent Posts</h4>
          <div className="bd-side-posts">
            {recentPosts.slice(0, 5).map((p) => (
              <div key={p.id} className="bd-side-post" onClick={() => navigate(`/blog/${p.slug}`)}>
                {p.image && <img src={p.image} alt={p.title} className="bd-side-post-img" />}
                <div className="bd-side-post-body">
                  <p className="bd-side-post-title">{p.title}</p>
                  <span className="bd-side-post-meta">{p.date || (p.published_at ? new Date(p.published_at).toLocaleDateString() : "")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div className="bd-side-widget">
          <h4 className="bd-side-title">Popular Tags</h4>
          <div className="bd-side-tags">
            {tags.map((tag) => (
              <button key={tag} className="bd-side-tag" onClick={() => navigate("/blog")}>#{tag}</button>
            ))}
          </div>
        </div>
      )}

      <div className="bd-side-widget">
        <h4 className="bd-side-title">Newsletter</h4>
        <p className="bd-side-newsletter-text">Get weekly wellness insights delivered to your inbox.</p>
        <form onSubmit={handleSubscribe} className="bd-side-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="bd-side-input"
          />
          <button type="submit" disabled={subscribing} className="bd-side-btn">
            {subscribing ? "Subscribing…" : "Subscribe"}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </form>
      </div>
    </aside>
  );
}

/* ─── Main Page ────────────────────────────────── */
export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setVisible(false);
    window.scrollTo({ top: 0, behavior: "smooth" });

    Promise.all([getBlogBySlug(slug), getBlogs()]).then(([found, blogs]) => {
      if (!found) { setNotFound(true); }
      else { setPost(found); }
      setAllPosts(Array.isArray(blogs) ? blogs : []);
      setLoading(false);
      setTimeout(() => setVisible(true), 50);
    });
  }, [slug]);

  if (loading) {
    return (
      <main className="bd-page">
        <ProgressBar />
        <div style={{ padding: "6rem 2rem", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>Loading article…</div>
      </main>
    );
  }

  if (notFound || !post) {
    return (
      <main className="bd-page">
        <ProgressBar />
        <div style={{ padding: "6rem 2rem", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
          <h2>Article not found.</h2>
          <button className="bd-back-btn" style={{ marginTop: "1rem" }} onClick={() => navigate("/blog")}>← Back to Journal</button>
        </div>
      </main>
    );
  }

  const postTags = parseJsonField(post.tags, []);
  const related = allPosts.filter((b) => b.slug !== post.slug && b.category === post.category).slice(0, 6);
  const allTags = [...new Set(allPosts.flatMap((b) => parseJsonField(b.tags, [])))];
  const recentPosts = allPosts.filter((b) => b.slug !== post.slug).slice(0, 5);
  const publishDate = post.date || (post.published_at ? new Date(post.published_at).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" }) : "");

  return (
    <main className="bd-page">
      <ProgressBar />

      {/* ── Hero banner ──────────────────────────── */}
      <header className={`bd-hero${visible ? " visible" : ""}`}>
        <img src={post.image} alt={post.title} className="bd-hero-img" />
        <div className="bd-hero-overlay" />
        <div className="bd-hero-content">
          <div className="bd-hero-inner">
            <button className="bd-back-btn" onClick={() => navigate("/blog")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              Back to Journal
            </button>
            <h1 className="bd-hero-title">{post.title}</h1>
            <p className="bd-hero-excerpt">{post.excerpt}</p>
            <div className="bd-hero-meta">
              <div className="bd-hero-author">
                <span className="bd-avatar">{(post.author || "A").charAt(0)}</span>
                <div>
                  <div className="bd-author-name">{post.author}</div>
                  {post.authorRole && <div className="bd-author-role">{post.authorRole}</div>}
                </div>
              </div>
              {publishDate && (
                <div className="bd-hero-info">
                  <span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {publishDate}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Article + Sidebar ────────────────────── */}
      <div className="bd-body-wrap">
        <div className="bd-body-inner">
          <article className="bd-article">
            <div
              className="bd-article-content"
              dangerouslySetInnerHTML={{ __html: decodeHtml(post.content) }}
            />

            {postTags.length > 0 && (
              <div className="bd-article-tags">
                <span className="bd-tags-label">Tags:</span>
                {postTags.map((tag) => (
                  <button key={tag} className="bd-tag" onClick={() => navigate("/blog")}>{tag}</button>
                ))}
              </div>
            )}

            <SocialShare title={post.title} />
          </article>

          <Sidebar tags={allTags} recentPosts={recentPosts} navigate={navigate} allPosts={allPosts} />
        </div>
      </div>

      <RelatedArticles related={related} navigate={navigate} />
    </main>
  );
}
