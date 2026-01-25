#!/bin/bash

# Script pour ajouter les URLs de bandes-annonces aux films dans Neo4j
# Usage: ./add-trailers.sh

echo "🎬 Adding trailer URLs to movies in Neo4j..."

# Configuration Neo4j
NEO4J_URI="bolt://localhost:7687"
NEO4J_USER="neo4j"
NEO4J_PASSWORD="password"

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour exécuter une requête Cypher
execute_cypher() {
    local query="$1"
    local title="$2"

    echo -e "${BLUE}Setting trailer for: $title${NC}"

    curl -X POST http://localhost:7474/db/neo4j/tx/commit \
        -H "Content-Type: application/json" \
        -H "Accept: application/json" \
        -u neo4j:password \
        -d "{\"statements\":[{\"statement\":\"$query\"}]}" \
        > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Success${NC}"
    else
        echo -e "${RED}✗ Failed${NC}"
    fi
}

echo ""
echo "Adding trailer URLs for popular movies..."
echo "=========================================="

# The Matrix
execute_cypher "MATCH (m:Movie {title: 'The Matrix'}) SET m.trailer_url = 'https://www.youtube.com/embed/vKQi3bBA1y8' RETURN m" "The Matrix"

# Inception
execute_cypher "MATCH (m:Movie {title: 'Inception'}) SET m.trailer_url = 'https://www.youtube.com/embed/YoHD9XEInc0' RETURN m" "Inception"

# The Dark Knight
execute_cypher "MATCH (m:Movie {title: 'The Dark Knight'}) SET m.trailer_url = 'https://www.youtube.com/embed/EXeTwQWrcwY' RETURN m" "The Dark Knight"

# Interstellar
execute_cypher "MATCH (m:Movie {title: 'Interstellar'}) SET m.trailer_url = 'https://www.youtube.com/embed/zSWdZVtXT7E' RETURN m" "Interstellar"

# The Shawshank Redemption
execute_cypher "MATCH (m:Movie {title: 'The Shawshank Redemption'}) SET m.trailer_url = 'https://www.youtube.com/embed/6hB3S9bIaco' RETURN m" "The Shawshank Redemption"

# Pulp Fiction
execute_cypher "MATCH (m:Movie {title: 'Pulp Fiction'}) SET m.trailer_url = 'https://www.youtube.com/embed/s7EdQ4FqbhY' RETURN m" "Pulp Fiction"

# Fight Club
execute_cypher "MATCH (m:Movie {title: 'Fight Club'}) SET m.trailer_url = 'https://www.youtube.com/embed/BdJKm16Co6M' RETURN m" "Fight Club"

# The Godfather
execute_cypher "MATCH (m:Movie {title: 'The Godfather'}) SET m.trailer_url = 'https://www.youtube.com/embed/sY1S34973zA' RETURN m" "The Godfather"

# Forrest Gump
execute_cypher "MATCH (m:Movie {title: 'Forrest Gump'}) SET m.trailer_url = 'https://www.youtube.com/embed/bLvqoHBptjg' RETURN m" "Forrest Gump"

# Avatar
execute_cypher "MATCH (m:Movie {title: 'Avatar'}) SET m.trailer_url = 'https://www.youtube.com/embed/5PSNL1qE6VY' RETURN m" "Avatar"

# Titanic
execute_cypher "MATCH (m:Movie {title: 'Titanic'}) SET m.trailer_url = 'https://www.youtube.com/embed/kVrqfYjkTdQ' RETURN m" "Titanic"

# Gladiator
execute_cypher "MATCH (m:Movie {title: 'Gladiator'}) SET m.trailer_url = 'https://www.youtube.com/embed/uvbavW31adA' RETURN m" "Gladiator"

# Spider-Man: No Way Home
execute_cypher "MATCH (m:Movie {title: 'Spider-Man: No Way Home'}) SET m.trailer_url = 'https://www.youtube.com/embed/JfVOs4VSpmA' RETURN m" "Spider-Man: No Way Home"

# Joker
execute_cypher "MATCH (m:Movie {title: 'Joker'}) SET m.trailer_url = 'https://www.youtube.com/embed/zAGVQLHvwOY' RETURN m" "Joker"

# Black Panther
execute_cypher "MATCH (m:Movie {title: 'Black Panther'}) SET m.trailer_url = 'https://www.youtube.com/embed/xjDjIWPwcPU' RETURN m" "Black Panther"

# Oppenheimer
execute_cypher "MATCH (m:Movie {title: 'Oppenheimer'}) SET m.trailer_url = 'https://www.youtube.com/embed/uYPbbksJxIg' RETURN m" "Oppenheimer"

# The Batman
execute_cypher "MATCH (m:Movie {title: 'The Batman'}) SET m.trailer_url = 'https://www.youtube.com/embed/mqqft2x_Aa4' RETURN m" "The Batman"

# John Wick
execute_cypher "MATCH (m:Movie {title: 'John Wick'}) SET m.trailer_url = 'https://www.youtube.com/embed/C0BMx-qxsP4' RETURN m" "John Wick"

# Parasite
execute_cypher "MATCH (m:Movie {title: 'Parasite'}) SET m.trailer_url = 'https://www.youtube.com/embed/5xH0HfJHsaY' RETURN m" "Parasite"

echo ""
echo "Setting default trailer for remaining movies..."
execute_cypher "MATCH (m:Movie) WHERE m.trailer_url IS NULL SET m.trailer_url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' RETURN count(m)" "Default trailer"

echo ""
echo -e "${GREEN}✅ Trailer URLs have been added successfully!${NC}"
echo ""
echo "You can verify in Neo4j Browser with:"
echo "MATCH (m:Movie) RETURN m.title, m.trailer_url LIMIT 20"
