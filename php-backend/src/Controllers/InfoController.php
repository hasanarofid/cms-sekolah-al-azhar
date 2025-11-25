<?php

namespace App\Controllers;

use App\Database;
use App\Response;

class InfoController extends BaseController
{
    /**
     * Menampilkan informasi koneksi database dan statistik data
     */
    public function index()
    {
        try {
            $db = Database::getInstance();
            $connection = $db->getConnection();
            
            // Ambil config database
            $dbConfig = require __DIR__ . '/../../config/database.php';
            
            // Test koneksi
            $connection->query("SELECT 1");
            
            // Info koneksi database
            $dbInfo = [
                'host' => $dbConfig['host'],
                'port' => $dbConfig['port'],
                'database' => $dbConfig['database'],
                'username' => $dbConfig['username'],
                'charset' => $dbConfig['charset'],
                'status' => 'connected',
            ];
            
            // Daftar tabel untuk statistik
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
            
            // Ambil statistik data
            $statistics = [];
            $totalRows = 0;
            
            foreach ($tables as $table) {
                try {
                    $count = $connection->query("SELECT COUNT(*) as cnt FROM `{$table}`")->fetch()['cnt'];
                    $statistics[$table] = (int)$count;
                    $totalRows += (int)$count;
                } catch (\Exception $e) {
                    $statistics[$table] = 'error: ' . $e->getMessage();
                }
            }
            
            // Ambil beberapa contoh data untuk preview
            $preview = [];
            try {
                // Preview Menu (maksimal 5)
                $menuPreview = $connection->query("SELECT id, title, slug, isActive FROM `Menu` ORDER BY `order` ASC LIMIT 5")->fetchAll();
                if (!empty($menuPreview)) {
                    $preview['Menu'] = $menuPreview;
                }
            } catch (\Exception $e) {
                // Ignore error
            }
            
            // Info tambahan
            $additionalInfo = [
                'server_time' => date('Y-m-d H:i:s'),
                'php_version' => PHP_VERSION,
                'total_tables' => count($tables),
                'total_rows' => $totalRows,
            ];
            
            // Response
            Response::json([
                'success' => true,
                'message' => 'Database connection successful',
                'database' => $dbInfo,
                'statistics' => $statistics,
                'preview' => $preview,
                'info' => $additionalInfo,
            ], 200);
            
        } catch (\Exception $e) {
            Response::json([
                'success' => false,
                'message' => 'Database connection failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

