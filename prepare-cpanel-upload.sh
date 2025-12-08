#!/bin/bash

echo "================================================"
echo "📦 Preparing Files for cPanel Upload"
echo "================================================"
echo ""

cd "$(dirname "$0")"

# Create deploy folder
mkdir -p deploy-cpanel
cd deploy-cpanel

echo "1️⃣ Building Frontend..."
cd ../react-frontend
npm run build:prod
echo "✅ Frontend built successfully!"
echo ""

echo "2️⃣ Packaging Backend..."
cd ..
zip -r deploy-cpanel/php-backend.zip php-backend/ \
    -x "php-backend/vendor/*" \
    -x "php-backend/.env" \
    -x "php-backend/node_modules/*" \
    -x "php-backend/.git/*" \
    -x "php-backend/*.log"

echo "✅ Backend packaged!"
echo ""

echo "3️⃣ Packaging Frontend..."
cd react-frontend/dist
zip -r ../../deploy-cpanel/frontend-dist.zip ./*
cd ../..

echo "✅ Frontend packaged!"
echo ""

echo "================================================"
echo "✅ Files Ready for Upload!"
echo "================================================"
echo ""
echo "📁 Files location: deploy-cpanel/"
echo ""
echo "Files created:"
echo "  1. php-backend.zip     → Upload ke /public_html/api/"
echo "  2. frontend-dist.zip   → Extract ke /public_html/"
echo ""
echo "Next steps:"
echo "  1. Upload php-backend.zip ke cPanel"
echo "  2. Extract di /public_html/api/"
echo "  3. Upload frontend-dist.zip"
echo "  4. Extract di /public_html/"
echo "  5. Setup .env file"
echo "  6. Run: composer install --no-dev"
echo ""
echo "📖 Read: DEPLOYMENT-CPANEL.md for detailed guide"
echo "================================================"

