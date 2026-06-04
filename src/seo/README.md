# SEO System - Quick Reference

## What's in this folder?

Everything you need to make your website search-engine optimized.

## Files Overview

### 🎯 Core Files

#### `SEOHelmet.jsx` 
**What it does**: Sets page titles, descriptions, and social sharing metadata

**Use on every page:**
```jsx
import { SEOHelmet } from "./seo/SEOHelmet";

export default function MyPage() {
  return (
    <>
      <SEOHelmet 
        title="Page Title | Brand"
        description="50-160 character description"
        keywords="keyword1, keyword2"
        url="/my-page"
      />
      <h1>My Page</h1>
    </>
  );
}
```

#### `seoData.js`
**What it does**: Stores SEO metadata for all pages (centralized database)

**Includes**:
- Pre-written titles and descriptions
- Schema generators (Organization, Product, Blog, etc.)
- Keyword suggestions

**Use it:**
```jsx
import { getSEOData, generateProductSchema } from "./seo/seoData";

const seoData = getSEOData("home");
const productSchema = generateProductSchema(product, siteUrl);
```

#### `SEOBlogTemplate.jsx`
**What it does**: Complete blog page template with SEO optimization

**Includes**: Reading time, breadcrumbs, related articles, FAQ support

**Use it:**
```jsx
import { SEOBlogTemplate, BlogFAQ, RelatedArticles } from "./seo/SEOBlogTemplate";

<SEOBlogTemplate article={article}>
  {/* Your blog content */}
</SEOBlogTemplate>
```

#### `SEOProductTemplate.jsx`
**What it does**: Complete product page template with SEO optimization

**Includes**: Product gallery, reviews, related products, FAQ support

**Use it:**
```jsx
import { SEOProductTemplate, ProductReviews, RelatedProducts } from "./seo/SEOProductTemplate";

<SEOProductTemplate product={product}>
  {/* Your product content */}
</SEOProductTemplate>
```

#### `seoUtils.js`
**What it does**: Helper functions for SEO optimization

**Important functions**:
- `optimizeImage()` - Optimize images for SEO + performance
- `generateSlug()` - Create URL-friendly text
- `validatePageTitle()` - Check title length
- `validateMetaDescription()` - Check description length
- `generateBreadcrumbs()` - Create breadcrumb nav
- `getReadingTime()` - Calculate article reading time
- `generateSEOAuditReport()` - Audit a page for SEO issues

**Use it:**
```jsx
import { optimizeImage, generateSlug, generateSEOAuditReport } from "./seo/seoUtils";

// Optimize images
<img {...optimizeImage("/image.png", "Alt text")} />

// Create URL-friendly slug
const slug = generateSlug("My Product Name"); // "my-product-name"

// Audit a page
const audit = generateSEOAuditReport(page);
console.log(audit.issues);    // Fix these
console.log(audit.warnings);  // Improve these
console.log(audit.tips);      // Nice-to-have
```

#### `sitemapGenerator.js`
**What it does**: Generates sitemap.xml for search engines

**Auto-generates URLs for**:
- All pages
- All products
- All blog posts
- All certification reports

**Use it** (for updates):
```jsx
import { generateSitemap } from "./seo/sitemapGenerator";

const sitemapXML = generateSitemap();
// Save to public/sitemap.xml
```

## Quick Integration Guide

### Step 1: Add to Homepage
```jsx
import { SEOHelmet, SchemaScript } from "@/seo/SEOHelmet";
import { getSEOData, generateOrgSchema } from "@/seo/seoData";

const seoData = getSEOData("home");

return (
  <>
    <SEOHelmet {...seoData} />
    <SchemaScript schema={generateOrgSchema("https://arionorganicfood.com")} />
    {/* rest of page */}
  </>
);
```

### Step 2: Add to Product Pages
```jsx
import { SEOProductTemplate, SEOProductGallery, ProductReviews } from "@/seo/SEOProductTemplate";

return (
  <SEOProductTemplate product={product}>
    <SEOProductGallery images={product.images} />
    <ProductReviews reviews={product.reviews} />
  </SEOProductTemplate>
);
```

### Step 3: Add to Blog Pages
```jsx
import { SEOBlogTemplate, BlogFAQ, RelatedArticles } from "@/seo/SEOBlogTemplate";

return (
  <SEOBlogTemplate article={article}>
    {/* blog content */}
    <BlogFAQ faqs={faqs} />
    <RelatedArticles articles={relatedPosts} />
  </SEOBlogTemplate>
);
```

### Step 4: Optimize Images
```jsx
import { optimizeImage } from "@/seo/seoUtils";

<img {...optimizeImage("/photo.png", "Descriptive alt text")} />
// Automatically adds: loading="lazy", alt, decoding="async"
```

## Do's ✅

- ✅ Use ONE SEOHelmet per page
- ✅ Write unique titles (30-60 chars)
- ✅ Write unique descriptions (50-160 chars)
- ✅ Use descriptive alt text on images
- ✅ Create ONE H1 per page
- ✅ Link to related content
- ✅ Validate schemas at schema.org
- ✅ Test with Lighthouse

## Don'ts ❌

- ❌ Don't use multiple SEOHelmet on one page
- ❌ Don't create multiple H1 tags
- ❌ Don't skip image alt text
- ❌ Don't use "click here" as link text
- ❌ Don't ignore character limits
- ❌ Don't skip image optimization
- ❌ Don't forget breadcrumbs on detail pages

## Validation Checklist

For each page, verify:
- [ ] Unique title (30-60 chars)
- [ ] Unique description (50-160 chars)
- [ ] ONE H1 tag only
- [ ] All images have alt text
- [ ] All images use `loading="lazy"`
- [ ] Proper heading hierarchy (H1→H2→H3)
- [ ] Internal links to related content
- [ ] Breadcrumbs on detail pages
- [ ] Mobile responsive
- [ ] Schema validated

## Testing & Validation

### Test with Lighthouse
Chrome DevTools → Lighthouse → Run Audit
- Check SEO score
- Check Performance score
- Check Accessibility score

### Validate Schema
https://schema.org/validator
- Paste page URL
- Verify structured data

### Check Mobile Compatibility
https://search.google.com/test/mobile-friendly

### Monitor in Google Search Console
https://search.google.com/search-console
- Submit sitemap.xml
- Check indexing status
- Monitor search queries

## Common Issues & Fixes

**Problem**: Meta tags not updating when navigating
**Fix**: Make sure HelmetProvider wraps Router in App.jsx

**Problem**: Images not showing in social shares
**Fix**: Use absolute URLs: `https://arionorganicfood.com/image.png`

**Problem**: Schema not recognized
**Fix**: Validate at schema.org, ensure proper JSON structure

**Problem**: Low Core Web Vitals
**Fix**: Use image lazy loading, optimize assets, remove render-blocking resources

## Useful Functions Quick Reference

```jsx
// Import
import { 
  SEOHelmet, 
  SchemaScript,
  optimizeImage,
  generateSlug,
  getReadingTime,
  generateBreadcrumbs,
  validatePageTitle,
  validateMetaDescription,
  generateSEOAuditReport,
  preloadResources,
  prefetchResources
} from "@/seo/...";

// Set page metadata
<SEOHelmet title="..." description="..." />

// Add schema
<SchemaScript schema={generateOrgSchema(...)} />

// Optimize image
<img {...optimizeImage(src, alt)} />

// Generate URL slug
const slug = generateSlug("Product Name");

// Calculate reading time
const time = getReadingTime(content);

// Create breadcrumbs
const breadcrumbs = generateBreadcrumbs("/products/honey");

// Validate
validatePageTitle("My Title");
validateMetaDescription("My description");

// Audit page
const audit = generateSEOAuditReport(page);

// Performance optimization
preloadResources(["/fonts/main.woff2"]);
prefetchResources(["/products"]);
```

## Examples in Project

- `SEO_EXAMPLE_HOME.jsx` - See how to implement on a real page
- `SEO_IMPLEMENTATION_GUIDE.md` - Complete implementation guide
- `SEO_IMPLEMENTATION_CHECKLIST.md` - Phase-by-phase checklist

## Further Resources

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Docs](https://schema.org)
- [React Helmet Async](https://github.com/stayradiated/react-helmet-async)
- [Web Vitals Guide](https://web.dev/vitals)

---

**Quick Start**: Copy the pattern from `SEO_EXAMPLE_HOME.jsx` and adapt it to your pages!
