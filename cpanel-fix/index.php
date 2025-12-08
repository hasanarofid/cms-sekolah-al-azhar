<?php
/**
 * Main Entry Point
 * Route semua request ke endpoint yang sesuai
 */

// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors to users
ini_set('log_errors', 1);

require_once __DIR__ . '/../vendor/autoload.php';

// Load environment variables
require_once __DIR__ . '/../config/load-env.php';

// Load config
require_once __DIR__ . '/../config/config.php';

// Autoload classes
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/../src/';
    
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }
    
    $relativeClass = substr($class, $len);
    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';
    
    if (file_exists($file)) {
        require $file;
    }
});

// CORS Headers - Set early before any output
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept');
header('Access-Control-Max-Age: 86400');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get request path
$requestUri = $_SERVER['REQUEST_URI'];
$scriptName = $_SERVER['SCRIPT_NAME'];

// Parse path from request URI
$path = parse_url($requestUri, PHP_URL_PATH);

// Check if request is for a static file (uploads, images, etc.)
// Serve static files directly if they exist
// IMPORTANT: Check BEFORE any path manipulation
if (preg_match('#^/uploads/#', $path)) {
    // __DIR__ is /path/to/php-backend/public
    // $path is /uploads/sliders/image.png
    // Full path: /path/to/php-backend/public/uploads/sliders/image.png
    $filePath = __DIR__ . $path;
    
    // Debug logging (remove in production)
    if (getenv('APP_DEBUG') === 'true') {
        error_log("Static file request: " . $path);
        error_log("Full file path: " . $filePath);
        error_log("File exists: " . (file_exists($filePath) ? 'YES' : 'NO'));
    }
    
    if (file_exists($filePath) && is_file($filePath)) {
        // Determine MIME type
        $mimeType = mime_content_type($filePath);
        if (!$mimeType || $mimeType === 'application/octet-stream') {
            $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
            $mimeTypes = [
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
                'webp' => 'image/webp',
                'pdf' => 'application/pdf',
                'css' => 'text/css',
                'js' => 'application/javascript',
                'mp4' => 'video/mp4',
                'webm' => 'video/webm',
                'ogg' => 'video/ogg',
                'ogv' => 'video/ogg',
                'mov' => 'video/quicktime',
                'avi' => 'video/x-msvideo',
            ];
            $mimeType = $mimeTypes[$ext] ?? 'application/octet-stream';
        }
        
        // Set headers and serve file
        header('Content-Type: ' . $mimeType);
        header('Content-Length: ' . filesize($filePath));
        header('Cache-Control: public, max-age=31536000'); // Cache for 1 year
        
        // CORS headers untuk static files (images, videos, etc)
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        if ($origin && in_array($origin, ALLOWED_ORIGINS)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        } else {
            // Untuk static files, izinkan semua origin
            header('Access-Control-Allow-Origin: *');
        }
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        header('Access-Control-Max-Age: 86400');
        header('Cross-Origin-Resource-Policy: cross-origin');
        
        readfile($filePath);
        exit;
    } else {
        // File not found - log for debugging
        if (getenv('APP_DEBUG') === 'true') {
            error_log("Static file NOT FOUND: " . $filePath);
        }
    }
}

// Remove script directory from path
$scriptDir = dirname($scriptName);
if ($scriptDir !== '/' && $scriptDir !== '.' && $scriptDir !== '\\') {
    // Remove script directory from path if it exists
    if (strpos($path, $scriptDir) === 0) {
        $path = substr($path, strlen($scriptDir));
    }
}

// Also remove /public if it exists in path (when accessed through root index.php)
if (strpos($path, '/public') === 0) {
    $path = substr($path, 7); // Remove '/public'
}

// Clean path
$path = trim($path, '/');

// Debug: log path untuk troubleshooting (hapus di production)
if (getenv('APP_DEBUG') === 'true') {
    error_log("Request path: " . $path);
    error_log("Request URI: " . $requestUri);
    error_log("Script name: " . $scriptName);
}

// Handle PUT/DELETE methods via POST with _method parameter
$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'POST' && isset($_POST['_method'])) {
    $method = strtoupper($_POST['_method']);
}

// Route mapping
$routes = [
    // Root - Info & Database Status
    '' => 'InfoController@index',
    'api/info' => 'InfoController@index',
    
    // Auth
    'api/auth/login' => 'AuthController@login',
    'api/auth/session' => 'AuthController@session',
    
    // Admin - Categories
    'api/admin/categories' => 'CategoryController@index',
    'api/admin/categories/create' => 'CategoryController@create',
    'api/admin/categories/([a-zA-Z0-9]+)' => 'CategoryController@show',
    'api/admin/categories/([a-zA-Z0-9]+)/update' => 'CategoryController@update',
    'api/admin/categories/([a-zA-Z0-9]+)/delete' => 'CategoryController@delete',
    
    // Admin - Posts
    'api/admin/posts' => 'PostController@index',
    'api/admin/posts/create' => 'PostController@create',
    'api/admin/posts/([a-zA-Z0-9]+)' => 'PostController@show',
    'api/admin/posts/([a-zA-Z0-9]+)/update' => 'PostController@update',
    'api/admin/posts/([a-zA-Z0-9]+)/delete' => 'PostController@delete',
    
    // Admin - Pages
    'api/admin/pages' => 'PageController@index',
    'api/admin/pages/create' => 'PageController@create',
    'api/admin/pages/([a-zA-Z0-9]+)' => 'PageController@show',
    'api/admin/pages/([a-zA-Z0-9]+)/update' => 'PageController@update',
    'api/admin/pages/([a-zA-Z0-9]+)/delete' => 'PageController@delete',
    'api/admin/pages/([a-zA-Z0-9_-]+)/blocks' => 'PageBlockController@index',
    'api/admin/pages/([a-zA-Z0-9_-]+)/blocks/create' => 'PageBlockController@create',
    // More flexible route for block IDs (must come before specific route) - support alphanumeric, dash, underscore
    'api/admin/pages/([a-zA-Z0-9_-]+)/blocks/([a-zA-Z0-9_-]+)' => 'PageBlockController@show', // GET untuk show, PUT untuk update, DELETE untuk delete - flexible ID matching
    
    // Admin - Page Hero
    'api/admin/pages/([a-zA-Z0-9_-]+)/hero' => 'PageHeroController@index', // GET untuk list all heroes
    'api/admin/pages/([a-zA-Z0-9_-]+)/hero/create' => 'PageHeroController@create', // POST untuk create
    'api/admin/page-heroes/([a-zA-Z0-9_-]+)' => 'PageHeroController@show', // GET untuk show, PUT untuk update, DELETE untuk delete
    'api/admin/page-heroes/([a-zA-Z0-9_-]+)/update' => 'PageHeroController@update',
    'api/admin/page-heroes/([a-zA-Z0-9_-]+)/delete' => 'PageHeroController@delete',
    
    // Admin - Page Sections
    'api/admin/pages/([a-zA-Z0-9_-]+)/sections' => 'PageSectionController@index', // GET untuk list
    'api/admin/pages/([a-zA-Z0-9_-]+)/sections/create' => 'PageSectionController@create', // POST untuk create
    'api/admin/page-sections/([a-zA-Z0-9_-]+)' => 'PageSectionController@show', // GET untuk show, PUT untuk update, DELETE untuk delete
    'api/admin/page-sections/([a-zA-Z0-9_-]+)/update' => 'PageSectionController@update',
    'api/admin/page-sections/([a-zA-Z0-9_-]+)/delete' => 'PageSectionController@delete',
    
    // Admin - Page Blocks (alternative route)
    'api/admin/page-blocks' => 'PageBlockController@all',
    'api/admin/page-blocks/([a-zA-Z0-9]+)' => 'PageBlockController@show',
    'api/admin/page-blocks/([a-zA-Z0-9]+)/update' => 'PageBlockController@update',
    'api/admin/page-blocks/([a-zA-Z0-9]+)/delete' => 'PageBlockController@delete',
    
    // Admin - Menus
    'api/admin/menus' => 'MenuController@index',
    'api/admin/menus/create' => 'MenuController@create',
    'api/admin/menus/([a-zA-Z0-9]+)' => 'MenuController@show',
    'api/admin/menus/([a-zA-Z0-9]+)/update' => 'MenuController@update',
    'api/admin/menus/([a-zA-Z0-9]+)/delete' => 'MenuController@delete',
    
    // Admin - Sliders
    'api/admin/sliders' => 'SliderController@index',
    'api/admin/sliders/create' => 'SliderController@create',
    'api/admin/sliders/([a-zA-Z0-9]+)' => 'SliderController@show', // GET untuk show, PUT untuk update, DELETE untuk delete
    'api/admin/sliders/([a-zA-Z0-9]+)/update' => 'SliderController@update', // Fallback untuk POST dengan _method
    'api/admin/sliders/([a-zA-Z0-9]+)/delete' => 'SliderController@delete', // Fallback untuk POST dengan _method
    
    // Admin - FAQs
    'api/admin/faqs' => 'FAQController@index',
    'api/admin/faqs/create' => 'FAQController@create',
    'api/admin/faqs/([a-zA-Z0-9]+)' => 'FAQController@show',
    'api/admin/faqs/([a-zA-Z0-9]+)/update' => 'FAQController@update',
    'api/admin/faqs/([a-zA-Z0-9]+)/delete' => 'FAQController@delete',
    
    // Admin - Figures
    'api/admin/figures' => 'FigureController@index',
    'api/admin/figures/create' => 'FigureController@create',
    'api/admin/figures/([a-zA-Z0-9]+)' => 'FigureController@show',
    'api/admin/figures/([a-zA-Z0-9]+)/update' => 'FigureController@update',
    'api/admin/figures/([a-zA-Z0-9]+)/delete' => 'FigureController@delete',
    
    // Admin - Home Sections
    'api/admin/home-sections' => 'HomeSectionController@index',
    'api/admin/home-sections/create' => 'HomeSectionController@create',
    'api/admin/home-sections/([a-zA-Z0-9_-]+)' => 'HomeSectionController@show', // GET untuk show, PUT untuk update, DELETE untuk delete
    'api/admin/home-sections/([a-zA-Z0-9_-]+)/update' => 'HomeSectionController@update',
    'api/admin/home-sections/([a-zA-Z0-9]+)/delete' => 'HomeSectionController@delete',
    
    // Admin - Partnerships
    'api/admin/partnerships' => 'PartnershipController@index',
    'api/admin/partnerships/create' => 'PartnershipController@create',
    'api/admin/partnerships/([a-zA-Z0-9]+)' => 'PartnershipController@show',
    'api/admin/partnerships/([a-zA-Z0-9]+)/update' => 'PartnershipController@update',
    'api/admin/partnerships/([a-zA-Z0-9]+)/delete' => 'PartnershipController@delete',
    
    // Admin - Settings
    'api/admin/settings' => 'SettingController@index',
    'api/admin/settings/create' => 'SettingController@create',
    'api/admin/settings/([a-zA-Z0-9_-]+)' => 'SettingController@show',
    'api/admin/settings/([a-zA-Z0-9_-]+)/update' => 'SettingController@update',
    
    // Admin - SEO
    'api/admin/seo' => 'SEOController@index',
    'api/admin/seo/create' => 'SEOController@create',
    'api/admin/seo/([a-zA-Z0-9_-]+)' => 'SEOController@show',
    'api/admin/seo/([a-zA-Z0-9_-]+)/update' => 'SEOController@update',
    'api/admin/seo/([a-zA-Z0-9_-]+)/delete' => 'SEOController@delete',
    
    // Admin - Upload
    'api/admin/upload' => 'UploadController@upload',
    
    // Admin - Contacts
    'api/admin/contacts' => 'ContactController@index',
    'api/admin/contacts/([a-zA-Z0-9]+)/read' => 'ContactController@markAsRead',
    'api/admin/contacts/([a-zA-Z0-9]+)/delete' => 'ContactController@delete',
    
    // Public - Contact
    'api/contact' => 'ContactController@create',
];

// Find matching route
$matched = false;
foreach ($routes as $pattern => $handler) {
    // For exact matches (no placeholders), use simple string comparison
    if (strpos($pattern, '(') === false) {
        if ($path === $pattern) {
            $matches = [];
        } else {
            continue;
        }
    } else {
        // Convert route pattern to regex
        // Replace (xxx) with regex capture groups
        $regex = '#^' . preg_replace('/\([^)]+\)/', '([^/]+)', $pattern) . '$#';
        
        if (!preg_match($regex, $path, $matches)) {
            continue;
        }
        array_shift($matches); // Remove full match
    }
    
    list($controllerName, $method) = explode('@', $handler);
    $controllerClass = "App\\Controllers\\{$controllerName}";
    
    if (class_exists($controllerClass)) {
        $controller = new $controllerClass();
        
        // Special handling untuk PageBlockController dengan 2 parameters (pageId, blockId)
        // HARUS dilakukan SEBELUM generic RESTful routing
        if ($controllerName === 'PageBlockController' && count($matches) === 2) {
            $httpMethod = strtoupper($_SERVER['REQUEST_METHOD']);
            if ($httpMethod === 'POST' && isset($_POST['_method'])) {
                $httpMethod = strtoupper($_POST['_method']);
            }
            
            // Validate that we have both pageId and blockId
            $pageId = $matches[0];
            $blockId = $matches[1];
            
            error_log("PageBlockController routing - pageId: " . $pageId . ", blockId: " . $blockId . ", method: " . $httpMethod . ", original method: " . $method);
            
            // Validate blockId is not the same as pageId
            if ($blockId === $pageId) {
                error_log("PageBlockController routing - ERROR: blockId sama dengan pageId! pageId: " . $pageId . ", blockId: " . $blockId);
                App\Response::error('Invalid request: Block ID sama dengan Page ID. Block ID: ' . $blockId . ', Page ID: ' . $pageId, 400);
                exit;
            }
            
            if ($httpMethod === 'PUT' && method_exists($controller, 'update')) {
                $method = 'update';
                // Pass only blockId untuk update
                $matches = [$blockId];
                error_log("PageBlockController routing - Calling update with blockId: " . $blockId);
            } elseif ($httpMethod === 'DELETE' && method_exists($controller, 'delete')) {
                $method = 'delete';
                // Pass only blockId untuk delete
                $matches = [$blockId];
            } elseif ($httpMethod === 'GET' && $method === 'show') {
                // For GET, show method only needs blockId
                $matches = [$blockId];
            }
        } else {
            // RESTful routing: Check HTTP method untuk resource routes dengan ID
            // Jika route adalah show tapi HTTP method adalah PUT/DELETE, gunakan method yang sesuai
            if (count($matches) > 0 && $method === 'show') {
                $httpMethod = strtoupper($_SERVER['REQUEST_METHOD']);
                if ($httpMethod === 'POST' && isset($_POST['_method'])) {
                    $httpMethod = strtoupper($_POST['_method']);
                }
                
                // Override method berdasarkan HTTP method untuk RESTful API
                if ($httpMethod === 'PUT' && method_exists($controller, 'update')) {
                    $method = 'update';
                } elseif ($httpMethod === 'DELETE' && method_exists($controller, 'delete')) {
                    $method = 'delete';
                }
            }
        }
        
        if (method_exists($controller, $method)) {
            call_user_func_array([$controller, $method], $matches);
            $matched = true;
            break;
        }
    }
}

if (!$matched) {
    // Check if request is for a static file (uploads, images, etc.)
    // If file exists in public directory, serve it directly
    $publicPath = __DIR__ . '/' . ltrim($path, '/');
    if (file_exists($publicPath) && is_file($publicPath)) {
        // Determine MIME type
        $mimeType = mime_content_type($publicPath);
        if (!$mimeType) {
            $ext = strtolower(pathinfo($publicPath, PATHINFO_EXTENSION));
            $mimeTypes = [
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'gif' => 'image/gif',
                'webp' => 'image/webp',
                'pdf' => 'application/pdf',
                'css' => 'text/css',
                'js' => 'application/javascript',
            ];
            $mimeType = $mimeTypes[$ext] ?? 'application/octet-stream';
        }
        
        // Set headers and serve file
        header('Content-Type: ' . $mimeType);
        header('Content-Length: ' . filesize($publicPath));
        header('Cache-Control: public, max-age=31536000'); // Cache for 1 year
        readfile($publicPath);
        exit;
    }
    
    // Debug info (hapus di production)
    $debugInfo = [
        'error' => 'Endpoint not found',
        'path' => $path,
        'request_uri' => $requestUri,
        'script_name' => $scriptName,
        'available_routes' => array_keys($routes),
    ];
    
    // Hanya tampilkan debug jika APP_DEBUG=true
    if (getenv('APP_DEBUG') === 'true' || isset($_GET['debug'])) {
        App\Response::json($debugInfo, 404);
    } else {
        App\Response::error('Endpoint not found', 404);
    }
}

