#!/bin/bash
set -euo pipefail

BASE_URL=${BASE_URL:-http://localhost:1111}
EMAIL=${EMAIL:-admin@user.com}
PASSWORD=${PASSWORD:-Password123!}

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required for this script." >&2
  exit 1
fi

echo "1) Health check gateway: $BASE_URL/actuator/health"
if ! curl -sf "$BASE_URL/actuator/health" >/dev/null; then
  echo "Gateway health check failed. Is api-gateway running on :1111?" >&2
  exit 1
fi

echo "2) Login: $EMAIL"
LOGIN_JSON=$(curl -s -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

echo "$LOGIN_JSON" | jq . >/dev/null
TOKEN=$(echo "$LOGIN_JSON" | jq -r '.accessToken // empty')
if [ -z "$TOKEN" ]; then
  echo "Login response has no accessToken. Full response:" >&2
  echo "$LOGIN_JSON" | jq . >&2
  exit 1
fi

echo "3) Call movies search-paged with token"
HTTP_CODE=$(curl -s -o /tmp/movies.json -w "%{http_code}" "$BASE_URL/api/v1/movies/search-paged?sort=date&page=0&size=1" \
  -H "Authorization: Bearer $TOKEN")

if [ "$HTTP_CODE" != "200" ]; then
  echo "Movies call failed with HTTP $HTTP_CODE" >&2
  echo "Body:" >&2
  cat /tmp/movies.json >&2
  exit 1
fi

echo "✅ OK: movies endpoint authorized"
cat /tmp/movies.json | jq '.content | length' 2>/dev/null || true
