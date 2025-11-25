<?php

namespace App;

class Response
{
    public static function json($data, $statusCode = 200)
    {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        
        // CORS headers
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $appEnv = getenv('APP_ENV') ?: 'development';
        
        // Jika origin ada di ALLOWED_ORIGINS, set header dengan origin tersebut
        // Ini penting untuk credentials (cookies, auth headers)
        // Catatan: Ketika menggunakan credentials: true, tidak bisa pakai wildcard (*)
        if ($origin && in_array($origin, ALLOWED_ORIGINS)) {
            header("Access-Control-Allow-Origin: $origin");
            header('Access-Control-Allow-Credentials: true');
        } else {
            // Fallback: jika tidak ada origin atau tidak di list
            if ($appEnv !== 'production') {
                // Development: izinkan semua origin (tanpa credentials)
                header('Access-Control-Allow-Origin: *');
            }
            // Production: jika origin tidak di list, tidak set header (akan ditolak browser)
            // Ini untuk keamanan
        }
        
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
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

