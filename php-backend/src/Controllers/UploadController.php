<?php

namespace App\Controllers;

use App\Response;

class UploadController extends BaseController
{
    public function upload()
    {
        $this->requireAuth();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::error('Method not allowed', 405);
        }

        if (!isset($_FILES['file'])) {
            Response::error('No file uploaded', 400);
        }

        $file = $_FILES['file'];

        // Validate file type
        if (!in_array($file['type'], ALLOWED_IMAGE_TYPES)) {
            Response::error('Invalid file type. Only images are allowed.', 400);
        }

        // Validate file size
        if ($file['size'] > MAX_FILE_SIZE) {
            Response::error('File size too large. Maximum size is 5MB.', 400);
        }

        // Determine upload directory based on type parameter
        $type = $_POST['type'] ?? 'general';
        $allowedTypes = ['sliders', 'general', 'home-sections', 'figures', 'partnerships', 'categories', 'posts', 'pages'];
        if (!in_array($type, $allowedTypes)) {
            $type = 'general';
        }

        // Create upload directory if it doesn't exist
        $uploadDir = UPLOAD_DIR . '/' . $type;
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        // Generate unique filename
        $timestamp = time();
        $randomString = bin2hex(random_bytes(8));
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $prefix = $type === 'sliders' ? 'slider' : ($type === 'home-sections' ? 'section' : 'file');
        $filename = "{$prefix}-{$timestamp}-{$randomString}.{$extension}";

        // Move uploaded file
        $filepath = $uploadDir . '/' . $filename;
        if (!move_uploaded_file($file['tmp_name'], $filepath)) {
            Response::error('Failed to upload file', 500);
        }

        // Return public URL
        $publicUrl = '/uploads/' . $type . '/' . $filename;
        Response::json(['url' => $publicUrl, 'filename' => $filename, 'type' => $type]);
    }
}

