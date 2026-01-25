#!/bin/bash
# Script complet pour résoudre le problème des doublons et relancer les services

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  FIX COMPLET: Doublons Users + Démarrage Services           ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

cd "$(dirname "$0")"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "1️⃣  Nettoyage des doublons dans Neo4j..."
echo ""
echo "⚠️  IMPORTANT: Ouvre Neo4j Browser et exécute ces requêtes:"
echo ""
echo -e "${YELLOW}http://localhost:7474${NC}"
echo ""
echo "Copie-colle ces requêtes une par une:"
echo ""
echo -e "${GREEN}// 1. Voir les doublons${NC}"
echo "MATCH (u:Users)"
echo "WITH u.email AS email, COLLECT(u) AS users"
echo "WHERE SIZE(users) > 1"
echo "RETURN email, SIZE(users) AS count;"
echo ""
echo -e "${GREEN}// 2. Supprimer les doublons${NC}"
echo "MATCH (u:Users)"
echo "WITH u.email AS email, COLLECT(u) AS users"
echo "WHERE SIZE(users) > 1"
echo "WITH email, users, HEAD([user IN users ORDER BY user.created_at ASC]) AS oldest"
echo "UNWIND users AS user"
echo "WHERE user.id <> oldest.id"
echo "DELETE user;"
echo ""
echo -e "${GREEN}// 3. Créer contrainte d'unicité${NC}"
echo "CREATE CONSTRAINT users_email_unique IF NOT EXISTS"
echo "FOR (u:Users)"
echo "REQUIRE u.email IS UNIQUE;"
echo ""
echo -e "${GREEN}// 4. Vérifier${NC}"
echo "MATCH (u:Users {email: \"admin@user.com\"})"
echo "RETURN COUNT(u) AS count;"
echo ""
echo "Appuie sur ENTRÉE après avoir exécuté les requêtes..."
read

echo ""
echo "2️⃣  Démarrage de tous les services avec Docker Compose..."
echo ""

docker-compose up -d

echo ""
echo "3️⃣  Attente du démarrage (30 secondes)..."
sleep 30

echo ""
echo "4️⃣  Vérification de l'état des services..."
echo ""

# Vérifier API Gateway
if curl -s http://localhost:1111/actuator/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} API Gateway UP (http://localhost:1111)"
else
    echo -e "${YELLOW}⚠${NC}  API Gateway pas encore UP (attendre 30s de plus)"
fi

# Vérifier User Service
if curl -s http://localhost:8081/actuator/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} User Service UP (http://localhost:8081)"
else
    echo -e "${YELLOW}⚠${NC}  User Service pas encore UP (attendre 30s de plus)"
fi

echo ""
echo "5️⃣  Test du login..."
echo ""

LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:1111/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@user.com","password":"Password123!"}' 2>&1)

HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n 1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓${NC} Login fonctionne ! (200 OK)"
    echo ""
    echo "Token:"
    echo "$LOGIN_RESPONSE" | head -n -1 | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE" | head -n -1
elif [ "$HTTP_CODE" = "401" ]; then
    echo -e "${YELLOW}⚠${NC}  Login retourne 401 (credentials peut-être incorrects)"
elif [ "$HTTP_CODE" = "500" ]; then
    echo -e "${RED}✗${NC} Login retourne 500 (problème serveur)"
else
    echo -e "${YELLOW}⚠${NC}  Login retourne: $HTTP_CODE (services pas encore prêts?)"
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                     TERMINÉ !                                ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 URLs utiles:"
echo "   • Frontend: http://localhost:4200"
echo "   • API Gateway: http://localhost:1111"
echo "   • Neo4j Browser: http://localhost:7474"
echo "   • Eureka: http://localhost:8761"
echo ""
echo "🧪 Tester le frontend:"
echo "   1. Va sur http://localhost:4200/login"
echo "   2. Email: admin@user.com"
echo "   3. Password: Password123!"
echo ""
