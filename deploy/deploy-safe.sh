#!/bin/bash
set -e

# Configuration
APP_DIR="/opt/cleanmeta"
REPO_URL="YOUR_REPO_URL" # User will need to set this or upload manually

echo "Starting Safe Docker Deployment..."

# 1. Create Directory
if [ ! -d "$APP_DIR" ]; then
    echo "Creating directory $APP_DIR..."
    mkdir -p $APP_DIR
fi

# 2. Check for Docker
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed on this server."
    exit 1
fi

echo "Deploying to $APP_DIR"
cd $APP_DIR

# Note: Ideally we pull code here. For manual upload workflow:
# We assume files are uploaded to this dir.

# 3. Build and Start
echo "Building and Starting Containers..."
docker compose -f docker-compose.prod.yml up -d --build

echo "Deployment Complete!"
echo "App is running on http://localhost:3003 (Internal)"
