#!/bin/bash
# Script pour tester les catégories de films via l'API
# Vérifie si les filtres de genre fonctionnent correctement

set -e

API_BASE="http://localhost:8080/api/v1/movies"
TOKEN="${JWT_TOKEN:-}"  # Optionnel: définir JWT_TOKEN si l'API nécessite auth

echo "🎬 Test des catégories de films Neo4flix"
echo "=========================================="
echo ""

# Fonction pour appeler l'API
call_api() {
    local endpoint="$1"
    local description="$2"

    echo "📊 $description"
    if [ -n "$TOKEN" ]; then
        curl -s -H "Authorization: Bearer $TOKEN" "$endpoint" | jq -r '.items[]?.title // .[]?.title // "No movies found"' | head -n 5
    else
        curl -s "$endpoint" | jq -r '.items[]?.title // .[]?.title // "No movies found"' | head -n 5
    fi
    echo ""
}

# Test 1: Trending (pas de genre, trié par date)
call_api "${API_BASE}/search-paged?sort=date&size=20" "Trending Now (sort=date)"

# Test 2: Top Rated
call_api "${API_BASE}/search-paged?sort=rating&minRating=6&size=20" "Top Rated (minRating=6)"

# Test 3: Action
call_api "${API_BASE}/search-paged?genre=Action&sort=rating&size=20" "Action"

# Test 4: Comedy
call_api "${API_BASE}/search-paged?genre=Comedy&sort=rating&size=20" "Comedy"

# Test 5: Drama
call_api "${API_BASE}/search-paged?genre=Drama&sort=rating&size=20" "Drama"

# Test 6: Sci-Fi
call_api "${API_BASE}/search-paged?genre=Sci-Fi&sort=rating&size=20" "Sci-Fi"

# Test 7: Science Fiction (variante)
call_api "${API_BASE}/search-paged?genre=Science%20Fiction&sort=rating&size=20" "Science Fiction (variante)"

# Test 8: Horror
call_api "${API_BASE}/search-paged?genre=Horror&sort=rating&size=20" "Horror"

# Test 9: Romance
call_api "${API_BASE}/search-paged?genre=Romance&sort=rating&size=20" "Romance"

echo "✅ Test terminé!"
echo ""
echo "💡 Tips:"
echo "  - Si des catégories sont vides, vérifiez les genres exacts dans Neo4j"
echo "  - Lancez scripts/check-genres.cypher dans Neo4j Browser"
echo "  - Les noms de genres doivent correspondre EXACTEMENT (sensible à la casse)"
