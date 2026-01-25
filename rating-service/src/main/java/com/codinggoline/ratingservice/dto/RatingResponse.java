package com.codinggoline.ratingservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingResponse {

    private Long id;
    private String userId;
    private String movieId;
    private String movieTitle;
    private Double rating;
    private String review;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
