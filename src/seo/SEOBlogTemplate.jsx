import { Helmet } from "react-helmet-async";
import { SEOHelmet, SchemaScript } from "./SEOHelmet";
import { generateBlogSchema, generateBreadcrumbSchema } from "./seoData";
import { getReadingTime, generateBreadcrumbs } from "./seoUtils";

/**
 * Reusable SEO Blog Detail Template
 * Usage: Wrap your blog content with this component
 * Provides: SEO metadata, structured data, breadcrumbs, reading time
 */
export const SEOBlogTemplate = ({
  article = {},
  siteUrl = "https://organicfood.swiftsigngeneraltrading.com",
  children,
}) => {
  const {
    title,
    slug,
    description,
    content,
    author = "Arion Organic Food",
    date,
    lastModified,
    image,
    keywords,
    category,
  } = article;

  const readingTime = content ? getReadingTime(content) : 5;
  const breadcrumbs = generateBreadcrumbs(`/blog/${slug}`);
  const pageUrl = `${siteUrl}/blog/${slug}`;

  return (
    <>
      <SEOHelmet
        title={title}
        description={description}
        keywords={keywords}
        image={image}
        url={`/blog/${slug}`}
        type="article"
      >
        {/* Additional Article-specific tags */}
        <meta property="article:published_time" content={date} />
        {lastModified && <meta property="article:modified_time" content={lastModified} />}
        <meta property="article:author" content={author} />
        {category && <meta property="article:section" content={category} />}

        {/* Reading time meta */}
        <meta name="reading-time" content={`${readingTime} min read`} />
      </SEOHelmet>

      {/* Blog Schema */}
      <SchemaScript
        schema={generateBlogSchema(
          {
            title,
            excerpt: description,
            image,
            date,
            lastModified,
            author,
            slug,
          },
          siteUrl
        )}
      />

      {/* Breadcrumb Schema */}
      <SchemaScript schema={generateBreadcrumbSchema(breadcrumbs, siteUrl)} />

      {/* Blog Content */}
      <article className="blog-article">
        {/* Breadcrumb Navigation */}
        <nav className="blog-breadcrumb" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <span key={i}>
              {i > 0 && <span className="separator"> / </span>}
              {crumb.url === `/blog/${slug}` ? (
                <span className="current">{crumb.label}</span>
              ) : (
                <a href={crumb.url}>{crumb.label}</a>
              )}
            </span>
          ))}
        </nav>

        {/* Article Header */}
        <header className="blog-header">
          {image && (
            <img
              src={image}
              alt={title}
              className="blog-featured-image"
              loading="lazy"
              decoding="async"
            />
          )}

          <h1 className="blog-title">{title}</h1>

          <div className="blog-meta">
            <span className="author">
              <strong>By:</strong> {author}
            </span>
            {date && (
              <time className="published" dateTime={date}>
                <strong>Published:</strong> {new Date(date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
            <span className="reading-time">
              <strong>Reading Time:</strong> {readingTime} min read
            </span>
          </div>

          {category && (
            <div className="blog-category">
              <span className="category-tag">{category}</span>
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="blog-content">{children}</div>
      </article>
    </>
  );
};

/**
 * Table of Contents Component for Blog Posts
 * Automatically generates from heading structure
 */
export const TableOfContents = ({ content }) => {
  // Extract headings from content (assuming headings are h2 and h3)
  const headingRegex = /<h([2-3]).*?id="([^"]*)".*?>([^<]+)<\/h\1>/g;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1];
    const id = match[2];
    const text = match[3];
    headings.push({ level: parseInt(level), id, text });
  }

  if (headings.length === 0) return null;

  return (
    <nav className="table-of-contents" aria-label="Table of Contents">
      <h2>Table of Contents</h2>
      <ul>
        {headings.map((heading, index) => (
          <li key={index} style={{ marginLeft: `${(heading.level - 2) * 20}px` }}>
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

/**
 * Related Articles Component
 * Shows related blog posts for internal linking
 */
export const RelatedArticles = ({ currentSlug, articles, limit = 3 }) => {
  const related = articles
    .filter((article) => article.slug !== currentSlug)
    .slice(0, limit);

  return (
    <section className="related-articles" aria-label="Related Articles">
      <h2>Related Articles</h2>
      <div className="articles-grid">
        {related.map((article) => (
          <article key={article.slug} className="article-card">
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                loading="lazy"
                decoding="async"
              />
            )}
            <h3>
              <a href={`/blog/${article.slug}`}>{article.title}</a>
            </h3>
            <p>{article.description}</p>
            <a href={`/blog/${article.slug}`} className="read-more">
              Read More →
            </a>
          </article>
        ))}
      </div>
    </section>
  );
};

/**
 * FAQ Schema Component for Blog Posts
 * Helps answer common questions and improves SERP appearance
 */
export const BlogFAQ = ({ faqs, siteUrl = "https://organicfood.swiftsigngeneraltrading.com" }) => {
  const { generateFAQSchema } = require("./seoData");

  return (
    <>
      <SchemaScript schema={generateFAQSchema(faqs)} />

      <section className="blog-faq" aria-label="Frequently Asked Questions">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <details key={index} className="faq-item">
              <summary className="faq-question">{faq.question}</summary>
              <p className="faq-answer">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
};
