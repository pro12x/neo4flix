package com.codinggoline.movieservice.repository;

import com.codinggoline.movieservice.entity.Movie;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends Neo4jRepository<Movie, String> {

    Optional<Movie> findByTitle(String title);

    List<Movie> findByTitleContainingIgnoreCase(String title);

    @Query("MATCH (m:Movie) WHERE any(genre IN m.genres WHERE genre = $genre) RETURN m")
    List<Movie> findByGenre(String genre);

    @Query("MATCH (m:Movie) WHERE m.release_date >= $startDate AND m.release_date <= $endDate RETURN m")
    List<Movie> findByReleaseDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("MATCH (m:Movie) WHERE m.average_rating >= $minRating RETURN m ORDER BY m.average_rating DESC")
    List<Movie> findTopRatedMovies(Double minRating);

    @Query("MATCH (m:Movie) RETURN m ORDER BY m.release_date DESC LIMIT $limit")
    List<Movie> findLatestMovies(int limit);

    @Query("MATCH (m:Movie) WHERE m.imdbId = $imdbId RETURN m")
    Movie findByImdbId(String imdbId);

    @Query("MATCH (m:Movie) " +
            "WHERE ($title IS NULL OR toLower(m.title) CONTAINS toLower($title)) " +
            "AND ($genre IS NULL OR any(g IN m.genres WHERE g = $genre)) " +
            "AND ($minRating IS NULL OR m.average_rating >= $minRating) " +
            "RETURN m " +
            "ORDER BY m.average_rating DESC, m.release_date DESC")
    List<Movie> search(String title, String genre, Double minRating);

    @Query("MATCH (m:Movie) " +
            "WHERE ($title IS NULL OR toLower(m.title) CONTAINS toLower($title)) " +
            "AND ($genre IS NULL OR any(g IN m.genres WHERE g = $genre)) " +
            "AND ($minRating IS NULL OR m.average_rating >= $minRating) " +
            "WITH m " +
            "ORDER BY " +
            "CASE WHEN $sort = 'date' THEN m.release_date END DESC, " +
            "CASE WHEN $sort = 'rating' THEN m.average_rating END DESC, " +
            "m.title ASC " +
            "SKIP $skip LIMIT $limit " +
            "RETURN m")
    List<Movie> searchPaged(String title, String genre, Double minRating, String sort, long skip, long limit);

    @Query("MATCH (m:Movie) " +
            "WHERE ($title IS NULL OR toLower(m.title) CONTAINS toLower($title)) " +
            "AND ($genre IS NULL OR any(g IN m.genres WHERE g = $genre)) " +
            "AND ($minRating IS NULL OR m.average_rating >= $minRating) " +
            "RETURN count(m)")
    long countSearch(String title, String genre, Double minRating);

    @Query("MATCH (m:Movie), (current:Movie {id: $movieId}) " +
            "WHERE m.id <> $movieId " +
            "AND ANY(genre IN m.genres WHERE genre IN current.genres) " +
            "RETURN m " +
            "ORDER BY m.average_rating DESC, m.release_date DESC " +
            "LIMIT $limit")
    List<Movie> findSimilarMovies(String movieId, int limit);
}
