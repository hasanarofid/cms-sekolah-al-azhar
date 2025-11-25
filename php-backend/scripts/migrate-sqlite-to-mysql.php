<?php
/**
 * Script untuk migrasi data dari SQLite ke MySQL
 * 
 * Usage: php migrate-sqlite-to-mysql.php
 */

require_once __DIR__ . '/../vendor/autoload.php';

// Load config
$dbConfig = require __DIR__ . '/../config/database.php';

// Connect to SQLite
$sqlitePath = __DIR__ . '/../../prisma/dev.db';
if (!file_exists($sqlitePath)) {
    die("SQLite database not found: {$sqlitePath}\n");
}

$sqlite = new PDO("sqlite:{$sqlitePath}");
$sqlite->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Connect to MySQL
$mysqlDsn = sprintf(
    'mysql:host=%s;port=%s;dbname=%s;charset=%s',
    $dbConfig['host'],
    $dbConfig['port'],
    $dbConfig['database'],
    $dbConfig['charset']
);

try {
    $mysql = new PDO(
        $mysqlDsn,
        $dbConfig['username'],
        $dbConfig['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    die("Failed to connect to MySQL: " . $e->getMessage() . "\n");
}

echo "Starting migration from SQLite to MySQL...\n\n";

// Tables to migrate (in order due to foreign keys)
$tables = [
    'User',
    'Menu',
    'Category',
    'Page',
    'Post',
    'Media',
    'Gallery',
    'Contact',
    'Setting',
    'Slider',
    'HomeSection',
    'FAQ',
    'Figure',
    'Partnership',
    'PageBlock',
];

foreach ($tables as $table) {
    echo "Migrating table: {$table}...\n";
    
    // Check if table exists in SQLite
    try {
        $tableCheck = $sqlite->query("SELECT name FROM sqlite_master WHERE type='table' AND name='{$table}'")->fetch();
        if (!$tableCheck) {
            echo "  Table {$table} does not exist in SQLite. Skipping.\n\n";
            continue;
        }
    } catch (PDOException $e) {
        echo "  Error checking table: " . $e->getMessage() . "\n\n";
        continue;
    }
    
    // Get all data from SQLite
    try {
        $rows = $sqlite->query("SELECT * FROM {$table}")->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo "  Error reading from SQLite: " . $e->getMessage() . "\n\n";
        continue;
    }
    
    if (empty($rows)) {
        echo "  No data to migrate.\n\n";
        continue;
    }
    
    echo "  Found " . count($rows) . " rows in SQLite.\n";
    
    // Get column names
    $columns = array_keys($rows[0]);
    $placeholders = implode(',', array_fill(0, count($columns), '?'));
    $columnList = '`' . implode('`, `', $columns) . '`';
    
    // Use REPLACE INTO to handle duplicates (will replace existing records with same primary key)
    $stmt = $mysql->prepare("REPLACE INTO `{$table}` ({$columnList}) VALUES ({$placeholders})");
    
    $count = 0;
    $errors = 0;
    foreach ($rows as $row) {
        try {
            // Convert boolean values and datetime
            $values = [];
            foreach ($columns as $col) {
                $value = $row[$col];
                
                // Handle datetime conversion (SQLite stores as integer timestamp in milliseconds)
                if (in_array($col, ['createdAt', 'updatedAt', 'publishedAt'])) {
                    if ($value !== null && $value !== '') {
                        // Check if it's a timestamp (integer or numeric string)
                        if (is_numeric($value)) {
                            // Convert from milliseconds to seconds, then to MySQL datetime
                            $timestamp = intval($value) / 1000;
                            $value = date('Y-m-d H:i:s', $timestamp);
                        } elseif (is_string($value)) {
                            // Try to parse as datetime string
                            try {
                                $dt = new DateTime($value);
                                $value = $dt->format('Y-m-d H:i:s');
                            } catch (Exception $e) {
                                // If parsing fails, try as timestamp
                                if (is_numeric($value)) {
                                    $timestamp = intval($value) / 1000;
                                    $value = date('Y-m-d H:i:s', $timestamp);
                                } else {
                                    $value = null;
                                }
                            }
                        }
                    } else {
                        $value = null;
                    }
                }
                
                // Handle boolean conversion
                if (in_array($col, ['isActive', 'isPublished', 'isRead'])) {
                    // SQLite stores booleans as 0/1, but we need to ensure it's integer
                    $value = ($value === true || $value === 1 || $value === '1') ? 1 : 0;
                }
                
                // Handle default values for TEXT columns
                if ($value === null || $value === '') {
                    if ($col === 'tags' && $table === 'Post') {
                        $value = '[]';
                    } elseif ($col === 'images' && $table === 'Gallery') {
                        $value = '[]';
                    } elseif ($col === 'value' && $table === 'Setting') {
                        // Setting.value cannot be null
                        $value = '';
                    } elseif (!in_array($col, ['createdAt', 'updatedAt', 'publishedAt'])) {
                        $value = null;
                    }
                }
                
                // Truncate strings that are too long for VARCHAR columns
                // Common VARCHAR(191) columns that might overflow
                if (is_string($value) && strlen($value) > 191) {
                    $varcharColumns = [
                        'title', 'titleEn', 'subtitle', 'subtitleEn', 'name', 'nameEn', 
                        'slug', 'email', 'key', 'buttonText', 'buttonTextEn', 
                        'question', 'questionEn', 'sectionTitle', 'sectionTitleEn', 
                        'position', 'positionEn', 'category', 'subject'
                    ];
                    if (in_array($col, $varcharColumns)) {
                        $value = substr($value, 0, 191);
                    }
                }
                
                $values[] = $value;
            }
            
            $stmt->execute($values);
            $count++;
        } catch (PDOException $e) {
            $errors++;
            echo "  Error inserting row (ID: " . ($row['id'] ?? 'unknown') . "): " . $e->getMessage() . "\n";
        }
    }
    
    echo "  Migrated {$count} rows";
    if ($errors > 0) {
        echo " ({$errors} errors)";
    }
    echo ".\n\n";
}

echo "Migration completed!\n";

