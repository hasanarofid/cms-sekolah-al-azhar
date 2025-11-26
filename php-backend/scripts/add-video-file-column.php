<?php
/**
 * Migration Script: Add videoFile column to Slider table
 * 
 * Usage: php scripts/add-video-file-column.php
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
    
    echo "Checking existing columns...\n";
    
    // Check if videoUrl column exists
    $stmt = $pdo->query("SHOW COLUMNS FROM `Slider` LIKE 'videoUrl'");
    $videoUrlExists = $stmt->rowCount() > 0;
    
    // Check if videoFile column exists
    $stmt = $pdo->query("SHOW COLUMNS FROM `Slider` LIKE 'videoFile'");
    $videoFileExists = $stmt->rowCount() > 0;
    
    if ($videoUrlExists && $videoFileExists) {
        echo "Both 'videoUrl' and 'videoFile' columns already exist. Skipping migration.\n";
        exit(0);
    }
    
    // Add videoUrl column if it doesn't exist
    if (!$videoUrlExists) {
        echo "Adding videoUrl column to Slider table...\n";
        $pdo->exec("ALTER TABLE `Slider` ADD COLUMN `videoUrl` VARCHAR(191) NULL AFTER `image`");
        echo "✓ Column 'videoUrl' added.\n";
    } else {
        echo "Column 'videoUrl' already exists.\n";
    }
    
    // Add videoFile column if it doesn't exist
    if (!$videoFileExists) {
        echo "Adding videoFile column to Slider table...\n";
        // Add after videoUrl if it exists, otherwise after image
        if ($videoUrlExists) {
            $pdo->exec("ALTER TABLE `Slider` ADD COLUMN `videoFile` VARCHAR(191) NULL AFTER `videoUrl`");
        } else {
            $pdo->exec("ALTER TABLE `Slider` ADD COLUMN `videoFile` VARCHAR(191) NULL AFTER `image`");
        }
        echo "✓ Column 'videoFile' added.\n";
    } else {
        echo "Column 'videoFile' already exists.\n";
    }
    
    echo "\n✓ Migration completed successfully!\n";
    echo "Columns 'videoUrl' and 'videoFile' are now available in Slider table.\n";
    
} catch (PDOException $e) {
    echo "✗ Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}

