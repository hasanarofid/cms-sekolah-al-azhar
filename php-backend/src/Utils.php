<?php

namespace App;

class Utils
{
    /**
     * Generate unique ID (cuid-like)
     */
    public static function generateId()
    {
        $timestamp = dechex(time());
        $random = bin2hex(random_bytes(8));
        return $timestamp . $random;
    }

    /**
     * Slugify text
     */
    public static function slugify($text)
    {
        $text = mb_strtolower($text, 'UTF-8');
        $text = trim($text);
        $text = preg_replace('/\s+/', '-', $text);
        $text = preg_replace('/[^\w\-]+/u', '', $text);
        $text = preg_replace('/\-+/', '-', $text);
        $text = trim($text, '-');
        return $text;
    }

    /**
     * Format date
     */
    public static function formatDate($date, $format = 'Y-m-d H:i:s')
    {
        if (is_string($date)) {
            $date = new \DateTime($date);
        }
        return $date->format($format);
    }

    /**
     * Get JSON input from request
     */
    public static function getJsonInput()
    {
        $json = file_get_contents('php://input');
        return json_decode($json, true) ?? [];
    }

    /**
     * Validate required fields
     */
    public static function validateRequired($data, $fields)
    {
        $missing = [];
        foreach ($fields as $field) {
            if (!isset($data[$field]) || $data[$field] === '') {
                $missing[] = $field;
            }
        }
        return $missing;
    }

    /**
     * Get video duration in seconds
     * Tries multiple methods: ffprobe, getID3, or fallback to browser detection
     */
    public static function getVideoDuration($videoPath)
    {
        if (!file_exists($videoPath)) {
            return null;
        }

        // Method 1: Try ffprobe (most reliable, if available)
        $ffprobe = self::findExecutable('ffprobe');
        if ($ffprobe) {
            try {
                $command = sprintf(
                    '%s -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "%s"',
                    escapeshellarg($ffprobe),
                    escapeshellarg($videoPath)
                );
                $output = shell_exec($command);
                if ($output !== null && $output !== false) {
                    $duration = (float) trim($output);
                    if ($duration > 0) {
                        return (int) round($duration);
                    }
                }
            } catch (\Exception $e) {
                // Fall through to next method
            }
        }

        // Method 2: Try getID3 library (if installed via composer)
        if (class_exists('getID3')) {
            try {
                $getID3 = new \getID3();
                $fileInfo = $getID3->analyze($videoPath);
                if (isset($fileInfo['playtime_seconds'])) {
                    return (int) round($fileInfo['playtime_seconds']);
                }
            } catch (\Exception $e) {
                // Fall through to next method
            }
        }

        // Method 3: Try PHP's built-in getID3 (if extension available)
        if (function_exists('getid3_lib')) {
            try {
                $getID3 = new \getID3();
                $fileInfo = $getID3->analyze($videoPath);
                if (isset($fileInfo['playtime_seconds'])) {
                    return (int) round($fileInfo['playtime_seconds']);
                }
            } catch (\Exception $e) {
                // Fall through
            }
        }

        // Method 4: Try mediainfo (if available)
        $mediainfo = self::findExecutable('mediainfo');
        if ($mediainfo) {
            try {
                $command = sprintf(
                    '%s --Output="General;%%Duration%%" "%s"',
                    escapeshellarg($mediainfo),
                    escapeshellarg($videoPath)
                );
                $output = shell_exec($command);
                if ($output !== null && $output !== false) {
                    $durationMs = (int) trim($output);
                    if ($durationMs > 0) {
                        return (int) round($durationMs / 1000); // Convert ms to seconds
                    }
                }
            } catch (\Exception $e) {
                // Fall through
            }
        }

        // If all methods fail, return null (frontend can detect via video element)
        return null;
    }

    /**
     * Find executable in system PATH
     */
    private static function findExecutable($name)
    {
        $paths = explode(PATH_SEPARATOR, getenv('PATH'));
        foreach ($paths as $path) {
            $fullPath = $path . DIRECTORY_SEPARATOR . $name;
            if (is_executable($fullPath)) {
                return $fullPath;
            }
        }
        
        // Also check common locations
        $commonPaths = [
            '/usr/bin',
            '/usr/local/bin',
            '/opt/homebrew/bin',
        ];
        foreach ($commonPaths as $path) {
            $fullPath = $path . DIRECTORY_SEPARATOR . $name;
            if (is_executable($fullPath)) {
                return $fullPath;
            }
        }
        
        return null;
    }
}
