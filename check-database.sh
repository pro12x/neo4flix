#!/bin/bash
# Script pour vérifier l'état de la base de données Neo4j
# Usage: ./check-database.sh

echo "🔍 Vérification de l'état de la base de données Neo4flix"
echo "========================================================="

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Charger les variables d'environnement
if [ -f .env ]; then
    source .env
else
    echo -e "${RED}❌ Fichier .env non trouvé!${NC}"
    exit 1
fi

# Vérifier si Neo4j est accessible
echo -e "${BLUE}📡 Vérification de la connexion à Neo4j...${NC}"
if curl -s http://localhost:7474 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Neo4j est accessible${NC}"
else
    echo -e "${RED}❌ Neo4j n'est pas accessible${NC}"
    echo -e "${YELLOW}💡 Démarrez Neo4j avec: docker-compose up -d neo4j${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}📊 Statistiques de la base de données:${NC}"
echo "----------------------------------------"

# Compter les nœuds par type
docker exec ${APP_NAME}-neo4j cypher-shell -u ${NEO4J_USERNAME} -p ${NEO4J_PASSWORD} \
    "MATCH (n) RETURN labels(n)[0] as Type, count(*) as Count ORDER BY Count DESC;" 2>/dev/null

echo ""
echo -e "${BLUE}🎬 Films par genre (Top 10):${NC}"
echo "----------------------------------------"
docker exec ${APP_NAME}-neo4j cypher-shell -u ${NEO4J_USERNAME} -p ${NEO4J_PASSWORD} \
    "MATCH (m:Movie) UNWIND m.genres as genre RETURN genre, count(m) as count ORDER BY count DESC LIMIT 10;" 2>/dev/null

echo ""
echo -e "${BLUE}⭐ Films les mieux notés:${NC}"
echo "----------------------------------------"
docker exec ${APP_NAME}-neo4j cypher-shell -u ${NEO4J_USERNAME} -p ${NEO4J_PASSWORD} \
    "MATCH (m:Movie) WHERE m.average_rating IS NOT NULL RETURN m.title, m.average_rating ORDER BY m.average_rating DESC LIMIT 5;" 2>/dev/null

echo ""
echo -e "${BLUE}📈 Statistiques des relations:${NC}"
echo "----------------------------------------"
docker exec ${APP_NAME}-neo4j cypher-shell -u ${NEO4J_USERNAME} -p ${NEO4J_PASSWORD} \
    "MATCH ()-[r]->() RETURN type(r) as Relation, count(r) as Count ORDER BY Count DESC;" 2>/dev/null

echo ""
echo -e "${BLUE}🔗 Accès rapides:${NC}"
echo "----------------------------------------"
echo -e "Neo4j Browser: ${GREEN}http://localhost:7474${NC}"
echo -e "API Gateway:   ${GREEN}http://localhost:1111${NC}"
echo -e "Movie Service: ${GREEN}http://localhost:1113${NC}"
echo ""
echo -e "${YELLOW}💡 Pour réinitialiser la base: ./reset-database.sh${NC}"
echo ""
