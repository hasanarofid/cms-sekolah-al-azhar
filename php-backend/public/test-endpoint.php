<?php
/**
 * Test endpoint untuk debug
 * Akses: http://localhost:8000/test-endpoint.php
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>PHP Backend Test</h1>";

// Test 1: Composer autoload
echo "<h2>1. Composer Autoload</h2>";
try {
    require_once __DIR__ . '/../vendor/autoload.php';
    echo "✅ Composer autoload OK<br>";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
    exit;
}

// Test 2: Environment
echo "<h2>2. Environment Variables</h2>";
require_once __DIR__ . '/../config/load-env.php';
echo "DB_HOST: " . (getenv('DB_HOST') ?: 'not set') . "<br>";
echo "DB_DATABASE: " . (getenv('DB_DATABASE') ?: 'not set') . "<br>";

// Test 3: Config
echo "<h2>3. Config</h2>";
try {
    require_once __DIR__ . '/../config/config.php';
    echo "✅ Config loaded<br>";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
}

// Test 4: Database
echo "<h2>4. Database Connection</h2>";
try {
    $config = require __DIR__ . '/../config/database.php';
    $dsn = sprintf(
        'mysql:host=%s;port=%s;dbname=%s;charset=%s',
        $config['host'],
        $config['port'],
        $config['database'],
        $config['charset']
    );
    $pdo = new PDO($dsn, $config['username'], $config['password']);
    echo "✅ Database connection OK<br>";
    
    // Test query
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM User");
    $result = $stmt->fetch();
    echo "Users in database: " . $result['count'] . "<br>";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
}

// Test 5: Autoload classes
echo "<h2>5. Class Autoload</h2>";
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

try {
    $db = App\Database::getInstance();
    echo "✅ Database class OK<br>";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
}

try {
    $auth = new App\Auth();
    echo "✅ Auth class OK<br>";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
}

// Test 6: JWT
echo "<h2>6. JWT Library</h2>";
try {
    if (class_exists('Firebase\JWT\JWT')) {
        echo "✅ JWT library loaded<br>";
    } else {
        echo "❌ JWT library not found<br>";
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
}

// Test 7: Test login
echo "<h2>7. Test Login</h2>";
try {
    $auth = new App\Auth();
    $result = $auth->login('admin@example.com', 'admin123');
    if ($result) {
        echo "✅ Login test OK<br>";
        echo "User: " . $result['user']['email'] . "<br>";
        echo "Token: " . substr($result['token'], 0, 20) . "...<br>";
    } else {
        echo "❌ Login failed (user not found or wrong password)<br>";
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
    echo "Stack trace: <pre>" . $e->getTraceAsString() . "</pre>";
}

echo "<hr>";
echo "<p><strong>Jika semua test OK, coba akses:</strong></p>";
echo "<ul>";
echo "<li><a href='index.php?path=api/auth/login'>Test routing</a></li>";
echo "<li>POST ke: <code>http://localhost:8000/api/auth/login</code></li>";
echo "</ul>";

