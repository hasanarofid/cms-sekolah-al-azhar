#!/bin/bash

echo "================================================"
echo "🚀 Starting PHP Development Server"
echo "   with Video Upload Support (50MB)"
echo "================================================"
echo ""

# Change to php-backend directory
cd "$(dirname "$0")"

# Start PHP server with custom upload limits
php -S localhost:8000 \
    -t public \
    -d upload_max_filesize=50M \
    -d post_max_size=60M \
    -d max_execution_time=300 \
    -d max_input_time=300 \
    -d memory_limit=256M

echo ""
echo "Server stopped."
