package com.codinggoline.recommendationservice.controller;

import com.codinggoline.recommendationservice.dto.MovieRecommendation;
import com.codinggoline.recommendationservice.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recommendations")
@RequiredArgsConstructor
@Slf4j
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MovieRecommendation>> getPersonalizedRecommendations(
            @PathVariable String userId,
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Received request for personalized recommendations for user: {}", userId);
        List<MovieRecommendation> recommendations = recommendationService
                .getPersonalizedRecommendations(userId, limit);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/user/{userId}/collaborative")
    public ResponseEntity<List<MovieRecommendation>> getCollaborativeRecommendations(
            @PathVariable String userId,
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Received request for collaborative recommendations for user: {}", userId);
        List<MovieRecommendation> recommendations = recommendationService
                .getCollaborativeRecommendations(userId, limit);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/user/{userId}/content-based")
    public ResponseEntity<List<MovieRecommendation>> getContentBasedRecommendations(
            @PathVariable String userId,
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Received request for content-based recommendations for user: {}", userId);
        List<MovieRecommendation> recommendations = recommendationService
                .getContentBasedRecommendations(userId, limit);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/user/{userId}/trending")
    public ResponseEntity<List<MovieRecommendation>> getTrendingRecommendations(
            @PathVariable String userId,
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Received request for trending recommendations for user: {}", userId);
        List<MovieRecommendation> recommendations = recommendationService
                .getTrendingRecommendations(userId, limit);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/user/{userId}/genre/{genre}")
    public ResponseEntity<List<MovieRecommendation>> getGenreRecommendations(
            @PathVariable String userId,
            @PathVariable String genre,
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Received request for genre recommendations for user: {} and genre: {}", userId, genre);
        List<MovieRecommendation> recommendations = recommendationService
                .getGenreRecommendations(userId, genre, limit);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/movie/{movieId}/similar")
    public ResponseEntity<List<MovieRecommendation>> getSimilarMovies(
            @PathVariable String movieId,
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Received request for similar movies to movie: {}", movieId);
        List<MovieRecommendation> recommendations = recommendationService
                .getSimilarMovies(movieId, limit);
        return ResponseEntity.ok(recommendations);
    }
}
