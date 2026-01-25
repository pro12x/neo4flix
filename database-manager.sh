#!/bin/bash
# Script interactif pour gérer la base de données Neo4flix
# Usage: ./database-manager.sh

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

clear
echo -e "${CYAN}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║          🎬 Neo4flix Database Manager 🎬                  ║"
echo "║                                                            ║"
echo "║          Gestionnaire de Base de Données                  ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Menu principal
while true; do
    echo ""
    echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}Que voulez-vous faire?${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  ${CYAN}1)${NC} 🔄 Réinitialisation complète (recommandé)"
    echo -e "     ${YELLOW}→${NC} Supprime tout et recharge 600+ films"
    echo ""
    echo -e "  ${CYAN}2)${NC} 🧹 Nettoyage simple"
    echo -e "     ${YELLOW}→${NC} Vide la base sans arrêter les services"
    echo ""
    echo -e "  ${CYAN}3)${NC} 🔍 Vérifier l'état de la base"
    echo -e "     ${YELLOW}→${NC} Statistiques et informations"
    echo ""
    echo -e "  ${CYAN}4)${NC} 📊 Voir les logs du chargement"
    echo -e "     ${YELLOW}→${NC} Suivre le processus en temps réel"
    echo ""
    echo -e "  ${CYAN}5)${NC} 🏗️  Compiler et rebuilder"
    echo -e "     ${YELLOW}→${NC} Recompiler le movie-service"
    echo ""
    echo -e "  ${CYAN}6)${NC} 🚀 Redémarrer les services"
    echo -e "     ${YELLOW}→${NC} Redémarrer tous les containers"
    echo ""
    echo -e "  ${CYAN}7)${NC} 📖 Aide et documentation"
    echo -e "     ${YELLOW}→${NC} Afficher les ressources disponibles"
    echo ""
    echo -e "  ${CYAN}0)${NC} 🚪 Quitter"
    echo ""
    echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
    echo -n -e "${GREEN}Votre choix [0-7]: ${NC}"
    read choice

    case $choice in
        1)
            echo ""
            echo -e "${MAGENTA}╔════════════════════════════════════════════════════╗${NC}"
            echo -e "${MAGENTA}║  🔄 RÉINITIALISATION COMPLÈTE                     ║${NC}"
            echo -e "${MAGENTA}╚════════════════════════════════════════════════════╝${NC}"
            echo ""
            echo -e "${YELLOW}⚠️  ATTENTION: Ceci va supprimer TOUTES les données!${NC}"
            echo -e "${YELLOW}Cette opération va:${NC}"
            echo -e "  - Arrêter tous les services"
            echo -e "  - Supprimer les volumes Neo4j"
            echo -e "  - Redémarrer Neo4j"
            echo -e "  - Nettoyer la base"
            echo -e "  - Créer les index"
            echo -e "  - Redémarrer tous les services"
            echo -e "  - Charger 600+ films automatiquement"
            echo ""
            echo -n -e "${GREEN}Continuer? (o/N): ${NC}"
            read confirm
            if [[ $confirm == [oO] ]]; then
                ./reset-database.sh
            else
                echo -e "${YELLOW}Opération annulée.${NC}"
            fi
            ;;
        2)
            echo ""
            echo -e "${MAGENTA}╔════════════════════════════════════════════════════╗${NC}"
            echo -e "${MAGENTA}║  🧹 NETTOYAGE SIMPLE                              ║${NC}"
            echo -e "${MAGENTA}╚════════════════════════════════════════════════════╝${NC}"
            echo ""
            echo -e "${YELLOW}⚠️  Ceci va nettoyer la base de données${NC}"
            echo -n -e "${GREEN}Continuer? (o/N): ${NC}"
            read confirm
            if [[ $confirm == [oO] ]]; then
                ./clean-neo4j.sh
                echo ""
                echo -e "${BLUE}Redémarrage du movie-service...${NC}"
                docker-compose restart movie-service
                echo -e "${GREEN}✅ Terminé! Consultez les logs pour suivre le chargement.${NC}"
            else
                echo -e "${YELLOW}Opération annulée.${NC}"
            fi
            ;;
        3)
            echo ""
            echo -e "${MAGENTA}╔════════════════════════════════════════════════════╗${NC}"
            echo -e "${MAGENTA}║  🔍 VÉRIFICATION DE L'ÉTAT                        ║${NC}"
            echo -e "${MAGENTA}╚════════════════════════════════════════════════════╝${NC}"
            echo ""
            ./check-database.sh
            ;;
        4)
            echo ""
            echo -e "${MAGENTA}╔════════════════════════════════════════════════════╗${NC}"
            echo -e "${MAGENTA}║  📊 LOGS DU CHARGEMENT                            ║${NC}"
            echo -e "${MAGENTA}╚════════════════════════════════════════════════════╝${NC}"
            echo ""
            echo -e "${BLUE}Affichage des logs (Ctrl+C pour quitter)...${NC}"
            echo ""
            docker-compose logs -f movie-service
            ;;
        5)
            echo ""
            echo -e "${MAGENTA}╔════════════════════════════════════════════════════╗${NC}"
            echo -e "${MAGENTA}║  🏗️  COMPILATION                                   ║${NC}"
            echo -e "${MAGENTA}╚════════════════════════════════════════════════════╝${NC}"
            echo ""
            echo -e "${BLUE}Compilation du movie-service...${NC}"
            cd movie-service
            mvn clean package -DskipTests
            cd ..
            echo ""
            echo -e "${BLUE}Rebuild de l'image Docker...${NC}"
            docker-compose build movie-service
            echo ""
            echo -e "${GREEN}✅ Compilation terminée!${NC}"
            echo -e "${YELLOW}💡 N'oubliez pas de redémarrer le service (option 6)${NC}"
            ;;
        6)
            echo ""
            echo -e "${MAGENTA}╔════════════════════════════════════════════════════╗${NC}"
            echo -e "${MAGENTA}║  🚀 REDÉMARRAGE DES SERVICES                      ║${NC}"
            echo -e "${MAGENTA}╚════════════════════════════════════════════════════╝${NC}"
            echo ""
            echo -e "${BLUE}Arrêt des services...${NC}"
            docker-compose down
            echo ""
            echo -e "${BLUE}Démarrage des services...${NC}"
            docker-compose up -d
            echo ""
            echo -e "${GREEN}✅ Services redémarrés!${NC}"
            echo -e "${YELLOW}Attendez ~30 secondes pour que tout soit prêt.${NC}"
            ;;
        7)
            echo ""
            echo -e "${MAGENTA}╔════════════════════════════════════════════════════╗${NC}"
            echo -e "${MAGENTA}║  📖 AIDE ET DOCUMENTATION                         ║${NC}"
            echo -e "${MAGENTA}╚════════════════════════════════════════════════════╝${NC}"
            echo ""
            echo -e "${CYAN}Documents disponibles:${NC}"
            echo ""
            echo -e "${GREEN}1. REINITIALISATION_RAPIDE.md${NC}"
            echo -e "   → Guide rapide de démarrage"
            echo ""
            echo -e "${GREEN}2. docs/DATABASE_RESET_GUIDE.md${NC}"
            echo -e "   → Documentation complète et détaillée"
            echo ""
            echo -e "${GREEN}3. COMMANDES_RAPIDES.md${NC}"
            echo -e "   → Toutes les commandes utiles"
            echo ""
            echo -e "${GREEN}4. SUMMARY_MODIFICATIONS.md${NC}"
            echo -e "   → Résumé de toutes les modifications"
            echo ""
            echo -e "${CYAN}Accès rapides:${NC}"
            echo -e "   Neo4j Browser: ${GREEN}http://localhost:7474${NC}"
            echo -e "   API Gateway:   ${GREEN}http://localhost:1111${NC}"
            echo -e "   Movie Service: ${GREEN}http://localhost:1113${NC}"
            echo ""
            echo -e "${CYAN}Scripts disponibles:${NC}"
            echo -e "   ${GREEN}./reset-database.sh${NC}  - Réinitialisation complète"
            echo -e "   ${GREEN}./clean-neo4j.sh${NC}     - Nettoyage simple"
            echo -e "   ${GREEN}./check-database.sh${NC}  - Vérification état"
            echo ""
            ;;
        0)
            echo ""
            echo -e "${GREEN}👋 Au revoir!${NC}"
            echo ""
            exit 0
            ;;
        *)
            echo ""
            echo -e "${RED}❌ Choix invalide. Veuillez sélectionner un nombre entre 0 et 7.${NC}"
            ;;
    esac

    echo ""
    echo -n -e "${YELLOW}Appuyez sur Entrée pour continuer...${NC}"
    read
    clear
    echo -e "${CYAN}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║          🎬 Neo4flix Database Manager 🎬                  ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
done
