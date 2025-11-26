<?php
/**
 * Script untuk membuat user admin default
 * 
 * Usage: php scripts/create-admin-user.php
 * 
 * Akan membuat user dengan:
 * - Email: admin@alazhar.ac.id
 * - Password: admin123
 * 
 * PENTING: Ubah password setelah login pertama!
 */

require_once __DIR__ . '/../vendor/autoload.php';

use App\Database;
use App\Utils;

try {
    $db = Database::getInstance();
    
    // Cek apakah sudah ada user
    $existingUser = $db->fetchOne('SELECT id FROM User LIMIT 1');
    
    if ($existingUser) {
        echo "✅ User sudah ada di database.\n";
        echo "Email: " . ($db->fetchOne('SELECT email FROM User LIMIT 1')['email'] ?? 'N/A') . "\n";
        exit(0);
    }
    
    // Buat user admin default
    $id = Utils::generateId();
    $email = 'admin@alazhar.ac.id';
    $password = password_hash('admin123', PASSWORD_DEFAULT);
    $name = 'Administrator';
    $role = 'admin';
    $now = date('Y-m-d H:i:s');
    
    $db->query(
        'INSERT INTO User (id, email, password, name, role, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?)',
        [$id, $email, $password, $name, $role, $now, $now]
    );
    
    echo "✅ User admin berhasil dibuat!\n\n";
    echo "Email: $email\n";
    echo "Password: admin123\n";
    echo "\n⚠️  PENTING: Ubah password setelah login pertama!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}

