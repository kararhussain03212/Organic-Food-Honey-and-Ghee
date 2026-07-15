<?php

declare(strict_types=1);

// Seed the Partner With Us page content and team members with the exact copy
// that was previously hardcoded in src/pages/Career.jsx.

require_once __DIR__ . '/../config/database.php';

use Backend\Config\Database;

$pdo = Database::connection();

// ── partner_page_settings (singleton, id = 1) ─────────────────────
$exists = $pdo->query('SELECT COUNT(*) FROM partner_page_settings')->fetchColumn();
if ((int) $exists > 0) {
    echo "partner_page_settings already seeded. Skipping.\n";
} else {
    $stmt = $pdo->prepare(
        'INSERT INTO partner_page_settings
          (id, hero_badge, hero_heading, hero_heading_accent, hero_description,
           program_badge, program_heading, program_subheading, who_its_for,
           how_it_works, what_you_get, form_title, applicant_types,
           team_badge, team_heading, team_subheading)
         VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        '✦ Join the Movement',
        'Join the',
        'Arion Family',
        "We're building more than a brand — a trusted name in natural wellness across Pakistan. If you believe in purity, honesty, and healthier living, there's a place for you here.",
        'Arion Affiliate Program',
        'Partner with Us',
        "Earn by sharing products you'd recommend to your own family.",
        'Resellers, wellness advocates, Teachers, fitness coaches, and social influencers who want to earn while promoting authentic, naturally sourced products.',
        json_encode([
            ['label' => 'Apply', 'description' => 'Fill the form with your details.'],
            ['label' => 'Get onboarded', 'description' => 'We share your unique code, product info, and marketing material.'],
            ['label' => 'Start earning', 'description' => 'Earn commission on every sale through your reference or link.'],
        ], JSON_UNESCAPED_UNICODE),
        json_encode([
            'Competitive commission per sale',
            'Marketing materials and product photos',
            'Priority WhatsApp support from our team',
            'Early access to new products',
            'Monthly payouts, no minimum sales pressure',
        ], JSON_UNESCAPED_UNICODE),
        'Apply Now',
        json_encode(['Individual', 'Reseller', 'Influencer', 'Fitness/Wellness Coach'], JSON_UNESCAPED_UNICODE),
        'Meet Our Team',
        'Talk to a Real Person, Not a Bot',
        'Our regional sales agents are here to help you order, ask questions, or set up bulk/reseller purchases — directly on WhatsApp.',
    ]);
    echo "Seeded partner_page_settings.\n";
}

// ── team_members ───────────────────────────────────────────────────
$exists = $pdo->query('SELECT COUNT(*) FROM team_members')->fetchColumn();
if ((int) $exists > 0) {
    echo "team_members already seeded. Skipping.\n";
} else {
    // Placeholder WhatsApp numbers — to be replaced with real per-person numbers via admin.
    $members = [
        ['Azam Muhammad', 'Gilgit Baltistan', 'Here to help you find the right product for your family.', '+923425551234'],
        ['Dr. Iftikhar', 'Dubai, UAE', 'Your trusted wellness partner in the Gulf.', '+971501234567'],
        ['Wasif Abbas', 'Khyber Pakhtunkhwa', 'Bringing pure products to KPK families.', '+923115551234'],
        ['Zahir Abbas', 'Khyber Pakhtunkhwa', 'Quality wellness, delivered to your doorstep.', '+923335551234'],
        ['Ismail', 'Islamabad', "Connect with Arion's trusted representative.", '+923005551234'],
        ['Punjabi Saeed', 'Punjab', 'Serving Punjab with authentic, natural products.', '+923215551234'],
    ];

    $stmt = $pdo->prepare(
        'INSERT INTO team_members (name, region, quote, photo, whatsapp_number, sort_order, is_active)
         VALUES (?, ?, ?, NULL, ?, ?, 1)'
    );
    foreach ($members as $i => [$name, $region, $quote, $whatsapp]) {
        $stmt->execute([$name, $region, $quote, $whatsapp, $i + 1]);
    }
    echo 'Seeded ' . count($members) . " team_members.\n";
}

echo "Done.\n";
