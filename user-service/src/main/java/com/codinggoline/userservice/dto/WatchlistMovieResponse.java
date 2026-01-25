package com.codinggoline.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WatchlistMovieResponse {

    private String movieId;
    private String title;
    private List<String> genres;
    private String poster;
    private Double averageRating;
    private LocalDateTime addedAt;
}
