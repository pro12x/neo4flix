package com.codinggoline.movieservice.controller;

import com.codinggoline.movieservice.dto.MovieRequest;
import com.codinggoline.movieservice.dto.MovieResponse;
import com.codinggoline.movieservice.dto.PagedResponse;
import com.codinggoline.movieservice.service.MovieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/movies")
@RequiredArgsConstructor
@Slf4j
public class MovieController {

    private final MovieService movieService;

    @PostMapping
    public ResponseEntity<MovieResponse> createMovie(@Valid @RequestBody MovieRequest request) {
        log.info("Received request to create movie");
        MovieResponse response = movieService.createMovie(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovieResponse> getMovieById(@PathVariable String id) {
        log.info("Received request to get movie with id: {}", id);
        MovieResponse response = movieService.getMovieById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<MovieResponse>> getAllMovies() {
        log.info("Received request to get all movies");
        List<MovieResponse> responses = movieService.getAllMovies();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/search")
    public ResponseEntity<List<MovieResponse>> searchMovies(@RequestParam String title) {
        log.info("Received request to search movies by title: {}", title);
        List<MovieResponse> responses = movieService.searchMoviesByTitle(title);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<MovieResponse>> getMoviesByGenre(@PathVariable String genre) {
        log.info("Received request to get movies by genre: {}", genre);
        List<MovieResponse> responses = movieService.getMoviesByGenre(genre);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/latest")
    public ResponseEntity<List<MovieResponse>> getLatestMovies(@RequestParam(defaultValue = "10") int limit) {
        log.info("Received request to get latest movies");
        List<MovieResponse> responses = movieService.getLatestMovies(limit);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<MovieResponse>> getTopRatedMovies(@RequestParam(defaultValue = "4.0") Double minRating) {
        log.info("Received request to get top rated movies");
        List<MovieResponse> responses = movieService.getTopRatedMovies(minRating);
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MovieResponse> updateMovie(
            @PathVariable String id,
            @Valid @RequestBody MovieRequest request) {
        log.info("Received request to update movie with id: {}", id);
        MovieResponse response = movieService.updateMovie(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable String id) {
        log.info("Received request to delete movie with id: {}", id);
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search-advanced")
    public ResponseEntity<List<MovieResponse>> searchMoviesAdvanced(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Integer limit
    ) {
        log.info("Received request to search movies (advanced)");
        List<MovieResponse> responses = movieService.searchMovies(title, genre, minRating, limit);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/search-paged")
    public ResponseEntity<PagedResponse<MovieResponse>> searchMoviesPaged(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) Double minRating,
            @RequestParam(defaultValue = "rating") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        log.info("Received request to search movies (paged)");
        return ResponseEntity.ok(movieService.searchMoviesPaged(title, genre, minRating, sort, page, size));
    }

    @GetMapping("/{id}/similar")
    public ResponseEntity<List<MovieResponse>> getSimilarMovies(
            @PathVariable String id,
            @RequestParam(defaultValue = "6") int limit) {
        log.info("Received request to get similar movies for movie id: {}, limit: {}", id, limit);
        List<MovieResponse> responses = movieService.getSimilarMovies(id, limit);
        return ResponseEntity.ok(responses);
    }
}
