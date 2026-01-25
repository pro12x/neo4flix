#!/bin/bash
# Script de build et test local du frontend Docker

set -e

cd "$(dirname "$0")"

echo "🔨 Building neo4flix-ui Docker image..."
docker build -t neo4flix-ui:latest .

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "🧪 Testing the image locally..."
echo ""

# Stop any existing container
docker rm -f neo4flix-ui-test 2>/dev/null || true

# Run container
docker run -d \
  --name neo4flix-ui-test \
  -p 8080:80 \
  -e API_BASE_URL=http://localhost:1111 \
  neo4flix-ui:latest

echo ""
echo "✅ Container started!"
echo ""
echo "📋 Container info:"
docker ps --filter name=neo4flix-ui-test --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "🌐 Access the UI at: http://localhost:8080"
echo ""
echo "📝 View logs: docker logs -f neo4flix-ui-test"
echo "🛑 Stop test: docker rm -f neo4flix-ui-test"
echo ""
