<?php
/**
 * Script untuk test login endpoint
 * 
 * Usage: php scripts/test-login.php [email] [password]
 */

require_once __DIR__ . '/../vendor/autoload.php';

use App\Auth;
use App\Database;

try {
    $db = Database::getInstance();
    
    // Get credentials from command line or use defaults
    $email = $argv[1] ?? 'admin@example.com';
    $password = $argv[2] ?? 'admin123';
    
    echo "Testing login...\n";
    echo "Email: $email\n";
    echo "Password: $password\n\n";
    
    // Test 1: Cek apakah user ada di database
    echo "1. Checking if user exists in database...\n";
    $user = $db->fetchOne('SELECT id, email, name, role FROM User WHERE email = ?', [$email]);
    
    if (!$user) {
        echo "❌ User tidak ditemukan di database!\n";
        exit(1);
    }
    
    echo "✅ User found:\n";
    echo "   ID: {$user['id']}\n";
    echo "   Email: {$user['email']}\n";
    echo "   Name: {$user['name']}\n";
    echo "   Role: {$user['role']}\n\n";
    
    // Test 2: Cek password hash
    echo "2. Checking password hash...\n";
    $userWithPassword = $db->fetchOne('SELECT password FROM User WHERE email = ?', [$email]);
    $passwordHash = $userWithPassword['password'];
    echo "   Hash: " . substr($passwordHash, 0, 20) . "...\n";
    
    // Test 3: Verify password
    echo "3. Verifying password...\n";
    if (password_verify($password, $passwordHash)) {
        echo "✅ Password verified successfully!\n\n";
    } else {
        echo "❌ Password verification failed!\n";
        echo "   Current hash doesn't match password.\n";
        echo "   Run: php scripts/reset-admin-password.php $email $password\n";
        exit(1);
    }
    
    // Test 4: Test Auth class login
    echo "4. Testing Auth::login()...\n";
    $auth = new Auth();
    $result = $auth->login($email, $password);
    
    if ($result) {
        echo "✅ Login successful!\n";
        echo "   User ID: {$result['user']['id']}\n";
        echo "   User Email: {$result['user']['email']}\n";
        echo "   User Name: {$result['user']['name']}\n";
        echo "   Token: " . substr($result['token'], 0, 30) . "...\n\n";
    } else {
        echo "❌ Login failed!\n";
        exit(1);
    }
    
    // Test 5: Test token verification
    echo "5. Testing token verification...\n";
    $token = $result['token'];
    $decoded = $auth->verifyToken($token);
    
    if ($decoded) {
        echo "✅ Token verified successfully!\n";
        echo "   Decoded ID: {$decoded['id']}\n";
        echo "   Decoded Email: {$decoded['email']}\n\n";
    } else {
        echo "❌ Token verification failed!\n";
        exit(1);
    }
    
    echo "✅ All tests passed! Login should work.\n";
    echo "\nTry logging in with:\n";
    echo "  Email: $email\n";
    echo "  Password: $password\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}

