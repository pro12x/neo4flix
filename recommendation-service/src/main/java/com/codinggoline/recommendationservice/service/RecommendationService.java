package com.codinggoline.recommendationservice.service;

import com.codinggoline.recommendationservice.dto.MovieDto;
import com.codinggoline.recommendationservice.dto.MovieRecommendation;
import com.codinggoline.recommendationservice.repository.CustomRecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationService {

    private final CustomRecommendationRepository recommendationRepository;

    public List<MovieRecommendation> getPersonalizedRecommendations(String userId, int limit) {
        log.info("Generating personalized recommendations for user: {}", userId);

        List<MovieRecommendation> recommendations = new ArrayList<>();

        // Get collaborative filtering recommendations (40% of results)
        List<Map<String, Object>> collaborative = recommendationRepository
                .findCollaborativeRecommendations(userId, (int)(limit * 0.4));
        recommendations.addAll(mapToRecommendations(collaborative));

        // Get content-based recommendations (40% of results)
        List<Map<String, Object>> contentBased = recommendationRepository
                .findContentBasedRecommendations(userId, (int)(limit * 0.4));
        recommendations.addAll(mapToRecommendations(contentBased));

        // Get trending movies (20% of results)
        List<Map<String, Object>> trending = recommendationRepository
                .findTrendingMovies(userId, (int)(limit * 0.2));
        recommendations.addAll(mapToRecommendations(trending));

        // Remove duplicates and limit results
        return recommendations.stream()
                .distinct()
                .limit(limit)
                .collect(Collectors.toList());
    }

    public List<MovieRecommendation> getCollaborativeRecommendations(String userId, int limit) {
        log.info("Generating collaborative filtering recommendations for user: {}", userId);
        List<Map<String, Object>> results = recommendationRepository
                .findCollaborativeRecommendations(userId, limit);
        return mapToRecommendations(results);
    }

    public List<MovieRecommendation> getContentBasedRecommendations(String userId, int limit) {
        log.info("Generating content-based recommendations for user: {}", userId);
        List<Map<String, Object>> results = recommendationRepository
                .findContentBasedRecommendations(userId, limit);
        return mapToRecommendations(results);
    }

    public List<MovieRecommendation> getTrendingRecommendations(String userId, int limit) {
        log.info("Generating trending movie recommendations for user: {}", userId);
        List<Map<String, Object>> results = recommendationRepository
                .findTrendingMovies(userId, limit);
        return mapToRecommendations(results);
    }

    public List<MovieRecommendation> getGenreRecommendations(String userId, String genre, int limit) {
        log.info("Generating genre-based recommendations for user: {} and genre: {}", userId, genre);
        List<Map<String, Object>> results = recommendationRepository
                .findGenreRecommendations(userId, genre, limit);
        return mapToRecommendations(results);
    }

    public List<MovieRecommendation> getSimilarMovies(String movieId, int limit) {
        log.info("Finding similar movies to movie: {}", movieId);
        List<Map<String, Object>> results = recommendationRepository
                .findSimilarMovies(movieId, limit);
        return mapToRecommendations(results);
    }

    private List<MovieRecommendation> mapToRecommendations(List<Map<String, Object>> results) {
        return results.stream()
                .map(this::mapToRecommendation)
                .collect(Collectors.toList());
    }

    @SuppressWarnings("unchecked")
    private MovieRecommendation mapToRecommendation(Map<String, Object> result) {
        MovieDto movie = MovieDto.builder()
                .id((String) result.get("id"))
                .title((String) result.get("title"))
                .releaseDate(parseReleaseDate(result.get("releaseDate")))
                .plot((String) result.get("plot"))
                .poster((String) result.get("poster"))
                .genres((List<String>) result.get("genres"))
                .averageRating(result.get("averageRating") != null ?
                        ((Number) result.get("averageRating")).doubleValue() : 0.0)
                .build();

        return MovieRecommendation.builder()
                .movie(movie)
                .score(result.get("score") != null ?
                        ((Number) result.get("score")).doubleValue() : 0.0)
                .reason((String) result.get("reason"))
                .build();
    }

    private LocalDate parseReleaseDate(Object releaseDateObj) {
        if (releaseDateObj == null) {
            return null;
        }
        try {
            if (releaseDateObj instanceof LocalDate) {
                return (LocalDate) releaseDateObj;
            }
            String dateStr = releaseDateObj.toString();
            if (dateStr.isEmpty()) {
                return null;
            }
            return LocalDate.parse(dateStr);
        } catch (Exception e) {
            log.warn("Failed to parse release date: {}", releaseDateObj, e);
            return null;
        }
    }
}
