# ========================================
# Stage 1: Build with Maven
# ========================================
FROM maven:3.9-eclipse-temurin-17-alpine AS builder

WORKDIR /build

# Copy parent POM first
COPY pom.xml .

# Copy service POM
COPY recommendation-service/pom.xml recommendation-service/

# Download dependencies (cached layer)
WORKDIR /build/recommendation-service
RUN mvn dependency:go-offline -B || true

# Copy source code
COPY recommendation-service/src ./src

# Build the application
RUN mvn clean package -DskipTests -B

# ========================================
# Stage 2: Runtime with JRE
# ========================================
FROM eclipse-temurin:17-jre-alpine

RUN apk add --no-cache curl

WORKDIR /app

# Copy JAR from builder stage
COPY --from=builder /build/recommendation-service/target/*.jar app.jar

EXPOSE 1115

ENTRYPOINT ["java", "-jar", "app.jar"]
