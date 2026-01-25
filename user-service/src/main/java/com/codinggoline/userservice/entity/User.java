package com.codinggoline.userservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Property;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Node("Users")
public class User {

    @Id
    private String id;

    @Property("first_name")
    private String firstName;

    @Property("last_name")
    private String lastName;

    @Property("pseudo")
    private String pseudo;

    private String email;

    private String password;

    private Role role;

    @Builder.Default
    private boolean enable = true;

    @Property("last_connection")
    private LocalDateTime lastConnection;

    @Property("created_at")
    private LocalDateTime createdAt;

}
