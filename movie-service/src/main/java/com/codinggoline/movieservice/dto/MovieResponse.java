package com.codinggoline.movieservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieResponse {

    private String id;
    private String title;
    private LocalDate releaseDate;
    private String plot;
    private String poster;
    private String imdbId;
    private String trailerUrl;
    private List<String> genres;
    private Double averageRating;
    private Integer ratingCount;
}
