<?php
// Test file untuk debug 403 error
echo "PHP is working!<br>";
echo "Current directory: " . __DIR__ . "<br>";
echo "Server: " . $_SERVER['SERVER_SOFTWARE'] . "<br>";
echo "PHP Version: " . phpversion() . "<br>";

// Test file permissions
$files = [
    'index.php',
    '.htaccess',
    '../config/database.php',
    '../vendor/autoload.php'
];

echo "<br>File check:<br>";
foreach ($files as $file) {
    $path = __DIR__ . '/' . $file;
    echo $file . ": " . (file_exists($path) ? "EXISTS" : "NOT FOUND") . "<br>";
}

// Test .htaccess
if (file_exists(__DIR__ . '/.htaccess')) {
    echo "<br>.htaccess content:<br>";
    echo "<pre>" . htmlspecialchars(file_get_contents(__DIR__ . '/.htaccess')) . "</pre>";
} else {
    echo "<br>.htaccess: NOT FOUND<br>";
}

