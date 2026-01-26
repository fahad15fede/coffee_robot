# Use Python 3.9 slim image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy frontend package files and install dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copy all source code
COPY . .

# Build React app
RUN cd frontend && npm run build

# Test imports before starting
RUN python3 test_import.py

# Expose port
EXPOSE $PORT

# Start the application
CMD ["python3", "start.py"]