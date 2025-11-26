<?php
/**
 * Script untuk cek struktur tabel Slider
 */

require_once __DIR__ . '/../vendor/autoload.php';

$dbConfig = require __DIR__ . '/../config/database.php';

try {
    $pdo = new PDO(
        sprintf('mysql:host=%s;port=%s;dbname=%s;charset=%s', 
            $dbConfig['host'], 
            $dbConfig['port'], 
            $dbConfig['database'], 
            $dbConfig['charset']
        ),
        $dbConfig['username'],
        $dbConfig['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
    
    echo "Struktur tabel Slider:\n";
    echo str_repeat('=', 50) . "\n";
    
    $stmt = $pdo->query("DESCRIBE `Slider`");
    $columns = $stmt->fetchAll();
    
    foreach ($columns as $column) {
        echo sprintf("%-20s %-20s %s\n", 
            $column['Field'], 
            $column['Type'], 
            $column['Null'] === 'YES' ? 'NULL' : 'NOT NULL'
        );
    }
    
    echo str_repeat('=', 50) . "\n";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}

