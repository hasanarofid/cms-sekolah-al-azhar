<?php
/**
 * Script untuk mengecek data di SQLite database
 * Usage: php check-sqlite-data.php
 */

$sqlitePath = __DIR__ . '/prisma/dev.db';

if (!file_exists($sqlitePath)) {
    die("❌ SQLite database tidak ditemukan: {$sqlitePath}\n");
}

echo "📊 Mengecek data di SQLite database...\n";
echo str_repeat('=', 60) . "\n\n";

try {
    $sqlite = new PDO("sqlite:{$sqlitePath}");
    $sqlite->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Daftar tabel berdasarkan schema.prisma
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
    
    $totalRows = 0;
    $tablesWithData = [];
    
    foreach ($tables as $table) {
        // Cek apakah tabel ada
        $tableCheck = $sqlite->query("SELECT name FROM sqlite_master WHERE type='table' AND name='{$table}'")->fetch();
        
        if (!$tableCheck) {
            echo "⚠️  Tabel {$table}: TIDAK ADA\n";
            continue;
        }
        
        // Hitung jumlah data
        $count = $sqlite->query("SELECT COUNT(*) as cnt FROM `{$table}`")->fetch()['cnt'];
        
        if ($count > 0) {
            $tablesWithData[] = $table;
            $totalRows += $count;
            echo "✅ Tabel {$table}: {$count} baris data\n";
        } else {
            echo "⚪ Tabel {$table}: KOSONG (0 baris)\n";
        }
    }
    
    echo "\n" . str_repeat('=', 60) . "\n";
    echo "📈 Ringkasan:\n";
    echo "   - Total tabel yang ada: " . count($tables) . "\n";
    echo "   - Tabel dengan data: " . count($tablesWithData) . "\n";
    echo "   - Total baris data: {$totalRows}\n";
    
    if (count($tablesWithData) > 0) {
        echo "\n✅ Database SQLite MEMILIKI DATA\n";
        echo "   Tabel yang berisi data: " . implode(', ', $tablesWithData) . "\n";
    } else {
        echo "\n⚠️  Database SQLite KOSONG (tidak ada data)\n";
    }
    
} catch (PDOException $e) {
    die("❌ Error: " . $e->getMessage() . "\n");
}