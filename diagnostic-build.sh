#!/bin/bash
# Test build direct d'un service pour diagnostic

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  🔍 DIAGNOSTIC BUILD DOCKER                                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

cd "$(dirname "$0")"

echo "1️⃣  Vérification structure projet..."
echo ""

# Vérifier pom.xml racine
if [ -f "pom.xml" ]; then
    echo "✅ pom.xml (racine) existe"
else
    echo "❌ pom.xml (racine) MANQUANT!"
    exit 1
fi

# Vérifier services
for service in eureka-server api-gateway user-service movie-service rating-service recommendation-service; do
    if [ -d "$service" ]; then
        echo "✅ $service/ existe"

        if [ -f "$service/pom.xml" ]; then
            echo "  ✅ $service/pom.xml OK"
        else
            echo "  ❌ $service/pom.xml MANQUANT"
        fi

        if [ -d "$service/src" ]; then
            echo "  ✅ $service/src/ OK"
        else
            echo "  ❌ $service/src/ MANQUANT"
        fi
    else
        echo "❌ $service/ MANQUANT!"
        exit 1
    fi
done

echo ""
echo "2️⃣  Vérification .dockerignore..."
if [ -f ".dockerignore" ]; then
    echo "✅ .dockerignore existe"
    echo ""
    echo "Contenu:"
    cat .dockerignore
else
    echo "❌ .dockerignore MANQUANT!"
fi

echo ""
echo "3️⃣  Test build eureka-server..."
echo ""

docker compose build --no-cache eureka-server

echo ""
echo "✅ Build eureka-server réussi!"
echo ""
echo "🚀 Le build devrait fonctionner maintenant:"
echo "   docker compose up -d --build"
echo ""
