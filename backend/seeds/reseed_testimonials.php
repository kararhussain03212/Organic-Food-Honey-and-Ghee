<?php
$conn = new mysqli('localhost', 'root', '', 'organic_food');
if ($conn->connect_error) die('Connection failed: ' . $conn->connect_error);

// Clear existing testimonials
$conn->query('DELETE FROM testimonials');
echo "Cleared existing testimonials.\n";

// Insert testimonials from component
$testimonials = [
    [
        'name' => 'Ayesha Malik',
        'role' => 'Mother of 3, Lahore',
        'avatar' => '/avatar1.png',
        'rating' => 5,
        'quote' => "Since switching to Arion's ghee and honey, I've noticed a real difference in my family's health. The quality is unmistakable — you can literally taste the purity. This is the real thing.",
        'product' => 'Pure Desi Ghee',
        'verified' => 1,
        'sort_order' => 1,
        'is_active' => 1,
    ],
    [
        'name' => 'Bilal Chaudhry',
        'role' => 'Nutritionist, Islamabad',
        'avatar' => '/avatar2.png',
        'rating' => 5,
        'quote' => "As a nutritionist, I'm very particular about what I recommend. Arion's products are genuinely chemical-free and traditionally sourced. I recommend them to all my clients without hesitation.",
        'product' => 'Raw Honey 500g',
        'verified' => 1,
        'sort_order' => 2,
        'is_active' => 1,
    ],
    [
        'name' => 'Sadia Hussain',
        'role' => 'Wellness Coach, Karachi',
        'avatar' => '/avatar3.png',
        'rating' => 5,
        'quote' => "The Shilajit has been life-changing for my energy levels. And the packaging tells you everything — premium, careful, and respectful of the product inside. I'm a loyal customer for life.",
        'product' => 'Himalayan Shilajit',
        'verified' => 1,
        'sort_order' => 3,
        'is_active' => 1,
    ],
    [
        'name' => 'Usman Tariq',
        'role' => 'Chef & Food Blogger',
        'avatar' => '/avatar2.png',
        'rating' => 5,
        'quote' => "I use Arion ghee in my restaurant. Customers always ask what makes the food taste so rich and wholesome. The answer is always the same — quality ingredients from quality people.",
        'product' => 'Premium Ghee',
        'verified' => 1,
        'sort_order' => 4,
        'is_active' => 1,
    ],
];

$inserted = 0;
foreach ($testimonials as $t) {
    $stmt = $conn->prepare('INSERT INTO testimonials (name, role, avatar, rating, quote, product, verified, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');

    $stmt->bind_param(
        'sssissiii',
        $t['name'], $t['role'], $t['avatar'], $t['rating'], $t['quote'],
        $t['product'], $t['verified'], $t['sort_order'], $t['is_active']
    );

    if ($stmt->execute()) {
        $inserted++;
    } else {
        echo "Error inserting testimonial: " . $stmt->error . "\n";
    }
}

echo "Successfully inserted $inserted testimonials into the database.";
$conn->close();
