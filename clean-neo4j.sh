#!/bin/bash
# Script pour nettoyer la base de données Neo4j manuellement
# Utilise cypher-shell directement
# Usage: ./clean-neo4j.sh

set -e

echo "🧹 Script de nettoyage manuel de Neo4j"
echo "======================================="

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Charger les variables d'environnement
if [ -f .env ]; then
    source .env
else
    echo -e "${RED}❌ Fichier .env non trouvé!${NC}"
    exit 1
fi

echo -e "${YELLOW}⚠️  ATTENTION: Ceci va supprimer TOUTES les données!${NC}"
echo -e "${YELLOW}Appuyez sur Entrée pour continuer ou Ctrl+C pour annuler...${NC}"
read

echo ""
echo -e "${BLUE}🔍 Statistiques AVANT nettoyage:${NC}"
docker exec ${APP_NAME}-neo4j cypher-shell -u ${NEO4J_USERNAME} -p ${NEO4J_PASSWORD} \
    "MATCH (n) RETURN labels(n)[0] as Type, count(*) as Count ORDER BY Count DESC;" 2>/dev/null || echo "Base vide ou Neo4j non accessible"

echo ""
echo -e "${BLUE}🗑️  Suppression de tous les nœuds et relations...${NC}"
docker exec ${APP_NAME}-neo4j cypher-shell -u ${NEO4J_USERNAME} -p ${NEO4J_PASSWORD} \
    "MATCH (n) DETACH DELETE n;"

echo ""
echo -e "${BLUE}📊 Création des index de performance...${NC}"
docker exec ${APP_NAME}-neo4j cypher-shell -u ${NEO4J_USERNAME} -p ${NEO4J_PASSWORD} \
    "CREATE INDEX user_id IF NOT EXISTS FOR (u:Users) ON (u.id);"
docker exec ${APP_NAME}-neo4j cypher-shell -u ${NEO4J_USERNAME} -p ${NEO4J_PASSWORD} \
    "CREATE INDEX movie_id IF NOT EXISTS FOR (m:Movie) ON (m.id);"
docker exec ${APP_NAME}-neo4j cypher-shell -u ${NEO4J_USERNAME} -p ${NEO4J_PASSWORD} \
    "CREATE INDEX movie_title IF NOT EXISTS FOR (m:Movie) ON (m.title);"
docker exec ${APP_NAME}-neo4j cypher-shell -u ${NEO4J_USERNAME} -p ${NEO4J_PASSWORD} \
    "CREATE INDEX genre_name IF NOT EXISTS FOR (g:Genre) ON (g.name);"

echo ""
echo -e "${GREEN}✅ Nettoyage terminé!${NC}"
echo ""
echo -e "${BLUE}🔍 Statistiques APRÈS nettoyage:${NC}"
docker exec ${APP_NAME}-neo4j cypher-shell -u ${NEO4J_USERNAME} -p ${NEO4J_PASSWORD} \
    "MATCH (n) RETURN labels(n)[0] as Type, count(*) as Count ORDER BY Count DESC;"

echo ""
echo -e "${GREEN}🎉 Base de données nettoyée avec succès!${NC}"
echo -e "${BLUE}Redémarrez les services pour recharger les données:${NC}"
echo -e "   ${GREEN}docker-compose restart movie-service${NC}"
echo ""
