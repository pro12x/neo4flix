package com.codinggoline.movieservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Property;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Node("Movie")
public class Movie {

    @Id
    private String id;

    private String title;

    @Property("release_date")
    private LocalDate releaseDate;

    private String plot;

    private String poster;

    private String imdbId;

    @Property("trailer_url")
    private String trailerUrl;

    private List<String> genres;

    @Property("average_rating")
    private Double averageRating;

    @Property("rating_count")
    private Integer ratingCount;

    @Relationship(type = "IN_GENRE")
    private List<Genre> genreList;

    public Movie(String id, String title) {
        this.id = id;
        this.title = title;
        this.genres = new ArrayList<>();
        this.averageRating = 0.0;
        this.ratingCount = 0;
    }
}
