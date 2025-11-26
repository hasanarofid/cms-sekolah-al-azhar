<?php
/**
 * Script untuk reset password admin
 * 
 * Usage: php scripts/reset-admin-password.php [email] [new_password]
 * 
 * Contoh:
 * php scripts/reset-admin-password.php admin@example.com admin123
 */

require_once __DIR__ . '/../vendor/autoload.php';

use App\Database;

try {
    $db = Database::getInstance();
    
    // Get email and password from command line or use defaults
    $email = $argv[1] ?? 'admin@example.com';
    $newPassword = $argv[2] ?? 'admin123';
    
    // Cek apakah user ada
    $user = $db->fetchOne('SELECT id, email, name FROM User WHERE email = ?', [$email]);
    
    if (!$user) {
        echo "❌ User dengan email '$email' tidak ditemukan.\n";
        echo "\nDaftar user yang ada:\n";
        $users = $db->fetchAll('SELECT email, name FROM User');
        foreach ($users as $u) {
            echo "  - {$u['email']} ({$u['name']})\n";
        }
        exit(1);
    }
    
    // Hash password baru
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    
    // Update password
    $db->query(
        'UPDATE User SET password = ?, updatedAt = NOW(3) WHERE email = ?',
        [$hashedPassword, $email]
    );
    
    echo "✅ Password berhasil direset!\n\n";
    echo "Email: {$user['email']}\n";
    echo "Nama: {$user['name']}\n";
    echo "Password baru: $newPassword\n";
    echo "\n⚠️  PENTING: Ubah password setelah login!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}

