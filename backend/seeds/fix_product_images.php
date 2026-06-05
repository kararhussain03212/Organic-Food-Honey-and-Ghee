<?php
$conn = new mysqli('localhost', 'root', '', 'organic_food');
if ($conn->connect_error) die('Connection failed: ' . $conn->connect_error);

// Map product slugs to their image files
$imageMap = [
    'pure-himalayan-shilajit-5gm' => ['/product-images/shilajit 5g.png'],
    'pure-himalayan-shilajit-10gm' => ['/product-images/shilajit 10g.png'],
    'arion-cow-desi-ghee-500gm' => ['/product-images/cow-ghee-500g.png'],
    'arion-cow-desi-ghee-1kg' => ['/product-images/ghee-cow-1kg.png'],
    'arion-honey-500gm' => ['/product-images/honey 500 g.png', '/product-images/honey.png'],
    'arion-honey-1kg' => ['/product-images/honey-1kg.png'],
    'arion-goat-desi-ghee-500gm' => ['/product-images/goat-ghee-500g.png'],
    'arion-goat-desi-ghee-1kg' => ['/product-images/ghee-goat-1kg.png'],
    'arion-buffalo-desi-ghee-500gm' => ['/product-images/buffalo-ghee-500g.png'],
    'arion-buffalo-desi-ghee-1kg' => ['/product-images/ghee-buff-1kg.png'],
];

$updated = 0;
foreach ($imageMap as $slug => $images) {
    $imagesJson = json_encode($images);
    $stmt = $conn->prepare('UPDATE products SET images = ? WHERE slug = ?');
    $stmt->bind_param('ss', $imagesJson, $slug);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo "Updated: $slug\n";
            $updated++;
        }
    } else {
        echo "Error updating $slug: " . $stmt->error . "\n";
    }
}

echo "\nSuccessfully updated $updated products with correct images.";
$conn->close();
