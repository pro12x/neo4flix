#!/bin/bash

# Quick Fix Script for Neo4Flix Docker Health Check Issues
# Run this after the build to verify everything is working

echo "Checking Docker containers..."
echo ""

# Check if containers are running
RUNNING=$(docker compose ps --format json 2>/dev/null | wc -l)

if [ "$RUNNING" -eq 0 ]; then
    echo "No containers running. Starting them now..."
    docker compose up --build -d
    sleep 10
fi

echo "Container Status:"
echo "================"
docker compose ps

echo ""
echo "Checking Health Status:"
echo "======================"

# Check eureka-server
EUREKA_HEALTH=$(docker inspect --format='{{.State.Health.Status}}' Neo4Flix-eureka-server 2>/dev/null || echo "not_found")
echo "Eureka Server: $EUREKA_HEALTH"

# Check api-gateway
GATEWAY_HEALTH=$(docker inspect --format='{{.State.Health.Status}}' Neo4Flix-api-gateway 2>/dev/null || echo "not_found")
echo "API Gateway:   $GATEWAY_HEALTH"

echo ""
echo "If any service shows 'unhealthy', check logs with:"
echo "  docker compose logs -f [service-name]"
echo ""
echo "Common issues:"
echo "  1. Service takes time to start - wait 40-60 seconds"
echo "  2. Missing actuator dependency - check pom.xml"
echo "  3. Port conflicts - check if ports are available"
