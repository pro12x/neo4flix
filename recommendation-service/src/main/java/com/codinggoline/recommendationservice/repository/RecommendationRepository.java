package com.codinggoline.recommendationservice.repository;

import com.codinggoline.recommendationservice.entity.Movie;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecommendationRepository extends Neo4jRepository<Movie, String> {
    // Les requêtes personnalisées sont dans CustomRecommendationRepository
}
