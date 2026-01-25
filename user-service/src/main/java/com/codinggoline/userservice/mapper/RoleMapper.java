package com.codinggoline.userservice.mapper;

import com.codinggoline.userservice.entity.Role;
import org.springframework.stereotype.Component;

@Component
public class RoleMapper {

    public String toString(Role role) {
        return role.name();
    }

    public Role fromString(String roleStr) {
        return roleStr != null ? Role.valueOf(roleStr) : Role.USER;
    }

}
