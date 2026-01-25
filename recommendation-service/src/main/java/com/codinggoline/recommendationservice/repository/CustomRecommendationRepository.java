package com.codinggoline.recommendationservice.repository;

import java.util.List;
import java.util.Map;

public interface CustomRecommendationRepository {
    List<Map<String, Object>> findCollaborativeRecommendations(String userId, int limit);
    List<Map<String, Object>> findContentBasedRecommendations(String userId, int limit);
    List<Map<String, Object>> findTrendingMovies(String userId, int limit);
    List<Map<String, Object>> findGenreRecommendations(String userId, String genre, int limit);
    List<Map<String, Object>> findSimilarMovies(String movieId, int limit);
}
