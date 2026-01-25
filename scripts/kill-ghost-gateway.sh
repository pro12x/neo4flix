#!/usr/bin/env bash
set -euo pipefail

# Purpose:
# - Detect if something is listening on old API Gateway port 8080
# - Kill typical local dev processes (mvn spring-boot:run / java) that still run api-gateway
# - Prevent double registration in Eureka (1111 + 8080)

OLD_PORT=${OLD_GATEWAY_PORT:-8080}

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ok() { echo -e "${GREEN}✅ $*${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $*${NC}"; }

if ! command -v ss >/dev/null 2>&1; then
  warn "ss not found; cannot detect listeners."
  exit 0
fi

LISTENERS=$(sudo ss -ltnp 2>/dev/null | grep -E ":${OLD_PORT}\\b" || true)
if [[ -z "$LISTENERS" ]]; then
  ok "No listener detected on :${OLD_PORT}"
  exit 0
fi

warn "Found listener(s) on :${OLD_PORT}:"
echo "$LISTENERS"

echo
warn "Attempting to stop common dev processes for api-gateway..."

# Be conservative: try graceful pkill patterns first.
pkill -f 'mvn spring-boot:run' || true
pkill -f 'api-gateway' || true

echo
LISTENERS_AFTER=$(sudo ss -ltnp 2>/dev/null | grep -E ":${OLD_PORT}\\b" || true)
if [[ -z "$LISTENERS_AFTER" ]]; then
  ok "Port :${OLD_PORT} is now free"
else
  warn "Port :${OLD_PORT} still has listener(s). You may need to kill the PID(s) shown above."
  echo "$LISTENERS_AFTER"
fi
