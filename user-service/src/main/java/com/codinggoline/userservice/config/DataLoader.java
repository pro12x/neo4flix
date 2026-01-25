package com.codinggoline.userservice.config;

import com.codinggoline.userservice.entity.Role;
import com.codinggoline.userservice.entity.User;
import com.codinggoline.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Check if admin user already exists using existsByEmail to avoid duplicate query exception
        try {
            if (userRepository.existsByEmail("admin@user.com")) {
                log.info("✓ Admin user already exists, skipping creation.");
                return;
            }
        } catch (Exception e) {
            // If existsByEmail fails (multiple users), log warning and skip creation
            log.warn("⚠️  Multiple users with email 'admin@user.com' found in database!");
            log.warn("⚠️  Please clean duplicates using: scripts/clean-duplicate-users.cypher");
            log.warn("⚠️  Skipping admin user creation to prevent more duplicates.");
            return;
        }

        log.info("Creating default admin user...");

        // Generate explicit UUID to prevent duplicates
        String adminId = "admin-" + UUID.randomUUID();

        User admin = User.builder()
                .id(adminId)  // Explicitly set ID
                .firstName("Admin")
                .lastName("USER")
                .pseudo("admin")
                .email("admin@user.com")
                .password(passwordEncoder.encode("Password123!"))
                .role(Role.ADMIN)
                .enable(true)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(admin);
        log.info("✅ Default admin user created successfully!");
        log.info("   ID: {}", adminId);
        log.info("   Email: admin@user.com");
        log.info("   Password: Password123!");
    }
}
