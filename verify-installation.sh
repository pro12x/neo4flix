#!/bin/bash
# Script de vérification que tous les fichiers nécessaires sont présents
# Usage: ./verify-installation.sh

echo "🔍 Vérification de l'installation des modifications Neo4flix"
echo "=============================================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

# Fonction de vérification
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $1"
    else
        echo -e "${RED}❌${NC} $1 - MANQUANT"
        ((ERRORS++))
    fi
}

check_executable() {
    if [ -x "$1" ]; then
        echo -e "${GREEN}✅${NC} $1 (exécutable)"
    elif [ -f "$1" ]; then
        echo -e "${YELLOW}⚠️${NC}  $1 (existe mais pas exécutable)"
        ((WARNINGS++))
    else
        echo -e "${RED}❌${NC} $1 - MANQUANT"
        ((ERRORS++))
    fi
}

echo "📝 Vérification des fichiers de documentation:"
echo "-----------------------------------------------"
check_file "START_HERE.md"
check_file "REINITIALISATION_RAPIDE.md"
check_file "COMMANDES_RAPIDES.md"
check_file "SUMMARY_MODIFICATIONS.md"
check_file "INDEX_DOCUMENTATION.md"
check_file "LISEZ_MOI_DABORD.txt"
check_file "docs/DATABASE_RESET_GUIDE.md"

echo ""
echo "🛠️  Vérification des scripts:"
echo "-----------------------------------------------"
check_executable "database-manager.sh"
check_executable "reset-database.sh"
check_executable "clean-neo4j.sh"
check_executable "check-database.sh"

echo ""
echo "💻 Vérification du code source modifié:"
echo "-----------------------------------------------"
check_file "movie-service/src/main/java/com/codinggoline/movieservice/config/MovieDataLoader.java"
check_file "movie-service/src/main/java/com/codinggoline/movieservice/repository/MovieRepository.java"

echo ""
echo "📊 Vérification du contenu des fichiers clés:"
echo "-----------------------------------------------"

# Vérifier MovieDataLoader contient les nouvelles méthodes
if grep -q "fetchTopRatedMovies" movie-service/src/main/java/com/codinggoline/movieservice/config/MovieDataLoader.java 2>/dev/null; then
    echo -e "${GREEN}✅${NC} MovieDataLoader contient fetchTopRatedMovies()"
else
    echo -e "${RED}❌${NC} MovieDataLoader ne contient pas fetchTopRatedMovies()"
    ((ERRORS++))
fi

if grep -q "fetchNowPlayingMovies" movie-service/src/main/java/com/codinggoline/movieservice/config/MovieDataLoader.java 2>/dev/null; then
    echo -e "${GREEN}✅${NC} MovieDataLoader contient fetchNowPlayingMovies()"
else
    echo -e "${RED}❌${NC} MovieDataLoader ne contient pas fetchNowPlayingMovies()"
    ((ERRORS++))
fi

if grep -q "fetchMoviesByGenre" movie-service/src/main/java/com/codinggoline/movieservice/config/MovieDataLoader.java 2>/dev/null; then
    echo -e "${GREEN}✅${NC} MovieDataLoader contient fetchMoviesByGenre()"
else
    echo -e "${RED}❌${NC} MovieDataLoader ne contient pas fetchMoviesByGenre()"
    ((ERRORS++))
fi

# Vérifier MovieRepository contient findByTitle
if grep -q "findByTitle" movie-service/src/main/java/com/codinggoline/movieservice/repository/MovieRepository.java 2>/dev/null; then
    echo -e "${GREEN}✅${NC} MovieRepository contient findByTitle()"
else
    echo -e "${RED}❌${NC} MovieRepository ne contient pas findByTitle()"
    ((ERRORS++))
fi

echo ""
echo "=============================================================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 Tout est parfait! Aucune erreur détectée.${NC}"
    echo ""
    echo "✅ Tous les fichiers sont présents"
    echo "✅ Tous les scripts sont exécutables"
    echo "✅ Le code source a été correctement modifié"
    echo ""
    echo -e "${GREEN}Vous êtes prêt à réinitialiser la base de données!${NC}"
    echo ""
    echo "Prochaines étapes:"
    echo "  1. Lisez START_HERE.md"
    echo "  2. Lancez: ./database-manager.sh"
    echo ""
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Installation OK avec quelques avertissements.${NC}"
    echo ""
    echo "Avertissements: $WARNINGS"
    echo ""
    if [ $WARNINGS -gt 0 ]; then
        echo "Pour corriger les permissions des scripts:"
        echo "  chmod +x *.sh"
        echo ""
    fi
    exit 0
else
    echo -e "${RED}❌ Des erreurs ont été détectées!${NC}"
    echo ""
    echo "Erreurs: $ERRORS"
    echo "Avertissements: $WARNINGS"
    echo ""
    echo "Veuillez vérifier que tous les fichiers ont été correctement créés."
    exit 1
fi
