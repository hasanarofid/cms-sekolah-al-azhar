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
}

