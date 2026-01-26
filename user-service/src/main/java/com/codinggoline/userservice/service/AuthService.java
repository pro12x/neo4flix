package com.codinggoline.userservice.service;

import com.codinggoline.userservice.dto.*;
import com.codinggoline.userservice.entity.Role;
import com.codinggoline.userservice.entity.User;
import com.codinggoline.userservice.exception.BadRequestException;
import com.codinggoline.userservice.exception.UnauthorizedException;
import com.codinggoline.userservice.mapper.UserMapper;
import com.codinggoline.userservice.repository.UserRepository;
import com.codinggoline.userservice.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private static final String CLAIM_USER_ID = "userId";
    private static final String TOKEN_TYPE_BEARER = "Bearer";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UserMapper userMapper;
    private final TwoFactorService twoFactorService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());

        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("User with email " + request.getEmail() + " already exists");
        }

        if (userRepository.findByPseudo(request.getPseudo()).isPresent()) {
            throw new BadRequestException("User with pseudo " + request.getPseudo() + " already exists");
        }

        // Create new user
        User user = User.builder()
                .id(UUID.randomUUID().toString())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .pseudo(request.getPseudo())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .enable(true)
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);

        // Generate tokens
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put(CLAIM_USER_ID, savedUser.getId());
        extraClaims.put("role", savedUser.getRole().name());

        String accessToken = jwtTokenProvider.generateToken(savedUser.getEmail(), extraClaims);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        log.info("User registered successfully: {}", savedUser.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType(TOKEN_TYPE_BEARER)
                .expiresIn(jwtTokenProvider.getExpirationTime())
                .user(userMapper.toResponse(savedUser))
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("Authenticating user: {}", request.getEmail());

        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Load user
        User user = userRepository.findFirstByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        // Update last connection
        user.setLastConnection(LocalDateTime.now());
        userRepository.save(user);

        // Generate tokens
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put(CLAIM_USER_ID, user.getId());
        extraClaims.put("role", user.getRole().name());

        String accessToken = jwtTokenProvider.generateToken(user.getEmail(), extraClaims);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType(TOKEN_TYPE_BEARER)
                .expiresIn(jwtTokenProvider.getExpirationTime())
                .user(userMapper.toResponse(user))
                .build();
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        log.info("Refreshing token");

        String refreshToken = request.getRefreshToken();

        // Validate refresh token
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        // Extract username from refresh token
        String username = jwtTokenProvider.extractUsername(refreshToken);

        // Load user
        User user = userRepository.findFirstByEmail(username)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        // Generate new access token
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put(CLAIM_USER_ID, user.getId());
        extraClaims.put("role", user.getRole().name());

        String accessToken = jwtTokenProvider.generateToken(user.getEmail(), extraClaims);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType(TOKEN_TYPE_BEARER)
                .expiresIn(jwtTokenProvider.getExpirationTime())
                .user(userMapper.toResponse(user))
                .build();
    }

    @Transactional
    public Map<String, Object> loginWithPossible2Fa(LoginRequest request) {
        log.info("Authenticating user (2FA-aware): {}", request.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findFirstByEmail(request.getEmail()).orElseThrow(() -> new UnauthorizedException("User not found"));

        // Update last connection time
        user.setLastConnection(LocalDateTime.now());
        userRepository.save(user);

        if (user.isTwoFactorEnabled() && user.getTwoFactorSecret() != null) {
            // 2FA required — return a response indicating that client must provide code
            Map<String, Object> res = new HashMap<>();
            res.put("2fa_required", true);
            res.put("message", "Two-factor authentication required");
            res.put("email", user.getEmail());
            return res;
        }

        // No 2FA: generate tokens immediately
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put(CLAIM_USER_ID, user.getId());
        extraClaims.put("role", user.getRole().name());

        String accessToken = jwtTokenProvider.generateToken(user.getEmail(), extraClaims);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        Map<String, Object> res = new HashMap<>();
        res.put("2fa_required", false);
        res.put("accessToken", accessToken);
        res.put("refreshToken", refreshToken);
        res.put("tokenType", TOKEN_TYPE_BEARER);
        res.put("expiresIn", jwtTokenProvider.getExpirationTime());
        res.put("user", userMapper.toResponse(user));
        return res;
    }

    @Transactional
    public AuthResponse verify2Fa(Verify2FaRequest request) {
        String email = request.getEmail();
        int code = request.getCode();

        User user = userRepository.findFirstByEmail(email).orElseThrow(() -> new UnauthorizedException("User not found"));
        String secret = user.getTwoFactorSecret();

        log.info("Verifying 2FA - Email: {}, Code: {}, Secret length: {}", email, code, secret != null ? secret.length() : 0);

        if (secret == null) throw new UnauthorizedException("2FA not setup for user");

        boolean ok = twoFactorService.verifyCode(secret, code);
        if (!ok) throw new UnauthorizedException("Invalid 2FA code");

        // generate tokens
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put(CLAIM_USER_ID, user.getId());
        extraClaims.put("role", user.getRole().name());

        String accessToken = jwtTokenProvider.generateToken(email, extraClaims);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType(TOKEN_TYPE_BEARER)
                .expiresIn(jwtTokenProvider.getExpirationTime())
                .user(userMapper.toResponse(user))
                .build();
    }

    @Transactional
    public void saveTwoFactorSecret(String email, String secret) {
        User user = userRepository.findFirstByEmail(email).orElseThrow(() -> new UnauthorizedException("User not found"));
        user.setTwoFactorSecret(secret);
        userRepository.save(user);
    }

    @Transactional
    public void enableTwoFactorForUser(String email, int code) {
        User user = userRepository.findFirstByEmail(email).orElseThrow(() -> new UnauthorizedException("User not found"));
        String secret = user.getTwoFactorSecret();
        if (secret == null) throw new UnauthorizedException("2FA not setup");
        if (!twoFactorService.verifyCode(secret, code)) throw new UnauthorizedException("Invalid 2FA code");
        user.setTwoFactorEnabled(true);
        userRepository.save(user);
    }

    @Transactional
    public void disableTwoFactorForUser(String email) {
        User user = userRepository.findFirstByEmail(email).orElseThrow(() -> new UnauthorizedException("User not found"));
        user.setTwoFactorEnabled(false);
        user.setTwoFactorSecret(null);
        userRepository.save(user);
    }

    public boolean validateToken(String token) {
        return jwtTokenProvider.validateToken(token);
    }

    public String extractUsername(String token) {
        return jwtTokenProvider.extractUsername(token);
    }
}
