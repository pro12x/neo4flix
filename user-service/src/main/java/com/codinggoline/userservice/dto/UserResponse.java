package com.codinggoline.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private String id;

    private String firstName;

    private String lastName;

    private String pseudo;

    private String email;

    private String password;

    private String role;

    private boolean enable;

    private LocalDateTime lastConnection;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}
