<?php
/**
 * Test script untuk debug routing
 * Akses: http://localhost:8000/test-route.php?path=api/auth/login
 */

$testPath = $_GET['path'] ?? 'api/auth/login';

echo "<h2>Testing Route: {$testPath}</h2>";

$routes = [
    'api/auth/login' => 'AuthController@login',
    'api/auth/session' => 'AuthController@session',
];

$path = trim($testPath, '/');

echo "<p>Path: <strong>{$path}</strong></p>";

foreach ($routes as $pattern => $handler) {
    if (strpos($pattern, '(') === false) {
        $match = ($path === $pattern);
        echo "<p>Pattern: <code>{$pattern}</code> - Match: " . ($match ? 'YES' : 'NO') . "</p>";
        if ($match) {
            echo "<p>Handler: <code>{$handler}</code></p>";
        }
    }
}

