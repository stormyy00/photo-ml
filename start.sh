#!/bin/bash

BACKEND_IMAGE="photo-ml"
BACKEND_CONTAINER="photo-ml-backend-container"
BACKEND_PORT=5050
BACKEND_URL="http://127.0.0.1:5050"


cleanup() {
  echo "🛑 Stopping backend container..."
  docker stop $BACKEND_CONTAINER 2>/dev/null || true
  docker rm $BACKEND_CONTAINER 2>/dev/null || true
  exit 0
}
trap cleanup SIGINT SIGTERM

echo "🚀 Building backend Docker image..."
docker build --platform=linux/amd64 -t $BACKEND_IMAGE .

echo "📦 Starting backend container..."
docker run -d --name photo-ml-backend --rm -p $BACKEND_PORT:$BACKEND_PORT $BACKEND_IMAGE

echo "✅ Backend running at $BACKEND_URL"

echo "🎨 Starting frontend with Bun..."
bun dev
