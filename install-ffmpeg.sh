#!/bin/bash

echo "================================================"
echo "🎬 Installing FFmpeg for Video Processing"
echo "================================================"
echo ""

# Check if FFmpeg already installed
if command -v ffmpeg &> /dev/null; then
    echo "✅ FFmpeg already installed!"
    ffmpeg -version | head -1
    which ffmpeg
    echo ""
    echo "Skip installation."
    exit 0
fi

echo "📦 Installing FFmpeg..."
echo ""

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if [ -f /etc/debian_version ]; then
        # Debian/Ubuntu
        echo "Detected: Debian/Ubuntu"
        sudo apt update
        sudo apt install ffmpeg -y
    elif [ -f /etc/redhat-release ]; then
        # CentOS/RHEL
        echo "Detected: CentOS/RHEL"
        sudo yum install epel-release -y
        sudo yum install ffmpeg -y
    else
        echo "Unknown Linux distribution"
        echo "Please install FFmpeg manually:"
        echo "  Ubuntu/Debian: sudo apt install ffmpeg"
        echo "  CentOS/RHEL: sudo yum install ffmpeg"
        exit 1
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "Detected: macOS"
    if ! command -v brew &> /dev/null; then
        echo "❌ Homebrew not found!"
        echo "Install Homebrew first: https://brew.sh"
        exit 1
    fi
    brew install ffmpeg
else
    echo "Unsupported OS: $OSTYPE"
    exit 1
fi

echo ""
echo "================================================"
echo "✅ FFmpeg Installation Complete!"
echo "================================================"
echo ""

# Verify installation
if command -v ffmpeg &> /dev/null; then
    echo "✅ FFmpeg installed successfully!"
    echo ""
    ffmpeg -version | head -3
    echo ""
    echo "Location: $(which ffmpeg)"
    echo ""
    echo "================================================"
    echo "🎉 Ready to process videos!"
    echo "================================================"
    echo ""
    echo "Next steps:"
    echo "1. Restart development servers"
    echo "2. Upload video di admin panel"
    echo "3. Sistem akan otomatis gunakan FFmpeg untuk trim video"
else
    echo "❌ Installation failed!"
    echo "Please install FFmpeg manually."
    exit 1
fi

