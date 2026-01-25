package com.codinggoline.movieservice.config;

import com.codinggoline.movieservice.entity.Movie;
import com.codinggoline.movieservice.repository.MovieRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class MovieDataLoader implements CommandLineRunner {

    private final MovieRepository movieRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // TMDB API - Clé gratuite (vous pouvez la remplacer par la vôtre sur https://www.themoviedb.org/settings/api)
    private static final String TMDB_API_KEY = "8265bd1679663a7ea12ac168da84d2e8";
    private static final String TMDB_BASE_URL = "https://api.themoviedb.org/3";
    private static final String TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

    @Override
    public void run(String... args) throws Exception {
        long existingMovies = movieRepository.count();

        if (existingMovies > 0) {
            log.info("Database already contains {} movies. Skipping data loading.", existingMovies);
            return;
        }

        log.info("🎬 Starting to load movies from TMDB API...");
        log.info("🎯 This will load a large collection of diverse movies...");

        try {
            int totalMoviesLoaded = 0;

            // 1. Charger les films populaires (10 pages = ~200 films)
            log.info("📺 Loading POPULAR movies...");
            for (int page = 1; page <= 10; page++) {
                List<Movie> movies = fetchPopularMovies(page);
                if (!movies.isEmpty()) {
                    movieRepository.saveAll(movies);
                    totalMoviesLoaded += movies.size();
                    log.info("✅ Popular - Page {}/10 - {} movies ({} with trailers)",
                            page, movies.size(), movies.stream().filter(m -> m.getTrailerUrl() != null).count());
                }
                Thread.sleep(500); // Augmenté pour les appels trailer
            }

            // 2. Charger les films les mieux notés (10 pages = ~200 films)
            log.info("⭐ Loading TOP-RATED movies...");
            for (int page = 1; page <= 10; page++) {
                List<Movie> movies = fetchTopRatedMovies(page);
                if (!movies.isEmpty()) {
                    movieRepository.saveAll(movies);
                    totalMoviesLoaded += movies.size();
                    log.info("✅ Top-Rated - Page {}/10 - {} movies ({} with trailers)",
                            page, movies.size(), movies.stream().filter(m -> m.getTrailerUrl() != null).count());
                }
                Thread.sleep(500);
            }

            // 3. Charger les films actuellement au cinéma (5 pages = ~100 films)
            log.info("🎥 Loading NOW PLAYING movies...");
            for (int page = 1; page <= 5; page++) {
                List<Movie> movies = fetchNowPlayingMovies(page);
                if (!movies.isEmpty()) {
                    movieRepository.saveAll(movies);
                    totalMoviesLoaded += movies.size();
                    log.info("✅ Now Playing - Page {}/5 - {} movies ({} with trailers)",
                            page, movies.size(), movies.stream().filter(m -> m.getTrailerUrl() != null).count());
                }
                Thread.sleep(500);
            }

            // 4. Charger les films à venir (5 pages = ~100 films)
            log.info("🔜 Loading UPCOMING movies...");
            for (int page = 1; page <= 5; page++) {
                List<Movie> movies = fetchUpcomingMovies(page);
                if (!movies.isEmpty()) {
                    movieRepository.saveAll(movies);
                    totalMoviesLoaded += movies.size();
                    log.info("✅ Upcoming - Page {}/5 - {} movies ({} with trailers)",
                            page, movies.size(), movies.stream().filter(m -> m.getTrailerUrl() != null).count());
                }
                Thread.sleep(500);
            }

            // 5. Charger des films par genres spécifiques
            log.info("🎭 Loading movies by GENRES...");
            int[] genreIds = {28, 35, 18, 878, 27, 10749}; // Action, Comedy, Drama, Sci-Fi, Horror, Romance
            String[] genreNames = {"Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Romance"};

            for (int i = 0; i < genreIds.length; i++) {
                log.info("🎬 Loading {} movies...", genreNames[i]);
                for (int page = 1; page <= 3; page++) {
                    List<Movie> movies = fetchMoviesByGenre(genreIds[i], page);
                    if (!movies.isEmpty()) {
                        movieRepository.saveAll(movies);
                        totalMoviesLoaded += movies.size();
                        log.info("✅ {} - Page {}/3 - {} movies", genreNames[i], page, movies.size());
                    }
                    Thread.sleep(250);
                }
            }

            log.info("🎉 Successfully loaded {} movies from TMDB!", totalMoviesLoaded);
            log.info("📊 Database now contains movies from multiple categories:");
            log.info("   - Popular movies");
            log.info("   - Top-rated classics");
            log.info("   - Currently in theaters");
            log.info("   - Upcoming releases");
            log.info("   - Genre-specific collections");

        } catch (Exception e) {
            log.error("❌ Error loading movies from TMDB: {}", e.getMessage());
            log.info("💡 The application will continue without pre-loaded movies.");
        }
    }

    private List<Movie> fetchPopularMovies(int page) {
        return fetchMoviesFromEndpoint("popular", page);
    }

    private List<Movie> fetchTopRatedMovies(int page) {
        return fetchMoviesFromEndpoint("top_rated", page);
    }

    private List<Movie> fetchNowPlayingMovies(int page) {
        return fetchMoviesFromEndpoint("now_playing", page);
    }

    private List<Movie> fetchUpcomingMovies(int page) {
        return fetchMoviesFromEndpoint("upcoming", page);
    }

    private List<Movie> fetchMoviesByGenre(int genreId, int page) {
        List<Movie> movies = new ArrayList<>();

        try {
            String url = String.format("%s/discover/movie?api_key=%s&language=en-US&page=%d&with_genres=%d&sort_by=popularity.desc",
                    TMDB_BASE_URL, TMDB_API_KEY, page, genreId);

            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode results = root.get("results");

            if (results != null && results.isArray()) {
                for (JsonNode movieNode : results) {
                    try {
                        Movie movie = convertToMovie(movieNode);
                        if (movie != null && !movieExists(movie.getTitle())) {
                            movies.add(movie);
                        }
                    } catch (Exception e) {
                        log.warn("Failed to convert movie: {}", e.getMessage());
                    }
                }
            }

        } catch (Exception e) {
            log.error("Failed to fetch movies by genre {} from page {}: {}", genreId, page, e.getMessage());
        }

        return movies;
    }

    private List<Movie> fetchMoviesFromEndpoint(String endpoint, int page) {
        List<Movie> movies = new ArrayList<>();

        try {
            String url = String.format("%s/movie/%s?api_key=%s&language=en-US&page=%d",
                    TMDB_BASE_URL, endpoint, TMDB_API_KEY, page);

            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode results = root.get("results");

            if (results != null && results.isArray()) {
                for (JsonNode movieNode : results) {
                    try {
                        Movie movie = convertToMovie(movieNode);
                        if (movie != null && !movieExists(movie.getTitle())) {
                            movies.add(movie);
                        }
                    } catch (Exception e) {
                        log.warn("Failed to convert movie: {}", e.getMessage());
                    }
                }
            }

        } catch (Exception e) {
            log.error("Failed to fetch {} movies from page {}: {}", endpoint, page, e.getMessage());
        }

        return movies;
    }

    private boolean movieExists(String title) {
        // Simple check to avoid loading duplicate movies
        return movieRepository.findByTitle(title).isPresent();
    }

    private Movie convertToMovie(JsonNode node) {
        try {
            String title = node.get("title").asText();
            String tmdbId = node.has("id") ? node.get("id").asText() : null;
            String overview = node.has("overview") ? node.get("overview").asText() : "No description available.";
            String posterPath = node.has("poster_path") && !node.get("poster_path").isNull()
                    ? TMDB_IMAGE_BASE + node.get("poster_path").asText()
                    : "https://via.placeholder.com/500x750?text=No+Poster";

            LocalDate releaseDate = LocalDate.now();
            if (node.has("release_date") && !node.get("release_date").asText().isEmpty()) {
                try {
                    releaseDate = LocalDate.parse(node.get("release_date").asText(),
                            DateTimeFormatter.ISO_DATE);
                } catch (Exception e) {
                    log.debug("Could not parse release date for {}", title);
                }
            }

            // Extraire les genres
            List<String> genres = new ArrayList<>();
            if (node.has("genre_ids") && node.get("genre_ids").isArray()) {
                for (JsonNode genreId : node.get("genre_ids")) {
                    String genreName = getGenreName(genreId.asInt());
                    if (genreName != null) {
                        genres.add(genreName);
                    }
                }
            }

            // Récupérer l'URL du trailer depuis TMDB
            String trailerUrl = null;
            if (tmdbId != null) {
                trailerUrl = fetchTrailerUrl(tmdbId);
            }

            return Movie.builder()
                    .id(UUID.randomUUID().toString())
                    .title(title)
                    .plot(overview)
                    .releaseDate(releaseDate)
                    .genres(genres)
                    .poster(posterPath)
                    .trailerUrl(trailerUrl)
                    .averageRating(0.0)
                    .build();

        } catch (Exception e) {
            log.error("Error converting movie node: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Récupère l'URL YouTube du trailer principal d'un film depuis TMDB
     */
    private String fetchTrailerUrl(String tmdbId) {
        try {
            String url = String.format("%s/movie/%s/videos?api_key=%s&language=en-US",
                    TMDB_BASE_URL, tmdbId, TMDB_API_KEY);

            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode results = root.get("results");

            if (results != null && results.isArray() && results.size() > 0) {
                // Chercher le premier trailer YouTube officiel
                for (JsonNode video : results) {
                    String type = video.has("type") ? video.get("type").asText() : "";
                    String site = video.has("site") ? video.get("site").asText() : "";
                    String key = video.has("key") ? video.get("key").asText() : "";

                    // Priorité aux trailers YouTube officiels
                    if ("Trailer".equalsIgnoreCase(type) && "YouTube".equalsIgnoreCase(site) && !key.isEmpty()) {
                        return "https://www.youtube.com/watch?v=" + key;
                    }
                }

                // Si pas de trailer trouvé, prendre la première vidéo YouTube
                for (JsonNode video : results) {
                    String site = video.has("site") ? video.get("site").asText() : "";
                    String key = video.has("key") ? video.get("key").asText() : "";

                    if ("YouTube".equalsIgnoreCase(site) && !key.isEmpty()) {
                        return "https://www.youtube.com/watch?v=" + key;
                    }
                }
            }
        } catch (Exception e) {
            log.debug("Could not fetch trailer for movie ID {}: {}", tmdbId, e.getMessage());
        }

        return null;
    }

    // Mapping des IDs de genres TMDB vers leurs noms
    private String getGenreName(int genreId) {
        return switch (genreId) {
            case 28 -> "Action";
            case 12 -> "Adventure";
            case 16 -> "Animation";
            case 35 -> "Comedy";
            case 80 -> "Crime";
            case 99 -> "Documentary";
            case 18 -> "Drama";
            case 10751 -> "Family";
            case 14 -> "Fantasy";
            case 36 -> "History";
            case 27 -> "Horror";
            case 10402 -> "Music";
            case 9648 -> "Mystery";
            case 10749 -> "Romance";
            case 878 -> "Science Fiction";
            case 10770 -> "TV Movie";
            case 53 -> "Thriller";
            case 10752 -> "War";
            case 37 -> "Western";
            default -> null;
        };
    }
}
