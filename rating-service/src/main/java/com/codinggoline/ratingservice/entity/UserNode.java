package com.codinggoline.ratingservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Node("Users")
public class UserNode {

    @Id
    private String id;

    private String email;

    @Relationship(type = "RATED")
    private List<Rating> ratings;

    public UserNode(String id, String email) {
        this.id = id;
        this.email = email;
        this.ratings = new ArrayList<>();
    }
}
