<?php
/**
 * Frontend SPA Router
 * Routes all requests to the React dist/index.html for client-side routing
 */

// Check if it's an API request
if (strpos($_SERVER['REQUEST_URI'], '/api/') === 0 || strpos($_SERVER['REQUEST_URI'], '/backend/') === 0) {
    // Let backend handle API requests
    require_once __DIR__ . '/backend/index.php';
    exit;
}

// Check if it's an admin request
if (strpos($_SERVER['REQUEST_URI'], '/admin') === 0) {
    // Route to admin/dist/index.html
    $adminIndex = __DIR__ . '/admin/dist/index.html';
    if (file_exists($adminIndex)) {
        include $adminIndex;
    } else {
        http_response_code(404);
        echo "Admin panel not found. Make sure to run: npm run build inside the admin directory.";
    }
    exit;
}

// Check if it's a static file
$requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (preg_match('/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|map)$/', $requestPath)) {
    // Let the web server serve static files
    return false;
}

// Route everything else to frontend
$frontendIndex = __DIR__ . '/dist/index.html';
if (file_exists($frontendIndex)) {
    include $frontendIndex;
} else {
    http_response_code(404);
    echo "Frontend not found. Make sure to run: npm run build";
}
?>
