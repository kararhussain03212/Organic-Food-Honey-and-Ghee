export const categories = [
  { id: "all", label: "All Articles", count: 1 },
  {
    id: "shilajit-wellness",
    label: "Shilajit Wellness",
    count: 1,
    desc: "Shilajit benefits, usage, and recovery support",
  },
];

export const blogs = [
  {
    id: 1,
    title: "Shilajit for Daily Energy, Strength, and Recovery",
    slug: "shilajit-energy-strength-recovery",
    category: "shilajit-wellness",
    excerpt:
      "Discover how pure Himalayan shilajit supports stamina, focus, post-work recovery, and long-term wellness when used consistently.",
    image:
      "https://images.unsplash.com/photo-1667484423744-f32654ba7f4b?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Arion Wellness Team",
    authorRole: "Research Desk",
    date: "May 22, 2026",
    readTime: "7 min read",
    featured: true,
    tags: ["shilajit", "energy", "recovery", "stamina", "focus"],
  },
];

export const recentPosts = blogs.map(({ id, slug, title, date, readTime, image, category }) => ({
  id,
  slug,
  title,
  date,
  readTime,
  image,
  category,
}));

export const popularPosts = recentPosts;

export const allTags = ["shilajit", "energy", "recovery", "stamina", "focus"];

export const POSTS_PER_PAGE = 6;

const postShilajit = [
  {
    type: "paragraph",
    text: "Deep inside the high Himalayan mountains, nature creates one of its most powerful wellness secrets. Shilajit is a natural, dark mineral resin that has been used for thousands of years to boost health. It is not a factory-made supplement; it is a clean, pure gift from the rocks that helps restore your daily energy and strength.",
  },
  { type: "heading", text: "What is Shilajit and Where Does It Come From?" },
  {
    type: "paragraph",
    text: "When plants and organic matter stay trapped between heavy mountain rocks for centuries, they slowly change due to extreme weather and pressure. The result is a thick, mineral-rich paste that oozes out of the rocks during warm summer months. This raw material is carefully gathered and washed with pure water to create a safe, high-quality health resin.",
  },
  {
    type: "quote",
    text: "\"Shilajit is known as the destroyer of weakness. It brings back the natural power and energy that modern life takes away.\"",
  },
  { type: "heading", text: "Key Health Benefits for Everyday Life" },
  {
    type: "list",
    style: "bullet",
    items: [
      "Natural Energy Booster — Helps your body's cells produce clean energy so you feel less tired during long work days.",
      "Rich in Minerals — Contains over 85 natural minerals that are very easy for your body to absorb and use.",
      "Protects Health — Packed with natural antioxidants (Fulvic Acid) that clean out bad toxins and keep your cells healthy.",
      "Sharpens the Mind — Supports focus, memory, and clear thinking when you feel mentally exhausted.",
      "Stronger Body — Helps your muscles recover faster after heavy exercise or physical hard work.",
    ],
  },
  { type: "subheading", text: "How It Helps Fight Modern Stress" },
  {
    type: "paragraph",
    text: "Modern life keeps us busy, stressed, and tired. Many people turn to energy drinks or too much coffee, which cause sudden crashes later. Shilajit works differently. It works at a deep cellular level to build up steady, long-lasting stamina without making you feel anxious or shaky.",
  },
  { type: "heading", text: "How to Use Shilajit Properly" },
  {
    type: "list",
    style: "numbered",
    items: [
      "Use the small measuring tool to take a tiny, pea-sized piece of the resin.",
      "Drop it into a glass of warm water, warm milk, or green tea.",
      "Stir gently until the resin dissolves completely into the liquid.",
      "Drink it first thing in the morning on an empty stomach for the best results.",
      "Close the jar tightly and store it in a dry place so it does not get hard.",
    ],
  },
  {
    type: "tip-card",
    title: "✦ Simple Tips for Best Results",
    items: [
      "Be consistent — take your small daily portion every morning rather than taking large amounts once in a while.",
      "Mix it with a small spoon of raw honey if you want to soften its strong, earthy taste.",
      "Avoid using tap water with chlorine; always use clean, filtered warm water.",
      "Drink plenty of water throughout the day to help your body process the natural minerals smoothly.",
    ],
  },
  { type: "subheading", text: "How to Know Your Shilajit is Real" },
  {
    type: "paragraph",
    text: "Because Shilajit is highly prized, there are many fake powders and mixed syrups in the market. True, high-grade Shilajit always comes as a thick, shiny resin. It dissolves fully in warm water without leaving any sandy pieces behind, and it has a unique, smoky, mountain-like smell that cannot be copied in a lab.",
  },
  {
    type: "note-card",
    text: "⚠️ Important: Shilajit is very potent. If you take prescription medications or have high blood pressure, always talk to your doctor before adding it to your morning routine.",
  },
  { type: "heading", text: "Conclusion" },
  {
    type: "paragraph",
    text: "You do not need complicated chemical supplements to feel strong and energetic. True health starts with pure, natural foods and ancient mountain wisdom. By adding a small drop of pure Shilajit to your morning routine, you can naturally upgrade your daily stamina, protect your immune system, and keep your mind sharp all day long.",
  },  
];

export const contentBySlug = {
  "shilajit-energy-strength-recovery": postShilajit,
};

export const defaultContent = postShilajit;

export function getPostContent(slug) {
  return contentBySlug[slug] || defaultContent;
}

export function getRelatedPosts(slug) {
  return blogs.filter((b) => b.slug !== slug).slice(0, 4);
}
