#!/bin/bash

# Neo4Flix Docker Compose Startup Script
# This script builds JARs and starts all containers

set -e

echo "======================================"
echo "Neo4Flix - Docker Compose Startup"
echo "======================================"
echo ""

# Step 1: Build JARs
echo "Step 1/3: Building Maven JARs..."
mvn clean package -DskipTests
if [ $? -ne 0 ]; then
    echo "❌ Maven build failed!"
    exit 1
fi
echo "✅ Maven build successful!"
echo ""

# Step 2: Stop any running containers
echo "Step 2/3: Stopping any running containers..."
docker compose down
echo "✅ Containers stopped"
echo ""

# Step 3: Build and start containers
echo "Step 3/3: Building and starting Docker containers..."
docker compose up --build -d
if [ $? -ne 0 ]; then
    echo "❌ Docker compose failed!"
    exit 1
fi
echo ""

# Wait a moment for containers to start
sleep 5

# Show status
echo "======================================"
echo "Container Status:"
echo "======================================"
docker compose ps

echo ""
echo "======================================"
echo "✅ Startup complete!"
echo "======================================"
echo ""
echo "Services:"
echo "  - Eureka Server:    http://localhost:8761"
echo "  - API Gateway:      http://localhost:1111"
echo "  - User Service:     http://localhost:1112"
echo "  - Movie Service:    http://localhost:1113"
echo "  - Rating Service:   http://localhost:1114"
echo "  - Recommendation:   http://localhost:1115"
echo "  - Neo4j Browser:    http://localhost:7474"
echo ""
echo "To view logs: docker compose logs -f [service-name]"
echo "To stop all:  docker compose down"
echo ""
