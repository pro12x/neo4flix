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
