#!/bin/bash
set -e

echo "Installing Python dependencies..."
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt

echo "Installing Node.js dependencies..."
cd frontend
npm install

echo "Building React app..."
npm run build

echo "Build completed successfully!"