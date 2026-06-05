<?php
$conn = new mysqli('localhost', 'root', '', 'organic_food');
if ($conn->connect_error) die('Connection failed: ' . $conn->connect_error);

// Wipe existing products
$conn->query('DELETE FROM products');
$conn->query('ALTER TABLE products AUTO_INCREMENT = 1');
echo "Cleared existing products.\n";

$products = [
    [
        'name'                    => 'Pure Himalayan Shilajit 5GM',
        'slug'                    => 'pure-himalayan-shilajit-5gm',
        'subtitle'                => 'Premium Golden Grade Resin',
        'category'                => 'herbal',
        'size'                    => '5g',
        'price'                   => 1000,
        'original_price'          => 1200,
        'discount'                => 16,
        'rating'                  => 4.9,
        'reviews'                 => 92,
        'stock'                   => 1,
        'featured'                => 0,
        'variants'                => ['5g'],
        'variant_prices'          => ['5g' => 1000],
        'variant_original_prices' => ['5g' => 1200],
        'images'                  => ['/product-images/shilajit 5g.png'],
        'badges'                  => ['Trial Size', 'Pure Product'],
        'short_desc'              => 'Pure, high-altitude gold-grade mineral resin. Perfect trial size for beginners introducing shilajit to their lifestyle.',
        'description'             => 'Sourced from pristine Himalayan mountain ranges, our 5gm Shilajit jar offers the exact same premium quality as our standard size. An excellent choice for individuals looking to experience the profound cellular energy and recovery benefits of ancient organic minerals.',
        'benefits'                => [
            'Supplies trace ionic minerals to counteract everyday physical exhaustion.',
            "Improves your body's natural resilience against environmental stressors.",
            'Authentic resin form ensuring zero fillers, binding powders, or synthetic shortcuts.',
        ],
        'ingredients'             => '100% Pure Purified Shilajit Resin.',
        'how_to_use'              => [
            ['step' => '01', 'text' => 'Dissolve a small grain-sized portion in any warm, non-chlorinated fluid daily.'],
            ['step' => '02', 'text' => 'Always ensure the jar lid is free of sticky residue before closing to keep it easy to open.'],
        ],
        'faqs'                    => [
            ['q' => 'Can this be taken with coffee?', 'a' => 'Yes, dissolving shilajit in your morning coffee is a popular way to mask its earthy taste while enjoying sustained focus.'],
        ],
        'tags'                    => ['shilajit', 'resin', '5g', 'himalayan', 'herbal', 'trial'],
        'sort_order'              => 1,
        'is_active'               => 1,
    ],
    [
        'name'                    => 'Pure Himalayan Shilajit-10GM',
        'slug'                    => 'pure-himalayan-shilajit-10gm',
        'subtitle'                => 'Premium Golden Grade Resin',
        'category'                => 'herbal',
        'size'                    => '10g',
        'price'                   => 2000,
        'original_price'          => 2100,
        'discount'                => 5,
        'rating'                  => 5.0,
        'reviews'                 => 184,
        'stock'                   => 1,
        'featured'                => 1,
        'variants'                => ['10g'],
        'variant_prices'          => ['10g' => 2000],
        'variant_original_prices' => ['10g' => 2100],
        'images'                  => ['/product-images/shilajit 10g.png'],
        'badges'                  => ['Gold Grade', 'Organic'],
        'short_desc'              => 'Pure, gold-grade mineral resin sourced from high-altitude Himalayan peaks, rich in Fulvic acid.',
        'description'             => 'Our Pure Himalayan Shilajit resin is meticulously purified to eliminate impurities while keeping its complex trace mineral profile intact. Extracted from the most pristine high-altitude rock formations, it acts as a premier natural vitality, stamina, and cognitive booster.',
        'benefits'                => [
            'Extremely rich in Fulvic Acid and over 85 essential trace ionic minerals.',
            'Accelerates natural energy levels, cellular ATP production, and daily stamina.',
            'Supports robust immune response, joint health, and sharp mental clarity.',
        ],
        'ingredients'             => '100% Pure Purified Shilajit Resin.',
        'how_to_use'              => [
            ['step' => '01', 'text' => 'Use the included measuring spoon to dissolve a pea-sized portion (approx. 250mg) in warm water, milk, or green tea.'],
            ['step' => '02', 'text' => 'Consume on an empty stomach first thing in the morning for maximum metabolic absorption.'],
            ['step' => '03', 'text' => 'Store tightly sealed in a cool, dry place away from moisture to prevent hardening.'],
        ],
        'faqs'                    => [
            ['q' => 'What makes gold-grade shilajit different?', 'a' => 'Gold-grade shilajit is collected at extreme altitudes (above 16,000 feet), yielding the highest natural concentration of therapeutic nutrients and fulvic minerals.'],
            ['q' => 'How long does a 10g jar last?', 'a' => 'When consumed daily at the recommended pea-sized dosage, a 10gm jar will comfortably last around 35 to 40 days.'],
        ],
        'tags'                    => ['shilajit', 'resin', '10g', 'himalayan', 'herbal', 'vitality'],
        'sort_order'              => 2,
        'is_active'               => 1,
    ],
    [
        'name'                    => 'Arion Cow Desi Ghee 500GM',
        'slug'                    => 'arion-cow-desi-ghee-500gm',
        'subtitle'                => 'Traditional Clarified Butter',
        'category'                => 'ghee',
        'size'                    => '500g',
        'price'                   => 2000,
        'original_price'          => 2250,
        'discount'                => 0,
        'rating'                  => 5.0,
        'reviews'                 => 248,
        'stock'                   => 1,
        'featured'                => 1,
        'variants'                => ['500g'],
        'variant_prices'          => ['500g' => 2000],
        'variant_original_prices' => ['500g' => 2250],
        'images'                  => ['/product-images/cow-ghee-500g.png'],
        'badges'                  => ['Best Seller', 'Organic'],
        'short_desc'              => "High-quality Desi Ghee made from 100% carefully selected cow's milk.",
        'description'             => "We use 100% cow's milk to make our Desi Ghee, very carefully chosen to suit our requirements and fulfill hygiene standards. Once butter is made, it is simmered on a very low flame for several hours with precision and constant monitoring to achieve the desired quality. During this process, milk solids are completely separated.",
        'benefits'                => [
            'Helps increase bile production.',
            'Improve insulin resistance by normalizing blood sugars.',
            'Decrease inflammation.',
            'Increase energy.',
            'Omega 3 Fatty Acids (Healthy Fats).',
            'Omega 9 Fatty Acids (Healthy Fats).',
            'MCT fat (Medium-chain triglycerides).',
            'Vitamin A, D, E and K (Fat-soluble vitamins).',
            'CLA - a healthy fat that helps athlete performance and weight loss.',
            'Antioxidants.',
        ],
        'ingredients'             => '100% Pure Desi Cow Ghee.',
        'how_to_use'              => [
            ['step' => '01', 'text' => 'Use daily in cooking or with warm milk.'],
            ['step' => '02', 'text' => 'Store in a cool, dry place.'],
        ],
        'faqs'                    => [
            ['q' => 'Does this need refrigeration?', 'a' => 'No. Keep it at room temperature in a dry place.'],
        ],
        'tags'                    => ['ghee', 'cow', '500g', 'traditional'],
        'sort_order'              => 3,
        'is_active'               => 1,
    ],
    [
        'name'                    => 'Arion Cow Desi Ghee 1KG',
        'slug'                    => 'arion-cow-desi-ghee-1kg',
        'subtitle'                => 'Traditional Clarified Butter',
        'category'                => 'ghee',
        'size'                    => '1kg',
        'price'                   => 4000,
        'original_price'          => 4500,
        'discount'                => 0,
        'rating'                  => 5.0,
        'reviews'                 => 182,
        'stock'                   => 1,
        'featured'                => 0,
        'variants'                => ['1kg'],
        'variant_prices'          => ['1kg' => 4000],
        'variant_original_prices' => ['1kg' => 4500],
        'images'                  => ['/product-images/ghee-cow-1kg.png'],
        'badges'                  => ['Pure'],
        'short_desc'              => "High-quality Desi Ghee made from 100% carefully selected cow's milk.",
        'description'             => "We use 100% cow's milk to make our Desi Ghee, very carefully chosen to suit our requirements and fulfill hygiene standards. Once butter is made, it is simmered on a very low flame for several hours with precision and constant monitoring to achieve the desired quality. During this process, milk solids are completely separated.",
        'benefits'                => [
            'Helps increase bile production.',
            'Improve insulin resistance by normalizing blood sugars.',
            'Decrease inflammation.',
            'Increase energy.',
            'Omega 3 Fatty Acids (Healthy Fats).',
            'Omega 9 Fatty Acids (Healthy Fats).',
            'MCT fat (Medium-chain triglycerides).',
            'Vitamin A, D, E and K (Fat-soluble vitamins).',
            'CLA - a healthy fat that helps athlete performance and weight loss.',
            'Antioxidants.',
        ],
        'ingredients'             => '100% Pure Desi Cow Ghee.',
        'how_to_use'              => [
            ['step' => '01', 'text' => 'Use in cooking, frying, or as finishing.'],
            ['step' => '02', 'text' => 'Store at room temperature.'],
        ],
        'faqs'                    => [
            ['q' => 'Is this the same quality as 500g?', 'a' => 'Yes, same quality in larger size.'],
        ],
        'tags'                    => ['ghee', 'cow', '1kg', 'a2'],
        'sort_order'              => 4,
        'is_active'               => 1,
    ],
    [
        'name'                    => 'Arion Honey 500GM',
        'slug'                    => 'arion-honey-500gm',
        'subtitle'                => 'Unfiltered & Unheated',
        'category'                => 'honey',
        'size'                    => '500g',
        'price'                   => 3500,
        'original_price'          => 3750,
        'discount'                => 0,
        'rating'                  => 5.0,
        'reviews'                 => 312,
        'stock'                   => 1,
        'featured'                => 1,
        'variants'                => ['500g'],
        'variant_prices'          => ['500g' => 3500],
        'variant_original_prices' => ['500g' => 3750],
        'images'                  => ['/product-images/honey 500 g.png', '/product-images/honey.png'],
        'badges'                  => ['Best Seller', 'Pure'],
        'short_desc'              => 'Cold-extracted, unfiltered raw honey taken directly from natural hives.',
        'description'             => 'This honey is extracted by honeybees that collect nectar from flowers, making it naturally rich in vitamins, especially Vitamin C. It is recommended for healing ulcers, antispasmodic support, sedative effect, and works against insomnia and nervous excitement. The honey is extracted straight from the hives without applying any heat (cold-extracted). Once extracted, we do not filter the honey and bottle it in raw form.',
        'benefits'                => [
            'Loaded with natural antioxidants that have anti-inflammatory, anti-allergy, anti-carcinogenic and immune boosting properties.',
            'Zinc, boron, manganese, magnesium, calcium, selenium, copper, potassium and sodium are all healthy minerals found in this honey.',
            'It has healing properties, and is an easy and safe choice for a minor wound and burn treatment.',
            'It contains anti-bacterial properties that can be used to fight a range of pathogens. It can soothe a sore throat and treat a cough.',
            'It can help to regulate blood sugar levels, as it is low on the glycemic index.',
            'It can help athletes improve their recovery time due to its ability to help the body maintain its glycogen levels.',
            'It can be paired with other ingredients to make organic beauty products to help moisturise the skin and hair.',
        ],
        'ingredients'             => '100% Raw, Unfiltered Honey.',
        'how_to_use'              => [
            ['step' => '01', 'text' => 'Use in warm water, tea, or as a daily spoonful.'],
            ['step' => '02', 'text' => 'Store in a cool dry place.'],
        ],
        'faqs'                    => [
            ['q' => 'Why does honey crystallize?', 'a' => 'Crystallization is natural and a sign of purity.'],
        ],
        'tags'                    => ['honey', '500g', 'raw'],
        'sort_order'              => 5,
        'is_active'               => 1,
    ],
    [
        'name'                    => 'Arion Honey 1KG',
        'slug'                    => 'arion-honey-1kg',
        'subtitle'                => 'Unfiltered & Unheated',
        'category'                => 'honey',
        'size'                    => '1kg',
        'price'                   => 7000,
        'original_price'          => 7500,
        'discount'                => 0,
        'rating'                  => 5.0,
        'reviews'                 => 167,
        'stock'                   => 1,
        'featured'                => 0,
        'variants'                => ['1kg'],
        'variant_prices'          => ['1kg' => 7000],
        'variant_original_prices' => ['1kg' => 7500],
        'images'                  => ['/product-images/honey-1kg.png'],
        'badges'                  => ['Organic'],
        'short_desc'              => 'Cold-extracted, unfiltered raw honey taken directly from natural hives.',
        'description'             => 'This honey is extracted by honeybees that collect nectar from flowers, making it naturally rich in vitamins, especially Vitamin C. It is recommended for healing ulcers, antispasmodic support, sedative effect, and works against insomnia and nervous excitement. The honey is extracted straight from the hives without applying any heat (cold-extracted). Once extracted, we do not filter the honey and bottle it in raw form.',
        'benefits'                => [
            'Loaded with natural antioxidants with anti-inflammatory, anti-allergy, anti-carcinogenic, and immune-boosting properties.',
            'Contains healthy minerals including zinc, boron, manganese, magnesium, calcium, selenium, copper, potassium, and sodium.',
            'Has healing properties and is an easy and safe choice for minor wound and burn support.',
            'Contains antibacterial properties that can help fight a range of pathogens, soothe sore throat, and treat cough.',
            'Can help regulate blood sugar levels due to a low glycemic index profile.',
            'Can help athletes improve recovery time by supporting the body glycogen levels.',
            'Can be paired with other ingredients to create organic beauty products that help moisturize skin and hair.',
        ],
        'ingredients'             => '100% Raw, Unfiltered Honey.',
        'how_to_use'              => [
            ['step' => '01', 'text' => 'Use as a natural sweetener in meals and drinks.'],
            ['step' => '02', 'text' => 'Keep in dry place away from heat.'],
        ],
        'faqs'                    => [
            ['q' => 'Is this filtered?', 'a' => 'Lightly strained only, no heat processing.'],
        ],
        'tags'                    => ['honey', '1kg', 'raw'],
        'sort_order'              => 6,
        'is_active'               => 1,
    ],
    [
        'name'                    => 'Arion Goat Desi Ghee 500GM',
        'slug'                    => 'arion-goat-desi-ghee-500gm',
        'subtitle'                => 'Traditional Clarified Butter',
        'category'                => 'ghee',
        'size'                    => '500g',
        'price'                   => 3000,
        'original_price'          => 3250,
        'discount'                => 0,
        'rating'                  => 5.0,
        'reviews'                 => 131,
        'stock'                   => 1,
        'featured'                => 1,
        'variants'                => ['500g'],
        'variant_prices'          => ['500g' => 3000],
        'variant_original_prices' => ['500g' => 3250],
        'images'                  => ['/product-images/goat-ghee-500g.png'],
        'badges'                  => ['Best Seller', 'Organic'],
        'short_desc'              => 'Traditional clarified butter made from goat milk for rich flavor and aroma.',
        'description'             => 'Our Pure Desi Goat Ghee is prepared in small batches using traditional methods for rich aroma, taste, and nutritional quality.',
        'benefits'                => [
            'Naturally rich taste and aroma.',
            'Supports everyday cooking.',
            'Traditional small-batch quality.',
        ],
        'ingredients'             => '100% Pure Desi Goat Ghee.',
        'how_to_use'              => [
            ['step' => '01', 'text' => 'Use daily in cooking or with warm milk.'],
            ['step' => '02', 'text' => 'Store in a cool, dry place.'],
        ],
        'faqs'                    => [
            ['q' => 'Does this need refrigeration?', 'a' => 'No. Keep it at room temperature in a dry place.'],
        ],
        'tags'                    => ['ghee', 'goat', '500g', 'traditional'],
        'sort_order'              => 7,
        'is_active'               => 1,
    ],
    [
        'name'                    => 'Arion Goat Desi Ghee 1KG',
        'slug'                    => 'arion-goat-desi-ghee-1kg',
        'subtitle'                => 'Traditional Clarified Butter',
        'category'                => 'ghee',
        'size'                    => '1kg',
        'price'                   => 6000,
        'original_price'          => 6500,
        'discount'                => 0,
        'rating'                  => 5.0,
        'reviews'                 => 96,
        'stock'                   => 1,
        'featured'                => 0,
        'variants'                => ['1kg'],
        'variant_prices'          => ['1kg' => 6000],
        'variant_original_prices' => ['1kg' => 6500],
        'images'                  => ['/product-images/ghee-goat-1kg.png'],
        'badges'                  => ['Pure'],
        'short_desc'              => 'Family-size goat ghee with rich flavor and traditional quality.',
        'description'             => 'Pure Desi Goat Ghee 1kg is ideal for regular home use with the same traditional quality and aroma.',
        'benefits'                => [
            'Everyday cooking support.',
            'Naturally rich flavor.',
            'Premium traditional quality.',
        ],
        'ingredients'             => '100% Pure Desi Goat Ghee.',
        'how_to_use'              => [
            ['step' => '01', 'text' => 'Use in cooking, frying, or as finishing.'],
            ['step' => '02', 'text' => 'Store at room temperature.'],
        ],
        'faqs'                    => [
            ['q' => 'Is this the same quality as 500g?', 'a' => 'Yes, same quality in larger size.'],
        ],
        'tags'                    => ['ghee', 'goat', '1kg', 'traditional'],
        'sort_order'              => 8,
        'is_active'               => 1,
    ],
    [
        'name'                    => 'Arion Buffalo Desi Ghee 500GM',
        'slug'                    => 'arion-buffalo-desi-ghee-500gm',
        'subtitle'                => 'Rich & Premium Clarified Butter',
        'category'                => 'ghee',
        'size'                    => '500g',
        'price'                   => 1800,
        'original_price'          => 2050,
        'discount'                => 0,
        'rating'                  => 5.0,
        'reviews'                 => 142,
        'stock'                   => 1,
        'featured'                => 1,
        'variants'                => ['500g', '1kg'],
        'variant_prices'          => ['500g' => 1800, '1kg' => 3400],
        'variant_original_prices' => ['500g' => 2050, '1kg' => 3900],
        'images'                  => ['/product-images/buffalo-ghee-500g.png'],
        'badges'                  => ['Premium Quality', 'Pure Desi'],
        'short_desc'              => 'Arion premium creamy white clarified butter derived from healthy, grass-fed buffalo milk.',
        'description'             => 'Our Arion Buffalo Desi Ghee is made using traditional methods to ensure an authentic taste and a thick, granular texture. It is 100% pure, free from harmful trans fats, chemicals, and hydrogenated oils, making it a healthy and nutritious choice for your everyday family meals.',
        'benefits'                => [
            'Rich source of healthy Medium-Chain Triglycerides (MCTs) for immediate physical energy.',
            'High smoke point (250 C), preventing the formation of dangerous free radicals during deep cooking.',
            'Lubricates joints and deeply nourishes internal bodily tissues.',
        ],
        'ingredients'             => '100% Pure Clarified Buffalo Milk Fat.',
        'how_to_use'              => [
            ['step' => '01', 'text' => 'Perfect for searing traditional Pakistani meats, frying tarkas, or making rich winter halwas.'],
            ['step' => '02', 'text' => 'Drizzle over freshly baked flatbreads or parathas for an authentic rich flavor depth.'],
            ['step' => '03', 'text' => 'Store in a cool, dry pantry inside its original glass container; no refrigeration required.'],
        ],
        'faqs'                    => [
            ['q' => 'What makes Arion Buffalo Ghee different from Cow Ghee?', 'a' => 'Arion Buffalo Ghee is creamy-white and features a bolder, richer aroma profile that holds up beautifully in heavy traditional subzis and handis.'],
        ],
        'tags'                    => ['ghee', 'buffalo', '500g', 'arion', 'pure', 'traditional'],
        'sort_order'              => 9,
        'is_active'               => 1,
    ],
    [
        'name'                    => 'Arion Buffalo Desi Ghee 1KG',
        'slug'                    => 'arion-buffalo-desi-ghee-1kg',
        'subtitle'                => 'Rich & Premium Clarified Butter',
        'category'                => 'ghee',
        'size'                    => '1kg',
        'price'                   => 3400,
        'original_price'          => 3900,
        'discount'                => 5,
        'rating'                  => 4.9,
        'reviews'                 => 216,
        'stock'                   => 1,
        'featured'                => 1,
        'variants'                => ['500g', '1kg'],
        'variant_prices'          => ['500g' => 1800, '1kg' => 3400],
        'variant_original_prices' => ['500g' => 2050, '1kg' => 3900],
        'images'                  => ['/product-images/ghee-buff-1kg.png'],
        'badges'                  => ['Best Value', '100% Organic'],
        'short_desc'              => 'Family-sized 1kg jar of Arion premium clarified butter. Slow-cooked from pure buffalo milk for maximum danedar texture.',
        'description'             => 'Our 1kg pack of Arion Buffalo Ghee is perfect for everyday cooking. Made using traditional methods, it keeps all its natural vitamins and healthy fats. This jar guarantees 100% pure quality and great taste for your family from the very first scoop to the last.',
        'benefits'                => [
            'Provides sustained daily energy without causing rapid blood-glucose spikes.',
            'Contains zero hydrogenated vegetable blends, chemical fillers, or artificial scent additives.',
            'Slow-cooked in small batches to guarantee authentic, historic culinary quality.',
        ],
        'ingredients'             => '100% Pure Clarified Buffalo Milk Fat.',
        'how_to_use'              => [
            ['step' => '01', 'text' => 'Use as your primary cooking medium for all daily household recipes.'],
            ['step' => '02', 'text' => 'Always make sure to use a clean, thoroughly dry spoon to keep moisture completely out of the jar.'],
        ],
        'faqs'                    => [
            ['q' => 'How should I store this 1kg family pack?', 'a' => 'Keep it tightly sealed in a dark, cool kitchen cupboard. Keep it away from wet areas to ensure it retains its aroma for up to 12 months.'],
        ],
        'tags'                    => ['ghee', 'buffalo', '1kg', 'arion', 'family-pack', 'organic'],
        'sort_order'              => 10,
        'is_active'               => 1,
    ],
];

$inserted = 0;

foreach ($products as $p) {
    $e = fn($v) => $conn->real_escape_string($v);

    $name    = $e($p['name']);
    $slug    = $e($p['slug']);
    $sub     = $e($p['subtitle']);
    $cat     = $e($p['category']);
    $size    = $e($p['size']);
    $price   = (float) $p['price'];
    $orig    = (float) $p['original_price'];
    $disc    = (int) $p['discount'];
    $rating  = (float) $p['rating'];
    $reviews = (int) $p['reviews'];
    $stock   = (int) $p['stock'];
    $feat    = (int) $p['featured'];
    $vars    = $e(json_encode($p['variants']));
    $vp      = $e(json_encode($p['variant_prices']));
    $vop     = $e(json_encode($p['variant_original_prices']));
    $images  = $e(json_encode($p['images']));
    $badges  = $e(json_encode($p['badges']));
    $sdesc   = $e($p['short_desc']);
    $desc    = $e($p['description']);
    $bens    = $e(json_encode($p['benefits']));
    $ing     = $e($p['ingredients']);
    $htu     = $e(json_encode($p['how_to_use']));
    $faqs    = $e(json_encode($p['faqs']));
    $tags    = $e(json_encode($p['tags']));
    $order   = (int) $p['sort_order'];
    $active  = (int) $p['is_active'];

    $sql = "INSERT INTO products
        (name, slug, subtitle, category, size, price, original_price, discount, rating, reviews,
         stock, featured, variants, variant_prices, variant_original_prices, images, badges,
         short_desc, description, benefits, ingredients, how_to_use, faqs, tags, sort_order, is_active)
        VALUES
        ('$name','$slug','$sub','$cat','$size',$price,$orig,$disc,$rating,$reviews,
         $stock,$feat,'$vars','$vp','$vop','$images','$badges',
         '$sdesc','$desc','$bens','$ing','$htu','$faqs','$tags',$order,$active)";

    if ($conn->query($sql)) {
        $inserted++;
        echo "Inserted: {$p['name']}\n";
    } else {
        echo "Error on {$p['name']}: " . $conn->error . "\n";
    }
}

echo "\nDone. Inserted $inserted / " . count($products) . " products.\n";
$conn->close();
