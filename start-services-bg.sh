#!/bin/bash
# Script de démarrage simple et rapide

echo "🚀 Démarrage Neo4flix (services backend)"
echo "=========================================="

cd "$(dirname "$0")"
PROJECT_DIR="$(pwd)"

# Créer logs
mkdir -p logs

# Fonction pour démarrer un service
start_service() {
    local name=$1
    local dir=$2
    local port=$3

    echo "  → Démarrage $name (port $port)..."
    cd "$PROJECT_DIR/$dir"
    mvn spring-boot:run > "$PROJECT_DIR/logs/$name.log" 2>&1 &
    local pid=$!
    echo $pid > "$PROJECT_DIR/logs/$name.pid"
    echo "     PID: $pid"
    cd "$PROJECT_DIR"
}

# Démarrer Neo4j
echo ""
echo "1. Neo4j..."
docker-compose up -d neo4j 2>/dev/null
sleep 2

# Démarrer Eureka
echo ""
echo "2. Eureka Server..."
start_service "eureka" "eureka-server" "8761"
sleep 15

# Démarrer User Service
echo ""
echo "3. User Service..."
start_service "user-service" "user-service" "8081"
sleep 10

# Démarrer API Gateway
echo ""
echo "4. API Gateway..."
start_service "api-gateway" "api-gateway" "1111"
sleep 10

# Démarrer Movie Service
echo ""
echo "5. Movie Service..."
start_service "movie-service" "movie-service" "8082"
sleep 5

echo ""
echo "=========================================="
echo "✅ Tous les services ont été lancés !"
echo "=========================================="
echo ""
echo "Attendre 30-60 secondes pour le démarrage complet."
echo ""
echo "Vérifier l'état:"
echo "  curl http://localhost:1111/actuator/health"
echo ""
echo "Voir les logs:"
echo "  tail -f logs/api-gateway.log"
echo "  tail -f logs/user-service.log"
echo ""
echo "Arrêter tous les services:"
echo "  kill \$(cat logs/*.pid)"
echo ""
