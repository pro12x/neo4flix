#!/bin/bash
# Script pour tester le chargement des trailers
# Usage: ./test-trailers.sh

echo "🎬 Test du Chargement des Trailers"
echo "===================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}Ce script va:${NC}"
echo "  1. Compiler le movie-service"
echo "  2. Rebuilder l'image Docker"
echo "  3. Nettoyer la base Neo4j"
echo "  4. Redémarrer le service"
echo "  5. Attendre le chargement"
echo "  6. Vérifier les résultats"
echo ""
echo -e "${YELLOW}⏱️  Temps estimé: 5-10 minutes${NC}"
echo ""
echo -n "Continuer? (o/N): "
read confirm

if [[ ! $confirm =~ ^[oO]$ ]]; then
    echo "Opération annulée."
    exit 0
fi

echo ""
echo -e "${BLUE}📦 Étape 1/6: Compilation du movie-service...${NC}"
cd movie-service
mvn clean package -DskipTests > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Compilation réussie${NC}"
else
    echo -e "${YELLOW}⚠️  Erreur de compilation (vérifiez les logs)${NC}"
fi
cd ..

echo ""
echo -e "${BLUE}🐋 Étape 2/6: Rebuild de l'image Docker...${NC}"
docker-compose build movie-service > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Image Docker créée${NC}"
else
    echo -e "${YELLOW}⚠️  Erreur Docker build${NC}"
fi

echo ""
echo -e "${BLUE}🧹 Étape 3/6: Nettoyage de la base Neo4j...${NC}"
./clean-neo4j.sh > /dev/null 2>&1
echo -e "${GREEN}✅ Base nettoyée${NC}"

echo ""
echo -e "${BLUE}🔄 Étape 4/6: Redémarrage du movie-service...${NC}"
docker-compose restart movie-service > /dev/null 2>&1
echo -e "${GREEN}✅ Service redémarré${NC}"

echo ""
echo -e "${BLUE}⏳ Étape 5/6: Attente du chargement des films...${NC}"
echo -e "${YELLOW}Ceci peut prendre 3-5 minutes. Soyez patient...${NC}"
echo ""

# Attendre que le service soit prêt
sleep 10

# Suivre les logs pendant 3 minutes
timeout 180 docker-compose logs -f movie-service &
LOGS_PID=$!

# Attendre
sleep 180

# Arrêter les logs
kill $LOGS_PID 2>/dev/null

echo ""
echo -e "${BLUE}🔍 Étape 6/6: Vérification des résultats...${NC}"
echo ""

# Vérifier que l'API répond
if ! curl -s http://localhost:1113/api/v1/movies > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  L'API ne répond pas encore. Attendez encore quelques secondes.${NC}"
    exit 1
fi

# Statistiques
TOTAL=$(curl -s http://localhost:1113/api/v1/movies | jq 'length' 2>/dev/null || echo "0")
WITH_TRAILERS=$(curl -s http://localhost:1113/api/v1/movies | jq '[.[] | select(.trailerUrl != null)] | length' 2>/dev/null || echo "0")

echo -e "${GREEN}📊 Résultats:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "  Total de films:        ${BLUE}$TOTAL${NC}"
echo -e "  Films avec trailers:   ${GREEN}$WITH_TRAILERS${NC}"

if [ "$TOTAL" -gt 0 ]; then
    PERCENTAGE=$((WITH_TRAILERS * 100 / TOTAL))
    echo -e "  Pourcentage:           ${GREEN}${PERCENTAGE}%${NC}"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$WITH_TRAILERS" -gt 0 ]; then
    echo -e "${GREEN}✅ Les trailers sont chargés avec succès!${NC}"
    echo ""
    echo -e "${BLUE}Exemples de films avec trailers:${NC}"
    curl -s http://localhost:1113/api/v1/movies | jq -r '.[] | select(.trailerUrl != null) | "  - \(.title): \(.trailerUrl)"' 2>/dev/null | head -5
else
    echo -e "${YELLOW}⚠️  Aucun trailer chargé. Vérifiez les logs.${NC}"
fi

echo ""
echo -e "${BLUE}💡 Commandes utiles:${NC}"
echo "  Voir les logs:        docker-compose logs -f movie-service"
echo "  Vérifier Neo4j:       http://localhost:7474"
echo "  Tester l'API:         curl http://localhost:1113/api/v1/movies | jq '.[0]'"
echo ""
echo -e "${GREEN}🎉 Test terminé!${NC}"
