package com.codinggoline.ratingservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Node("Movie")
public class MovieNode {

    @Id
    private String id;

    private String title;

    public MovieNode(String id) {
        this.id = id;
    }
}
