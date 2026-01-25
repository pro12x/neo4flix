FROM eclipse-temurin:17-jdk-alpine

LABEL authors="Franchis Janel MOKOMBA"
LABEL description="This is our user service container image"

RUN apk add --no-cache curl

WORKDIR /app

COPY target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]

