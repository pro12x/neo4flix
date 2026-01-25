package com.codinggoline.recommendationservice.dto;

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
public class MovieDto {
    private String id;
    private String title;
    private LocalDate releaseDate;
    private String plot;
    private String poster;
    private List<String> genres;
    private Double averageRating;
}
