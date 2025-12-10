<?php
/**
 * Database Configuration
 * Update dengan kredensial MySQL hosting Anda
 */

return [
    'host' => getenv('DB_HOST') ?: 'localhost',
    'port' => getenv('DB_PORT') ?: '3306',
    'database' => getenv('DB_DATABASE') ?: 'u548738830_alazhar',
    'username' => getenv('DB_USERNAME') ?: 'root',
    'password' => getenv('DB_PASSWORD') ?: 'hasanitki',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
];

