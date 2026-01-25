#!/bin/bash
# Script de diagnostic complet pour les catégories vides
# Vérifie Neo4j, l'API et suggère des corrections

set -e

echo "🔍 Diagnostic des catégories Neo4flix"
echo "======================================"
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
NEO4J_URL="http://localhost:7474"
API_URL="http://localhost:8080/api/v1/movies"
EXPECTED_GENRES=("Action" "Comedy" "Drama" "Sci-Fi" "Horror" "Romance")

# 1. Vérifier Neo4j
echo "1️⃣  Vérification Neo4j..."
if curl -s -f "${NEO4J_URL}" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Neo4j accessible sur ${NEO4J_URL}"
else
    echo -e "${RED}✗${NC} Neo4j non accessible sur ${NEO4J_URL}"
    echo "   → Lance Docker: docker-compose up -d neo4j"
    exit 1
fi

# 2. Vérifier API Gateway
echo ""
echo "2️⃣  Vérification API Gateway..."
if curl -s -f "${API_URL}" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} API Gateway accessible"
else
    echo -e "${RED}✗${NC} API Gateway non accessible sur ${API_URL}"
    echo "   → Lance les services: ./start-all.sh"
    exit 1
fi

# 3. Tester chaque catégorie
echo ""
echo "3️⃣  Test des catégories..."
echo ""

for genre in "${EXPECTED_GENRES[@]}"; do
    count=$(curl -s "${API_URL}/search-paged?genre=${genre}&size=1" | jq -r '.total // 0')

    if [ "$count" -gt 0 ]; then
        echo -e "${GREEN}✓${NC} $genre: $count films"
    else
        echo -e "${RED}✗${NC} $genre: 0 films"
        echo "   → Le genre '$genre' n'existe pas ou est mal orthographié dans Neo4j"
    fi
done

# 4. Lister les genres réels dans Neo4j
echo ""
echo "4️⃣  Genres réels dans Neo4j:"
echo ""
echo "   Exécute cette commande dans Neo4j Browser (${NEO4J_URL}):"
echo ""
echo -e "${YELLOW}"
cat << 'EOF'
   MATCH (m:Movie)
   UNWIND m.genres AS genre
   RETURN DISTINCT genre, count(*) as count
   ORDER BY count DESC, genre;
EOF
echo -e "${NC}"

# 5. Suggestions
echo ""
echo "💡 Suggestions:"
echo ""
echo "   Si des catégories sont vides:"
echo ""
echo "   A) Corriger le frontend (rapide):"
echo "      Édite: neo4flix-ui/src/app/components/home/home.ts"
echo "      Ligne 370-375, remplace les genres par ceux listés ci-dessus"
echo ""
echo "   B) Normaliser la BD (robuste):"
echo "      Lance: cat scripts/check-genres.cypher"
echo "      Puis adapte les genres dans Neo4j si besoin"
echo ""
echo "   C) Vérifier les logs frontend:"
echo "      1. Lance: cd neo4flix-ui && npm start"
echo "      2. Va sur http://localhost:4200/browse"
echo "      3. Ouvre Console (F12)"
echo "      4. Cherche: [Home] Section ... loaded X movies"
echo ""
echo "📄 Documentation complète: docs/FIX_EMPTY_CATEGORIES.md"
