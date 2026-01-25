package com.codinggoline.ratingservice.repository;

import com.codinggoline.ratingservice.entity.UserNode;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RatingRepository extends Neo4jRepository<UserNode, String> {

    @Query("MATCH (u:Users {id: $userId})-[r:RATED]->(m:Movie {id: $movieId}) RETURN u, r, m")
    UserNode findUserRatingForMovie(String userId, String movieId);

    @Query("MATCH (u:Users {id: $userId})-[r:RATED]->(m:Movie) RETURN u, collect(r) as ratings, collect(m) as movies")
    UserNode findAllUserRatings(String userId);

    @Query("MATCH (u:Users)-[r:RATED]->(m:Movie {id: $movieId}) RETURN avg(r.rating)")
    Double getAverageRatingForMovie(String movieId);

    @Query("MATCH (u:Users)-[r:RATED]->(m:Movie {id: $movieId}) RETURN count(r)")
    Integer getRatingCountForMovie(String movieId);

    @Query(
            "MATCH (u:Users {id: $userId})-[r:RATED]->(m:Movie {id: $movieId}) " +
            "SET r.rating = $rating, r.updated_at = datetime() " +
            "FOREACH (_ IN CASE WHEN $review IS NULL THEN [] ELSE [1] END | SET r.review = $review) " +
            "FOREACH (_ IN CASE WHEN $review IS NULL THEN [1] ELSE [] END | REMOVE r.review) " +
            "RETURN u"
    )
    UserNode updateRating(String userId, String movieId, Double rating, String review);

    @Query("MATCH (u:Users {id: $userId})-[r:RATED]->(m:Movie {id: $movieId}) DELETE r")
    void deleteRating(String userId, String movieId);

    @Query(
            "MATCH (u:Users {id: $userId}) " +
            "MERGE (m:Movie {id: $movieId}) " +
            // MERGE without null properties
            "MERGE (u)-[r:RATED]->(m) " +
            "SET r.rating = $rating, r.created_at = coalesce(r.created_at, datetime()), r.updated_at = datetime() " +
            "FOREACH (_ IN CASE WHEN $review IS NULL THEN [] ELSE [1] END | SET r.review = $review) " +
            "FOREACH (_ IN CASE WHEN $review IS NULL THEN [1] ELSE [] END | REMOVE r.review) " +
            "RETURN u"
    )
    UserNode createRating(String userId, String movieId, Double rating, String review);
}
