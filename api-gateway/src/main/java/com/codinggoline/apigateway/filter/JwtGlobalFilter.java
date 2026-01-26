package com.codinggoline.apigateway.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@Slf4j
public class JwtGlobalFilter implements GlobalFilter, Ordered {

    @Value("${jwt.secret:dummy}")
    private String secret;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getPath().value();

        // Skip JWT validation for public endpoints
        if (isPublicPath(path)) {
            return chain.filter(exchange);
        }

        // Check Authorization header presence; do not attempt to parse/validate here to avoid JJWT issues
        String authHeader = request.getHeaders().getFirst("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.debug("Missing or invalid Authorization header for path {}", path);
            return onError(exchange, HttpStatus.UNAUTHORIZED);
        }

        // Forward the request with the Authorization header intact; downstream services should validate the token
        return chain.filter(exchange);
    }

    private boolean isPublicPath(String path) {
        return path.contains("/auth/register") ||
                path.contains("/auth/login") ||
                path.contains("/users/register") ||
                path.contains("/users/login") ||
                path.contains("/actuator") ||
                path.contains("/auth/verify-2fa") ||
                path.contains("/auth/2fa/setup") ||
                path.contains("/auth/2fa/enable") ||
                path.contains("/auth/2fa/disable") ||
                path.contains("/eureka");
    }

    private Mono<Void> onError(ServerWebExchange exchange, HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        return response.setComplete();
    }

    @Override
    public int getOrder() {
        return -100; // Execute before other filters
    }
}
