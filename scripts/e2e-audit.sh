#!/usr/bin/env bash
set -euo pipefail

# Neo4flix E2E audit script
# Purpose: quick, reproducible end-to-end checks for:
# - Ports listening
# - Actuator health
# - Eureka registration
# - Gateway routing endpoints (basic)
# - Angular build (optional)

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ok() { echo -e "${GREEN}✅ $*${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $*${NC}"; }
fail() { echo -e "${RED}❌ $*${NC}"; exit 1; }

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "Missing required command: $1"
}

need_cmd curl
need_cmd grep
need_cmd sed

# Config (sync with .env)
EUREKA_PORT=${EUREKA_SERVER_PORT:-8761}
GATEWAY_PORT=${API_GATEWAY_PORT:-1111}
USER_PORT=${USER_SERVICE_PORT:-1112}
MOVIE_PORT=${MOVIE_SERVICE_PORT:-1113}
RATING_PORT=${RATING_SERVICE_PORT:-1114}
RECO_PORT=${RECOMMENDATION_SERVICE_PORT:-1115}

BASE_EUREKA="http://127.0.0.1:${EUREKA_PORT}"
BASE_GATEWAY="http://127.0.0.1:${GATEWAY_PORT}"

section() {
  echo
  echo "============================================================"
  echo "$*"
  echo "============================================================"
}

http_ok() {
  local url="$1"
  curl -fsS --max-time 5 "$url" >/dev/null
}

# --- Checks
section "1) Port sanity (host)"
# Use ss if available
if command -v ss >/dev/null 2>&1; then
  ss -ltn | grep -E "(:${EUREKA_PORT}|:${GATEWAY_PORT}|:${USER_PORT}|:${MOVIE_PORT}|:${RATING_PORT}|:${RECO_PORT})" >/dev/null \
    && ok "At least one neo4flix port appears to be listening" \
    || warn "No neo4flix ports detected as listening via ss (may be Docker-only or services not started)"
else
  warn "ss not available; skipping port listening check"
fi

section "2) Eureka health"
http_ok "${BASE_EUREKA}/actuator/health" && ok "Eureka actuator health reachable" || fail "Eureka actuator health NOT reachable (${BASE_EUREKA}/actuator/health)"

section "3) API Gateway health"
http_ok "${BASE_GATEWAY}/actuator/health" && ok "Gateway actuator health reachable" || fail "Gateway actuator health NOT reachable (${BASE_GATEWAY}/actuator/health)"

section "4) Eureka registration sanity"
# We expect API-GATEWAY registered once (ideally). We'll just show what Eureka knows.
APPS_XML=$(curl -fsS --max-time 5 "${BASE_EUREKA}/eureka/apps" || true)
if echo "$APPS_XML" | grep -qi "<application>API-GATEWAY</application>"; then
  ok "Eureka lists API-GATEWAY"
else
  warn "Eureka does NOT list API-GATEWAY (yet)"
fi

# Count API-GATEWAY instances if possible
# Prefer counting <app>API-GATEWAY</app> occurrences.
INSTANCES_COUNT=$(echo "$APPS_XML" | grep -o "<app>API-GATEWAY</app>" | wc -l | tr -d ' ' || true)
if [[ "${INSTANCES_COUNT}" =~ ^[0-9]+$ && "${INSTANCES_COUNT}" -ge 1 ]]; then
  if [[ "${INSTANCES_COUNT}" -eq 1 ]]; then
    ok "API-GATEWAY has 1 instance registered"
  else
    warn "API-GATEWAY appears to have ${INSTANCES_COUNT} instances registered (possible ghost instance on old port)"
  fi
else
  warn "Could not reliably count API-GATEWAY instances from XML"
fi

section "5) Gateway routes endpoint (actuator)"
# It's OK if not exposed; just check if reachable.
if http_ok "${BASE_GATEWAY}/actuator/gateway/routes"; then
  ok "Gateway routes actuator endpoint reachable"
else
  warn "Gateway routes actuator endpoint not reachable (may be disabled in Spring or secured)"
fi

section "6) Frontend build (neo4flix-ui)"
if [[ -f "./neo4flix-ui/package.json" ]]; then
  if command -v npm >/dev/null 2>&1; then
    (cd neo4flix-ui && npm run -s build) && ok "neo4flix-ui builds" || fail "neo4flix-ui build failed"
  else
    warn "npm not installed; skipping frontend build"
  fi
else
  warn "neo4flix-ui not found; skipping"
fi

section "DONE"
ok "Audit completed. Review warnings above for remaining instability."
