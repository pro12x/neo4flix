#!/bin/bash
# Script pour rebuilder tous les services après le refactoring Security

set -e

echo "🔧 Rebuild complet après refactoring Security"
echo "=============================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

cd "$(dirname "$0")"

echo "1️⃣  Clean et rebuild API Gateway..."
cd api-gateway
mvn clean package -DskipTests > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} API Gateway built successfully"
else
    echo -e "${YELLOW}⚠${NC}  API Gateway build failed - vérifier les logs"
fi
cd ..

echo ""
echo "2️⃣  Clean et rebuild Movie Service..."
cd movie-service
mvn clean package -DskipTests > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Movie Service built successfully"
else
    echo -e "${YELLOW}⚠${NC}  Movie Service build failed"
fi
cd ..

echo ""
echo "3️⃣  Clean et rebuild Rating Service..."
cd rating-service
mvn clean package -DskipTests > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Rating Service built successfully"
else
    echo -e "${YELLOW}⚠${NC}  Rating Service build failed"
fi
cd ..

echo ""
echo "4️⃣  Clean et rebuild Recommendation Service..."
cd recommendation-service
mvn clean package -DskipTests > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Recommendation Service built successfully"
else
    echo -e "${YELLOW}⚠${NC}  Recommendation Service build failed"
fi
cd ..

echo ""
echo "5️⃣  Rebuild User Service (unchanged)..."
cd user-service
mvn clean package -DskipTests > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} User Service built successfully"
else
    echo -e "${YELLOW}⚠${NC}  User Service build failed"
fi
cd ..

echo ""
echo -e "${GREEN}✅ Build terminé !${NC}"
echo ""
echo "📋 Résumé:"
echo "  • API Gateway: Spring Security + JWT GlobalFilter"
echo "  • Movie Service: NO Security (nettoyé)"
echo "  • Rating Service: NO Security (nettoyé)"
echo "  • Recommendation Service: NO Security (nettoyé)"
echo "  • User Service: Spring Security + JWT (inchangé)"
echo ""
echo "🚀 Prochaine étape: ./start-all.sh"
