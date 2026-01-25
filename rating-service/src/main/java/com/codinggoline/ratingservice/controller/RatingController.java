package com.codinggoline.ratingservice.controller;

import com.codinggoline.ratingservice.dto.RatingRequest;
import com.codinggoline.ratingservice.dto.RatingResponse;
import com.codinggoline.ratingservice.dto.UpdateRatingRequest;
import com.codinggoline.ratingservice.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ratings")
@RequiredArgsConstructor
@Slf4j
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<RatingResponse> createRating(@Valid @RequestBody RatingRequest request) {
        log.info("Received request to create rating");
        RatingResponse response = ratingService.createRating(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RatingResponse>> getUserRatings(@PathVariable String userId) {
        log.info("Received request to get ratings for user {}", userId);
        List<RatingResponse> responses = ratingService.getUserRatings(userId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/movie/{movieId}/average")
    public ResponseEntity<Map<String, Object>> getMovieAverageRating(@PathVariable String movieId) {
        log.info("Received request to get average rating for movie {}", movieId);
        Double avgRating = ratingService.getAverageRating(movieId);
        Integer ratingCount = ratingService.getRatingCount(movieId);

        Map<String, Object> response = new HashMap<>();
        response.put("movieId", movieId);
        response.put("averageRating", avgRating);
        response.put("ratingCount", ratingCount);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/user/{userId}/movie/{movieId}")
    public ResponseEntity<RatingResponse> updateRating(
            @PathVariable String userId,
            @PathVariable String movieId,
            @Valid @RequestBody UpdateRatingRequest request) {
        log.info("Received request to update rating for user {} and movie {} with payload: {}", userId, movieId, request);
        // Build a RatingRequest to reuse existing service overload
        RatingRequest fullRequest = RatingRequest.builder()
                .userId(userId)
                .movieId(movieId)
                .rating(request.getRating())
                .review(request.getReview())
                .build();
        RatingResponse response = ratingService.updateRating(userId, movieId, fullRequest);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/user/{userId}/movie/{movieId}")
    public ResponseEntity<Void> deleteRating(
            @PathVariable String userId,
            @PathVariable String movieId) {
        log.info("Received request to delete rating for user {} and movie {}", userId, movieId);
        ratingService.deleteRating(userId, movieId);
        return ResponseEntity.noContent().build();
    }
}
