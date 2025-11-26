<?php
/**
 * Test auth directly via web
 */

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/load-env.php';
require_once __DIR__ . '/../config/config.php';

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

header('Content-Type: application/json');

try {
    $db = App\Database::getInstance();
    
    // Get all users
    $users = $db->fetchAll('SELECT id, email, name FROM User');
    
    echo json_encode([
        'users' => $users,
        'test_login' => []
    ], JSON_PRETTY_PRINT);
    
    // Test login
    $auth = new App\Auth();
    $result = $auth->login('admin@example.com', 'admin123');
    
    if ($result) {
        echo "\n\n=== LOGIN SUCCESS ===\n";
        echo json_encode(['success' => true, 'user' => $result['user']['email']], JSON_PRETTY_PRINT);
    } else {
        echo "\n\n=== LOGIN FAILED ===\n";
        
        // Check user
        $user = $db->fetchOne('SELECT * FROM User WHERE email = ?', ['admin@example.com']);
        if ($user) {
            echo "User found, testing password...\n";
            $isValid = password_verify('admin123', $user['password']);
            echo "Password valid: " . ($isValid ? 'YES' : 'NO') . "\n";
            echo "Password hash: " . substr($user['password'], 0, 30) . "...\n";
        } else {
            echo "User NOT found!\n";
        }
    }
    
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()], JSON_PRETTY_PRINT);
}

