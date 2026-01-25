#!/bin/bash
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║          DÉMARRAGE API GATEWAY - SIMPLE                     ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
# Tuer les anciens processus
echo "🛑 Arrêt processus API Gateway existants..."
pkill -9 -f "api-gateway" 2>/dev/null
sleep 2
echo "✅ Processus arrêtés"
echo ""
# Aller dans le dossier
cd /home/pro12x/Desktop/Projects/01Dakar/Java/neo4flix/api-gateway
# Démarrer
echo "🚀 Démarrage API Gateway..."
echo "   Logs: /tmp/api-gateway-clean.log"
echo ""
mvn spring-boot:run > /tmp/api-gateway-clean.log 2>&1 &
API_PID=$!
echo "   PID: $API_PID"
echo ""
echo "⏳ Attente 25 secondes..."
sleep 25
echo ""
# Vérifier
echo "🔍 Vérification..."
if curl -s http://localhost:1111/actuator/health | grep -q "UP"; then
  echo "✅ API Gateway is UP!"
  echo ""
  echo "📊 Test register endpoint:"
  curl -X POST http://localhost:1111/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -d '{"firstName":"Script","lastName":"Test","pseudo":"scripttest","email":"script@test.com","password":"TestPass123!"}' \
    -w "\n\n📈 HTTP Status: %{http_code}\n"
  echo ""
  echo "✅ Tout fonctionne!"
else
  echo "❌ API Gateway not responding"
  echo ""
  echo "📄 Dernières lignes du log:"
  tail -30 /tmp/api-gateway-clean.log
fi
echo ""
echo "═══════════════════════════════════════════════════════════════"
