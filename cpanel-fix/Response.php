<?php

namespace App;

class Response
{
    public static function json($data, $statusCode = 200)
    {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        
        // CORS headers - Simple & compatible untuk semua environment
        // Gunakan wildcard untuk public API (no credentials needed)
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Access-Control-Max-Age: 86400');

        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function error($message, $statusCode = 500)
    {
        self::json(['error' => $message], $statusCode);
    }

    public static function success($data = null, $statusCode = 200)
    {
        if ($data === null) {
            self::json(['success' => true], $statusCode);
        } else {
            self::json($data, $statusCode);
        }
    }
}

