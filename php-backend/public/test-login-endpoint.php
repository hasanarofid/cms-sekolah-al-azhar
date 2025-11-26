<?php
/**
 * Test login endpoint directly
 */

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/load-env.php';
require_once __DIR__ . '/../config/config.php';

// Simulate POST request
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['CONTENT_TYPE'] = 'application/json';

// Set JSON input
$jsonInput = json_encode([
    'email' => 'admin@example.com',
    'password' => 'admin123'
]);

// Simulate php://input
file_put_contents('php://memory', $jsonInput);

// Autoload
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

// Test Auth directly
echo "=== Testing Auth directly ===\n";
try {
    $auth = new App\Auth();
    $result = $auth->login('admin@example.com', 'admin123');
    
    if ($result) {
        echo "✅ Login SUCCESS\n";
        echo "User: {$result['user']['email']}\n";
        echo "Token: " . substr($result['token'], 0, 30) . "...\n";
    } else {
        echo "❌ Login FAILED\n";
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

// Test with Utils::getJsonInput simulation
echo "\n=== Testing JSON Input Parsing ===\n";
$_POST = [];
$GLOBALS['HTTP_RAW_POST_DATA'] = $jsonInput;

// Test database connection
echo "\n=== Testing Database Connection ===\n";
try {
    $db = App\Database::getInstance();
    $user = $db->fetchOne('SELECT email FROM User WHERE email = ?', ['admin@example.com']);
    if ($user) {
        echo "✅ Database connection OK\n";
        echo "User found: {$user['email']}\n";
    } else {
        echo "❌ User not found in database\n";
    }
} catch (Exception $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
}

