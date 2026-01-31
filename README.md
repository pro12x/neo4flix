# Neo4flix - Movie Recommendation System

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Java](https://img.shields.io/badge/Java-17-orange)]()
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.8-green)]()
[![Neo4j](https://img.shields.io/badge/Neo4j-Latest-blue)]()
[![Angular](https://img.shields.io/badge/Angular-18+-red)]()

## 📖 Overview

Neo4flix is a comprehensive movie recommendation engine built with modern microservices architecture. It leverages Neo4j graph database for intelligent recommendations, Spring Boot for backend services, and Angular for a responsive frontend.

## 🏗️ Architecture

### Microservices

The application consists of 7 services:

1. **Eureka Server** (Port 8761)
   - Service Discovery
   - Service registry and health monitoring
   - Dashboard UI for service visualization

2. **API Gateway** (Port 1111)
   - Single entry point for all requests
   - Load balancing with Eureka integration
   - Circuit breaker pattern (Resilience4j)
   - Retry logic and fallback endpoints
   - CORS configuration

3. **User Service** (Port 1112)
   - User registration and authentication
   - Profile management
   - User preferences
   - Two-Factor Authentication (2FA)

4. **Movie Service** (Port 1113)
   - Movie catalog management
   - Search and filtering
   - Genre management

5. **Rating Service** (Port 1114)
   - User ratings CRUD operations
   - Rating analytics
   - User-movie relationship management

6. **Recommendation Service** (Port 1115)
   - Collaborative filtering
   - Content-based recommendations
   - Trending movies
   - Genre-specific suggestions

7. **Neo4Flix UI** (Port 4200)
   - Angular frontend application
   - Responsive movie browsing interface
   - User authentication and profile management
   - Movie ratings and watchlist

### Technology Stack

**Backend:**
- Java 17
- Spring Boot 3.5.8
- Spring Data Neo4j
- Maven
- Lombok
- Jakarta Validation

**Database:**
- Neo4j (Graph Database)
- Neo4j Aura Cloud

**Frontend:**
- Angular 18+
- TypeScript
- SCSS
- RxJS

**DevOps:**
- Docker & Docker Compose
- Jenkins (CI/CD)
- Git

## 🚀 Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- Docker & Docker Compose
- Node.js 18+ (for frontend)
- Neo4j Aura account (or local Neo4j instance)

### 🔄 Database Reinitialization (NEW!)

The system now loads **600+ movies** from multiple categories instead of just 100!

**Quick Reset:**
```bash
# Complete reset (recommended)
./reset-database.sh

# OR simple cleanup
./clean-neo4j.sh
docker-compose restart movie-service
```

**What gets loaded:**
- 200 Popular movies
- 200 Top-rated movies
- 100 Now Playing movies
- 100 Upcoming movies
- 120 Genre-specific movies (Action, Comedy, Drama, Sci-Fi, Horror, Romance)

**See:** `REINITIALISATION_RAPIDE.md` for detailed instructions

### Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd neo4flix
```

2. Configure environment variables in `.env`:
```properties
# Application
APP_NAME=Neo4Flix
SPRING_PROFILES_ACTIVE=dev

# Microservices Ports
USER_SERVICE_PORT=1112
MOVIE_SERVICE_PORT=1113
RATING_SERVICE_PORT=1114
RECOMMENDATION_SERVICE_PORT=1115

# Neo4j Configuration
NEO4J_URI=neo4j+s://your-instance.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your-password
NEO4J_DATABASE=neo4j

# Communication Services
ZOOKEEPER_CLIENT_PORT=2181
ZOOKEEPER_TICK_TIME=2000
KAFKA_PORT=9092
```

### Build & Run

#### Option 1: Using Docker Compose (Recommended)

```bash
# Build all services
mvn clean install -DskipTests

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

#### Option 2: Run Individual Services

```bash
# Build all services
mvn clean install -DskipTests

# Run User Service
cd user-service
mvn spring-boot:run

# Run Movie Service (in new terminal)
cd movie-service
mvn spring-boot:run

# Run Rating Service (in new terminal)
cd rating-service
mvn spring-boot:run

# Run Recommendation Service (in new terminal)
cd recommendation-service
mvn spring-boot:run
```

#### Frontend Setup

```bash
cd neo4flix-ui
npm install
npm start
```

Frontend will be available at: http://localhost:4200

## 📚 API Documentation

### User Service (Port 1112)

#### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/users` | Create new user |
| GET | `/api/v1/users/{id}` | Get user by ID |
| GET | `/api/v1/users/email/{email}` | Get user by email |
| GET | `/api/v1/users` | Get all users |
| PUT | `/api/v1/users/{id}` | Update user |
| DELETE | `/api/v1/users/{id}` | Delete user |

**Example Request:**
```json
POST /api/v1/users
{
  "firstName": "John",
  "lastName": "Doe",
  "pseudo": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "USER"
}
```

### Movie Service (Port 1113)

#### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/movies` | Create new movie |
| GET | `/api/v1/movies/{id}` | Get movie by ID |
| GET | `/api/v1/movies` | Get all movies |
| GET | `/api/v1/movies/search?title={title}` | Search movies |
| GET | `/api/v1/movies/genre/{genre}` | Get movies by genre |
| GET | `/api/v1/movies/latest?limit={limit}` | Get latest movies |
| GET | `/api/v1/movies/top-rated?minRating={rating}` | Get top rated movies |
| PUT | `/api/v1/movies/{id}` | Update movie |
| DELETE | `/api/v1/movies/{id}` | Delete movie |

**Example Request:**
```json
POST /api/v1/movies
{
  "title": "The Matrix",
  "releaseDate": "1999-03-31",
  "plot": "A computer hacker learns about the true nature of reality...",
  "poster": "https://example.com/matrix.jpg",
  "imdbId": "tt0133093",
  "genres": ["Action", "Sci-Fi"]
}
```

### Rating Service (Port 1114)

#### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/ratings` | Create rating |
| GET | `/api/v1/ratings/user/{userId}` | Get user's ratings |
| GET | `/api/v1/ratings/movie/{movieId}/average` | Get movie average rating |
| PUT | `/api/v1/ratings/user/{userId}/movie/{movieId}` | Update rating |
| DELETE | `/api/v1/ratings/user/{userId}/movie/{movieId}` | Delete rating |

**Example Request:**
```json
POST /api/v1/ratings
{
  "userId": "user-123",
  "movieId": "movie-456",
  "rating": 4.5,
  "review": "Great movie! Highly recommended."
}
```

### Recommendation Service (Port 1115)

#### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/recommendations/user/{userId}?limit={limit}` | Get personalized recommendations |
| GET | `/api/v1/recommendations/user/{userId}/collaborative` | Collaborative filtering |
| GET | `/api/v1/recommendations/user/{userId}/content-based` | Content-based recommendations |
| GET | `/api/v1/recommendations/user/{userId}/trending` | Trending movies |
| GET | `/api/v1/recommendations/user/{userId}/genre/{genre}` | Genre-specific recommendations |
| GET | `/api/v1/recommendations/movie/{movieId}/similar` | Similar movies |

## 🔒 Security

### Authentication

The application implements JWT-based authentication for secure access to all endpoints.

### Two-Factor Authentication (2FA)

Neo4Flix supports Two-Factor Authentication using TOTP (Time-based One-Time Password) for enhanced security. Users can enable 2FA in their profile using Google Authenticator or similar apps.

### Password Policy

- Minimum 8 characters
- Must include uppercase and lowercase letters
- Must include numbers
- Must include special characters

### HTTPS

In production, all communication should be encrypted using HTTPS with SSL/TLS certificates.

## 🧪 Testing

```bash
# Run all tests
mvn test

# Run tests for specific service
cd user-service
mvn test
```

## 🐳 Docker Deployment

### Services in Docker Compose

- Neo4j Database (Ports 7474, 7687)
- User Service (Port 1112)
- Movie Service (Port 1113)
- Rating Service (Port 1114)
- Recommendation Service (Port 1115)
- Neo4Flix UI (Port 4200)
- MongoDB (for additional data)
- Zookeeper (Port 2181)
- Kafka (Port 9092)

### Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Rebuild specific service
docker-compose up -d --build [service-name]
```

## 📊 Neo4j Graph Model

### Nodes

- **User**: Represents application users
  - Properties: id, firstName, lastName, email, pseudo, role, createdAt

- **Movie**: Represents movies in the catalog
  - Properties: id, title, releaseDate, plot, poster, imdbId, genres, averageRating, ratingCount

- **Genre**: Represents movie genres
  - Properties: id, name

### Relationships

- **(User)-[RATED]->(Movie)**: User rates a movie
  - Properties: rating, review, createdAt, updatedAt

- **(Movie)-[IN_GENRE]->(Genre)**: Movie belongs to genre

## 🔍 Recommendation Algorithms

### 1. Collaborative Filtering
Recommends movies based on similar users' preferences:
```cypher
MATCH (u:Users {id: $userId})-[r:RATED]->(m:Movie)
WITH u, avg(r.rating) as userAvg
MATCH (u)-[r1:RATED]->(m1:Movie)<-[r2:RATED]-(other:Users)
WHERE r1.rating > userAvg AND r2.rating > userAvg
WITH other, count(DISTINCT m1) as commonMovies
ORDER BY commonMovies DESC LIMIT 10
MATCH (other)-[r3:RATED]->(rec:Movie)
WHERE NOT EXISTS((u)-[:RATED]->(rec)) AND r3.rating >= 4.0
RETURN rec
ORDER BY count(*) DESC, rec.average_rating DESC
```

### 2. Content-Based Filtering
Recommends movies based on genre preferences:
```cypher
MATCH (u:Users {id: $userId})-[r:RATED]->(m:Movie)
WHERE r.rating >= 4.0
WITH u, collect(DISTINCT m.genres) as likedGenres
UNWIND likedGenres as genreList
UNWIND genreList as genre
MATCH (rec:Movie)
WHERE NOT EXISTS((u)-[:RATED]->(rec))
AND any(g IN rec.genres WHERE g = genre)
RETURN rec
ORDER BY count(*) DESC, rec.average_rating DESC
```

### 3. Trending Movies
Shows popular movies the user hasn't rated yet:
```cypher
MATCH (m:Movie)
WHERE NOT EXISTS((:Users {id: $userId})-[:RATED]->(m))
AND m.rating_count >= 10
RETURN m
ORDER BY m.average_rating DESC, m.rating_count DESC
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **Pro12x** - Initial work - [GitHub Profile](https://github.com/pro12x)

## 🙏 Acknowledgments

- Neo4j for excellent graph database technology
- Spring Boot team for robust framework
- Angular team for powerful frontend framework

## 📞 Support

For support, email support@neo4flix.com or open an issue in the repository.

---

**Built with ❤️ using Spring Boot, Neo4j, and Angular**

## Frontend (Neo4Flix UI) — HTTPS, logs and CORS notes

Note: The frontend has been hardened and updated to run over HTTPS in container deployments and to avoid accidental leakage of sensitive data via console logs. Read the short how-to and troubleshooting notes below.

### HTTPS (production / docker)

- The frontend is served by an internal Nginx inside the `neo4flix-ui` container and listens on port 1116 with TLS enabled. The container exposes the UI over HTTPS to avoid mixed-content issues when the backend is HTTPS.
- Nginx configuration to look at: `neo4flix-ui/nginx/default.conf` — it contains the `listen 1116 ssl;` stanza and expects certificates at:
  - `/etc/ssl/certs/neo4flix-ui-cert.pem`
  - `/etc/ssl/private/neo4flix-ui-key.pem`

- In local/container development you can use self-signed certificates (the repo contains helper scripts in `docs/` and `neo4flix-ui/` to generate dev certs). When using self-signed certs, your browser will require explicitly trusting the cert or you can bypass certificate checks in tests using `curl -k`.

- The Nginx reverse proxy forwards API calls with the original path preserved. If you access the UI at `https://localhost:1116`, API calls to `/api/...` are proxied to the API Gateway (internal service) so the browser does not need to talk to the gateway port directly and CORS / mixed-content issues are avoided.

  - Example: frontend request `POST https://localhost:1116/api/v1/auth/login` is proxied to `http://api-gateway:1111/api/v1/auth/login` by the container network (no trailing slash rewrite), preventing 404 caused by path stripping.

### Ports (summary)
- Frontend (NGINX with TLS): 1116 (HTTPS)
- API Gateway (internal in compose): 1111 (HTTP by gateway service)

> If you previously ran the frontend at `http://localhost:4200` for development, the Dockerized containerized frontend now serves over HTTPS at `https://localhost:1116`. The dev server (`npm start`) still runs on 4200 for local dev without Docker.

### How to (re)build and start the frontend with HTTPS in Docker Compose

1. Ensure certificates are present (or generate dev certs). The project includes scripts and docs to generate dev certs. One simple helper is in `docs/GENERATE_DEV_SSL_CERTS.sh`.

2. Rebuild and start the frontend container (and the gateway if you need it):

```bash
# from repository root
# rebuild frontend image and start the ui and gateway
docker-compose up --build neo4flix-ui api-gateway
```

3. Open: https://localhost:1116 (ignore certificate warnings if self-signed or add the cert to your OS/browser trust store).

4. Test the API proxy behavior (example):

```bash
# health check for frontend nginx
curl -k https://localhost:1116/health
# login (example), -k ignores self-signed cert warnings
curl -k -v https://localhost:1116/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@user.com","password":"Password123!"}'
```

If you receive 404 for `/api/...` when using the Dockerized UI, be sure your containers are up and `api-gateway` is reachable from the `neo4flix-ui` container (compose network). The Nginx config was fixed to forward the full original path (no path-stripping) — this fixes cases where `proxy_pass` included a trailing slash and caused `/api` to be removed.

### Console logs: disabled by default

- To avoid accidental leakage of tokens, user info or sensitive data in production, the frontend now disables all `console` methods by default (log/debug/info/warn/error/trace) very early during application bootstrap.
- Implementation: `neo4flix-ui/src/main.ts` contains a small runtime override that replaces `console.log`, `console.error`, etc. with no-op functions. This prevents accidental console output in production containers.

- Re-enable logs temporarily for debugging (NOT recommended in production):
  - Set a runtime flag in the frontend runtime config before the app boots. The runtime config file used by the Docker entrypoint is `neo4flix-ui/public/assets/env.js` and you can set:

```javascript
window.__env = window.__env || {};
window.__env.disableLogs = 'false';
```

  - Note: For the override to take effect you must set this before Angular bootstraps (the Docker entrypoint will overwrite `assets/env.js` at container startup).

### CORS and mixed-content

- The dockerized frontend proxies requests to the API Gateway. Because the browser talks to the UI host (`https://localhost:1116`) and Nginx forwards to the internal gateway (HTTP), the browser sees only same-origin requests to the UI's host and CORS issues are avoided.
- If you run the frontend outside of the container (e.g., `npm start` on `http://localhost:4200`), you must ensure the API Gateway allows CORS from that origin (see gateway CORS configuration). The API Gateway contains CORS configuration in its Spring Boot config (see `api-gateway/src/main/.../CorsConfig` if you need to adjust allowed origins).

### What changed in the codebase (short list)
- `neo4flix-ui/nginx/default.conf` — nginx updated to listen on 1116 with SSL, redirect HTTP 80 → HTTPS:1116, and `location /api/ { proxy_pass http://api-gateway:1111; }` (no trailing slash to preserve request path).
- `neo4flix-ui/src/main.ts` — global console override to disable console methods by default and silent bootstrap catch.
- Multiple frontend components & interceptors had console.* calls removed or neutralized (no sensitive data logged). See `src/app/...` for individual edits.

### Troubleshooting
- 404 on POST to `/api/v1/auth/login` from the UI:
  - If running via Docker compose, ensure `neo4flix-ui` and `api-gateway` services are up and healthy, and `neo4flix-ui` can resolve `api-gateway` (use `docker-compose logs` and `docker-compose exec neo4flix-ui nginx -T` to inspect active config).
  - If running the Angular dev server (4200), ensure `environment.apiBaseUrl` or `public/assets/env.js` points to the correct gateway URL and that gateway CORS allows `http://localhost:4200`.

