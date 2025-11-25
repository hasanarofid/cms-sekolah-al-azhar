<?php
/**
 * Router script untuk PHP built-in server
 * File ini digunakan untuk route semua request ke index.php
 * Kecuali untuk static files yang benar-benar ada
 */

$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);

// Jika request untuk static file yang benar-benar ada, serve langsung
$filePath = __DIR__ . $path;
if ($path !== '/' && $path !== '' && file_exists($filePath) && is_file($filePath)) {
    // Serve static file langsung melalui index.php handler
    // Karena index.php sudah punya handler untuk static files dengan CORS
    require __DIR__ . '/index.php';
    return true;
}

// Untuk semua request lainnya (API endpoints, dll), route ke index.php
if (file_exists(__DIR__ . '/index.php')) {
    require __DIR__ . '/index.php';
} else {
    http_response_code(404);
    header('Content-Type: text/plain');
    echo "Not Found";
}

