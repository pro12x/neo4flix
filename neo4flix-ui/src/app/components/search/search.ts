import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MovieService } from '../../services/movies';
import { Movie } from '../../models/movie.model';
import { WatchlistService } from '../../services/watchlist';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast.service';
import { MovieCardComponent } from '../share/movie-card';
import { VideoPlayerComponent } from '../share/video-player';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule, MovieCardComponent, VideoPlayerComponent],
  template: `
    <div class="search-container">
      <!-- Animated Background -->
      <div class="background-video">
        <div class="video-overlay"></div>
        <div class="particles-container">
          <div class="particle" *ngFor="let _ of particles"></div>
        </div>
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
        </div>
      </div>

      <!-- Header -->
      <header class="search-header">
        <div class="logo" routerLink="/">
          <span class="logo-text">NEO4FLIX</span>
          <div class="logo-glow"></div>
        </div>
        <nav class="nav-links">
          <a routerLink="/" class="nav-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            Home
          </a>
          <a routerLink="/recommendations" class="nav-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
            </svg>
            Recommendations
          </a>
          <a routerLink="/ratings" class="nav-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
            My Ratings
          </a>
          <a routerLink="/watchlist" class="nav-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10"/>
            </svg>
            Watchlist
          </a>
        </nav>
      </header>

      <!-- Main Search Content -->
      <main class="search-main">
        <!-- Search Hero Section -->
        <section class="search-hero">
          <div class="hero-background">
            <div class="hero-gradient"></div>
            <div class="hero-pattern"></div>
          </div>

          <div class="hero-content">
            <div class="search-title-section">
              <h1 class="search-title">
                <span class="title-text">Discover Your</span>
                <span class="title-highlight">Next Favorite</span>
              </h1>
              <p class="search-subtitle">Search through thousands of movies and find exactly what you're looking for</p>
            </div>

            <!-- Enhanced Search Bar -->
            <div class="search-bar-container">
              <div class="search-bar-wrapper">
                <div class="search-input-container">
                  <svg class="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by title, genre, actor..."
                    [value]="title()"
                    (input)="title.set($any($event.target).value); runSearch(0)"
                    class="search-input"
                    autocomplete="off"
                  />
                  <div class="search-focus-ring"></div>
                </div>

                <!-- Search button removed - search runs on input change -->
               </div>

              <!-- Search Suggestions -->
              <div class="search-suggestions" *ngIf="title() && !loading()">
                <div class="suggestion-item" *ngFor="let suggestion of getSuggestions()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <span>{{ suggestion }}</span>
                </div>
              </div>
            </div>

            <!-- Popular Searches -->
            <div class="popular-searches">
              <span class="popular-label">Popular searches:</span>
              <div class="popular-tags">
                <button class="tag-button" (click)="setSearchTerm('Action')">Action</button>
                <button class="tag-button" (click)="setSearchTerm('Comedy')">Comedy</button>
                <button class="tag-button" (click)="setSearchTerm('Drama')">Drama</button>
                <button class="tag-button" (click)="setSearchTerm('Sci-Fi')">Sci-Fi</button>
                <button class="tag-button" (click)="setSearchTerm('Horror')">Horror</button>
                <button class="tag-button" (click)="setSearchTerm('Romance')">Romance</button>
              </div>
            </div>
          </div>
        </section>

        <!-- Search Results -->
        <section class="results-section" *ngIf="movies().length > 0 || loading() || error()">
          <!-- Results Header -->
          <div class="results-header" *ngIf="movies().length > 0">
            <h2 class="results-title">
              <span class="results-count">{{ movies().length }}</span>
              <span class="results-text">movies found</span>
              <span class="results-query" *ngIf="title()">"{{ title() }}"</span>
            </h2>
            <div class="results-sort">
              <select class="sort-select" (change)="changeSort($any($event.target).value)">
                <option value="relevance">Most Relevant</option>
                <option value="rating">Highest Rated</option>
                <option value="date">Newest First</option>
                <option value="title">A-Z</option>
              </select>
            </div>
          </div>

          <!-- Loading State -->
          <div class="loading-state" *ngIf="loading()">
            <div class="loading-spinner">
              <div class="spinner-ring"></div>
              <div class="spinner-ring"></div>
              <div class="spinner-ring"></div>
            </div>
            <p class="loading-text">Searching for movies...</p>
          </div>

          <!-- Error State -->
          <div class="error-state" *ngIf="error() && !loading()">
            <div class="error-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <h3 class="error-title">Search Failed</h3>
            <p class="error-message">{{ error() }}</p>
            <button class="retry-button" (click)="runSearch(0)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23,4 23,10 17,10"/>
                <polyline points="1,20 1,14 7,14"/>
                <path d="M20.49,9A9,9,0,0,0,5.64,5.64L1,10m22,4l-4.64,4.36A9,9,0,0,1,3.51,15"/>
              </svg>
              Try Again
            </button>
          </div>

          <!-- Results Grid -->
          <div class="results-grid" *ngIf="!loading() && movies().length > 0">
            <app-movie-card
              *ngFor="let m of movies()"
              [movie]="m"
              [isInWatchlist]="isInWatchlist(m.id)"
              (played)="playTrailer(m)"
              (watchlistAdd)="addToWatchlist(m.id)"
              (watchlistRemove)="removeFromWatchlist(m.id)">
            </app-movie-card>
          </div>

          <!-- No Results -->
          <div class="no-results" *ngIf="!loading() && movies().length === 0 && title()">
            <div class="no-results-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                <line x1="13" y1="13" x2="9" y2="9"/>
              </svg>
            </div>
            <h3 class="no-results-title">No movies found</h3>
            <p class="no-results-message">Try adjusting your search terms or browse our popular categories</p>
            <div class="no-results-suggestions">
              <button class="suggestion-btn" (click)="setSearchTerm('Action')">Action Movies</button>
              <button class="suggestion-btn" (click)="setSearchTerm('Comedy')">Comedy Movies</button>
              <button class="suggestion-btn" (click)="setSearchTerm('Drama')">Drama Movies</button>
            </div>
          </div>
        </section>
      </main>

      <!-- Video Player Modal -->
      <app-video-player
        *ngIf="videoPlayerVisible()"
        [videoUrl]="currentTrailerUrl()"
        [movieTitle]="currentTrailerTitle()"
        (closed)="closeTrailer()">
      </app-video-player>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      overflow-x: hidden;
      background: #000000;
    }

    .search-container {
      position: relative;
      min-height: 100vh;
      background: #000000;
    }

    /* Animated Background */
    .background-video {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
    }

    .video-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        135deg,
        rgba(0, 0, 0, 0.9) 0%,
        rgba(20, 20, 40, 0.8) 50%,
        rgba(0, 0, 0, 0.9) 100%
      );
      backdrop-filter: blur(3px);
    }

    /* Particles Animation */
    .particles-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .particle {
      position: absolute;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 50%;
      animation: float 30s infinite linear;
    }

    .particle:nth-child(1) { width: 4px; height: 4px; left: 10%; animation-delay: 0s; }
    .particle:nth-child(2) { width: 6px; height: 6px; left: 20%; animation-delay: 3s; }
    .particle:nth-child(3) { width: 3px; height: 3px; left: 30%; animation-delay: 6s; }
    .particle:nth-child(4) { width: 5px; height: 5px; left: 40%; animation-delay: 9s; }
    .particle:nth-child(5) { width: 4px; height: 4px; left: 50%; animation-delay: 12s; }
    .particle:nth-child(6) { width: 7px; height: 7px; left: 60%; animation-delay: 15s; }
    .particle:nth-child(7) { width: 3px; height: 3px; left: 70%; animation-delay: 18s; }
    .particle:nth-child(8) { width: 5px; height: 5px; left: 80%; animation-delay: 21s; }
    .particle:nth-child(9) { width: 4px; height: 4px; left: 90%; animation-delay: 24s; }
    .particle:nth-child(10) { width: 6px; height: 6px; left: 95%; animation-delay: 27s; }

    @keyframes float {
      0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 0.5;
      }
      90% {
        opacity: 0.5;
      }
      100% {
        transform: translateY(-100px) rotate(360deg);
        opacity: 0;
      }
    }

    /* Floating Shapes */
    .floating-shapes {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .shape {
      position: absolute;
      background: linear-gradient(45deg, rgba(229, 9, 20, 0.06), rgba(178, 7, 16, 0.06));
      border: 1px solid rgba(229, 9, 20, 0.12);
      animation: shapeFloat 35s infinite linear;
    }

    .shape-1 {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      top: 20%;
      right: 5%;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 70px;
      height: 70px;
      border-radius: 20px;
      top: 60%;
      left: 15%;
      animation-delay: 12s;
    }

    .shape-3 {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      top: 40%;
      right: 20%;
      animation-delay: 24s;
    }

    @keyframes shapeFloat {
      0% {
        transform: translateY(0px) rotate(0deg) scale(1);
        opacity: 0.3;
      }
      25% {
        transform: translateY(-25px) rotate(90deg) scale(1.1);
        opacity: 0.6;
      }
      50% {
        transform: translateY(-50px) rotate(180deg) scale(0.9);
        opacity: 0.4;
      }
      75% {
        transform: translateY(-25px) rotate(270deg) scale(1.05);
        opacity: 0.5;
      }
      100% {
        transform: translateY(0px) rotate(360deg) scale(1);
        opacity: 0.3;
      }
    }

    /* Header */
    .search-header {
      position: relative;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2rem 4rem;
      animation: headerSlideIn 1s ease-out;
    }

    @keyframes headerSlideIn {
      from {
        transform: translateY(-100px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .logo {
      position: relative;
      font-size: 2.2rem;
      font-weight: 700;
      color: #e50914;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .logo:hover {
      transform: scale(1.05);
    }

    .logo-text {
      background: linear-gradient(45deg, #e50914, #b20710);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      position: relative;
      z-index: 2;
    }

    .logo-glow {
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, #e50914, #b20710);
      border-radius: 8px;
      opacity: 0;
      z-index: 1;
      transition: opacity 0.3s ease;
      filter: blur(8px);
    }

    .logo:hover .logo-glow {
      opacity: 0.3;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      transition: all 0.3s ease;
      position: relative;
    }

    .nav-link:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.1);
    }

    .nav-link svg {
      width: 18px;
      height: 18px;
    }

    /* Main Content */
    .search-main {
      position: relative;
      z-index: 5;
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Search Hero Section */
    .search-hero {
      position: relative;
      margin-bottom: 4rem;
      animation: heroFadeIn 1.5s ease-out 0.3s both;
    }

    @keyframes heroFadeIn {
      from {
        transform: translateY(30px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 24px;
      overflow: hidden;
      z-index: 1;
    }

    .hero-gradient {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        135deg,
        rgba(229, 9, 20, 0.1) 0%,
        rgba(20, 20, 40, 0.8) 50%,
        rgba(0, 0, 0, 0.9) 100%
      );
      backdrop-filter: blur(2px);
    }

    .hero-pattern {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.03;
      background-image:
        radial-gradient(circle at 25% 25%, #e50914 2px, transparent 2px),
        radial-gradient(circle at 75% 75%, #b20710 1px, transparent 1px);
      background-size: 40px 40px, 25px 25px;
    }

    .hero-content {
      position: relative;
      z-index: 2;
      padding: 4rem 3rem;
      text-align: center;
      color: #ffffff;
    }

    .search-title-section {
      margin-bottom: 3rem;
    }

    .search-title {
      font-size: clamp(2rem, 6vw, 3rem);
      font-weight: 900;
      margin-bottom: 1rem;
      line-height: 1.1;
    }

    .title-text {
      display: block;
      color: rgba(255, 255, 255, 0.9);
    }

    .title-highlight {
      display: block;
      background: linear-gradient(45deg, #ffffff, #e0e7ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: titleGlow 4s ease-in-out infinite alternate;
    }

    @keyframes titleGlow {
      from {
        filter: brightness(1);
      }
      to {
        filter: brightness(1.2);
      }
    }

    .search-subtitle {
      font-size: clamp(0.8rem, 2vw, 1.31em);
      color: rgba(255, 255, 255, 0.7);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* Enhanced Search Bar */
    .search-bar-container {
      max-width: 800px;
      margin: 0 auto 3rem;
    }

    .search-bar-wrapper {
      position: relative;
      z-index: 3;
    }

    .search-input-container {
      position: relative;
      margin-bottom: 1rem;
    }

    .search-icon {
      position: absolute;
      left: 1.5rem;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255, 255, 255, 0.5);
      z-index: 4;
      transition: color 0.3s ease;
    }

    .search-input {
      width: 100%;
      padding: 1.25rem 3rem 1.25rem 4rem;
      font-size: 1.1rem;
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      color: #ffffff;
      transition: all 0.3s ease;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .search-input:focus {
      outline: none;
      border-color: #e50914;
      background: rgba(255, 255, 255, 0.12);
      box-shadow: 0 0 40px rgba(229, 9, 20, 0.2);
    }

    .search-input::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }

    .search-focus-ring {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 16px;
      background: linear-gradient(45deg, #e50914, #b20710);
      opacity: 0;
      z-index: -1;
      transition: opacity 0.3s ease;
      filter: blur(16px);
    }

    .search-input:focus + .search-focus-ring {
      opacity: 0.1;
    }

    /* Search Suggestions */
    .search-suggestions {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      margin-top: 0.5rem;
      z-index: 5;
      max-height: 200px;
      overflow-y: auto;
    }

    .suggestion-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .suggestion-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }

    .suggestion-item svg {
      color: #e50914;
      flex-shrink: 0;
    }

    /* Popular Searches */
    .popular-searches {
      text-align: center;
    }

    .popular-label {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
      margin-bottom: 1rem;
      display: block;
    }

    .popular-tags {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .tag-button {
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .tag-button:hover {
      background: rgba(229, 9, 20, 0.2);
      border-color: #e50914;
      color: #ffffff;
      transform: translateY(-2px);
    }

    /* Results Section */
    .results-section {
      animation: resultsFadeIn 1s ease-out 0.6s both;
    }

    @keyframes resultsFadeIn {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding: 0 1rem;
    }

    .results-title {
      font-size: 1.8rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }

    .results-count {
      color: #e50914;
    }

    .results-query {
      color: rgba(255, 255, 255, 0.7);
      font-style: italic;
    }

    .results-sort {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .sort-select {
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: #ffffff;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .sort-select:focus {
      outline: none;
      border-color: #e50914;
      background: rgba(255, 255, 255, 0.15);
    }

    /* Loading State */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
    }

    .loading-spinner {
      position: relative;
      width: 60px;
      height: 60px;
      margin-bottom: 1.5rem;
    }

    .spinner-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      border-top-color: #e50914;
      animation: spin 1s linear infinite;
    }

    .spinner-ring:nth-child(2) {
      animation-delay: 0.2s;
      border-top-color: #b20710;
    }

    .spinner-ring:nth-child(3) {
      animation-delay: 0.4s;
      border-top-color: #8b0510;
    }

    .loading-text {
      color: rgba(255, 255, 255, 0.7);
      font-size: 1.1rem;
    }

    /* Error State */
    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
    }

    .error-icon {
      margin-bottom: 1.5rem;
      color: #ff6b6b;
    }

    .error-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 0.5rem;
    }

    .error-message {
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 2rem;
      max-width: 400px;
    }

    .retry-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #e50914, #b20710);
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .retry-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(229, 9, 20, 0.4);
    }

    /* Results Grid */
    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
      padding: 0 1rem;
    }

    /* No Results */
    .no-results {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
    }

    .no-results-icon {
      margin-bottom: 1.5rem;
      color: rgba(255, 255, 255, 0.3);
    }

    .no-results-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 0.5rem;
    }

    .no-results-message {
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 2rem;
      max-width: 400px;
    }

    .no-results-suggestions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .suggestion-btn {
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .suggestion-btn:hover {
      background: rgba(229, 9, 20, 0.2);
      border-color: #e50914;
      color: #ffffff;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .results-grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .search-header {
        padding: 1.5rem 2rem;
        flex-direction: column;
        gap: 1rem;
      }

      .logo {
        font-size: 1.8rem;
      }

      .nav-links {
        gap: 1rem;
      }

      .search-main {
        padding: 1rem;
      }

      .hero-content {
        padding: 3rem 2rem;
      }

      .search-title {
        font-size: 2.5rem;
      }

      .search-subtitle {
        font-size: 1rem;
      }

      .search-input {
        font-size: 1rem;
        padding: 1rem 2.5rem 1rem 3.5rem;
      }

      .results-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .results-title {
        font-size: 1.5rem;
      }

      .results-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
      }
    }

    @media (max-width: 480px) {
      .search-header {
        padding: 1rem;
      }

      .hero-content {
        padding: 2rem 1rem;
      }

      .search-title {
        font-size: 2rem;
      }

      .popular-tags {
        gap: 0.5rem;
      }

      .tag-button {
        padding: 0.4rem 0.8rem;
        font-size: 0.8rem;
      }

      .results-grid {
        grid-template-columns: 1fr;
      }

      .no-results-suggestions {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class SearchComponent implements OnInit {
  private readonly movieService = inject(MovieService);
  private readonly watchlistService = inject(WatchlistService);
  private readonly auth = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  title = signal('');
  movies = signal<Movie[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Video player signals
  videoPlayerVisible = signal(false);
  currentTrailerUrl = signal<string | undefined>(undefined);
  currentTrailerTitle = signal<string>('');

  particles: number[] = new Array(10).fill(0);

  // Track watchlist movie IDs
  watchlistMovieIds = signal<Set<string>>(new Set());

  constructor() {
    // Load initial search if query param exists
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.title.set(params['q']);
        this.runSearch(0);
      }
    });
  }

  ngOnInit() {
    this.loadWatchlist();
  }

  runSearch(page: number = 0) {
    if (!this.title().trim()) {
      this.movies.set([]);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.movieService.searchPaged({
      title: this.title().trim(),
      page,
      size: 20,
    }).subscribe({
      next: res => {
        this.movies.set(res?.items || []);
        this.loading.set(false);

        // Update URL with search query
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { q: this.title().trim() },
          queryParamsHandling: 'merge'
        });
      },
      error: err => {
        console.error('[Search] Error:', err);
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Search failed');
      }
    });
  }

  setSearchTerm(term: string) {
    this.title.set(term);
    this.runSearch(0);
  }

  getSuggestions(): string[] {
    const query = this.title().toLowerCase();
    if (!query) return [];

    const suggestions = [
      'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance',
      'Thriller', 'Adventure', 'Animation', 'Documentary'
    ];

    return suggestions.filter(s =>
      s.toLowerCase().includes(query)
    ).slice(0, 5);
  }

  changeSort(sortBy: string) {
    // Implement sorting logic here
    console.log('Sorting by:', sortBy);
  }

  private loadWatchlist() {
    const user = this.auth.currentUserValue;
    if (!user) return;

    this.watchlistService.getWatchlist(user.id).subscribe({
      next: watchlist => {
        const movieIds = new Set(watchlist.map(item => item.movieId));
        this.watchlistMovieIds.set(movieIds);
      },
      error: err => {
        console.error('Failed to load watchlist:', err);
      }
    });
  }

  addToWatchlist(movieId: string) {
    const user = this.auth.currentUserValue;
    if (!user) {
      this.toastService.show('You must be logged in to add to watchlist.', 'error');
      return;
    }
    this.watchlistService.add(user.id, movieId).subscribe({
      next: () => {
        this.watchlistMovieIds.update(ids => new Set([...ids, movieId]));
        this.toastService.show('Added to your watchlist!', 'success');
      },
      error: err => {
        this.toastService.show(err?.error?.message || 'Failed to add to watchlist.', 'error');
      }
    });
  }

  removeFromWatchlist(movieId: string) {
    const user = this.auth.currentUserValue;
    if (!user) {
      this.toastService.show('You must be logged in to remove from watchlist.', 'error');
      return;
    }
    this.watchlistService.remove(user.id, movieId).subscribe({
      next: () => {
        this.watchlistMovieIds.update(ids => {
          const newIds = new Set(ids);
          newIds.delete(movieId);
          return newIds;
        });
        this.toastService.show('Removed from your watchlist!', 'success');
      },
      error: err => {
        this.toastService.show(err?.error?.message || 'Failed to remove from watchlist.', 'error');
      }
    });
  }

  isInWatchlist(movieId: string): boolean {
    return this.watchlistMovieIds().has(movieId);
  }

  playTrailer(movie: Movie) {
    const url = (movie.trailerUrl || '').trim();
    if (!url) {
      this.toastService.show('No trailer available for this movie.', 'info');
      return;
    }

    this.currentTrailerUrl.set(url);
    this.currentTrailerTitle.set(movie.title);
    this.videoPlayerVisible.set(true);
  }

  closeTrailer() {
    this.videoPlayerVisible.set(false);
    this.currentTrailerUrl.set(undefined);
    this.currentTrailerTitle.set('');
  }

  getYear(date: string | Date): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (Number.isNaN(dateObj.getTime())) return '';
    return dateObj.getFullYear().toString();
  }
}
