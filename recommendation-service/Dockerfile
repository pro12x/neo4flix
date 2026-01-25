FROM eclipse-temurin:17-jre-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 1115
ENTRYPOINT ["java", "-jar", "app.jar"]
