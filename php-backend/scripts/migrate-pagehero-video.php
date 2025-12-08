<?php
/**
 * Migration: Add videoFile and videoDuration to PageHero
 * Run this via cPanel Terminal or browser
 */

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/load-env.php';

$host = getenv('DB_HOST') ?: 'localhost';
$port = getenv('DB_PORT') ?: '3306';
$database = getenv('DB_DATABASE');
$username = getenv('DB_USERNAME');
$password = getenv('DB_PASSWORD');

try {
    $dsn = "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4";
    $db = new PDO($dsn, $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Connected to database\n";
    
    // Check if videoFile column exists
    $result = $db->query("SHOW COLUMNS FROM PageHero LIKE 'videoFile'");
    if ($result->rowCount() == 0) {
        $db->exec("ALTER TABLE PageHero ADD COLUMN videoFile VARCHAR(500) NULL AFTER videoUrl");
        echo "✅ Added column: videoFile\n";
    } else {
        echo "ℹ️  Column videoFile already exists\n";
    }
    
    // Check if videoDuration column exists
    $result = $db->query("SHOW COLUMNS FROM PageHero LIKE 'videoDuration'");
    if ($result->rowCount() == 0) {
        $db->exec("ALTER TABLE PageHero ADD COLUMN videoDuration INT NULL AFTER videoFile");
        echo "✅ Added column: videoDuration\n";
    } else {
        echo "ℹ️  Column videoDuration already exists\n";
    }
    
    echo "\n✅ Migration completed successfully!\n";
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}

