package com.codinggoline.movieservice.mapper;

import com.codinggoline.movieservice.dto.MovieRequest;
import com.codinggoline.movieservice.dto.MovieResponse;
import com.codinggoline.movieservice.entity.Movie;
import org.springframework.stereotype.Component;

@Component
public class MovieMapper {

    public MovieResponse toResponse(Movie movie) {
        return MovieResponse.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .releaseDate(movie.getReleaseDate())
                .plot(movie.getPlot())
                .poster(movie.getPoster())
                .imdbId(movie.getImdbId())
                .trailerUrl(movie.getTrailerUrl())
                .genres(movie.getGenres())
                .averageRating(movie.getAverageRating())
                .ratingCount(movie.getRatingCount())
                .build();
    }

    public Movie toEntity(MovieRequest request) {
        return Movie.builder()
                .title(request.getTitle())
                .releaseDate(request.getReleaseDate())
                .plot(request.getPlot())
                .poster(request.getPoster())
                .imdbId(request.getImdbId())
                .trailerUrl(request.getTrailerUrl())
                .genres(request.getGenres())
                .averageRating(0.0)
                .ratingCount(0)
                .build();
    }
}
