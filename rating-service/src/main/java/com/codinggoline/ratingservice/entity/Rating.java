package com.codinggoline.ratingservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.*;

import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@RelationshipProperties
public class Rating {

    @Id
    @GeneratedValue
    private Long id;

    private Double rating;

    private String review;

    @Property("created_at")
    private OffsetDateTime createdAt;

    @Property("updated_at")
    private OffsetDateTime updatedAt;

    @TargetNode
    private MovieNode movie;

    public Rating(Double rating, String review, MovieNode movie) {
        this.rating = rating;
        this.review = review;
        this.movie = movie;
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
    }
}
