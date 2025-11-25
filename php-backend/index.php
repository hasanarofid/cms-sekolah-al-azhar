<?php
/**
 * Root Entry Point
 * Forward semua request ke public/index.php
 * 
 * File ini diperlukan karena subdomain api.aicjatibening.com
 * mengarah ke root direktori /public_html/api/
 * sedangkan index.php sebenarnya ada di /public_html/api/public/
 */

// Change to public directory context
chdir(__DIR__ . '/public');

// Update SCRIPT_NAME to reflect public/index.php
// This helps with path parsing in public/index.php
$_SERVER['SCRIPT_NAME'] = '/public/index.php';

// Include the actual entry point
require_once __DIR__ . '/public/index.php';

