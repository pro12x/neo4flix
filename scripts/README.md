# 🎬 Scripts Neo4flix

Ce dossier contient les scripts utiles pour la gestion de Neo4flix.

## 📁 Contenu

### 🎥 Gestion des bandes-annonces

#### `add-trailers.sh`
Script bash pour ajouter automatiquement les URLs de bandes-annonces aux films dans Neo4j.

**Usage**:
```bash
./add-trailers.sh
```

**Fonctionnalités**:
- Ajoute des URLs YouTube embed pour 20+ films populaires
- Configure une vidéo de démo par défaut pour les autres films
- Affichage coloré de la progression
- Vérification automatique du succès

#### `add-trailer-urls.cypher`
Fichier de requêtes Cypher pour ajouter les bandes-annonces directement via Neo4j Browser.

**Usage**:
1. Ouvrir Neo4j Browser: `http://localhost:7474`
2. Copier-coller les requêtes du fichier
3. Exécuter une par une ou toutes ensemble

**Contenu**:
- Requêtes UPDATE pour chaque film
- Requête de fallback pour les films sans bande-annonce
- Requête de vérification finale

### 🔍 Diagnostic et debug (NOUVEAU - 2026-01-23)

#### `diagnose-categories.sh` ⭐
**Script de diagnostic complet pour les catégories vides**

**Usage**:
```bash
./diagnose-categories.sh
```

**Ce qu'il fait**:
- ✅ Vérifie que Neo4j est accessible
- ✅ Vérifie que l'API Gateway fonctionne
- ✅ Teste chaque catégorie (Action, Comedy, Drama, Sci-Fi, Horror, Romance)
- ✅ Affiche combien de films par catégorie
- ✅ Suggère des corrections si une catégorie est vide

**Exemple de sortie**:
```
🔍 Diagnostic des catégories Neo4flix
======================================

1️⃣  Vérification Neo4j...
✓ Neo4j accessible sur http://localhost:7474

2️⃣  Vérification API Gateway...
✓ API Gateway accessible

3️⃣  Test des catégories...

✓ Action: 45 films
✓ Comedy: 23 films
✗ Sci-Fi: 0 films
   → Le genre 'Sci-Fi' n'existe pas ou est mal orthographié dans Neo4j
```

#### `check-genres.cypher`
Requêtes Cypher pour analyser les genres dans Neo4j.

**Usage**:
```bash
cat check-genres.cypher
# Copier-coller les requêtes dans Neo4j Browser
```

**Contenu**:
- Liste tous les genres uniques
- Compte les films par genre
- Détecte les variations de noms (ex: "Sci-Fi" vs "SciFi")
- Trouve les films sans genres

#### `test-categories.sh`
Teste les endpoints API pour chaque catégorie.

**Usage**:
```bash
./test-categories.sh
```

**Nécessite**: `jq` (JSON processor)

### 🛠️ Maintenance système

#### `e2e-audit.sh`
Script d'audit end-to-end du système.

#### `kill-ghost-gateway.sh`
Script pour tuer les processus fantômes de l'API Gateway.

## 🚀 Quick Start

Pour configurer rapidement les bandes-annonces:

```bash
# Option 1: Exécuter directement le script
./add-trailers.sh

# Option 2: Utiliser le setup guidé
../setup-trailers.sh
```

## 📝 Ajouter une Nouvelle Bande-Annonce

### Méthode 1: Modifier le script

Éditez `add-trailers.sh` et ajoutez:
```bash
execute_cypher "MATCH (m:Movie {title: 'Titre du Film'}) SET m.trailer_url = 'https://www.youtube.com/embed/VIDEO_ID' RETURN m" "Titre du Film"
```

### Méthode 2: Via Neo4j Browser

```cypher
MATCH (m:Movie {title: "Titre du Film"})
SET m.trailer_url = "https://www.youtube.com/embed/VIDEO_ID"
RETURN m.title, m.trailer_url;
```

### Méthode 3: Via API REST

```bash
curl -X PUT http://localhost:8080/api/movies/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Titre du Film",
    "releaseDate": "2024-01-01",
    "trailerUrl": "https://www.youtube.com/embed/VIDEO_ID",
    "genres": ["Action"]
  }'
```

## 🎯 Format des URLs

Utilisez toujours le format **YouTube Embed**:
```
https://www.youtube.com/embed/{VIDEO_ID}
```

**Exemples**:
- ✅ Correct: `https://www.youtube.com/embed/vKQi3bBA1y8`
- ❌ Incorrect: `https://www.youtube.com/watch?v=vKQi3bBA1y8`
- ❌ Incorrect: `https://youtu.be/vKQi3bBA1y8`

## 🔍 Trouver un VIDEO_ID YouTube

1. Allez sur YouTube
2. Cherchez la bande-annonce du film
3. Cliquez sur "Partager" → "Intégrer"
4. Copiez le code qui ressemble à: `<iframe src="https://www.youtube.com/embed/VIDEO_ID"...`
5. Extraire le VIDEO_ID

Ou simplement:
- URL normale: `https://www.youtube.com/watch?v=VIDEO_ID`
- Extraire: `VIDEO_ID`

## ✅ Vérification

Pour vérifier que les bandes-annonces sont bien ajoutées:

### Via Neo4j Browser
```cypher
MATCH (m:Movie) 
WHERE m.trailer_url IS NOT NULL
RETURN m.title, m.trailer_url
ORDER BY m.title
LIMIT 20;
```

### Via Neo4j Browser (Compter)
```cypher
MATCH (m:Movie) 
RETURN 
  count(m) as total_movies,
  count(m.trailer_url) as movies_with_trailers;
```

## 📊 Films avec Bandes-Annonces

Le script `add-trailers.sh` configure automatiquement:

- The Matrix
- Inception
- The Dark Knight
- Interstellar
- The Shawshank Redemption
- Pulp Fiction
- Fight Club
- The Godfather
- Forrest Gump
- Avatar
- Titanic
- Gladiator
- Spider-Man: No Way Home
- Joker
- Black Panther
- Oppenheimer
- The Batman
- John Wick
- Parasite

**+ Vidéo de démo pour tous les autres films**

## 🛠️ Dépannage

### Le script ne s'exécute pas
```bash
chmod +x add-trailers.sh
./add-trailers.sh
```

### Erreur de connexion Neo4j
1. Vérifiez que Neo4j est démarré: `docker ps`
2. Vérifiez les credentials dans le script (neo4j/password)
3. Testez la connexion: `http://localhost:7474`

### Les URLs ne sont pas ajoutées
1. Vérifiez que les films existent dans la BDD
2. Vérifiez les noms exacts des films
3. Utilisez Neo4j Browser pour debug

## 📚 Documentation

Pour plus d'informations, consultez:
- `../docs/VIDEO_PLAYER_GUIDE.md` - Guide complet du lecteur vidéo
- `../docs/VIDEO_FEATURE_SUMMARY.md` - Résumé de la fonctionnalité
- `../setup-trailers.sh` - Script de setup guidé

## 🤝 Contribution

Pour ajouter plus de bandes-annonces:
1. Trouvez le VIDEO_ID YouTube
2. Ajoutez la ligne dans `add-trailers.sh`
3. Testez le script
4. Commitez les changements

## 📝 Notes

- Les URLs YouTube embed sont sécurisées et sans CORS
- Le script peut être exécuté plusieurs fois sans problème
- Les URLs existantes seront écrasées
- La vidéo de démo (Big Buck Bunny) est hébergée par Google
