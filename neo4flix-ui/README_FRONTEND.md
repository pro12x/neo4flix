# Neo4flix UI - Angular Frontend

Application web Angular pour Neo4flix - plateforme de streaming de films.

---

## 🚀 Démarrage rapide

### Développement local
```bash
npm install
npm start
```

Ouvre http://localhost:4200

### Production avec Docker 🐳
```bash
# Test rapide
./docker-build-test.sh

# Ou manuellement
docker build -t neo4flix-ui .
docker run -p 8080:80 -e API_BASE_URL=http://localhost:1111 neo4flix-ui
```

Ouvre http://localhost:8080

---

## 📦 Docker

### Variables d'environnement
- `API_BASE_URL` - URL de l'API Gateway (défaut: `http://localhost:1111`)

### Exemples

**Build:**
```bash
docker build -t neo4flix-ui:latest .
```

**Run standalone:**
```bash
docker run -d \
  --name neo4flix-ui \
  -p 4200:80 \
  -e API_BASE_URL=http://localhost:1111 \
  neo4flix-ui:latest
```

**Avec Docker Compose (recommandé):**
```bash
# Depuis la racine du projet
docker compose up -d
```

---

## 🏗️ Architecture Docker

### Multi-stage build
1. **Stage 1 (builder):** Build Angular avec Node 20
2. **Stage 2 (runtime):** Serve statique avec Nginx Alpine

### Runtime configuration
Le fichier `assets/env.js` est généré au démarrage du container.  
Cela permet de changer l'URL API **sans rebuilder l'image**.

---

## 📁 Fichiers Docker

- `Dockerfile` - Build multi-stage optimisé
- `nginx/default.conf` - Config Nginx (SPA routing + cache + gzip)
- `docker/entrypoint.sh` - Génère env.js au runtime
- `.dockerignore` - Optimise le build
- `docker-build-test.sh` - Script de test local

---

## 🧪 Tests

```bash
npm test
```

---

## 📚 Documentation

- `README_DOCKER.md` - Guide Docker détaillé
- `/docs/DEPLOYMENT_VPS.md` - Déploiement sur VPS
- `/FRONTEND_DOCKER_FIXED.md` - Fix dockerisation

---

## 🛠️ Développement

### Structure
```
src/
  app/
    components/     - Composants UI (home, browse, etc.)
    services/       - Services (API calls, auth)
    interceptors/   - HTTP interceptors (JWT)
    models/         - Types TypeScript
  environments/     - Configuration (dev/prod)
  assets/           - Images, styles, runtime config
```

### Configuration API
- **Dev:** `http://localhost:1111` (hardcodé dans environment.ts)
- **Docker:** Runtime via `window.__env.apiBaseUrl` (généré par entrypoint.sh)

---

## 📋 Scripts disponibles

- `npm start` - Dev server avec HMR
- `npm run build` - Build production
- `npm test` - Run tests
- `./docker-build-test.sh` - Build et test image Docker

---

## 🚀 Déploiement VPS

Voir `/docs/DEPLOYMENT_VPS.md` pour le guide complet.

**Résumé rapide:**
```bash
# Sur le VPS
git clone <repo>
cd neo4flix
nano .env  # Configure JWT_SECRET et Neo4j
./deploy-vps.sh
```

---

**Version:** 1.0.0  
**Framework:** Angular 21  
**Auteur:** Neo4flix Team  
**Date:** 25 janvier 2026
