#!/bin/bash
# Script de build Docker Neo4flix - Version finale

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                  BUILD DOCKER NEO4FLIX                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

cd "$(dirname "$0")"

# Afficher la configuration
echo "📋 Configuration actuelle:"
echo ""
echo "1. docker-compose.yml - Build contexts:"
grep -A2 "build:" docker-compose.yml | head -30
echo ""

echo "2. .dockerignore:"
cat .dockerignore
echo ""

echo "3. Structure des services:"
for service in eureka-server api-gateway user-service movie-service rating-service recommendation-service; do
    if [ -d "$service/src" ] && [ -f "$service/pom.xml" ]; then
        echo "  ✅ $service/ (pom.xml + src/)"
    else
        echo "  ❌ $service/ INCOMPLET"
    fi
done
echo ""

# Nettoyer
echo "🧹 Nettoyage du cache Docker..."
docker system prune -f
echo ""

# Build
echo "🔨 Build de tous les services..."
docker compose build --no-cache

echo ""
echo "✅ Build terminé !"
echo ""
echo "🚀 Lancer les services:"
echo "   docker compose up -d"
echo ""
