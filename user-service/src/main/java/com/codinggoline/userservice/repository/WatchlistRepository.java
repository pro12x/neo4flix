package com.codinggoline.userservice.repository;

import com.codinggoline.userservice.dto.WatchlistMovieResponse;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WatchlistRepository extends Neo4jRepository<com.codinggoline.userservice.entity.User, String> {

    @Query("MATCH (u:Users {id: $userId}), (m:Movie {id: $movieId}) " +
            "MERGE (u)-[w:WATCHLIST]->(m) " +
            "ON CREATE SET w.addedAt = $addedAt " +
            "ON MATCH SET w.addedAt = coalesce(w.addedAt, $addedAt)")
    void addToWatchlist(@Param("userId") String userId,
                        @Param("movieId") String movieId,
                        @Param("addedAt") LocalDateTime addedAt);

    @Query("MATCH (u:Users {id: $userId})-[w:WATCHLIST]->(m:Movie {id: $movieId}) DELETE w")
    void removeFromWatchlist(@Param("userId") String userId, @Param("movieId") String movieId);

    @Query("MATCH (u:Users {id: $userId})-[w:WATCHLIST]->(m:Movie) " +
            "RETURN m.id as movieId, m.title as title, m.genres as genres, m.poster as poster, m.average_rating as averageRating, w.addedAt as addedAt " +
            "ORDER BY w.addedAt DESC")
    List<WatchlistMovieResponse> getWatchlist(@Param("userId") String userId);

    @Query("MATCH (u:Users {id: $userId})-[w:WATCHLIST]->(m:Movie {id: $movieId}) RETURN count(w) > 0")
    boolean existsInWatchlist(@Param("userId") String userId, @Param("movieId") String movieId);
}
