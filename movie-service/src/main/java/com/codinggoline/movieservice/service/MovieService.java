package com.codinggoline.movieservice.service;

import com.codinggoline.movieservice.dto.MovieRequest;
import com.codinggoline.movieservice.dto.MovieResponse;
import com.codinggoline.movieservice.dto.PagedResponse;
import com.codinggoline.movieservice.entity.Movie;
import com.codinggoline.movieservice.exception.NotFoundException;
import com.codinggoline.movieservice.mapper.MovieMapper;
import com.codinggoline.movieservice.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MovieService {

    private static final String MOVIE_NOT_FOUND_CODE = "MOVIE_NOT_FOUND";
    private static final String MOVIE_NOT_FOUND_PREFIX = "Movie not found with id: ";

    private final MovieRepository movieRepository;
    private final MovieMapper movieMapper;

    @Transactional
    public MovieResponse createMovie(MovieRequest request) {
        log.info("Creating new movie with title: {}", request.getTitle());

        Movie movie = movieMapper.toEntity(request);
        movie.setId(UUID.randomUUID().toString());

        Movie savedMovie = movieRepository.save(movie);
        log.info("Movie created successfully with id: {}", savedMovie.getId());

        return movieMapper.toResponse(savedMovie);
    }

    @Transactional(readOnly = true)
    public MovieResponse getMovieById(String id) {
        log.info("Fetching movie with id: {}", id);
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(MOVIE_NOT_FOUND_CODE, MOVIE_NOT_FOUND_PREFIX + id));
        return movieMapper.toResponse(movie);
    }

    @Transactional(readOnly = true)
    public List<MovieResponse> getAllMovies() {
        log.info("Fetching all movies");
        return movieRepository.findAll().stream()
                .map(movieMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MovieResponse> searchMoviesByTitle(String title) {
        log.info("Searching movies by title: {}", title);
        return movieRepository.findByTitleContainingIgnoreCase(title).stream()
                .map(movieMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MovieResponse> getMoviesByGenre(String genre) {
        log.info("Fetching movies by genre: {}", genre);
        return movieRepository.findByGenre(genre).stream()
                .map(movieMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MovieResponse> getLatestMovies(int limit) {
        log.info("Fetching latest {} movies", limit);
        return movieRepository.findLatestMovies(limit).stream()
                .map(movieMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MovieResponse> getTopRatedMovies(Double minRating) {
        log.info("Fetching top rated movies with minimum rating: {}", minRating);
        return movieRepository.findTopRatedMovies(minRating).stream()
                .map(movieMapper::toResponse)
                .toList();
    }

    @Transactional
    public MovieResponse updateMovie(String id, MovieRequest request) {
        log.info("Updating movie with id: {}", id);

        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(MOVIE_NOT_FOUND_CODE, MOVIE_NOT_FOUND_PREFIX + id));

        movie.setTitle(request.getTitle());
        movie.setReleaseDate(request.getReleaseDate());
        movie.setPlot(request.getPlot());
        movie.setPoster(request.getPoster());
        movie.setImdbId(request.getImdbId());
        movie.setGenres(request.getGenres());

        Movie updatedMovie = movieRepository.save(movie);
        log.info("Movie updated successfully with id: {}", updatedMovie.getId());

        return movieMapper.toResponse(updatedMovie);
    }

    @Transactional
    public void deleteMovie(String id) {
        log.info("Deleting movie with id: {}", id);
        if (!movieRepository.existsById(id)) {
            throw new NotFoundException(MOVIE_NOT_FOUND_CODE, MOVIE_NOT_FOUND_PREFIX + id);
        }
        movieRepository.deleteById(id);
        log.info("Movie deleted successfully with id: {}", id);
    }

    @Transactional
    public void updateMovieRating(String movieId, Double newAverageRating, Integer newRatingCount) {
        log.info("Updating rating for movie id: {}", movieId);
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new NotFoundException(MOVIE_NOT_FOUND_CODE, MOVIE_NOT_FOUND_PREFIX + movieId));

        movie.setAverageRating(newAverageRating);
        movie.setRatingCount(newRatingCount);
        movieRepository.save(movie);
    }

    @Transactional(readOnly = true)
    public List<MovieResponse> searchMovies(String title, String genre, Double minRating, Integer limit) {
        log.info("Search movies: title={}, genre={}, minRating={}, limit={}", title, genre, minRating, limit);

        String safeTitle = (title == null || title.isBlank()) ? null : title.trim();
        String safeGenre = (genre == null || genre.isBlank()) ? null : genre.trim();

        List<Movie> results = movieRepository.search(safeTitle, safeGenre, minRating);

        // Apply optional limit (defensive)
        if (limit != null && limit > 0 && results.size() > limit) {
            results = results.subList(0, limit);
        }

        return results.stream()
                .map(movieMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PagedResponse<MovieResponse> searchMoviesPaged(String title, String genre, Double minRating, String sort, int page, int size) {
        String safeTitle = (title == null || title.isBlank()) ? null : title.trim();
        String safeGenre = (genre == null || genre.isBlank()) ? null : genre.trim();
        String safeSort = (sort == null || sort.isBlank()) ? "rating" : sort.trim().toLowerCase();

        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 100);

        long skip = (long) safePage * safeSize;

        long total = movieRepository.countSearch(safeTitle, safeGenre, minRating);
        List<Movie> results = movieRepository.searchPaged(safeTitle, safeGenre, minRating, safeSort, skip, safeSize);

        return PagedResponse.<MovieResponse>builder()
                .items(results.stream().map(movieMapper::toResponse).toList())
                .total(total)
                .page(safePage)
                .size(safeSize)
                .build();
    }

    @Transactional(readOnly = true)
    public List<MovieResponse> getSimilarMovies(String movieId, int limit) {
        log.info("Fetching similar movies for movie id: {}, limit: {}", movieId, limit);

        // Find movies with similar genres, excluding the current movie
        List<Movie> similarMovies = movieRepository.findSimilarMovies(movieId, limit);

        return similarMovies.stream()
                .map(movieMapper::toResponse)
                .toList();
    }
}
