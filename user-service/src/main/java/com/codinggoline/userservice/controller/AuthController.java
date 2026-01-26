package com.codinggoline.userservice.controller;

import com.codinggoline.userservice.dto.*;
import com.codinggoline.userservice.service.AuthService;
import com.codinggoline.userservice.service.TwoFactorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final TwoFactorService twoFactorService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registration request received for email: {}", request.getEmail());
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request received for email: {}", request.getEmail());
        // Perform authentication and return either token or require 2FA
        Map<String, Object> result = authService.loginWithPossible2Fa(request);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/verify-2fa")
    public ResponseEntity<AuthResponse> verify2Fa(@RequestBody Verify2FaRequest request) {
        log.info("2FA verification for user: {}", request.getEmail());
        AuthResponse response = authService.verify2Fa(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/2fa/setup")
    public ResponseEntity<Map<String, String>> setup2Fa(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            log.info("2FA setup request for email: {}", email);
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }
            String secret = twoFactorService.generateSecret();
            String uri = twoFactorService.getOtpAuthUri(secret, email, "Neo4Flix");
            // Save secret temporarily in DB as not enabled until user verifies
            authService.saveTwoFactorSecret(email, secret);
            log.info("2FA setup successful for email: {}", email);
            return ResponseEntity.ok(Map.of("secret", secret, "otpauth_uri", uri));
        } catch (Exception e) {
            log.error("Error in 2FA setup", e);
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error"));
        }
    }

    @PostMapping("/2fa/enable")
    public ResponseEntity<Map<String, Object>> enable2Fa(@RequestBody Verify2FaRequest request) {
        authService.enableTwoFactorForUser(request.getEmail(), request.getCode());
        return ResponseEntity.ok(Map.of("enabled", true));
    }

    @PostMapping("/2fa/disable")
    public ResponseEntity<Map<String, Object>> disable2Fa(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        authService.disableTwoFactorForUser(email);
        return ResponseEntity.ok(Map.of("enabled", false));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("Refresh token request received");
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestHeader("Authorization") String authHeader) {
        log.info("Token validation request received");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(Map.of("valid", false, "message", "Invalid authorization header"));
        }

        String token = authHeader.substring(7);
        boolean isValid = authService.validateToken(token);

        Map<String, Object> response = new HashMap<>();
        response.put("valid", isValid);

        if (isValid) {
            String username = authService.extractUsername(token);
            response.put("username", username);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        log.info("Logout request received");
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
