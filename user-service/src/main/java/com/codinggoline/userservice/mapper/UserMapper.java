package com.codinggoline.userservice.mapper;

import com.codinggoline.userservice.dto.UserRequest;
import com.codinggoline.userservice.dto.UserResponse;
import com.codinggoline.userservice.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMapper {

    private final RoleMapper roleMapper;

    public User requestToEntity(UserRequest request) {
        return User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .pseudo(request.getPseudo())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(roleMapper.fromString(request.getRole()))
                .build();
    }

    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .pseudo(user.getPseudo())
                .email(user.getEmail())
                .role(roleMapper.toString(user.getRole()))
                .createdAt(user.getCreatedAt())
                .twoFactorEnabled(user.isTwoFactorEnabled())
                .build();
    }
}
