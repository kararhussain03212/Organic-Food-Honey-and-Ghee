export const categories = [
  { id: "all", label: "All Articles", icon: "✦", count: 12 },
  { id: "healthy-living", label: "Healthy Living", icon: "🌿", count: 3, desc: "Wellness routines, daily habits & lifestyle" },
  { id: "pure-nutrition", label: "Pure Nutrition", icon: "🥗", count: 2, desc: "Organic foods, nutrition & balanced eating" },
  { id: "desi-ghee", label: "Desi Ghee Benefits", icon: "🫙", count: 3, desc: "Traditional uses, cooking & wellness info" },
  { id: "honey-wellness", label: "Honey Wellness", icon: "🍯", count: 2, desc: "Honey benefits, remedies & immunity" },
  { id: "traditional-wellness", label: "Traditional Wellness", icon: "🌾", count: 2, desc: "Heritage methods & natural practices" },
];

export const blogs = [
  {
    id: 1,
    title: "10 Morning Rituals for a Healthier, More Energised Day",
    slug: "morning-rituals-healthier-day",
    category: "healthy-living",
    excerpt: "Start your day with purpose. These ten simple, science-backed morning habits can transform your energy, mood, and productivity from the first hour of waking.",
    image: "https://placehold.co/600x400/496348/ffffff?text=Morning+Rituals",
    author: "Sana Khalid",
    authorRole: "Wellness Coach",
    date: "May 14, 2026",
    readTime: "6 min read",
    featured: true,
    tags: ["morning routine", "healthy habits", "energy"],
  },
  {
    id: 2,
    title: "Why Desi Ghee Is the Gold Standard of Healthy Fats",
    slug: "desi-ghee-healthy-fats",
    category: "desi-ghee",
    excerpt: "Modern science is catching up to what our grandmothers always knew. Pure desi ghee offers a rich spectrum of fat-soluble vitamins and butyric acid that support gut health.",
    image: "https://placehold.co/600x400/C7A66B/ffffff?text=Desi+Ghee",
    author: "Dr. Imran Siddiqui",
    authorRole: "Nutritionist",
    date: "May 10, 2026",
    readTime: "8 min read",
    featured: false,
    tags: ["ghee", "healthy fats", "nutrition"],
  },
  {
    id: 3,
    title: "Raw Honey vs Processed Honey: What You Must Know",
    slug: "raw-vs-processed-honey",
    category: "honey-wellness",
    excerpt: "Not all honey is created equal. Learn the critical differences between raw, unprocessed honey and the commercial alternatives lining grocery shelves.",
    image: "https://placehold.co/600x400/D9A84C/ffffff?text=Raw+Honey",
    author: "Ayesha Noor",
    authorRole: "Food Scientist",
    date: "May 7, 2026",
    readTime: "5 min read",
    featured: false,
    tags: ["honey", "natural remedies", "immunity"],
  },
  {
    id: 4,
    title: "The Organic Plate: Building a Truly Balanced Diet",
    slug: "organic-plate-balanced-diet",
    category: "pure-nutrition",
    excerpt: "Eating well doesn't have to be complicated. Discover how to build nutrient-dense, satisfying meals using organic whole foods available right in your local market.",
    image: "https://placehold.co/600x400/5B7A58/ffffff?text=Organic+Plate",
    author: "Fatima Raza",
    authorRole: "Dietitian",
    date: "May 3, 2026",
    readTime: "7 min read",
    featured: false,
    tags: ["nutrition", "organic", "balanced diet"],
  },
  {
    id: 5,
    title: "Unani & Ayurvedic Wisdom: Timeless Healing for Modern Life",
    slug: "unani-ayurvedic-wisdom",
    category: "traditional-wellness",
    excerpt: "Our ancestors had centuries of accumulated healing knowledge. From turmeric to black seed, explore the science behind traditional remedies that still hold up today.",
    image: "https://placehold.co/600x400/7A6348/ffffff?text=Traditional+Wellness",
    author: "Prof. Bilal Chaudhry",
    authorRole: "Herbalist",
    date: "April 29, 2026",
    readTime: "9 min read",
    featured: false,
    tags: ["unani", "ayurveda", "natural healing"],
  },
  {
    id: 6,
    title: "Ghee in Pakistani Cooking: A Cultural and Nutritional Legacy",
    slug: "ghee-in-pakistani-cooking",
    category: "desi-ghee",
    excerpt: "From biryani to halwa, desi ghee is woven into the fabric of our culinary heritage. Explore the cultural significance and nutritional superiority of cooking with pure ghee.",
    image: "https://placehold.co/600x400/8B7355/ffffff?text=Ghee+Cooking",
    author: "Usman Tariq",
    authorRole: "Chef & Food Blogger",
    date: "April 25, 2026",
    readTime: "6 min read",
    featured: false,
    tags: ["ghee", "cooking", "culture"],
  },
  {
    id: 7,
    title: "Digital Detox: How Reducing Screen Time Improves Your Health",
    slug: "digital-detox-screen-time",
    category: "healthy-living",
    excerpt: "Excessive screen exposure is linked to anxiety, poor sleep, and reduced focus. Here's a practical guide to a structured digital detox that actually sticks.",
    image: "https://placehold.co/600x400/496348/E8E6E2?text=Digital+Detox",
    author: "Sana Khalid",
    authorRole: "Wellness Coach",
    date: "April 21, 2026",
    readTime: "5 min read",
    featured: false,
    tags: ["lifestyle", "mental health", "habits"],
  },
  {
    id: 8,
    title: "Honey as Medicine: Ancient Remedies That Still Work",
    slug: "honey-as-medicine",
    category: "honey-wellness",
    excerpt: "From wound healing to sore throat relief, honey has been used as medicine for over 5,000 years. Discover which traditional uses are validated by modern research.",
    image: "https://placehold.co/600x400/C8A04A/ffffff?text=Honey+Medicine",
    author: "Dr. Nadia Hamid",
    authorRole: "Integrative Medicine Practitioner",
    date: "April 17, 2026",
    readTime: "7 min read",
    featured: false,
    tags: ["honey", "medicine", "immunity"],
  },
  {
    id: 9,
    title: "Understanding Macronutrients: Protein, Carbs & Fats Explained",
    slug: "understanding-macronutrients",
    category: "pure-nutrition",
    excerpt: "Macronutrient balance is the foundation of good nutrition. This comprehensive guide breaks down what you actually need and how to get it from whole, organic sources.",
    image: "https://placehold.co/600x400/4A7C59/ffffff?text=Macronutrients",
    author: "Fatima Raza",
    authorRole: "Dietitian",
    date: "April 12, 2026",
    readTime: "8 min read",
    featured: false,
    tags: ["nutrition", "macros", "diet"],
  },
  {
    id: 10,
    title: "The Lost Art of Slow Cooking with Traditional Ingredients",
    slug: "slow-cooking-traditional-ingredients",
    category: "traditional-wellness",
    excerpt: "Before microwaves and instant meals, slow cooking preserved nutrients and deepened flavour. Revisit time-honoured techniques using organic spices and natural fats.",
    image: "https://placehold.co/600x400/6B5A3E/ffffff?text=Slow+Cooking",
    author: "Prof. Bilal Chaudhry",
    authorRole: "Herbalist",
    date: "April 8, 2026",
    readTime: "6 min read",
    featured: false,
    tags: ["cooking", "traditional", "organic"],
  },
  {
    id: 11,
    title: "Sleep, Stress & Gut Health: The Hidden Triangle of Wellness",
    slug: "sleep-stress-gut-health",
    category: "healthy-living",
    excerpt: "Sleep deprivation, chronic stress, and poor gut health form a vicious cycle. Understanding their connection is the first step to breaking free from fatigue and brain fog.",
    image: "https://placehold.co/600x400/496348/D9D2C7?text=Sleep+Wellness",
    author: "Dr. Imran Siddiqui",
    authorRole: "Nutritionist",
    date: "April 4, 2026",
    readTime: "10 min read",
    featured: false,
    tags: ["sleep", "gut health", "stress"],
  },
  {
    id: 12,
    title: "How to Use Ghee for Skin: Beauty Secrets from the Subcontinent",
    slug: "ghee-for-skin",
    category: "desi-ghee",
    excerpt: "Long before serums and moisturisers, women across the subcontinent used pure ghee for radiant skin. Explore the lipid science and traditional wisdom behind this practice.",
    image: "https://placehold.co/600x400/B8966A/ffffff?text=Ghee+Skincare",
    author: "Ayesha Noor",
    authorRole: "Food Scientist",
    date: "March 30, 2026",
    readTime: "5 min read",
    featured: false,
    tags: ["ghee", "beauty", "skincare"],
  },
];

export const recentPosts = blogs.slice(0, 4).map(({ id, title, date, readTime, image, category }) => ({
  id, title, date, readTime, image, category,
}));

export const popularPosts = [blogs[1], blogs[2], blogs[4], blogs[0]].map(({ id, title, date, readTime, image, category }) => ({
  id, title, date, readTime, image, category,
}));

export const allTags = [
  "ghee", "honey", "nutrition", "organic", "healthy habits",
  "morning routine", "gut health", "immunity", "cooking", "traditional",
  "ayurveda", "lifestyle", "skincare", "diet", "natural remedies",
];

export const POSTS_PER_PAGE = 6;

/* ── Detailed article content (shared across all slugs) ── */
export const defaultContent = [
  {
    type: "paragraph",
    text: "In a world flooded with synthetic shortcuts and processed conveniences, returning to nature's wisdom has never felt more urgent — or more rewarding. The organic lifestyle is not a trend; it is a rediscovery of what our bodies have always needed: clean, whole, traditionally prepared nourishment.",
  },
  { type: "heading", text: "Why This Matters More Than Ever" },
  {
    type: "paragraph",
    text: "Modern food systems have, in many ways, disconnected us from the source of our nutrition. Pesticide residues, artificial preservatives, and ultra-processed ingredients have become the norm rather than the exception. Understanding why these alternatives fall short is the first step toward meaningful, lasting change.",
  },
  {
    type: "quote",
    text: "\"Let food be thy medicine and medicine be thy food.\" — The principle that guided generations of healthy families across the subcontinent.",
  },
  { type: "heading", text: "Key Benefits Backed by Tradition & Science" },
  {
    type: "list",
    style: "bullet",
    items: [
      "Rich in fat-soluble vitamins (A, D, E, K) that support immunity and vision.",
      "Contains short-chain fatty acids that nourish the gut lining.",
      "Free from trans fats and artificial additives found in commercial alternatives.",
      "Higher smoke point than most refined oils — safer for high-heat cooking.",
      "Supports healthy cholesterol balance when consumed in moderation.",
    ],
  },
  { type: "subheading", text: "Traditional Uses Across Generations" },
  {
    type: "paragraph",
    text: "From the Ayurvedic texts of ancient India to the Unani physicians of Mughal courts, traditional healers consistently prescribed pure, organic foods as both preventive and curative agents. These weren't folk remedies — they were sophisticated, empirically tested therapeutic protocols refined over centuries.",
  },
  { type: "heading", text: "How to Incorporate It Into Daily Life" },
  {
    type: "list",
    style: "numbered",
    items: [
      "Start small — replace one processed food per week with an organic alternative.",
      "Read labels carefully; 'natural' does not always mean unprocessed.",
      "Source from trusted, transparent producers who share their process.",
      "Combine with whole grains, vegetables, and legumes for balanced nutrition.",
      "Store correctly — cool, dark, airtight — to preserve potency.",
    ],
  },
  {
    type: "tip-card",
    title: "✦ Arion Wellness Tips",
    items: [
      "Use 1 teaspoon of pure ghee in warm water each morning to activate digestion.",
      "A spoonful of raw honey with black seed before bed supports deep sleep.",
      "Slow-cook lentils with traditional spices rather than pressure-cooking for better nutrient retention.",
      "Pair organic foods with mindful eating — chew slowly, eat without screens.",
    ],
  },
  { type: "subheading", text: "What to Look for When Buying" },
  {
    type: "paragraph",
    text: "Purity is everything. A product labelled 'organic' must be verified — look for certifications, clear sourcing information, and producers who are willing to explain their process. At Arion, we believe transparency is not optional; it is the foundation of trust.",
  },
  {
    type: "note-card",
    text: "⚠️ Important: Always consult a qualified healthcare professional before making significant dietary changes, especially if you have existing health conditions or are on medication.",
  },
  { type: "heading", text: "Conclusion" },
  {
    type: "paragraph",
    text: "The path to better health does not require expensive supplements or complicated protocols. It begins with honest, organic, traditionally prepared food — the kind that has sustained healthy families for generations. Make one small change today, and let the compound effect of good choices transform your wellbeing over time.",
  },
];

/* ── Related posts per slug ── */
export function getRelatedPosts(slug) {
  const current = blogs.find((b) => b.slug === slug);
  if (!current) return blogs.slice(0, 4);
  return blogs
    .filter((b) => b.slug !== slug && b.category === current.category)
    .concat(blogs.filter((b) => b.slug !== slug && b.category !== current.category))
    .slice(0, 4);
}

