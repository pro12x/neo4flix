package com.codinggoline.movieservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class MovieRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Release date is required")
    private LocalDate releaseDate;

    private String plot;

    private String poster;

    private String imdbId;

    private String trailerUrl;

    private List<String> genres;
}
