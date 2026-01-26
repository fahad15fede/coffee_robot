# Use Python 3.9 slim image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy frontend package.json and install dependencies
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install

# Go back to app root and copy all files
WORKDIR /app
COPY . .

# Build React app
WORKDIR /app/frontend
RUN npm run build

# Back to app root and create symlink to avoid space issues
WORKDIR /app
RUN ln -s "OOP barista coffee" coffee_app

# Make start script executable
RUN chmod +x start.py

# Expose port
EXPOSE $PORT

# Start the application
ENTRYPOINT ["python3", "start.py"]