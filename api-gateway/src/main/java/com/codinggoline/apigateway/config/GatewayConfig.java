package com.codinggoline.apigateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // User Service Routes - Auth
                .route("user-service-auth", r -> r
                        .path("/api/v1/auth/**")
                        .uri("lb://user-service"))

                // User Service Routes
                .route("user-service", r -> r
                        .path("/api/v1/users/**")
                        .filters(f -> f
                                .circuitBreaker(config -> config
                                        .setName("userServiceCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/users"))
                                .retry(config -> config
                                        .setRetries(3)
                                        .setMethods(HttpMethod.GET)))
                        .uri("lb://user-service"))

                // Movie Service Routes
                .route("movie-service", r -> r
                        .path("/api/v1/movies/**")
                        .filters(f -> f
                                .circuitBreaker(config -> config
                                        .setName("movieServiceCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/movies"))
                                .retry(config -> config
                                        .setRetries(3)
                                        .setMethods(HttpMethod.GET)))
                        .uri("lb://movie-service"))

                // Rating Service Routes
                .route("rating-service", r -> r
                        .path("/api/v1/ratings/**")
                        .filters(f -> f
                                .circuitBreaker(config -> config
                                        .setName("ratingServiceCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/ratings"))
                                .retry(config -> config
                                        .setRetries(3)
                                        .setMethods(HttpMethod.GET)))
                        .uri("lb://rating-service"))

                // Recommendation Service Routes
                .route("recommendation-service", r -> r
                        .path("/api/v1/recommendations/**")
                        .filters(f -> f
                                .circuitBreaker(config -> config
                                        .setName("recommendationServiceCircuitBreaker")
                                        .setFallbackUri("forward:/fallback/recommendations"))
                                .retry(config -> config
                                        .setRetries(3)
                                        .setMethods(HttpMethod.GET)))
                        .uri("lb://recommendation-service"))

                .build();
    }
}
