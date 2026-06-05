-- ============================================================
-- Arion Organic Food — Seed Data
-- Run AFTER organic_food.sql has been imported.
-- Safe to re-run: uses INSERT IGNORE on slug-unique tables.
-- ============================================================

USE `organic_food`;

-- ============================================================
-- PRODUCTS
-- ============================================================

INSERT IGNORE INTO `products`
  (`name`, `slug`, `subtitle`, `category`, `size`, `price`, `original_price`,
   `discount`, `rating`, `reviews`, `stock`, `featured`,
   `variants`, `variant_prices`, `variant_original_prices`,
   `images`, `badges`, `short_desc`, `description`,
   `benefits`, `ingredients`, `how_to_use`, `faqs`, `tags`,
   `sort_order`, `is_active`, `created_at`, `updated_at`)
VALUES

-- ── 1. Shilajit 5g ──────────────────────────────────────────
(
  'Pure Himalayan Shilajit 5GM',
  'pure-himalayan-shilajit-5gm',
  'Premium Golden Grade Resin',
  'herbal',
  '5g',
  1000.00, 1200.00, 16, 4.9, 92, 1, 0,
  '["5g"]',
  '{"5g":1000}',
  '{"5g":1200}',
  '["/product-images/shilajit 5g.png"]',
  '["Trial Size","Pure Product"]',
  'Pure, high-altitude gold-grade mineral resin. Perfect trial size for beginners introducing shilajit to their lifestyle.',
  'Sourced from pristine Himalayan mountain ranges, our 5gm Shilajit jar offers the exact same premium quality as our standard size. An excellent choice for individuals looking to experience the profound cellular energy and recovery benefits of ancient organic minerals.',
  '["Supplies trace ionic minerals to counteract everyday physical exhaustion.","Improves your body\'s natural resilience against environmental stressors.","Authentic resin form ensuring zero fillers, binding powders, or synthetic shortcuts."]',
  '100% Pure Purified Shilajit Resin.',
  '[{"step":"01","text":"Dissolve a small grain-sized portion in any warm, non-chlorinated fluid daily."},{"step":"02","text":"Always ensure the jar lid is free of sticky residue before closing to keep it easy to open."}]',
  '[{"q":"Can this be taken with coffee?","a":"Yes, dissolving shilajit in your morning coffee is a popular way to mask its earthy taste while enjoying sustained focus."}]',
  '["shilajit","resin","5g","himalayan","herbal","trial"]',
  10, 1, NOW(), NOW()
),

-- ── 2. Shilajit 10g ─────────────────────────────────────────
(
  'Pure Himalayan Shilajit-10GM',
  'pure-himalayan-shilajit-10gm',
  'Premium Golden Grade Resin',
  'herbal',
  '10g',
  2000.00, 2100.00, 5, 5.0, 184, 1, 1,
  '["10g"]',
  '{"10g":2000}',
  '{"10g":2100}',
  '["/product-images/shilajit 10g.png"]',
  '["Gold Grade","Organic"]',
  'Pure, gold-grade mineral resin sourced from high-altitude Himalayan peaks, rich in Fulvic acid.',
  'Our Pure Himalayan Shilajit resin is meticulously purified to eliminate impurities while keeping its complex trace mineral profile intact. Extracted from the most pristine high-altitude rock formations, it acts as a premier natural vitality, stamina, and cognitive booster.',
  '["Extremely rich in Fulvic Acid and over 85 essential trace ionic minerals.","Accelerates natural energy levels, cellular ATP production, and daily stamina.","Supports robust immune response, joint health, and sharp mental clarity."]',
  '100% Pure Purified Shilajit Resin.',
  '[{"step":"01","text":"Use the included measuring spoon to dissolve a pea-sized portion (approx. 250mg) in warm water, milk, or green tea."},{"step":"02","text":"Consume on an empty stomach first thing in the morning for maximum metabolic absorption."},{"step":"03","text":"Store tightly sealed in a cool, dry place away from moisture to prevent hardening."}]',
  '[{"q":"What makes gold-grade shilajit different?","a":"Gold-grade shilajit is collected at extreme altitudes (above 16,000 feet), yielding the highest natural concentration of therapeutic nutrients and fulvic minerals."},{"q":"How long does a 10g jar last?","a":"When consumed daily at the recommended pea-sized dosage, a 10gm jar will comfortably last around 35 to 40 days."}]',
  '["shilajit","resin","10g","himalayan","herbal","vitality"]',
  9, 1, NOW(), NOW()
),

-- ── 3. Cow Ghee 500g ────────────────────────────────────────
(
  'Arion Cow Desi Ghee 500GM',
  'arion-cow-desi-ghee-500gm',
  'Traditional Clarified Butter',
  'ghee',
  '500g',
  2000.00, 2250.00, 0, 5.0, 248, 1, 1,
  '["500g"]',
  '{"500g":2000}',
  '{"500g":2250}',
  '["/product-images/cow-ghee-500g.png"]',
  '["Best Seller","Organic"]',
  'High-quality Desi Ghee made from 100% carefully selected cow\'s milk.',
  'We use 100% cow\'s milk to make our Desi Ghee, very carefully chosen to suit our requirements and fulfill hygiene standards. Once butter is made, it is simmered on a very low flame for several hours with precision and constant monitoring to achieve the desired quality. During this process, milk solids are completely separated.',
  '["Helps increase bile production.","Improve insulin resistance by normalizing blood sugars.","Decrease inflammation.","Increase energy.","Omega 3 Fatty Acids (Healthy Fats).","Omega 9 Fatty Acids (Healthy Fats).","MCT fat (Medium-chain triglycerides).","Vitamin A, D, E and K (Fat-soluble vitamins).","CLA - a healthy fat that helps athlete performance and weight loss.","Antioxidants."]',
  '100% Pure Desi Cow Ghee.',
  '[{"step":"01","text":"Use daily in cooking or with warm milk."},{"step":"02","text":"Store in a cool, dry place."}]',
  '[{"q":"Does this need refrigeration?","a":"No. Keep it at room temperature in a dry place."}]',
  '["ghee","cow","500g","traditional"]',
  1, 1, NOW(), NOW()
),

-- ── 4. Cow Ghee 1kg ─────────────────────────────────────────
(
  'Arion Cow Desi Ghee 1KG',
  'arion-cow-desi-ghee-1kg',
  'Traditional Clarified Butter',
  'ghee',
  '1kg',
  4000.00, 4500.00, 0, 5.0, 182, 1, 0,
  '["1kg"]',
  '{"1kg":4000}',
  '{"1kg":4500}',
  '["/product-images/ghee-cow-1kg.png"]',
  '["Pure"]',
  'High-quality Desi Ghee made from 100% carefully selected cow\'s milk.',
  'We use 100% cow\'s milk to make our Desi Ghee, very carefully chosen to suit our requirements and fulfill hygiene standards. Once butter is made, it is simmered on a very low flame for several hours with precision and constant monitoring to achieve the desired quality. During this process, milk solids are completely separated.',
  '["Helps increase bile production.","Improve insulin resistance by normalizing blood sugars.","Decrease inflammation.","Increase energy.","Omega 3 Fatty Acids (Healthy Fats).","Omega 9 Fatty Acids (Healthy Fats).","MCT fat (Medium-chain triglycerides).","Vitamin A, D, E and K (Fat-soluble vitamins).","CLA - a healthy fat that helps athlete performance and weight loss.","Antioxidants."]',
  '100% Pure Desi Cow Ghee.',
  '[{"step":"01","text":"Use in cooking, frying, or as finishing."},{"step":"02","text":"Store at room temperature."}]',
  '[{"q":"Is this the same quality as 500g?","a":"Yes, same quality in larger size."}]',
  '["ghee","cow","1kg","a2"]',
  2, 1, NOW(), NOW()
),

-- ── 5. Honey 500g ───────────────────────────────────────────
(
  'Arion Honey 500GM',
  'arion-honey-500gm',
  'Unfiltered & Unheated',
  'honey',
  '500g',
  3500.00, 3750.00, 0, 5.0, 312, 1, 1,
  '["500g"]',
  '{"500g":3500}',
  '{"500g":3750}',
  '["/product-images/honey 500 g.png","/product-images/honey.png"]',
  '["Best Seller","Pure"]',
  'Cold-extracted, unfiltered raw honey taken directly from natural hives.',
  'This honey is extracted by honeybees that collect nectar from flowers, making it naturally rich in vitamins, especially Vitamin C. It is recommended for healing ulcers, antispasmodic support, sedative effect, and works against insomnia and nervous excitement. Use it to sweeten your tea or coffee. The honey is extracted straight from the hives without applying any heat (cold-extracted). Once extracted, we do not filter the honey and bottle it in raw form.',
  '["This variety of honey is loaded with natural antioxidants that have anti-inflammatory, anti-allergy, anti-carcinogenic and immune boosting properties.","Zinc, boron, manganese, magnesium, calcium, selenium, copper, potassium and sodium are all healthy minerals found in this honey.","It has healing properties, and is an easy and safe choice for a minor wound and burn treatment.","It contains anti-bacterial properties that can be used to fight a range of pathogens. It can soothe a sore throat and treat a cough.","It can help to regulate blood sugar levels, as it is low on the glycemic index.","It can help athletes improve their recovery time due to its ability to help the body maintain its glycogen levels.","It can be paired with other ingredients to make organic beauty products to help moisturise the skin and hair."]',
  '100% Raw, Unfiltered Honey.',
  '[{"step":"01","text":"Use in warm water, tea, or daily spoonful."},{"step":"02","text":"Store in a cool dry place."}]',
  '[{"q":"Why does honey crystallize?","a":"Crystallization is natural and a sign of purity."}]',
  '["honey","500g","raw"]',
  5, 1, NOW(), NOW()
),

-- ── 6. Honey 1kg ────────────────────────────────────────────
(
  'Arion Honey 1KG',
  'arion-honey-1kg',
  'Unfiltered & Unheated',
  'honey',
  '1kg',
  7000.00, 7500.00, 0, 5.0, 167, 1, 0,
  '["1kg"]',
  '{"1kg":7000}',
  '{"1kg":7500}',
  '["/product-images/honey-1kg.png"]',
  '["Organic"]',
  'Cold-extracted, unfiltered raw honey taken directly from natural hives.',
  'This honey is extracted by honeybees that collect nectar from flowers, making it naturally rich in vitamins, especially Vitamin C. It is recommended for healing ulcers, antispasmodic support, sedative effect, and works against insomnia and nervous excitement. Use it to sweeten your tea or coffee. The honey is extracted straight from the hives without applying any heat (cold-extracted). Once extracted, we do not filter the honey and bottle it in raw form.',
  '["Loaded with natural antioxidants with anti-inflammatory, anti-allergy, anti-carcinogenic, and immune-boosting properties.","Contains healthy minerals including zinc, boron, manganese, magnesium, calcium, selenium, copper, potassium, and sodium.","Has healing properties and is an easy and safe choice for minor wound and burn support.","Contains antibacterial properties that can help fight a range of pathogens, soothe sore throat, and treat cough.","Can help regulate blood sugar levels due to a low glycemic index profile.","Can help athletes improve recovery time by supporting the body\'s glycogen levels.","Can be paired with other ingredients to create organic beauty products that help moisturize skin and hair."]',
  '100% Raw, Unfiltered Honey.',
  '[{"step":"01","text":"Use as a natural sweetener in meals and drinks."},{"step":"02","text":"Keep in dry place away from heat."}]',
  '[{"q":"Is this filtered?","a":"Lightly strained only, no heat processing."}]',
  '["honey","1kg","raw"]',
  6, 1, NOW(), NOW()
),

-- ── 7. Goat Ghee 500g ───────────────────────────────────────
(
  'Arion Goat Desi Ghee 500GM',
  'arion-goat-desi-ghee-500gm',
  'Traditional Clarified Butter',
  'ghee',
  '500g',
  3000.00, 3250.00, 0, 5.0, 131, 1, 1,
  '["500g"]',
  '{"500g":3000}',
  '{"500g":3250}',
  '["/product-images/goat-ghee-500g.png"]',
  '["Best Seller","Organic"]',
  'Traditional clarified butter made from goat milk for rich flavor and aroma.',
  'Our Pure Desi Goat Ghee is prepared in small batches using traditional methods for rich aroma, taste, and nutritional quality.',
  '["Naturally rich taste and aroma","Supports everyday cooking","Traditional small-batch quality"]',
  '100% Pure Desi Goat Ghee.',
  '[{"step":"01","text":"Use daily in cooking or with warm milk."},{"step":"02","text":"Store in a cool, dry place."}]',
  '[{"q":"Does this need refrigeration?","a":"No. Keep it at room temperature in a dry place."}]',
  '["ghee","goat","500g","traditional"]',
  3, 1, NOW(), NOW()
),

-- ── 8. Goat Ghee 1kg ────────────────────────────────────────
(
  'Arion Goat Desi Ghee 1KG',
  'arion-goat-desi-ghee-1kg',
  'Traditional Clarified Butter',
  'ghee',
  '1kg',
  6000.00, 6500.00, 0, 5.0, 96, 1, 0,
  '["1kg"]',
  '{"1kg":6000}',
  '{"1kg":6500}',
  '["/product-images/ghee-goat-1kg.png"]',
  '["Pure"]',
  'Family-size goat ghee with rich flavor and traditional quality.',
  'Pure Desi Goat Ghee 1kg is ideal for regular home use with the same traditional quality and aroma.',
  '["Everyday cooking support","Naturally rich flavor","Premium traditional quality"]',
  '100% Pure Desi Goat Ghee.',
  '[{"step":"01","text":"Use in cooking, frying, or as finishing."},{"step":"02","text":"Store at room temperature."}]',
  '[{"q":"Is this the same quality as 500g?","a":"Yes, same quality in larger size."}]',
  '["ghee","goat","1kg","traditional"]',
  4, 1, NOW(), NOW()
),

-- ── 9. Buffalo Ghee 500g ─────────────────────────────────────
(
  'Arion Buffalo Desi Ghee-500GM',
  'arion-buffalo-desi-ghee-500gm',
  'Rich & Premium Clarified Butter',
  'ghee',
  '500g',
  1800.00, 2050.00, 0, 5.0, 142, 1, 1,
  '["500g","1kg"]',
  '{"500g":1800,"1kg":3400}',
  '{"500g":2050,"1kg":3900}',
  '["/product-images/buffalo-ghee-500g.png"]',
  '["Premium Quality","Pure Desi"]',
  'Arion premium creamy white clarified butter derived from healthy, grass-fed buffalo milk.',
  'Our Arion Buffalo Desi Ghee is made using traditional methods to ensure an authentic taste and a thick, granular texture. It is 100% pure, free from harmful trans fats, chemicals, and hydrogenated oils, making it a healthy and nutritious choice for your everyday family meals.',
  '["Rich source of healthy Medium-Chain Triglycerides (MCTs) for immediate physical energy.","High smoke point (250°C), preventing the formation of dangerous free radicals during deep cooking.","Lubricates joints and deeply nourishes internal bodily tissues."]',
  '100% Pure Clarified Buffalo Milk Fat.',
  '[{"step":"01","text":"Perfect for searing traditional Pakistani meats, frying tarkas, or making rich winter halwas."},{"step":"02","text":"Drizzle over freshly baked flatbreads or parathas for an authentic rich flavor depth."},{"step":"03","text":"Store in a cool, dry pantry inside its original glass container; no refrigeration required."}]',
  '[{"q":"What makes Arion Buffalo Ghee different from Cow Ghee?","a":"Arion Buffalo Ghee is creamy-white and features a bolder, richer aroma profile that holds up beautifully in heavy traditional subzis and handis."}]',
  '["ghee","buffalo","500g","arion","pure","traditional"]',
  7, 1, NOW(), NOW()
),

-- ── 10. Buffalo Ghee 1kg ─────────────────────────────────────
(
  'Arion Buffalo Desi Ghee-1KG',
  'arion-buffalo-desi-ghee-1kg',
  'Rich & Premium Clarified Butter',
  'ghee',
  '1kg',
  3400.00, 3900.00, 5, 4.9, 216, 1, 1,
  '["500g","1kg"]',
  '{"500g":1800,"1kg":3400}',
  '{"500g":2050,"1kg":3900}',
  '["/product-images/ghee-buff-1kg.png"]',
  '["Best Value","100% Organic"]',
  'Family-sized 1kg jar of Arion premium clarified butter. Slow-cooked from pure buffalo milk for maximum danedar texture.',
  'Our 1kg pack of Arion Buffalo Ghee is perfect for everyday cooking. Made using traditional methods, it keeps all its natural vitamins and healthy fats. This jar guarantees 100% pure quality and great taste for your family from the very first scoop to the last.',
  '["Provides sustained daily energy without causing rapid blood-glucose spikes.","Contains zero hydrogenated vegetable blends, chemical fillers, or artificial scent additives.","Slow-cooked in small batches to guarantee authentic, historic culinary quality."]',
  '100% Pure Clarified Buffalo Milk Fat.',
  '[{"step":"01","text":"Use as your primary cooking medium for all daily household recipes."},{"step":"02","text":"Always make sure to use a clean, thoroughly dry spoon to keep moisture completely out of the jar."}]',
  '[{"q":"How should I store this 1kg family pack?","a":"Keep it tightly sealed in a dark, cool kitchen cupboard. Keep it away from wet areas to ensure it retains its aroma for up to 12 months."}]',
  '["ghee","buffalo","1kg","arion","family-pack","organic"]',
  8, 1, NOW(), NOW()
);


-- ============================================================
-- TESTIMONIALS
-- ============================================================

INSERT IGNORE INTO `testimonials`
  (`name`, `role`, `avatar`, `rating`, `quote`, `product`, `verified`, `sort_order`, `is_active`, `created_at`, `updated_at`)
VALUES
(
  'Ayesha Malik',
  'Mother of 3, Lahore',
  '/avatar1.png',
  5,
  'Since switching to Arion\'s ghee and honey, I\'ve noticed a real difference in my family\'s health. The quality is unmistakable — you can literally taste the purity. This is the real thing.',
  'Pure Desi Ghee',
  1, 1, 1, NOW(), NOW()
),
(
  'Bilal Chaudhry',
  'Nutritionist, Islamabad',
  '/avatar2.png',
  5,
  'As a nutritionist, I\'m very particular about what I recommend. Arion\'s products are genuinely chemical-free and traditionally sourced. I recommend them to all my clients without hesitation.',
  'Raw Honey 500g',
  1, 2, 1, NOW(), NOW()
),
(
  'Sadia Hussain',
  'Wellness Coach, Karachi',
  '/avatar3.png',
  5,
  'The Shilajit quality is exceptional. I\'ve tried several brands but nothing compares to the purity and potency of Arion\'s product. My energy levels have improved noticeably.',
  'Himalayan Shilajit',
  1, 3, 1, NOW(), NOW()
),
(
  'Usman Tariq',
  'Fitness Trainer, Rawalpindi',
  '',
  5,
  'I switched my clients to Arion Cow Ghee for their cooking and the feedback has been amazing. Pure, clean flavor and absolutely no compromise on quality. Highly recommended for athletes.',
  'Arion Cow Desi Ghee',
  1, 4, 1, NOW(), NOW()
),
(
  'Fatima Zara',
  'Homemaker, Faisalabad',
  '',
  5,
  'The Buffalo Ghee reminds me of the ghee my grandmother used to make. That authentic desi aroma and thick, creamy texture — I haven\'t found anything like it in the market before.',
  'Buffalo Desi Ghee',
  1, 5, 1, NOW(), NOW()
),
(
  'Dr. Kamran Iqbal',
  'General Physician, Lahore',
  '',
  5,
  'Medically, I\'ve started recommending Arion\'s raw honey to patients for immune support and sore throat relief. It is genuinely unheated and unfiltered — which makes all the difference therapeutically.',
  'Arion Honey 500g',
  1, 6, 1, NOW(), NOW()
);


-- ============================================================
-- BLOG POSTS
-- ============================================================

INSERT IGNORE INTO `blog_posts`
  (`title`, `slug`, `excerpt`, `content`, `image`, `author`, `category`,
   `tags`, `is_published`, `published_at`, `sort_order`, `created_at`, `updated_at`)
VALUES
(
  'Shilajit for Daily Energy, Strength, and Recovery',
  'shilajit-energy-strength-recovery',
  'Discover how pure Himalayan shilajit supports stamina, focus, post-work recovery, and long-term wellness when used consistently.',
  '<p>Deep inside the high Himalayan mountains, nature creates one of its most powerful wellness secrets. Shilajit is a natural, dark mineral resin that has been used for thousands of years to boost health. It is not a factory-made supplement; it is a clean, pure gift from the rocks that helps restore your daily energy and strength.</p>

<h2>What is Shilajit and Where Does It Come From?</h2>

<p>When plants and organic matter stay trapped between heavy mountain rocks for centuries, they slowly change due to extreme weather and pressure. The result is a thick, mineral-rich paste that oozes out of the rocks during warm summer months. This raw material is carefully gathered and washed with pure water to create a safe, high-quality health resin.</p>

<blockquote>&#8220;Shilajit is known as the destroyer of weakness. It brings back the natural power and energy that modern life takes away.&#8221;</blockquote>

<h2>Key Health Benefits for Everyday Life</h2>

<ul>
<li><strong>Natural Energy Booster</strong> — Helps your body&#39;s cells produce clean energy so you feel less tired during long work days.</li>
<li><strong>Rich in Minerals</strong> — Contains over 85 natural minerals that are very easy for your body to absorb and use.</li>
<li><strong>Protects Health</strong> — Packed with natural antioxidants (Fulvic Acid) that clean out bad toxins and keep your cells healthy.</li>
<li><strong>Sharpens the Mind</strong> — Supports focus, memory, and clear thinking when you feel mentally exhausted.</li>
<li><strong>Stronger Body</strong> — Helps your muscles recover faster after heavy exercise or physical hard work.</li>
</ul>

<h3>How It Helps Fight Modern Stress</h3>

<p>Modern life keeps us busy, stressed, and tired. Many people turn to energy drinks or too much coffee, which cause sudden crashes later. Shilajit works differently. It works at a deep cellular level to build up steady, long-lasting stamina without making you feel anxious or shaky.</p>

<h2>How to Use Shilajit Properly</h2>

<ol>
<li>Use the small measuring tool to take a tiny, pea-sized piece of the resin.</li>
<li>Drop it into a glass of warm water, warm milk, or green tea.</li>
<li>Stir gently until the resin dissolves completely into the liquid.</li>
<li>Drink it first thing in the morning on an empty stomach for the best results.</li>
<li>Close the jar tightly and store it in a dry place so it does not get hard.</li>
</ol>

<div style="background:rgba(200,160,74,0.1);border-left:4px solid #c8a04a;padding:1rem 1.25rem;border-radius:8px;margin:1.5rem 0;">
<p style="font-weight:700;margin-bottom:0.5rem;">&#10022; Simple Tips for Best Results</p>
<ul>
<li>Be consistent — take your small daily portion every morning rather than taking large amounts once in a while.</li>
<li>Mix it with a small spoon of raw honey if you want to soften its strong, earthy taste.</li>
<li>Avoid using tap water with chlorine; always use clean, filtered warm water.</li>
<li>Drink plenty of water throughout the day to help your body process the natural minerals smoothly.</li>
</ul>
</div>

<h3>How to Know Your Shilajit is Real</h3>

<p>Because Shilajit is highly prized, there are many fake powders and mixed syrups in the market. True, high-grade Shilajit always comes as a thick, shiny resin. It dissolves fully in warm water without leaving any sandy pieces behind, and it has a unique, smoky, mountain-like smell that cannot be copied in a lab.</p>

<div style="background:rgba(192,57,43,0.08);border-left:4px solid #c0392b;padding:1rem 1.25rem;border-radius:8px;margin:1.5rem 0;">
&#9888;&#65039; <strong>Important:</strong> Shilajit is very potent. If you take prescription medications or have high blood pressure, always talk to your doctor before adding it to your morning routine.
</div>

<h2>Conclusion</h2>

<p>You do not need complicated chemical supplements to feel strong and energetic. True health starts with pure, natural foods and ancient mountain wisdom. By adding a small drop of pure Shilajit to your morning routine, you can naturally upgrade your daily stamina, protect your immune system, and keep your mind sharp all day long.</p>',
  'https://images.unsplash.com/photo-1667484423744-f32654ba7f4b?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Arion Wellness Team',
  'shilajit-wellness',
  '["shilajit","energy","recovery","stamina","focus"]',
  1,
  '2026-05-22 00:00:00',
  1,
  NOW(), NOW()
);


-- ============================================================
-- HERO SLIDE (default)
-- ============================================================

INSERT IGNORE INTO `hero_slides`
  (`title`, `subtitle`, `button_text`, `button_link`, `image`, `sort_order`, `is_active`, `created_at`, `updated_at`)
VALUES
(
  'Pure by Nature — Proven by Integrity.',
  'Discover Natural Arion Honey, Ghee, and Shilajit.',
  'Shop Now',
  '/products',
  NULL,
  1, 1, NOW(), NOW()
);

-- ============================================================
-- Done. Verify with:
--   SELECT COUNT(*) FROM products;      -- expect 10
--   SELECT COUNT(*) FROM testimonials;  -- expect 6
--   SELECT COUNT(*) FROM blog_posts;    -- expect 1
--   SELECT COUNT(*) FROM hero_slides;   -- expect 1
-- ============================================================
