# ========================================
# Stage 1: Build with Maven
# ========================================
FROM maven:3.9-eclipse-temurin-17-alpine AS builder

WORKDIR /build

# Copy parent POM
COPY pom.xml .

# Copy service POM
COPY api-gateway/pom.xml api-gateway/pom.xml

# Go to service directory and download dependencies
WORKDIR /build/api-gateway
RUN mvn dependency:go-offline -B || true

# Copy source code
COPY api-gateway/src ./src

# Build the application
RUN mvn clean package -DskipTests -B

# ========================================
# Stage 2: Runtime with JRE
# ========================================
FROM eclipse-temurin:17-jre-alpine

RUN apk add --no-cache curl

WORKDIR /app

COPY --from=builder /build/api-gateway/target/*.jar app.jar

EXPOSE 1111

ENTRYPOINT ["java", "-jar", "app.jar"]
