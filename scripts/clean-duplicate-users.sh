#!/bin/bash
# Script pour nettoyer les utilisateurs en double dans Neo4j

set -e

NEO4J_URL="bolt://localhost:7687"
NEO4J_USER="neo4j"
NEO4J_PASS="password"

echo "🧹 Nettoyage des utilisateurs en double dans Neo4j"
echo "=================================================="
echo ""

# Fonction pour exécuter une requête Cypher
execute_cypher() {
    local query="$1"
    local description="$2"

    echo "📝 $description"

    if command -v cypher-shell &> /dev/null; then
        cypher-shell -a "$NEO4J_URL" -u "$NEO4J_USER" -p "$NEO4J_PASS" "$query" 2>&1 || {
            echo "⚠️  Erreur - vérifie que Neo4j est démarré et que les credentials sont corrects"
            return 1
        }
    else
        echo "⚠️  cypher-shell non disponible. Utilise Neo4j Browser à la place:"
        echo "   http://localhost:7474"
        echo "   Copie-colle: cat scripts/clean-duplicate-users.cypher"
        return 1
    fi
}

echo "1️⃣  Vérification des doublons..."
echo ""

execute_cypher "MATCH (u:Users) WITH u.email AS email, COLLECT(u) AS users WHERE SIZE(users) > 1 RETURN email, SIZE(users) AS count;" "Recherche des emails en double"

echo ""
echo "2️⃣  Suppression des doublons (garde le plus ancien)..."
echo ""

execute_cypher "MATCH (u:Users) WITH u.email AS email, COLLECT(u) AS users WHERE SIZE(users) > 1 WITH email, users, HEAD([user IN users ORDER BY user.created_at ASC]) AS oldest UNWIND users AS user WITH email, oldest, user WHERE user.id <> oldest.id DELETE user RETURN email, COUNT(*) AS deleted;" "Nettoyage des doublons"

echo ""
echo "3️⃣  Création de la contrainte d'unicité sur l'email..."
echo ""

execute_cypher "CREATE CONSTRAINT users_email_unique IF NOT EXISTS FOR (u:Users) REQUIRE u.email IS UNIQUE;" "Contrainte d'unicité"

echo ""
echo "4️⃣  Création d'un index sur l'email..."
echo ""

execute_cypher "CREATE INDEX users_email_index IF NOT EXISTS FOR (u:Users) ON (u.email);" "Index sur email"

echo ""
echo "5️⃣  Vérification finale..."
echo ""

execute_cypher "MATCH (u:Users) RETURN u.id, u.email, u.pseudo, u.role, u.created_at ORDER BY u.created_at;" "Liste des utilisateurs"

echo ""
echo "═══════════════════════════════════════════"
echo "✅ Nettoyage terminé !"
echo "═══════════════════════════════════════════"
echo ""
echo "Résumé:"
echo "  • Doublons supprimés"
echo "  • Contrainte d'unicité créée sur email"
echo "  • Index créé pour améliorer les performances"
echo ""
echo "Maintenant tu peux redémarrer le User Service."
echo "Il ne créera plus de doublons grâce à la contrainte."
echo ""
