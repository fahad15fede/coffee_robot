#!/bin/bash
set -e

echo "🚀 Starting Coffee Shop Application..."
echo "📁 Current directory: $(pwd)"
echo "🐍 Python version: $(python3 --version)"
echo "📦 Node version: $(node --version)"

# Start the Python application
exec python3 start.py