# ========================================
# Stage 1: Build with Maven
# ========================================
FROM maven:3.9-eclipse-temurin-17-alpine AS builder

WORKDIR /build

# Copy parent POM first
COPY pom.xml .

# Copy service POM
COPY eureka-server/pom.xml eureka-server/

# Download dependencies (cached layer)
WORKDIR /build/eureka-server
RUN mvn dependency:go-offline -B || true

# Copy source code
COPY eureka-server/src ./src

# Build the application
RUN mvn clean package -DskipTests -B

# ========================================
# Stage 2: Runtime with JRE
# ========================================
FROM eclipse-temurin:17-jre-alpine

RUN apk add --no-cache curl

WORKDIR /app

# Copy JAR from builder stage
COPY --from=builder /build/eureka-server/target/*.jar app.jar

EXPOSE 8761

ENTRYPOINT ["java", "-jar", "app.jar"]
