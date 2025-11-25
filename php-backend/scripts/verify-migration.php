<?php
/**
 * Script untuk verifikasi data setelah migrasi
 */

require_once __DIR__ . '/../vendor/autoload.php';

$dbConfig = require __DIR__ . '/../config/database.php';

try {
    $mysql = new PDO(
        sprintf('mysql:host=%s;port=%s;dbname=%s;charset=%s', 
            $dbConfig['host'], 
            $dbConfig['port'], 
            $dbConfig['database'], 
            $dbConfig['charset']
        ),
        $dbConfig['username'],
        $dbConfig['password'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    $tables = ['User', 'Menu', 'Category', 'Page', 'Post', 'Setting', 'Slider', 'HomeSection', 'FAQ', 'Figure', 'Partnership', 'PageBlock'];
    
    echo "Verifikasi Data MySQL:\n";
    echo str_repeat('=', 50) . "\n";
    
    foreach ($tables as $table) {
        $count = $mysql->query("SELECT COUNT(*) as cnt FROM `{$table}`")->fetch()['cnt'];
        echo sprintf("%-20s: %d rows\n", $table, $count);
    }
    
    echo str_repeat('=', 50) . "\n";
    echo "Verifikasi selesai!\n";
    
} catch (PDOException $e) {
    die("Error: " . $e->getMessage() . "\n");
}

