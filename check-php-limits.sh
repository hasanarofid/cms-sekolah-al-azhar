#!/bin/bash

echo "================================================"
echo "🔍 Checking PHP Upload Limits"
echo "================================================"
echo ""

echo "Current PHP Configuration:"
echo ""

php -r "echo 'upload_max_filesize: ' . ini_get('upload_max_filesize') . PHP_EOL;"
php -r "echo 'post_max_size: ' . ini_get('post_max_size') . PHP_EOL;"
php -r "echo 'max_execution_time: ' . ini_get('max_execution_time') . ' seconds' . PHP_EOL;"
php -r "echo 'max_input_time: ' . ini_get('max_input_time') . ' seconds' . PHP_EOL;"
php -r "echo 'memory_limit: ' . ini_get('memory_limit') . PHP_EOL;"

echo ""
echo "================================================"

# Check if limits are good
UPLOAD_LIMIT=$(php -r "echo ini_get('upload_max_filesize');")
if [[ "$UPLOAD_LIMIT" == "2M" ]]; then
    echo "⚠️  WARNING: upload_max_filesize is still 2M"
    echo "   Need to restart PHP server to apply new config!"
    echo ""
    echo "   Run:"
    echo "   cd php-backend && php -S localhost:8000 -t public"
elif [[ "$UPLOAD_LIMIT" == "50M" ]]; then
    echo "✅ GOOD: PHP upload limit is 50M"
    echo "   Video uploads should work fine!"
else
    echo "ℹ️  Current limit: $UPLOAD_LIMIT"
    echo "   Recommended: 50M for video uploads"
fi

echo "================================================"


