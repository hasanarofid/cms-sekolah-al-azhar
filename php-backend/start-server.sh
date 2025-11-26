#!/bin/bash
# Script untuk start PHP built-in server dengan upload limits yang benar

cd "$(dirname "$0")/public"

echo "Starting PHP server with upload limits..."
echo "upload_max_filesize: 50M"
echo "post_max_size: 55M"
echo ""
echo "Server running at: http://localhost:8000"
echo "Press Ctrl+C to stop"
echo ""

php -d upload_max_filesize=50M \
    -d post_max_size=55M \
    -d max_execution_time=300 \
    -d max_input_time=300 \
    -d memory_limit=128M \
    -S localhost:8000

