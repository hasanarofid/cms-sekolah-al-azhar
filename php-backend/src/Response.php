<?php

namespace App;

class Response
{
    public static function json($data, $statusCode = 200)
    {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        
        // CORS headers
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
        if (in_array($origin, ALLOWED_ORIGINS)) {
            header("Access-Control-Allow-Origin: $origin");
        } else {
            // Untuk development, izinkan semua origin jika tidak ada di list
            // Di production, hapus baris ini dan pastikan semua origin ada di ALLOWED_ORIGINS
            if (getenv('APP_ENV') !== 'production') {
                header('Access-Control-Allow-Origin: *');
            }
        }
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Allow-Credentials: true');
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

