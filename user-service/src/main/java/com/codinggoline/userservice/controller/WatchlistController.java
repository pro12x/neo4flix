package com.codinggoline.userservice.controller;

import com.codinggoline.userservice.dto.WatchlistMovieResponse;
import com.codinggoline.userservice.service.WatchlistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
public class WatchlistController {

    private final WatchlistService watchlistService;

    @PostMapping("/{userId}/watchlist/{movieId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> addToWatchlist(@PathVariable String userId, @PathVariable String movieId) {
        log.info("Received request to add movie {} to watchlist for user {}", movieId, userId);
        watchlistService.addToWatchlist(userId, movieId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}/watchlist/{movieId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> removeFromWatchlist(@PathVariable String userId, @PathVariable String movieId) {
        log.info("Received request to remove movie {} from watchlist for user {}", movieId, userId);
        watchlistService.removeFromWatchlist(userId, movieId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{userId}/watchlist")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<WatchlistMovieResponse>> getWatchlist(@PathVariable String userId) {
        log.info("Received request to get watchlist for user {}", userId);
        return ResponseEntity.ok(watchlistService.getWatchlist(userId));
    }

    @GetMapping("/{userId}/watchlist/{movieId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Boolean> isInWatchlist(@PathVariable String userId, @PathVariable String movieId) {
        return ResponseEntity.ok(watchlistService.isInWatchlist(userId, movieId));
    }
}
