export const productCategories = [
  { id: "all", label: "All Products", icon: "?", count: 6 },
  { id: "ghee", label: "Desi Ghee", icon: "??", count: 4 },
  { id: "honey", label: "Honey", icon: "??", count: 2 },
];

export const products = [
  {
    id: 1,
    slug: "pure-desi-cow-ghee-500g",
    name: "Cow Desi Ghee-500 gm",
    subtitle: "Traditional Clarified Butter",
    category: "ghee",
    size: "500g",
    price: 2000,
    originalPrice: 2000,
    discount: 0,
    rating: 5,
    reviews: 248,
    stock: true,
    purchasedQuantity: 0,
    balanceQuantity: 33,
    featured: true,
    variants: ["500g"],
    variantPrices: { "500g": 2000 },
    variantOriginalPrices: { "500g": 2000 },
    images: ["/product-images/ghee (1).png"],
    img: "/product-images/ghee (1).png",
    badges: ["Best Seller", "Organic"],
    shortDesc:
      "Traditional clarified butter made from grass-fed cows using the bilona method.",
    description:
      "Our Pure Desi Cow Ghee is prepared in small batches using traditional methods for rich aroma, taste, and nutritional quality.",
    benefits: [
      "Rich in fat-soluble vitamins A, D, E, K",
      "Supports digestion",
      "High smoke point for cooking",
    ],
    ingredients: "100% Pure Desi Cow Ghee.",
    howToUse: [
      { step: "01", text: "Use daily in cooking or with warm milk." },
      { step: "02", text: "Store in a cool, dry place." },
    ],
    faqs: [
      {
        q: "Does this need refrigeration?",
        a: "No. Keep it at room temperature in a dry place.",
      },
    ],
    tags: ["ghee", "cow", "500g", "traditional"],
  },
  {
    id: 2,
    slug: "pure-desi-cow-ghee-1kg",
    name: "Cow Desi Ghee-1000 gm",
    subtitle: "Traditional Clarified Butter",
    category: "ghee",
    size: "1kg",
    price: 4000,
    originalPrice: 4000,
    discount: 0,
    rating: 5,
    reviews: 182,
    stock: true,
    purchasedQuantity: 0,
    balanceQuantity: 16,
    featured: false,
    variants: ["1kg"],
    variantPrices: { "1kg": 4000 },
    variantOriginalPrices: { "1kg": 4000 },
    images: ["/product-images/ghee (1).png"],
    img: "/product-images/ghee (1).png",
    badges: ["Pure"],
    shortDesc: "A2 grass-fed cow ghee with rich flavor in family pack size.",
    description:
      "Pure Desi Cow Ghee 1kg is ideal for regular home use with the same traditional quality and aroma.",
    benefits: [
      "Everyday cooking support",
      "Naturally rich flavor",
      "Premium traditional quality",
    ],
    ingredients: "100% Pure Desi Cow Ghee.",
    howToUse: [
      { step: "01", text: "Use in cooking, frying, or as finishing." },
      { step: "02", text: "Store at room temperature." },
    ],
    faqs: [
      {
        q: "Is this the same quality as 500g?",
        a: "Yes, same quality in larger size.",
      },
    ],
    tags: ["ghee", "cow", "1kg", "a2"],
  },
  {
    id: 3,
    slug: "pure-desi-goat-ghee-500g",
    name: "Goat Desi Ghee-500 gm",
    subtitle: "Traditional Clarified Butter",
    category: "ghee",
    size: "500g",
    price: 3000,
    originalPrice: 3000,
    discount: 0,
    rating: 5,
    reviews: 131,
    stock: true,
    purchasedQuantity: 0,
    balanceQuantity: 21,
    featured: true,
    variants: ["500g"],
    variantPrices: { "500g": 3000 },
    variantOriginalPrices: { "500g": 3000 },
    images: ["/product-images/ghee (2).png"],
    img: "/product-images/ghee (2).png",
    badges: ["Best Seller", "Organic"],
    shortDesc:
      "Traditional clarified butter made from goat milk for rich flavor and aroma.",
    description:
      "Our Pure Desi Goat Ghee is prepared in small batches using traditional methods for rich aroma, taste, and nutritional quality.",
    benefits: [
      "Naturally rich taste and aroma",
      "Supports everyday cooking",
      "Traditional small-batch quality",
    ],
    ingredients: "100% Pure Desi Goat Ghee.",
    howToUse: [
      { step: "01", text: "Use daily in cooking or with warm milk." },
      { step: "02", text: "Store in a cool, dry place." },
    ],
    faqs: [
      {
        q: "Does this need refrigeration?",
        a: "No. Keep it at room temperature in a dry place.",
      },
    ],
    tags: ["ghee", "goat", "500g", "traditional"],
  },
  {
    id: 4,
    slug: "pure-desi-goat-ghee-1kg",
    name: "Goat Desi Ghee-1000 gm",
    subtitle: "Traditional Clarified Butter",
    category: "ghee",
    size: "1kg",
    price: 6000,
    originalPrice: 6000,
    discount: 0,
    rating: 5,
    reviews: 96,
    stock: true,
    purchasedQuantity: 0,
    balanceQuantity: 6,
    featured: false,
    variants: ["1kg"],
    variantPrices: { "1kg": 6000 },
    variantOriginalPrices: { "1kg": 6000 },
    images: ["/product-images/ghee (2).png"],
    img: "/product-images/ghee (2).png",
    badges: ["Pure"],
    shortDesc: "Family-size goat ghee with rich flavor and traditional quality.",
    description:
      "Pure Desi Goat Ghee 1kg is ideal for regular home use with the same traditional quality and aroma.",
    benefits: [
      "Everyday cooking support",
      "Naturally rich flavor",
      "Premium traditional quality",
    ],
    ingredients: "100% Pure Desi Goat Ghee.",
    howToUse: [
      { step: "01", text: "Use in cooking, frying, or as finishing." },
      { step: "02", text: "Store at room temperature." },
    ],
    faqs: [
      {
        q: "Is this the same quality as 500g?",
        a: "Yes, same quality in larger size.",
      },
    ],
    tags: ["ghee", "goat", "1kg", "traditional"],
  },
  {
    id: 5,
    slug: "raw-honey-500g",
    name: "Pure Desi Honey-500 gm",
    subtitle: "Unfiltered & Unheated",
    category: "honey",
    size: "500g",
    price: 3500,
    originalPrice: 3500,
    discount: 0,
    rating: 5,
    reviews: 312,
    stock: false,
    purchasedQuantity: 0,
    balanceQuantity: 0,
    featured: true,
    variants: ["500g"],
    variantPrices: { "500g": 3500 },
    variantOriginalPrices: { "500g": 3500 },
    images: ["/product-images/honey 500 g.png", "/product-images/honey.png"],
    img: "/product-images/honey 500 g.png",
    badges: ["Best Seller", "Pure"],
    shortDesc: "Unfiltered honey with natural enzymes and antioxidants.",
    description:
      "Raw Honey 500g is collected from clean apiaries and packed without heat processing to preserve natural quality.",
    benefits: ["Natural sweetness", "Daily wellness support", "Rich taste"],
    ingredients: "100% Raw, Unfiltered Honey.",
    howToUse: [
      { step: "01", text: "Use in warm water, tea, or daily spoonful." },
      { step: "02", text: "Store in a cool dry place." },
    ],
    faqs: [
      {
        q: "Why does honey crystallize?",
        a: "Crystallization is natural and a sign of purity.",
      },
    ],
    tags: ["honey", "500g", "raw"],
  },
  {
    id: 6,
    slug: "raw-honey-1kg",
    name: "Pure Desi Honey-1000 gm",
    subtitle: "Unfiltered & Unheated",
    category: "honey",
    size: "1kg",
    price: 7000,
    originalPrice: 7000,
    discount: 0,
    rating: 5,
    reviews: 167,
    stock: true,
    purchasedQuantity: 0,
    balanceQuantity: 5,
    featured: false,
    variants: ["1kg"],
    variantPrices: { "1kg": 7000 },
    variantOriginalPrices: { "1kg": 7000 },
    images: ["/product-images/honey.png", "/product-images/honey 500 g.png"],
    img: "/product-images/honey.png",
    badges: ["Organic"],
    shortDesc: "Family pack raw honey with deep floral taste.",
    description:
      "Raw Honey 1kg is a larger-size pack for regular home use with the same raw, natural quality.",
    benefits: [
      "Natural energy source",
      "Great for daily use",
      "Pure and unheated",
    ],
    ingredients: "100% Raw, Unfiltered Honey.",
    howToUse: [
      { step: "01", text: "Use as a natural sweetener in meals and drinks." },
      { step: "02", text: "Keep in dry place away from heat." },
    ],
    faqs: [
      {
        q: "Is this filtered?",
        a: "Lightly strained only, no heat processing.",
      },
    ],
    tags: ["honey", "1kg", "raw"],
  },
];

export const PRODUCTS_PER_PAGE = 6;

export function isProductAvailableInCity() {
  return true;
}

export function getRelatedProducts(slug) {
  const current = products.find((p) => p.slug === slug);
  if (!current) return products.slice(0, 4);
  return products
    .filter((p) => p.slug !== slug && p.category === current.category)
    .concat(products.filter((p) => p.slug !== slug && p.category !== current.category))
    .slice(0, 4);
}

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug) || products[0];
}
