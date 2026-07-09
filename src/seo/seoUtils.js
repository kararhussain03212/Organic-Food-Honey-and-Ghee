// SEO Utilities and helpers

// Image SEO Optimization
export const optimizeImage = (src, alt, title = "", options = {}) => ({
  src,
  alt: alt || "Organic food product image", // Default alt if not provided
  title: title || alt,
  loading: options.loading || "lazy",
  decoding: options.decoding || "async",
  className: options.className || "",
  style: {
    maxWidth: "100%",
    height: "auto",
    display: "block",
    ...options.style,
  },
});

// Generate responsive image srcset (for future optimization)
export const generateSrcSet = (imagePath, sizes = [320, 640, 960, 1280]) => {
  const basePath = imagePath.replace(/\.[^/.]+$/, "");
  const ext = imagePath.slice(imagePath.lastIndexOf(".") + 1);
  return sizes.map((size) => `${basePath}-${size}w.${ext} ${size}w`).join(", ");
};

// Slug generator for URLs
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// Extract reading time from text
export const getReadingTime = (text) => {
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
};

// Truncate text for previews
export const truncateText = (text, length = 160) => {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "...";
};

// Safe text for meta descriptions (Google recommends 50-160 characters)
export const validateMetaDescription = (description) => {
  if (description.length < 50) {
    console.warn("Meta description is too short (min 50 characters):", description);
  }
  if (description.length > 160) {
    console.warn("Meta description is too long (max 160 characters):", description);
    return description.slice(0, 157) + "...";
  }
  return description;
};

// Validate title length (Google recommends 50-60 characters)
export const validatePageTitle = (title) => {
  if (title.length < 30) {
    console.warn("Page title is too short (min 30 characters):", title);
  }
  if (title.length > 60) {
    console.warn("Page title is too long (max 60 characters):", title);
    return title.slice(0, 57) + "...";
  }
  return title;
};

// Check for duplicate meta tags
export const checkForDuplicateMeta = (pages) => {
  const titles = new Map();
  const descriptions = new Map();
  const duplicates = { titles: [], descriptions: [] };

  pages.forEach((page) => {
    if (titles.has(page.title)) {
      duplicates.titles.push([titles.get(page.title), page.slug]);
    } else {
      titles.set(page.title, page.slug);
    }

    if (descriptions.has(page.description)) {
      duplicates.descriptions.push([descriptions.get(page.description), page.slug]);
    } else {
      descriptions.set(page.description, page.slug);
    }
  });

  return duplicates;
};

// Generate breadcrumb schema data
export const generateBreadcrumbs = (pathname) => {
  const paths = pathname.split("/").filter(Boolean);
  const breadcrumbs = [{ label: "Home", url: "/" }];

  let currentPath = "";
  paths.forEach((path) => {
    currentPath += `/${path}`;
    const label = path
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    breadcrumbs.push({ label, url: currentPath });
  });

  return breadcrumbs;
};

// Accessibility helpers
export const createAriaLabel = (text, context = "") => {
  return context ? `${context}: ${text}` : text;
};

// Core Web Vitals monitoring (for development)
export const observeWebVitals = () => {
  if (typeof window === "undefined" || !("web-vital" in window)) return;

  // Largest Contentful Paint
  if ("PerformanceObserver" in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log("LCP:", entry.renderTime || entry.loadTime);
        }
      });
      observer.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (e) {
      console.warn("LCP observation not supported");
    }
  }
};

// Generate canonical URL
export const getCanonicalUrl = (pathname, baseUrl = "https://arionorganicfood.com") => {
  return `${baseUrl}${pathname}`;
};

// Extract keywords from content for validation
export const extractKeywords = (text, count = 5) => {
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "are", "be", "been", "being",
  ]);

  const words = text
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word));

  const frequency = {};
  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([word]) => word);
};

// SEO Audit Report
export const generateSEOAuditReport = (page) => {
  const issues = [];
  const warnings = [];
  const tips = [];

  // Title audit
  if (!page.title) {
    issues.push("Missing page title");
  } else if (page.title.length < 30) {
    warnings.push("Page title is too short (should be 30-60 characters)");
  } else if (page.title.length > 60) {
    warnings.push("Page title is too long (should be 30-60 characters)");
  }

  // Description audit
  if (!page.description) {
    issues.push("Missing meta description");
  } else if (page.description.length < 50) {
    warnings.push("Meta description is too short (should be 50-160 characters)");
  } else if (page.description.length > 160) {
    warnings.push("Meta description is too long (should be 50-160 characters)");
  }

  // Keywords audit
  if (!page.keywords || page.keywords.length === 0) {
    tips.push("Consider adding target keywords to meta");
  }

  // Canonical URL audit
  if (!page.canonical) {
    tips.push("Add canonical URL to prevent duplicate content issues");
  }

  // Images audit
  if (page.images && page.images.length > 0) {
    page.images.forEach((img) => {
      if (!img.alt) {
        issues.push(`Image missing alt text: ${img.src}`);
      }
    });
  }

  // Heading audit
  if (!page.h1) {
    issues.push("Missing H1 heading on page");
  }

  return { issues, warnings, tips };
};

// Performance optimization: Lazy load images
export const lazyLoadImages = () => {
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll("img.lazy").forEach((img) => imageObserver.observe(img));
  }
};

// Prefetch resources for better performance
export const prefetchResources = (urls) => {
  urls.forEach((url) => {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = url;
    document.head.appendChild(link);
  });
};

// Preload critical resources
export const preloadResources = (urls) => {
  urls.forEach((url) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = url;
    if (url.endsWith(".woff2")) link.as = "font";
    if (url.endsWith(".css")) link.as = "style";
    if (url.endsWith(".js")) link.as = "script";
    document.head.appendChild(link);
  });
};
