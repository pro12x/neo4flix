package com.codinggoline.recommendationservice.repository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.neo4j.driver.Driver;
import org.neo4j.driver.Record;
import org.neo4j.driver.Session;
import org.neo4j.driver.Result;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
@Slf4j
public class CustomRecommendationRepositoryImpl implements CustomRecommendationRepository {

    private final Driver driver;

    @Override
    public List<Map<String, Object>> findCollaborativeRecommendations(String userId, int limit) {
        String cypher = """
            MATCH (u:Users {id: $userId})-[r:RATED]->(m:Movie)
            WITH u, avg(r.rating) as userAvg
            MATCH (u)-[r1:RATED]->(m1:Movie)<-[r2:RATED]-(other:Users)
            WHERE r1.rating > userAvg AND r2.rating > userAvg
            WITH u, other, count(DISTINCT m1) as commonMovies
            ORDER BY commonMovies DESC LIMIT 10
            MATCH (other)-[r3:RATED]->(rec:Movie)
            WHERE NOT (u)-[:RATED]->(rec) AND r3.rating >= 4.0
            WITH rec, count(*) as matchScore
            RETURN rec.id as id, rec.title as title, rec.release_date as releaseDate,
                   rec.plot as plot, rec.poster as poster, rec.genres as genres,
                   rec.average_rating as averageRating, matchScore as score,
                   'Users with similar taste liked this' as reason
            ORDER BY score DESC, averageRating DESC
            LIMIT $limit
            """;
        return executeQuery(cypher, Map.of("userId", userId, "limit", limit));
    }

    @Override
    public List<Map<String, Object>> findContentBasedRecommendations(String userId, int limit) {
        String cypher = """
            MATCH (u:Users {id: $userId})-[r:RATED]->(m:Movie)
            WHERE r.rating >= 4.0
            UNWIND m.genres as genre
            WITH u, collect(DISTINCT genre) as likedGenres
            UNWIND likedGenres as genre
            MATCH (rec:Movie)
            WHERE NOT (u)-[:RATED]->(rec)
            AND genre IN rec.genres
            WITH rec, count(DISTINCT genre) as genreMatches
            RETURN rec.id as id, rec.title as title, rec.release_date as releaseDate,
                   rec.plot as plot, rec.poster as poster, rec.genres as genres,
                   rec.average_rating as averageRating, genreMatches as score,
                   'Based on genres you enjoy' as reason
            ORDER BY score DESC, COALESCE(rec.average_rating, 0) DESC
            LIMIT $limit
            """;
        return executeQuery(cypher, Map.of("userId", userId, "limit", limit));
    }

    @Override
    public List<Map<String, Object>> findTrendingMovies(String userId, int limit) {
        String cypher = """
            MATCH (m:Movie)
            WHERE NOT EXISTS { MATCH (:Users {id: $userId})-[:RATED]->(m) }
            RETURN m.id as id, m.title as title, m.release_date as releaseDate,
                   m.plot as plot, m.poster as poster, m.genres as genres,
                   m.average_rating as averageRating, COALESCE(m.rating_count, 0) as score,
                   'Trending now' as reason
            ORDER BY COALESCE(m.average_rating, 0) DESC, COALESCE(m.rating_count, 0) DESC
            LIMIT $limit
            """;
        return executeQuery(cypher, Map.of("userId", userId, "limit", limit));
    }

    @Override
    public List<Map<String, Object>> findGenreRecommendations(String userId, String genre, int limit) {
        String cypher = """
            MATCH (m:Movie)
            WHERE $genre IN m.genres
            AND NOT EXISTS { MATCH (:Users {id: $userId})-[:RATED]->(m) }
            RETURN m.id as id, m.title as title, m.release_date as releaseDate,
                   m.plot as plot, m.poster as poster, m.genres as genres,
                   m.average_rating as averageRating, COALESCE(m.rating_count, 0) as score,
                   'Top ' + $genre + ' movies' as reason
            ORDER BY COALESCE(m.average_rating, 0) DESC, COALESCE(m.rating_count, 0) DESC
            LIMIT $limit
            """;
        return executeQuery(cypher, Map.of("userId", userId, "genre", genre, "limit", limit));
    }

    @Override
    public List<Map<String, Object>> findSimilarMovies(String movieId, int limit) {
        String cypher = """
            MATCH (m:Movie {id: $movieId})
            UNWIND m.genres as genre
            MATCH (rec:Movie)
            WHERE rec.id <> $movieId
            AND genre IN rec.genres
            WITH rec, count(DISTINCT genre) as genreMatches
            RETURN rec.id as id, rec.title as title, rec.release_date as releaseDate,
                   rec.plot as plot, rec.poster as poster, rec.genres as genres,
                   rec.average_rating as averageRating, genreMatches as score,
                   'Similar to movies you watched' as reason
            ORDER BY score DESC, COALESCE(rec.average_rating, 0) DESC
            LIMIT $limit
            """;
        return executeQuery(cypher, Map.of("movieId", movieId, "limit", limit));
    }

    private List<Map<String, Object>> executeQuery(String cypher, Map<String, Object> params) {
        List<Map<String, Object>> results = new ArrayList<>();
        try (Session session = driver.session()) {
            Result result = session.run(cypher, params);
            while (result.hasNext()) {
                Record record = result.next();
                Map<String, Object> row = new HashMap<>();
                record.keys().forEach(key -> {
                    Object value = record.get(key).asObject();
                    row.put(key, value);
                });
                results.add(row);
            }
        } catch (Exception e) {
            log.error("Error executing Cypher query: {}", e.getMessage(), e);
        }
        return results;
    }
}
