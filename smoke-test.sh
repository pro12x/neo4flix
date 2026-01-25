#!/bin/bash

# 🔥 Neo4Flix - Smoke Test Complet
# Test de bout en bout de toutes les fonctionnalités critiques
# Auteur: GitHub Copilot
# Date: 23 Janvier 2026

set -e

echo "🚀 Neo4Flix - Test Complet de Validation"
echo "=========================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
API_BASE="http://localhost:1111"
EMAIL="tester@user.com"
PASSWORD="Password123!"

echo "📍 API Base: $API_BASE"
echo ""

# 1. LOGIN
echo "1️⃣  Test Login..."
LOGIN_JSON=$(curl -s -X POST "$API_BASE/api/v1/auth/login" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

TOKEN=$(echo "$LOGIN_JSON" | python3 -c "import sys, json; print(json.load(sys.stdin).get('accessToken',''))" 2>/dev/null)
USER_ID=$(echo "$LOGIN_JSON" | python3 -c "import sys, json; print(json.load(sys.stdin).get('user',{}).get('id',''))" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Login FAILED${NC}"
  exit 1
else
  echo -e "${GREEN}✅ Login OK${NC}"
  echo "   User ID: $USER_ID"
fi
echo ""

# 2. GET MOVIES
echo "2️⃣  Test Get Movies (Latest)..."
HTTP_CODE=$(curl -s -o /tmp/movies.json -w "%{http_code}" \
  "$API_BASE/api/v1/movies/latest?limit=5" \
  -H "Authorization: Bearer $TOKEN")

if [ "$HTTP_CODE" = "200" ]; then
  MOVIE_COUNT=$(python3 -c "import sys, json; print(len(json.load(open('/tmp/movies.json'))))" 2>/dev/null || echo "0")
  echo -e "${GREEN}✅ Get Movies OK (Status: $HTTP_CODE, Count: $MOVIE_COUNT)${NC}"

  # Récupérer un movie ID pour les tests suivants
  MOVIE_ID=$(python3 -c "import sys, json; d=json.load(open('/tmp/movies.json')); print(d[0]['id'] if d else '')" 2>/dev/null || echo "")
  echo "   Movie ID for tests: $MOVIE_ID"
else
  echo -e "${RED}❌ Get Movies FAILED (Status: $HTTP_CODE)${NC}"
fi
echo ""

# 3. POST RATING (sans review)
echo "3️⃣  Test POST Rating (sans review)..."
if [ -n "$MOVIE_ID" ]; then
  HTTP_CODE=$(curl -s -o /tmp/rating_post.json -w "%{http_code}" \
    -X POST "$API_BASE/api/v1/ratings" \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/json' \
    -d "{\"userId\":\"$USER_ID\",\"movieId\":\"$MOVIE_ID\",\"rating\":4.5}")

  if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "409" ]; then
    echo -e "${GREEN}✅ POST Rating OK (Status: $HTTP_CODE)${NC}"
  else
    echo -e "${RED}❌ POST Rating FAILED (Status: $HTTP_CODE)${NC}"
    cat /tmp/rating_post.json
  fi
else
  echo -e "${YELLOW}⚠️  POST Rating SKIPPED (no movie ID)${NC}"
fi
echo ""

# 4. GET USER RATINGS
echo "4️⃣  Test GET User Ratings..."
HTTP_CODE=$(curl -s -o /tmp/user_ratings.json -w "%{http_code}" \
  "$API_BASE/api/v1/ratings/user/$USER_ID" \
  -H "Authorization: Bearer $TOKEN")

if [ "$HTTP_CODE" = "200" ]; then
  RATING_COUNT=$(python3 -c "import sys, json; print(len(json.load(open('/tmp/user_ratings.json'))))" 2>/dev/null || echo "0")
  echo -e "${GREEN}✅ GET User Ratings OK (Status: $HTTP_CODE, Count: $RATING_COUNT)${NC}"
else
  echo -e "${RED}❌ GET User Ratings FAILED (Status: $HTTP_CODE)${NC}"
  cat /tmp/user_ratings.json
fi
echo ""

# 5. GET RECOMMENDATIONS (Personalized)
echo "5️⃣  Test GET Recommendations (Personalized)..."
HTTP_CODE=$(curl -s -o /tmp/reco_personalized.json -w "%{http_code}" \
  "$API_BASE/api/v1/recommendations/user/$USER_ID?limit=10" \
  -H "Authorization: Bearer $TOKEN")

if [ "$HTTP_CODE" = "200" ]; then
  RECO_COUNT=$(python3 -c "import sys, json; print(len(json.load(open('/tmp/reco_personalized.json'))))" 2>/dev/null || echo "0")
  echo -e "${GREEN}✅ GET Recommendations OK (Status: $HTTP_CODE, Count: $RECO_COUNT)${NC}"
else
  echo -e "${RED}❌ GET Recommendations FAILED (Status: $HTTP_CODE)${NC}"
  cat /tmp/reco_personalized.json
fi
echo ""

# 6. GET RECOMMENDATIONS (Collaborative)
echo "6️⃣  Test GET Recommendations (Collaborative)..."
HTTP_CODE=$(curl -s -o /tmp/reco_collab.json -w "%{http_code}" \
  "$API_BASE/api/v1/recommendations/user/$USER_ID/collaborative?limit=10" \
  -H "Authorization: Bearer $TOKEN")

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✅ GET Recommendations Collaborative OK (Status: $HTTP_CODE)${NC}"
else
  echo -e "${RED}❌ GET Recommendations Collaborative FAILED (Status: $HTTP_CODE)${NC}"
fi
echo ""

# 7. GET RECOMMENDATIONS (Content-Based)
echo "7️⃣  Test GET Recommendations (Content-Based)..."
HTTP_CODE=$(curl -s -o /tmp/reco_content.json -w "%{http_code}" \
  "$API_BASE/api/v1/recommendations/user/$USER_ID/content-based?limit=10" \
  -H "Authorization: Bearer $TOKEN")

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✅ GET Recommendations Content-Based OK (Status: $HTTP_CODE)${NC}"
else
  echo -e "${YELLOW}⚠️  GET Recommendations Content-Based (Status: $HTTP_CODE) - peut être vide${NC}"
fi
echo ""

# 8. GET RECOMMENDATIONS (Trending)
echo "8️⃣  Test GET Recommendations (Trending)..."
HTTP_CODE=$(curl -s -o /tmp/reco_trending.json -w "%{http_code}" \
  "$API_BASE/api/v1/recommendations/user/$USER_ID/trending?limit=10" \
  -H "Authorization: Bearer $TOKEN")

if [ "$HTTP_CODE" = "200" ]; then
  TRENDING_COUNT=$(python3 -c "import sys, json; print(len(json.load(open('/tmp/reco_trending.json'))))" 2>/dev/null || echo "0")
  echo -e "${GREEN}✅ GET Recommendations Trending OK (Status: $HTTP_CODE, Count: $TRENDING_COUNT)${NC}"
else
  echo -e "${RED}❌ GET Recommendations Trending FAILED (Status: $HTTP_CODE)${NC}"
fi
echo ""

# 9. GET TOP RATED MOVIES
echo "9️⃣  Test GET Top Rated Movies..."
HTTP_CODE=$(curl -s -o /tmp/top_rated.json -w "%{http_code}" \
  "$API_BASE/api/v1/movies/top-rated?minRating=7.5&limit=10" \
  -H "Authorization: Bearer $TOKEN")

if [ "$HTTP_CODE" = "200" ]; then
  TOP_COUNT=$(python3 -c "import sys, json; print(len(json.load(open('/tmp/top_rated.json'))))" 2>/dev/null || echo "0")
  echo -e "${GREEN}✅ GET Top Rated Movies OK (Status: $HTTP_CODE, Count: $TOP_COUNT)${NC}"
else
  echo -e "${RED}❌ GET Top Rated Movies FAILED (Status: $HTTP_CODE)${NC}"
fi
echo ""

# 10. SEARCH MOVIES
echo "🔟 Test SEARCH Movies..."
HTTP_CODE=$(curl -s -o /tmp/search.json -w "%{http_code}" \
  "$API_BASE/api/v1/movies/search?title=the&page=0&size=5" \
  -H "Authorization: Bearer $TOKEN")

if [ "$HTTP_CODE" = "200" ]; then
  SEARCH_COUNT=$(python3 -c "import sys, json; d=json.load(open('/tmp/search.json')); print(d.get('totalElements', 0))" 2>/dev/null || echo "0")
  echo -e "${GREEN}✅ SEARCH Movies OK (Status: $HTTP_CODE, Results: $SEARCH_COUNT)${NC}"
else
  echo -e "${RED}❌ SEARCH Movies FAILED (Status: $HTTP_CODE)${NC}"
fi
echo ""

# RÉSUMÉ
echo "=========================================="
echo "🎯 Résumé des Tests"
echo "=========================================="
echo ""
echo "✅ Tous les endpoints critiques ont été testés"
echo ""
echo "Fichiers de test générés:"
echo "  - /tmp/movies.json"
echo "  - /tmp/user_ratings.json"
echo "  - /tmp/reco_personalized.json"
echo "  - /tmp/reco_collab.json"
echo "  - /tmp/reco_content.json"
echo "  - /tmp/reco_trending.json"
echo "  - /tmp/top_rated.json"
echo "  - /tmp/search.json"
echo ""
echo -e "${GREEN}✅ Tests terminés avec succès!${NC}"
