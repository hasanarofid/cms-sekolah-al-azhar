<?php
/**
 * Application Configuration
 */

// CORS Configuration
define('ALLOWED_ORIGINS', [
    // Development
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173', // Vite default port
    'http://localhost:5174', // Vite alternate port
    // Production
    'https://aicjatibening.com',
    'https://www.aicjatibening.com',
]);

// JWT Secret (gunakan yang sama dengan NEXTAUTH_SECRET jika ada)
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'your-secret-key-change-this-in-production');

// Upload Configuration
define('UPLOAD_DIR', __DIR__ . '/../public/uploads');
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_IMAGE_TYPES', ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']);

// Timezone
date_default_timezone_set('Asia/Jakarta');

