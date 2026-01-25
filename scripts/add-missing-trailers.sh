#!/bin/bash
# Script pour ajouter des trailers aux films Top Rated et Sci-Fi
# qui n'en ont pas encore

set -e

NEO4J_URL="bolt://localhost:7687"
NEO4J_USER="neo4j"
NEO4J_PASS="password"

echo "🎬 Ajout de trailers pour Top Rated et Sci-Fi"
echo "=============================================="
echo ""

# Fonction pour exécuter une requête Cypher
execute_cypher() {
    local query="$1"
    local description="$2"

    echo "📝 $description"

    cypher-shell -a "$NEO4J_URL" -u "$NEO4J_USER" -p "$NEO4J_PASS" "$query" 2>&1 || {
        echo "⚠️  Erreur - vérifie que Neo4j est démarré et que les credentials sont corrects"
        return 1
    }
}

# URL de fallback (vidéo de démo)
FALLBACK_URL="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

echo "1️⃣  Vérification des films sans trailers..."
echo ""

# Compter les films sans trailers
execute_cypher "MATCH (m:Movie) WHERE m.trailer_url IS NULL OR m.trailer_url = '' RETURN count(m) as without_trailers;" "Films sans trailers"

echo ""
echo "2️⃣  Ajout de trailers spécifiques pour films populaires..."
echo ""

# Exemples de trailers pour des films Sci-Fi connus
# Format: titre exact|URL YouTube embed

declare -A TRAILERS=(
    ["The Matrix"]="vKQi3bBA1y8"
    ["Inception"]="YoHD9XEInc0"
    ["Interstellar"]="zSWdZVtXT7E"
    ["Avatar"]="5PSNL1qE6VY"
    ["Blade Runner"]="gCcx85zbxz4"
    ["The Terminator"]="k64P4l2Wmeg"
    ["Star Wars"]="vZ734NWnAHA"
    ["Back to the Future"]="qvsgGtivCgs"
    ["E.T."]="qYAETtIIClk"
    ["2001: A Space Odyssey"]="oR_e9y-bka0"
    ["The Fifth Element"]="fQ9RqgcR24g"
    ["District 9"]="DyLUwOcR5pk"
    ["Arrival"]="tFMo3UJ4B4g"
    ["Ex Machina"]="XYGzRB4Pnq8"
    ["Her"]="WzV6mXIOVl4"
    ["The Martian"]="ej3ioOneTy8"
    ["Gravity"]="OiTiKOy59o4"
    ["WALL-E"]="CZ1CATNbXg0"
    ["Ready Player One"]="cSp1dM2Vj48"
    ["Dune"]="n9xhJrPXop4"
)

for title in "${!TRAILERS[@]}"; do
    video_id="${TRAILERS[$title]}"
    url="https://www.youtube.com/embed/${video_id}"

    execute_cypher "MATCH (m:Movie {title: \"$title\"}) WHERE m.trailer_url IS NULL OR m.trailer_url = '' SET m.trailer_url = '$url' RETURN m.title;" "Ajout trailer: $title" || echo "   Film non trouvé: $title"
done

echo ""
echo "3️⃣  Ajout d'un trailer par défaut pour les films restants..."
echo ""

# Ajouter le fallback pour tous les films sans trailer
execute_cypher "MATCH (m:Movie) WHERE m.trailer_url IS NULL OR m.trailer_url = '' SET m.trailer_url = '$FALLBACK_URL' RETURN count(m) as updated;" "Fallback pour films restants"

echo ""
echo "4️⃣  Vérification finale..."
echo ""

# Vérifier combien de films ont maintenant des trailers
execute_cypher "MATCH (m:Movie) RETURN count(m) as total, count(m.trailer_url) as with_trailers;" "Statistiques finales"

echo ""
echo "✅ Terminé!"
echo ""
echo "💡 Pour vérifier:"
echo "   1. Ouvre Neo4j Browser: http://localhost:7474"
echo "   2. Exécute: MATCH (m:Movie) WHERE m.trailer_url IS NOT NULL RETURN m.title, m.trailer_url LIMIT 10;"
echo ""
echo "   Ou relance le frontend et vérifie la console pour voir:"
echo "   [Home] Section \"Sci-Fi\" loaded X movies (Y with trailers)"
