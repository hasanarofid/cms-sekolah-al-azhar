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
    'http://aicjatibening.com', // Fallback untuk non-SSL
    'http://www.aicjatibening.com',
]);

// JWT Secret (gunakan yang sama dengan NEXTAUTH_SECRET jika ada)
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'your-secret-key-change-this-in-production');

// Upload Configuration
define('UPLOAD_DIR', __DIR__ . '/../public/uploads');
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB
define('MAX_VIDEO_SIZE', 50 * 1024 * 1024); // 50MB untuk video
define('MAX_DOCUMENT_SIZE', 10 * 1024 * 1024); // 10MB untuk dokumen
define('ALLOWED_IMAGE_TYPES', ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']);
define('ALLOWED_VIDEO_TYPES', ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-m4v', 'application/octet-stream']);
define('ALLOWED_DOCUMENT_TYPES', [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
]);

// Timezone
date_default_timezone_set('Asia/Jakarta');

