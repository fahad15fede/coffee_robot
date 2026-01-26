#!/bin/bash
set -e

echo "🚀 Starting Coffee Shop Application..."
echo "📁 Current directory: $(pwd)"
echo "📁 Contents: $(ls -la)"

# Execute Python directly without any cd commands
exec python3 start.py