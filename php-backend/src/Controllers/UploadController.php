<?php

namespace App\Controllers;

use App\Response;
use App\Utils;

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
        
        // Check for upload errors first
        $errorCode = $file['error'] ?? UPLOAD_ERR_OK;
        if ($errorCode !== UPLOAD_ERR_OK) {
            $errorMessages = [
                UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize directive (' . ini_get('upload_max_filesize') . ')',
                UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE directive in HTML form',
                UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
                UPLOAD_ERR_NO_FILE => 'No file was uploaded',
                UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
                UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
                UPLOAD_ERR_EXTENSION => 'File upload stopped by extension',
            ];
            $errorMsg = $errorMessages[$errorCode] ?? 'Unknown upload error (code: ' . $errorCode . ')';
            Response::error('Upload failed: ' . $errorMsg . '. PHP limits: upload_max_filesize=' . ini_get('upload_max_filesize') . ', post_max_size=' . ini_get('post_max_size'), 400);
        }
        
        // Handle PHP 8.1+ structure where tmp_name might be in different format
        // PHP 8.1+ introduced 'full_path' but tmp_name should still exist
        // If tmp_name is missing, try to get it from full_path or error array
        if (!isset($file['tmp_name']) || empty($file['tmp_name'])) {
            // Try full_path (PHP 8.1+)
            if (isset($file['full_path']) && !empty($file['full_path'])) {
                $file['tmp_name'] = $file['full_path'];
            } else {
                // Check if it's an array structure (multiple files)
                if (is_array($file['name'])) {
                    Response::error('Multiple file uploads not supported. Please upload one file at a time.', 400);
                }
                Response::error('Upload file temporary name is missing. File keys: ' . implode(', ', array_keys($file)) . ' | File structure: ' . json_encode($file), 400);
            }
        }
        
        // Debug: Log file structure for troubleshooting
        if (getenv('APP_DEBUG') === 'true') {
            error_log('Upload file structure: ' . json_encode($file));
        }
        
        // Get file extension
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $videoExtensions = ['mp4', 'webm', 'ogg', 'ogv', 'mov', 'avi', 'm4v'];
        $documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
        
        // Check if this is a document upload
        $isDocument = isset($_POST['isDocument']) && ($_POST['isDocument'] === 'true' || $_POST['isDocument'] === true || $_POST['isDocument'] === '1');
        if (!$isDocument) {
            $isDocument = in_array($extension, $documentExtensions);
        }
        if (!$isDocument) {
            $isDocument = in_array($file['type'], ALLOWED_DOCUMENT_TYPES);
        }
        
        // Check if this is a video upload
        // Priority 1: Explicit isVideo parameter from frontend
        $isVideo = isset($_POST['isVideo']) && ($_POST['isVideo'] === 'true' || $_POST['isVideo'] === true || $_POST['isVideo'] === '1');
        
        // Priority 2: Check by file extension (more reliable than MIME type)
        if (!$isVideo && !$isDocument) {
            $isVideo = in_array($extension, $videoExtensions);
        }
        
        // Priority 3: Check by MIME type (some browsers send wrong MIME type)
        if (!$isVideo && !$isDocument) {
            $isVideo = in_array($file['type'], ALLOWED_VIDEO_TYPES);
        }

        // Validate file type
        if ($isDocument) {
            // Document file validation
            $extensionValid = in_array($extension, $documentExtensions);
            $mimeValid = in_array($file['type'], ALLOWED_DOCUMENT_TYPES);
            
            if (!$extensionValid && !$mimeValid) {
                Response::error('Invalid document file type. Allowed: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX. Received MIME: ' . $file['type'] . ', Extension: ' . $extension, 400);
            }
            // Validate document file size
            if ($file['size'] > MAX_DOCUMENT_SIZE) {
                Response::error('File size too large. Maximum size is 10MB for documents.', 400);
            }
        } elseif ($isVideo) {
            // Video file validation - check extension first (most reliable)
            $extensionValid = in_array($extension, $videoExtensions);
            
            // Check MIME type (but be lenient for mp4 files)
            $mimeValid = in_array($file['type'], ALLOWED_VIDEO_TYPES);
            
            // Special handling for mp4 files (browsers sometimes send wrong MIME type)
            $mp4MimeTypes = ['video/mp4', 'video/x-m4v', 'application/octet-stream', 'application/mp4', ''];
            $isMp4File = $extension === 'mp4';
            $isMp4Mime = in_array($file['type'], $mp4MimeTypes);
            
            // If isVideo parameter was explicitly set, trust it and only check extension
            $explicitVideo = isset($_POST['isVideo']) && ($_POST['isVideo'] === 'true' || $_POST['isVideo'] === true || $_POST['isVideo'] === '1');
            
            if ($explicitVideo) {
                // If explicitly marked as video, only check extension (trust the frontend)
                if (!$extensionValid) {
                    Response::error('Invalid video file extension. Allowed: ' . implode(', ', $videoExtensions) . '. Received: ' . $extension, 400);
                }
            } else {
                // If not explicitly marked, check both extension and MIME
                if (!$extensionValid && !($isMp4File && $isMp4Mime) && !$mimeValid) {
                    Response::error('Invalid file type. Only video files (mp4, webm, ogg, mov) are allowed. Received MIME: ' . $file['type'] . ', Extension: ' . $extension, 400);
                }
            }
            // Validate video file size
            if ($file['size'] > MAX_VIDEO_SIZE) {
                Response::error('File size too large. Maximum size is 50MB for videos.', 400);
            }
        } else {
            // Image file validation
            if (!in_array($file['type'], ALLOWED_IMAGE_TYPES)) {
                Response::error('Invalid file type. Only images are allowed.', 400);
            }
            // Validate image file size
            if ($file['size'] > MAX_FILE_SIZE) {
                Response::error('File size too large. Maximum size is 5MB.', 400);
            }
        }

        // Determine upload directory based on type parameter
        $type = $_POST['type'] ?? 'general';
        $allowedTypes = ['sliders', 'general', 'home-sections', 'figures', 'partnerships', 'categories', 'posts', 'pages', 'documents'];
        if (!in_array($type, $allowedTypes)) {
            $type = 'general';
        }

        // Create upload directory if it doesn't exist
        $uploadDir = UPLOAD_DIR . '/' . $type;
        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0755, true)) {
                Response::error('Failed to create upload directory: ' . $uploadDir, 500);
            }
        }

        // Ensure directory is writable
        if (!is_writable($uploadDir)) {
            // Try to make it writable
            if (!chmod($uploadDir, 0755)) {
                Response::error('Upload directory is not writable: ' . $uploadDir, 500);
            }
        }

        // Generate unique filename
        $timestamp = time();
        $randomString = bin2hex(random_bytes(8));
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if ($isDocument) {
            $prefix = 'document';
        } elseif ($isVideo) {
            $prefix = $type === 'sliders' ? 'slider-video' : ($type === 'home-sections' ? 'section-video' : 'video');
        } else {
            $prefix = $type === 'sliders' ? 'slider' : ($type === 'home-sections' ? 'section' : 'file');
        }
        $filename = "{$prefix}-{$timestamp}-{$randomString}.{$extension}";

        // Move uploaded file
        $filepath = $uploadDir . '/' . $filename;
        
        // Check if tmp file exists
        // Handle both old and new PHP $_FILES structure
        $tmpName = $file['tmp_name'] ?? $file['full_path'] ?? null;
        
        if (empty($tmpName)) {
            Response::error('Upload file temporary name is missing. File info: ' . json_encode(array_keys($file)) . ' | Full: ' . json_encode($file), 400);
        }
        
        // Update file array to use tmp_name consistently
        $file['tmp_name'] = $tmpName;
        
        if (!file_exists($file['tmp_name'])) {
            Response::error('Upload file not found at temporary location: ' . $file['tmp_name'], 400);
        }
        
        // Check if it's a valid uploaded file
        $isValidUpload = is_uploaded_file($file['tmp_name']);
        
        if ($isValidUpload) {
            // Normal uploaded file - use move_uploaded_file (secure)
            if (!move_uploaded_file($file['tmp_name'], $filepath)) {
                $error = error_get_last();
                $errorMsg = $error ? $error['message'] : 'Unknown error';
                Response::error('Failed to move uploaded file: ' . $errorMsg . ' (Directory: ' . $uploadDir . ', Writable: ' . (is_writable($uploadDir) ? 'yes' : 'no') . ')', 500);
            }
        } else {
            // Not a valid uploaded file - might be from testing or already processed
            // Check if file is readable
            if (!is_readable($file['tmp_name'])) {
                Response::error('Invalid upload file: file is not readable. tmp_name: ' . $file['tmp_name'], 400);
            }
            // Use copy as fallback (for development/testing scenarios)
            if (!copy($file['tmp_name'], $filepath)) {
                $error = error_get_last();
                $errorMsg = $error ? $error['message'] : 'Unknown error';
                Response::error('Failed to copy file: ' . $errorMsg . ' (Source: ' . $file['tmp_name'] . ', Destination: ' . $filepath . ')', 500);
            }
        }
        
        // Verify file was created
        if (!file_exists($filepath)) {
            Response::error('File was not saved to destination', 500);
        }

        // Check if video should be trimmed (server-side processing)
        // Frontend can send trimVideo=true and trimDuration=5 (default)
        $trimVideo = isset($_POST['trimVideo']) && ($_POST['trimVideo'] === 'true' || $_POST['trimVideo'] === true || $_POST['trimVideo'] === '1');
        $trimDuration = isset($_POST['trimDuration']) ? (int) $_POST['trimDuration'] : 5;
        
        if ($isVideo && $trimVideo) {
            try {
                // Check if video needs trimming
                if (Utils::shouldTrimVideo($filepath, $trimDuration)) {
                    error_log("Video is longer than {$trimDuration} seconds. Trimming...");
                    
                    // Create temporary output path
                    $tempOutputPath = $filepath . '.temp.mp4';
                    
                    // Trim video
                    Utils::trimVideo($filepath, $tempOutputPath, $trimDuration);
                    
                    // Replace original with trimmed version
                    if (file_exists($tempOutputPath)) {
                        // Remove original
                        @unlink($filepath);
                        
                        // Rename temp to original
                        rename($tempOutputPath, $filepath);
                        
                        error_log("Video successfully trimmed to {$trimDuration} seconds");
                    }
                }
            } catch (\Exception $e) {
                // If trimming fails, continue with original video
                error_log('Failed to trim video: ' . $e->getMessage());
                
                // Clean up temp file if it exists
                if (isset($tempOutputPath) && file_exists($tempOutputPath)) {
                    @unlink($tempOutputPath);
                }
            }
        }

        // Get video duration if it's a video file
        $videoDuration = null;
        if ($isVideo) {
            try {
                $duration = Utils::getVideoDuration($filepath);
                if ($duration !== null && $duration > 0) {
                    $videoDuration = $duration;
                }
            } catch (\Exception $e) {
                // If duration detection fails, continue without it
                // Frontend can detect via video element
                error_log('Failed to get video duration: ' . $e->getMessage());
            }
        }

        // Return public URL
        $publicUrl = '/uploads/' . $type . '/' . $filename;
        $response = ['url' => $publicUrl, 'filename' => $filename, 'type' => $type];
        
        // Include video duration if available
        if ($videoDuration !== null) {
            $response['videoDuration'] = $videoDuration;
        }
        
        Response::json($response);
    }
}

