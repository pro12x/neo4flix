#!/bin/bash
# Script pour réinitialiser complètement la base de données Neo4j
# Usage: ./reset-database.sh

set -e

echo "🔄 Script de réinitialisation complète de la base de données Neo4flix"
echo "=================================================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Charger les variables d'environnement
if [ -f .env ]; then
    source .env
else
    echo -e "${RED}❌ Fichier .env non trouvé!${NC}"
    exit 1
fi

echo -e "${YELLOW}⚠️  ATTENTION: Cette opération va supprimer TOUTES les données de la base!${NC}"
echo -e "${YELLOW}Appuyez sur Entrée pour continuer ou Ctrl+C pour annuler...${NC}"
read

echo ""
echo -e "${BLUE}📊 Étape 1/4: Arrêt des services...${NC}"
docker-compose down

echo ""
echo -e "${BLUE}📊 Étape 2/4: Suppression des volumes Neo4j...${NC}"
docker volume rm neo4flix_neo4j_data 2>/dev/null || echo "Volume neo4j_data n'existe pas"
docker volume rm neo4flix_neo4j_logs 2>/dev/null || echo "Volume neo4j_logs n'existe pas"

echo ""
echo -e "${BLUE}📊 Étape 3/4: Démarrage de Neo4j...${NC}"
docker-compose up -d neo4j

echo -e "${YELLOW}⏳ Attente du démarrage de Neo4j (30 secondes)...${NC}"
sleep 30

# Vérifier que Neo4j est prêt
echo -e "${BLUE}🔍 Vérification de la connexion à Neo4j...${NC}"
MAX_RETRIES=10
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:7474 | grep -q "200"; then
        echo -e "${GREEN}✅ Neo4j est prêt!${NC}"
        break
    else
        RETRY_COUNT=$((RETRY_COUNT + 1))
        echo -e "${YELLOW}⏳ Tentative $RETRY_COUNT/$MAX_RETRIES...${NC}"
        sleep 5
    fi
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo -e "${RED}❌ Impossible de se connecter à Neo4j après $MAX_RETRIES tentatives${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}📊 Étape 4/4: Nettoyage complet de la base de données...${NC}"

# Utiliser cypher-shell pour nettoyer la base
docker exec ${APP_NAME}-neo4j cypher-shell -u ${NEO4J_USERNAME} -p ${NEO4J_PASSWORD} \
    "MATCH (n) DETACH DELETE n;" || echo -e "${YELLOW}Base déjà vide${NC}"

# Créer les index pour optimiser les performances
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
echo -e "${GREEN}✅ Base de données Neo4j réinitialisée avec succès!${NC}"
echo ""
echo -e "${BLUE}📊 Statistiques de la base:${NC}"
docker exec ${APP_NAME}-neo4j cypher-shell -u ${NEO4J_USERNAME} -p ${NEO4J_PASSWORD} \
    "MATCH (n) RETURN labels(n)[0] as Type, count(*) as Count ORDER BY Count DESC;"

echo ""
echo -e "${BLUE}🚀 Étape 5/5: Redémarrage de tous les services...${NC}"
docker-compose down
docker-compose up -d

echo ""
echo -e "${GREEN}🎉 Réinitialisation complète terminée!${NC}"
echo ""
echo -e "${BLUE}Les services vont maintenant charger automatiquement les nouvelles données.${NC}"
echo -e "${BLUE}Attendez environ 2-3 minutes pour que tous les services soient prêts.${NC}"
echo ""
echo -e "${YELLOW}📌 Pour suivre le chargement des films:${NC}"
echo -e "   ${GREEN}docker-compose logs -f movie-service${NC}"
echo ""
echo -e "${YELLOW}📌 Accès Neo4j Browser:${NC}"
echo -e "   ${GREEN}http://localhost:7474${NC}"
echo -e "   Username: ${NEO4J_USERNAME}"
echo -e "   Password: ${NEO4J_PASSWORD}"
echo ""
