package com.codinggoline.userservice.service;

import com.codinggoline.userservice.dto.WatchlistMovieResponse;
import com.codinggoline.userservice.repository.WatchlistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;

    @Transactional
    public void addToWatchlist(String userId, String movieId) {
        log.info("Adding movie {} to watchlist for user {}", movieId, userId);
        watchlistRepository.addToWatchlist(userId, movieId, LocalDateTime.now());
    }

    @Transactional
    public void removeFromWatchlist(String userId, String movieId) {
        log.info("Removing movie {} from watchlist for user {}", movieId, userId);
        watchlistRepository.removeFromWatchlist(userId, movieId);
    }

    @Transactional(readOnly = true)
    public List<WatchlistMovieResponse> getWatchlist(String userId) {
        log.info("Fetching watchlist for user {}", userId);
        return watchlistRepository.getWatchlist(userId);
    }

    @Transactional(readOnly = true)
    public boolean isInWatchlist(String userId, String movieId) {
        return watchlistRepository.existsInWatchlist(userId, movieId);
    }
}
