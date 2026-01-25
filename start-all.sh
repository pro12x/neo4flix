#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                          ║"
echo "║              🚀 DÉMARRAGE AUTOMATIQUE NEO4FLIX 🚀                       ║"
echo "║                                                                          ║"
echo "╚══════════════════════════════════════════════════════════════════════════╝"
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT_DIR="/home/pro12x/Desktop/Projects/01Dakar/Java/neo4flix"

echo -e "${BLUE}📦 Vérification du build Maven...${NC}"
cd "$PROJECT_DIR"
mvn clean package -DskipTests > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build Maven réussi${NC}"
else
    echo -e "${YELLOW}⚠️  Problème de build, continuons quand même...${NC}"
fi

echo ""
echo -e "${BLUE}🚀 Démarrage des services...${NC}"
echo ""

# Function to start a service in a new terminal
start_service() {
    SERVICE_NAME=$1
    PORT=$2
    DIR=$3

    echo -e "${GREEN}✓${NC} Démarrage $SERVICE_NAME (Port $PORT)..."

    # Pour GNOME Terminal
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal --tab --title="$SERVICE_NAME" -- bash -c "cd $DIR && mvn spring-boot:run; exec bash"
    # Pour xterm
    elif command -v xterm &> /dev/null; then
        xterm -T "$SERVICE_NAME" -e "cd $DIR && mvn spring-boot:run" &
    # Pour konsole (KDE)
    elif command -v konsole &> /dev/null; then
        konsole --new-tab -e bash -c "cd $DIR && mvn spring-boot:run; exec bash" &
    # Fallback: background process
    else
        cd "$DIR" && mvn spring-boot:run > "/tmp/$SERVICE_NAME.log" 2>&1 &
        echo -e "${YELLOW}   Logs: /tmp/$SERVICE_NAME.log${NC}"
    fi

    sleep 2
}

# Démarrer les services dans l'ordre
echo "1️⃣  Eureka Server (Service Discovery)..."
start_service "Eureka Server" "8761" "$PROJECT_DIR/eureka-server"
echo "   Attente du démarrage d'Eureka..."
sleep 15

echo ""
echo "2️⃣  API Gateway..."
start_service "API Gateway" "8080" "$PROJECT_DIR/api-gateway"
sleep 10

echo ""
echo "3️⃣  User Service..."
start_service "User Service" "1112" "$PROJECT_DIR/user-service"

echo ""
echo "4️⃣  Movie Service..."
start_service "Movie Service" "1113" "$PROJECT_DIR/movie-service"

echo ""
echo "5️⃣  Rating Service..."
start_service "Rating Service" "1114" "$PROJECT_DIR/rating-service"

echo ""
echo "6️⃣  Recommendation Service..."
start_service "Recommendation Service" "1115" "$PROJECT_DIR/recommendation-service"

echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}✅ TOUS LES SERVICES SONT EN COURS DE DÉMARRAGE!${NC}"
echo ""
echo "📊 URLs importantes:"
echo "   • Eureka Dashboard:  http://localhost:8761"
echo "   • API Gateway:       http://localhost:1111"
echo "   • User Service:      http://localhost:1112"
echo ""
echo "⏱️  Attendez ~30-45 secondes que tous les services soient UP"
echo ""
echo "🔍 Vérifier Eureka Dashboard pour voir tous les services enregistrés"
echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""
echo -e "${BLUE}🎯 Voulez-vous démarrer le frontend Angular? (y/n)${NC}"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    echo -e "${GREEN}🚀 Démarrage du frontend Angular...${NC}"

    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal --tab --title="Angular Frontend" -- bash -c "cd $PROJECT_DIR/neo4flix-ui && npm start; exec bash"
    else
        cd "$PROJECT_DIR/neo4flix-ui"
        npm start &
    fi

    echo ""
    echo -e "${GREEN}✅ Frontend démarré!${NC}"
    echo "   Accéder à: http://localhost:4200"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}🎉 NEO4FLIX EST PRÊT!${NC}"
echo ""
echo "Pour arrêter tous les services:"
echo "   pkill -f 'spring-boot:run'"
echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
