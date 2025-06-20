#!/bin/bash

# PWA Icon Generator Script for Ahorrai
# This script helps generate the required PWA icons

echo "🎨 PWA Icon Generator for Ahorrai"
echo "=================================="

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick is not installed."
    echo "Please install ImageMagick first:"
    echo "  macOS: brew install imagemagick"
    echo "  Ubuntu: sudo apt-get install imagemagick"
    echo "  Windows: Download from https://imagemagick.org/"
    exit 1
fi

# Create icons directory if it doesn't exist
mkdir -p public/assets/images

# Check if source image exists
SOURCE_IMAGE=""
if [ -f "public/assets/images/logo.png" ]; then
    SOURCE_IMAGE="public/assets/images/logo.png"
elif [ -f "public/assets/images/logo.jpg" ]; then
    SOURCE_IMAGE="public/assets/images/logo.jpg"
elif [ -f "public/assets/images/logo.jpeg" ]; then
    SOURCE_IMAGE="public/assets/images/logo.jpeg"
fi

if [ -n "$SOURCE_IMAGE" ]; then
    echo "✅ Found source image: $SOURCE_IMAGE"
    echo "Generating PWA icons..."
    
    # Generate 192x192 icon
    convert "$SOURCE_IMAGE" -resize 192x192 -background white -gravity center -extent 192x192 public/assets/images/icon-192x192.png
    
    # Generate 512x512 icon
    convert "$SOURCE_IMAGE" -resize 512x512 -background white -gravity center -extent 512x512 public/assets/images/icon-512x512.png
    
    echo "✅ PWA icons generated successfully!"
    echo "📁 Icons created:"
    echo "  - public/assets/images/icon-192x192.png"
    echo "  - public/assets/images/icon-512x512.png"
else
    echo "⚠️  No source logo found."
    echo "Please add a logo file to public/assets/images/ with one of these names:"
    echo "  - logo.png"
    echo "  - logo.jpg"
    echo "  - logo.jpeg"
    echo ""
    echo "Then run this script again to generate the PWA icons."
    echo ""
    echo "Alternatively, you can manually create the required icons:"
    echo "  - public/assets/images/icon-192x192.png (192x192 pixels)"
    echo "  - public/assets/images/icon-512x512.png (512x512 pixels)"
fi

echo ""
echo "🎯 Next steps:"
echo "1. Add your logo to public/assets/images/logo.png (if not done already)"
echo "2. Run this script again to generate icons"
echo "3. Test the PWA: npm run build && npm start"
echo "4. Check PWA functionality in browser DevTools" 