#!/bin/bash
# Script de test rapide pour le login après le fix 401

set -e

API_URL="http://localhost:1111"

echo "🧪 Test du fix 401 sur /auth/login"
echo "===================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Vérifier que le Gateway est up
echo "1️⃣  Vérification Gateway..."
if curl -s -f "${API_URL}/actuator/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Gateway est accessible"
else
    echo -e "${RED}✗${NC} Gateway non accessible sur ${API_URL}"
    echo "   → Lance le Gateway: cd api-gateway && mvn spring-boot:run"
    exit 1
fi

echo ""
echo "2️⃣  Test LOGIN (endpoint public)..."

# Test login
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password"
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓${NC} Login réussi (200 OK)"
    echo ""
    echo "Response:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"

    # Extraire le token
    TOKEN=$(echo "$BODY" | jq -r '.token' 2>/dev/null)

    if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
        echo ""
        echo -e "${GREEN}✓${NC} JWT Token reçu"
        echo ""
        echo "3️⃣  Test endpoint protégé (avec token)..."

        # Test avec token
        MOVIES_RESPONSE=$(curl -s -w "\n%{http_code}" "${API_URL}/api/v1/movies" \
          -H "Authorization: Bearer $TOKEN")

        MOVIES_HTTP=$(echo "$MOVIES_RESPONSE" | tail -n 1)

        if [ "$MOVIES_HTTP" = "200" ]; then
            echo -e "${GREEN}✓${NC} Accès aux movies avec token: OK"
        else
            echo -e "${YELLOW}⚠${NC}  Accès aux movies retourne: $MOVIES_HTTP"
        fi
    fi

elif [ "$HTTP_CODE" = "401" ]; then
    echo -e "${RED}✗${NC} Login échoue encore avec 401 Unauthorized"
    echo ""
    echo "Causes possibles:"
    echo "  1. Gateway pas redémarré avec le nouveau code"
    echo "  2. User Service non accessible"
    echo "  3. Credentials incorrects"
    echo ""
    echo "Actions:"
    echo "  • Rebuild: cd api-gateway && mvn clean package -DskipTests"
    echo "  • Redémarrer: mvn spring-boot:run"

elif [ "$HTTP_CODE" = "404" ]; then
    echo -e "${RED}✗${NC} Endpoint non trouvé (404)"
    echo "   → Vérifier que la route /api/v1/auth/** est configurée"

else
    echo -e "${YELLOW}⚠${NC}  Login retourne: $HTTP_CODE"
    echo "Response: $BODY"
fi

echo ""
echo "4️⃣  Test REGISTER (endpoint public)..."

REGISTER_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }')

REGISTER_HTTP=$(echo "$REGISTER_RESPONSE" | tail -n 1)

if [ "$REGISTER_HTTP" = "201" ] || [ "$REGISTER_HTTP" = "200" ]; then
    echo -e "${GREEN}✓${NC} Register accessible (endpoint public OK)"
elif [ "$REGISTER_HTTP" = "401" ]; then
    echo -e "${RED}✗${NC} Register bloqué (401) - fix incomplet"
elif [ "$REGISTER_HTTP" = "409" ]; then
    echo -e "${GREEN}✓${NC} Register accessible (utilisateur existe déjà)"
else
    echo -e "${YELLOW}⚠${NC}  Register retourne: $REGISTER_HTTP"
fi

echo ""
echo "═══════════════════════════════════"
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ FIX VALIDÉ - Login fonctionne !${NC}"
else
    echo -e "${RED}❌ FIX INCOMPLET - Voir actions ci-dessus${NC}"
fi
echo "═══════════════════════════════════"
