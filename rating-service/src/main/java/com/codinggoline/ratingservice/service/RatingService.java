package com.codinggoline.ratingservice.service;

import com.codinggoline.ratingservice.dto.RatingRequest;
import com.codinggoline.ratingservice.dto.RatingResponse;
import com.codinggoline.ratingservice.entity.UserNode;
import com.codinggoline.ratingservice.exception.ConflictException;
import com.codinggoline.ratingservice.exception.NotFoundException;
import com.codinggoline.ratingservice.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RatingService {

    private final RatingRepository ratingRepository;

    @Transactional
    public RatingResponse createRating(RatingRequest request) {
        log.info("Creating rating for user {} and movie {}", request.getUserId(), request.getMovieId());

        UserNode existingRating = ratingRepository.findUserRatingForMovie(
                request.getUserId(), request.getMovieId());

        if (existingRating != null) {
            throw new ConflictException("RATING_ALREADY_EXISTS", "Rating already exists for this user and movie");
        }

        ratingRepository.createRating(
                request.getUserId(),
                request.getMovieId(),
                request.getRating(),
                request.getReview()
        );

        return RatingResponse.builder()
                .userId(request.getUserId())
                .movieId(request.getMovieId())
                .rating(request.getRating())
                .review(request.getReview())
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();
    }

    @Transactional(readOnly = true)
    public List<RatingResponse> getUserRatings(String userId) {
        log.info("Fetching ratings for user {}", userId);

        UserNode userNode = ratingRepository.findAllUserRatings(userId);

        if (userNode == null || userNode.getRatings() == null) {
            return List.of();
        }

        return userNode.getRatings().stream()
                .map(rating -> RatingResponse.builder()
                        .id(rating.getId())
                        .userId(userId)
                        .movieId(rating.getMovie().getId())
                        .movieTitle(rating.getMovie().getTitle())
                        .rating(rating.getRating())
                        .review(rating.getReview())
                        .createdAt(rating.getCreatedAt())
                        .updatedAt(rating.getUpdatedAt())
                        .build())
                .toList();
    }

    @Transactional(readOnly = true)
    public Double getAverageRating(String movieId) {
        log.info("Fetching average rating for movie {}", movieId);
        Double avgRating = ratingRepository.getAverageRatingForMovie(movieId);
        return avgRating != null ? avgRating : 0.0;
    }

    @Transactional(readOnly = true)
    public Integer getRatingCount(String movieId) {
        log.info("Fetching rating count for movie {}", movieId);
        Integer count = ratingRepository.getRatingCountForMovie(movieId);
        return count != null ? count : 0;
    }

    @Transactional
    public RatingResponse updateRating(String userId, String movieId, Double rating, String review) {
        log.info("Updating rating for user {} and movie {}", userId, movieId);

        UserNode existingRating = ratingRepository.findUserRatingForMovie(userId, movieId);

        if (existingRating == null) {
            throw new NotFoundException("RATING_NOT_FOUND", "Rating not found for this user and movie");
        }

        ratingRepository.updateRating(userId, movieId, rating, review);

        return RatingResponse.builder()
                .userId(userId)
                .movieId(movieId)
                .rating(rating)
                .review(review)
                .updatedAt(OffsetDateTime.now())
                .build();
    }

    // Backwards-compatible overload used by some callers
    @Transactional
    public RatingResponse updateRating(String userId, String movieId, com.codinggoline.ratingservice.dto.RatingRequest request) {
        return updateRating(userId, movieId, request.getRating(), request.getReview());
    }

    @Transactional
    public void deleteRating(String userId, String movieId) {
        log.info("Deleting rating for user {} and movie {}", userId, movieId);

        UserNode existingRating = ratingRepository.findUserRatingForMovie(userId, movieId);

        if (existingRating == null) {
            throw new NotFoundException("RATING_NOT_FOUND", "Rating not found for this user and movie");
        }

        ratingRepository.deleteRating(userId, movieId);
    }
}
