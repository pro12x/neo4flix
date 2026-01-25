package com.codinggoline.movieservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovieSearchRequest {

    private String title;
    private String genre;
    private Double minRating;
    private Integer limit;
}
