#!/bin/bash
# Script de démarrage complet après le refactoring Security

set -e

echo "🚀 Démarrage complet Neo4flix"
echo "=============================="
echo ""

cd "$(dirname "$0")"

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "1️⃣  Vérification des services requis..."
echo ""

# Vérifier Neo4j
if ! curl -s http://localhost:7474 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠${NC}  Neo4j non accessible sur localhost:7474"
    echo "   → Lance Docker: docker-compose up -d neo4j"
    echo "   OU vérifie que Neo4j tourne localement"
    echo ""
fi

# Vérifier Eureka
if ! curl -s http://localhost:8761 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠${NC}  Eureka non accessible sur localhost:8761"
    echo "   → Lance Eureka: cd eureka-server && mvn spring-boot:run &"
    echo ""
fi

echo "2️⃣  Rebuild rapide des services modifiés..."
echo ""

# Rebuild API Gateway (modifié avec Security)
echo "   • API Gateway..."
cd api-gateway
mvn clean install -DskipTests > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "     ${GREEN}✓${NC} Built"
else
    echo -e "     ${RED}✗${NC} Failed"
fi
cd ..

# Rebuild Movie Service (Security supprimée)
echo "   • Movie Service..."
cd movie-service
mvn clean install -DskipTests > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "     ${GREEN}✓${NC} Built"
else
    echo -e "     ${RED}✗${NC} Failed"
fi
cd ..

# User Service pas rebuilder (inchangé)
echo "   • User Service (skip - inchangé)"

echo ""
echo "3️⃣  Démarrage des services..."
echo ""

# Fonction pour lancer un service en arrière-plan
start_service() {
    local service_name=$1
    local service_dir=$2
    local port=$3

    echo "   • Démarrage $service_name (port $port)..."
    cd "$service_dir"
    nohup mvn spring-boot:run > "../logs/${service_name}.log" 2>&1 &
    echo $! > "../logs/${service_name}.pid"
    cd ..
    sleep 2
}

# Créer dossier logs
mkdir -p logs

# Démarrer les services
start_service "API Gateway" "api-gateway" "1111"
start_service "User Service" "user-service" "8081"
start_service "Movie Service" "movie-service" "8082"
start_service "Rating Service" "rating-service" "8083"
start_service "Recommendation Service" "recommendation-service" "8084"

echo ""
echo "4️⃣  Attente du démarrage (30s)..."
sleep 30

echo ""
echo "5️⃣  Vérification de l'état des services..."
echo ""

# Vérifier Gateway
if curl -s http://localhost:1111/actuator/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} API Gateway UP (http://localhost:1111)"
else
    echo -e "${RED}✗${NC} API Gateway DOWN"
    echo "   → Logs: tail -f logs/API\ Gateway.log"
fi

# Vérifier User Service
if curl -s http://localhost:8081/actuator/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} User Service UP (http://localhost:8081)"
else
    echo -e "${RED}✗${NC} User Service DOWN"
    echo "   → Logs: tail -f logs/User\ Service.log"
fi

# Vérifier Movie Service
if curl -s http://localhost:8082/actuator/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Movie Service UP (http://localhost:8082)"
else
    echo -e "${RED}✗${NC} Movie Service DOWN"
    echo "   → Logs: tail -f logs/Movie\ Service.log"
fi

echo ""
echo "6️⃣  Test du login..."
echo ""

LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:1111/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' 2>&1)

HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n 1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓${NC} Login fonctionne (200 OK)"
elif [ "$HTTP_CODE" = "401" ]; then
    echo -e "${YELLOW}⚠${NC}  Login retourne 401 (credentials incorrects ou user inexistant)"
elif [ "$HTTP_CODE" = "500" ]; then
    echo -e "${RED}✗${NC} Login retourne 500 (erreur serveur)"
    echo "   → Vérifier logs User Service: tail -f logs/User\ Service.log"
else
    echo -e "${YELLOW}⚠${NC}  Login retourne: $HTTP_CODE"
fi

echo ""
echo "═══════════════════════════════════════"
echo -e "${GREEN}✅ Services démarrés !${NC}"
echo "═══════════════════════════════════════"
echo ""
echo "📋 URLs utiles:"
echo "   • Frontend: http://localhost:4200"
echo "   • API Gateway: http://localhost:1111"
echo "   • Neo4j Browser: http://localhost:7474"
echo "   • Eureka: http://localhost:8761"
echo ""
echo "📁 Logs:"
echo "   → tail -f logs/*.log"
echo ""
echo "🛑 Pour arrêter:"
echo "   → kill \$(cat logs/*.pid)"
echo ""
