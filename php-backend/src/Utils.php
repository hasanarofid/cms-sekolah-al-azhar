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
     * Trim video to specified duration
     * @param string $inputPath - Path to input video file
     * @param string $outputPath - Path to output video file
     * @param int $durationSeconds - Duration in seconds (default: 5)
     * @return bool - True if successful, false otherwise
     */
    public static function trimVideo($inputPath, $outputPath, $durationSeconds = 5)
    {
        if (!file_exists($inputPath)) {
            throw new \Exception('Input video file not found');
        }

        $ffmpeg = self::findExecutable('ffmpeg');
        if (!$ffmpeg) {
            throw new \Exception('FFmpeg not found. Please install FFmpeg to enable video trimming.');
        }

        try {
            // Build FFmpeg command
            // -i input: input file
            // -ss 0: start from beginning
            // -t duration: trim to specified seconds
            // -c:v libx264: encode with H.264
            // -preset ultrafast: fast encoding
            // -crf 23: quality (lower is better, 23 is default)
            // -c:a aac: encode audio with AAC
            // -b:a 128k: audio bitrate
            // -movflags +faststart: optimize for web streaming
            // -y: overwrite output file without asking
            $command = sprintf(
                '%s -i %s -ss 0 -t %d -c:v libx264 -preset ultrafast -crf 23 -c:a aac -b:a 128k -movflags +faststart -y %s 2>&1',
                escapeshellarg($ffmpeg),
                escapeshellarg($inputPath),
                (int) $durationSeconds,
                escapeshellarg($outputPath)
            );

            // Execute command
            $output = shell_exec($command);
            
            // Check if output file was created
            if (!file_exists($outputPath) || filesize($outputPath) === 0) {
                throw new \Exception('Failed to create trimmed video. FFmpeg output: ' . $output);
            }

            return true;
        } catch (\Exception $e) {
            // Clean up output file if it exists
            if (file_exists($outputPath)) {
                @unlink($outputPath);
            }
            throw $e;
        }
    }

    /**
     * Check if video is longer than specified duration
     * @param string $videoPath - Path to video file
     * @param int $durationSeconds - Duration in seconds to check against
     * @return bool - True if video is longer than duration
     */
    public static function shouldTrimVideo($videoPath, $durationSeconds = 5)
    {
        $duration = self::getVideoDuration($videoPath);
        if ($duration === null) {
            // If we can't get duration, don't trim
            return false;
        }
        return $duration > $durationSeconds;
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
