<?php
/**
 * Debug login issue
 */

require_once __DIR__ . '/../vendor/autoload.php';

use App\Database;
use App\Auth;

try {
    $db = Database::getInstance();
    
    // Get all users
    echo "=== All Users in Database ===\n";
    $users = $db->fetchAll('SELECT id, email, name, role FROM User');
    foreach ($users as $user) {
        echo "ID: {$user['id']}\n";
        echo "Email: {$user['email']}\n";
        echo "Name: {$user['name']}\n";
        echo "Role: {$user['role']}\n";
        echo "---\n";
    }
    
    // Test specific user
    echo "\n=== Testing admin@example.com ===\n";
    $email = 'admin@example.com';
    $password = 'admin123';
    
    $user = $db->fetchOne('SELECT * FROM User WHERE email = ?', [$email]);
    
    if (!$user) {
        echo "❌ User not found!\n";
        exit(1);
    }
    
    echo "User found:\n";
    echo "  ID: {$user['id']}\n";
    echo "  Email: {$user['email']}\n";
    echo "  Password hash: " . substr($user['password'], 0, 30) . "...\n";
    
    // Test password verification
    echo "\nTesting password verification:\n";
    $isValid = password_verify($password, $user['password']);
    echo "  password_verify('$password', hash): " . ($isValid ? 'TRUE' : 'FALSE') . "\n";
    
    if (!$isValid) {
        echo "\n❌ Password verification failed!\n";
        echo "Resetting password...\n";
        
        $newHash = password_hash($password, PASSWORD_DEFAULT);
        $db->query(
            'UPDATE User SET password = ?, updatedAt = NOW(3) WHERE email = ?',
            [$newHash, $email]
        );
        
        echo "✅ Password reset. New hash: " . substr($newHash, 0, 30) . "...\n";
        
        // Test again
        $user = $db->fetchOne('SELECT * FROM User WHERE email = ?', [$email]);
        $isValid = password_verify($password, $user['password']);
        echo "  password_verify after reset: " . ($isValid ? 'TRUE' : 'FALSE') . "\n";
    }
    
    // Test Auth class
    echo "\n=== Testing Auth::login() ===\n";
    $auth = new Auth();
    $result = $auth->login($email, $password);
    
    if ($result) {
        echo "✅ Auth::login() SUCCESS\n";
        echo "  User: {$result['user']['email']}\n";
        echo "  Token: " . substr($result['token'], 0, 30) . "...\n";
    } else {
        echo "❌ Auth::login() FAILED\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}

