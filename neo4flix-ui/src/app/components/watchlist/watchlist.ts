import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WatchlistMovie, WatchlistService } from '../../services/watchlist';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast.service';
import { MovieService } from '../../services/movies';
import { VideoPlayerComponent } from '../share/video-player';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, RouterModule, VideoPlayerComponent],
  template: `
    <div class="watchlist-container">
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
      <header class="watchlist-header">
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
          <a routerLink="/search" class="nav-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Search
          </a>
        </nav>
      </header>

      <!-- Main Content -->
      <main class="watchlist-main">
        <!-- Hero Section -->
        <section class="watchlist-hero">
          <div class="hero-background">
            <div class="hero-gradient"></div>
            <div class="hero-pattern"></div>
          </div>

          <div class="hero-content">
            <div class="hero-title-section">
              <h1 class="hero-title">
                <span class="title-text">My</span>
                <span class="title-highlight">Watchlist</span>
              </h1>
              <p class="hero-subtitle">Your personal collection of movies to watch later</p>
            </div>

            <!-- Watchlist Stats -->
            <div class="watchlist-stats" *ngIf="!loading() && movies().length > 0">
              <div class="stat-card">
                <div class="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10"/>
                  </svg>
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ movies().length }}</div>
                  <div class="stat-label">Movies Saved</div>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ getTotalWatchTime() }}</div>
                  <div class="stat-label">Est. Watch Time</div>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ getAverageRating() }}</div>
                  <div class="stat-label">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Watchlist Content -->
        <section class="watchlist-content">
          <!-- Loading State -->
          <div class="loading-state" *ngIf="loading()">
            <div class="loading-spinner">
              <div class="spinner-ring"></div>
              <div class="spinner-ring"></div>
              <div class="spinner-ring"></div>
            </div>
            <h3 class="loading-title">Loading your watchlist...</h3>
            <p class="loading-subtitle">Getting your saved movies ready</p>
          </div>

          <!-- Error State -->
          <div class="error-state" *ngIf="error() && !loading()">
            <div class="error-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <h3 class="error-title">Unable to load watchlist</h3>
            <p class="error-message">{{ error() }}</p>
            <button class="retry-button" (click)="loadWatchlist()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23,4 23,10 17,10"/>
                <polyline points="1,20 1,14 7,14"/>
                <path d="M20.49,9A9,9,0,0,0,5.64,5.64L1,10m22,4l-4.64,4.36A9,9,0,0,1,3.51,15"/>
              </svg>
              Try Again
            </button>
          </div>

          <!-- Results Grid -->
          <div class="watchlist-grid" *ngIf="!loading() && movies().length > 0">
            <div class="grid-header">
              <h2 class="grid-title">
                <span class="title-count">{{ movies().length }}</span>
                <span class="title-text">movies in your watchlist</span>
              </h2>
              <div class="grid-actions">
                <button class="sort-btn" (click)="toggleSort()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M7 16V4m0 0L3 8m4-4 4 4m6 0v12m0 0 4-4m-4 4-4-4"/>
                  </svg>
                  <span>{{ sortOrder() === 'date' ? 'Sort by Date' : 'Sort by Title' }}</span>
                </button>
              </div>
            </div>

            <div class="movies-grid">
              <div class="movie-card" *ngFor="let m of sortedMovies(); trackBy: trackByMovieId">
                <div class="card-poster">
                  <a [routerLink]="['/movie', m.movieId]">
                    <img [src]="m.poster" [alt]="m.title" class="poster-img">
                  </a>
                  <div class="poster-overlay">
                    <button class="play-btn" (click)="playTrailer(m); $event.stopPropagation()">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </button>
                    <button class="remove-btn" (click)="remove(m.movieId); $event.stopPropagation()">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="card-content">
                  <a [routerLink]="['/movie', m.movieId]" class="card-link">
                    <h3 class="movie-title">{{ m.title }}</h3>
                  </a>

                  <div class="movie-meta">
                    <div class="meta-row">
                      <span class="year" *ngIf="m.releaseDate">{{ getYear(m.releaseDate) }}</span>
                      <span class="rating" *ngIf="m.averageRating">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                        </svg>
                        {{ m.averageRating.toFixed(1) }}
                      </span>
                    </div>

                    <div class="genres" *ngIf="m.genres?.length">
                      <span class="genre" *ngFor="let genre of m.genres?.slice(0, 2)">{{ genre }}</span>
                    </div>
                  </div>

                  <p class="movie-plot" *ngIf="m.plot">{{ m.plot | slice:0:100 }}...</p>

                  <div class="card-actions">
                    <button class="action-btn rate-btn" (click)="rateMovie(m); $event.stopPropagation()">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                      </svg>
                      <span>Rate</span>
                    </button>

                    <button class="action-btn share-btn" (click)="shareMovie(m); $event.stopPropagation()">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                        <polyline points="16,6 12,2 8,6"/>
                        <line x1="12" y1="2" x2="12" y2="15"/>
                      </svg>
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div class="empty-state" *ngIf="!loading() && movies().length === 0 && !error()">
            <div class="empty-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10"/>
              </svg>
            </div>
            <h3 class="empty-title">Your watchlist is empty</h3>
            <p class="empty-message">Start building your watchlist by adding movies you want to watch later</p>
            <div class="empty-actions">
              <a routerLink="/search" class="browse-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <span>Browse Movies</span>
              </a>
              <a routerLink="/recommendations" class="recommendations-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
                </svg>
                <span>Get Recommendations</span>
              </a>
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

    .watchlist-container {
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
    .watchlist-header {
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
    .watchlist-main {
      position: relative;
      z-index: 5;
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Hero Section */
    .watchlist-hero {
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
      background-size: 50px 50px, 30px 30px;
    }

    .hero-content {
      position: relative;
      z-index: 2;
      padding: 4rem 3rem;
      text-align: center;
      color: #ffffff;
    }

    .hero-title-section {
      margin-bottom: 3rem;
    }

    .hero-title {
      font-size: clamp(3rem, 6vw, 4.5rem);
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

    .hero-subtitle {
      font-size: clamp(1.1rem, 2vw, 1.3rem);
      color: rgba(255, 255, 255, 0.7);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* Watchlist Stats */
    .watchlist-stats {
      display: flex;
      justify-content: center;
      gap: 2rem;
      flex-wrap: wrap;
      margin-top: 3rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 1.5rem;
      min-width: 180px;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(229, 9, 20, 0.2);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #e50914, #b20710);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
    }

    .stat-content {
      flex: 1;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: #ffffff;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.7);
      margin-top: 0.25rem;
    }

    /* Watchlist Content */
    .watchlist-content {
      animation: contentFadeIn 1s ease-out 0.6s both;
    }

    @keyframes contentFadeIn {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    /* Loading State */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 6rem 2rem;
      text-align: center;
    }

    .loading-spinner {
      position: relative;
      width: 80px;
      height: 80px;
      margin-bottom: 2rem;
    }

    .loading-circle {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 4px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      border-top-color: #e50914;
      animation: spin 1.5s linear infinite;
    }

    .loading-circle:nth-child(2) {
      animation-delay: 0.3s;
      border-top-color: #b20710;
    }

    .loading-circle:nth-child(3) {
      animation-delay: 0.6s;
      border-top-color: #8b0510;
    }

    .loading-title {
      font-size: 1.8rem;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 0.5rem;
    }

    .loading-subtitle {
      color: rgba(255, 255, 255, 0.7);
      max-width: 400px;
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
    .watchlist-grid {
      animation: gridFadeIn 1s ease-out 0.8s both;
    }

    @keyframes gridFadeIn {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .grid-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding: 0 1rem;
    }

    .grid-title {
      font-size: 1.8rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }

    .title-count {
      color: #e50914;
    }

    .grid-actions {
      display: flex;
      gap: 1rem;
    }

    .sort-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .sort-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 2rem;
      padding: 0 1rem;
    }

    .movie-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
    }

    .movie-card:hover {
      transform: translateY(-8px);
      border-color: rgba(229, 9, 20, 0.2);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .card-poster {
      position: relative;
      aspect-ratio: 4/5;
      overflow: hidden;
    }

    .poster-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .movie-card:hover .poster-img {
      transform: scale(1.05);
    }

    .poster-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .movie-card:hover .poster-overlay {
      opacity: 1;
    }

    .play-btn, .remove-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      color: #ffffff;
    }

    .play-btn {
      background: linear-gradient(135deg, #e50914, #b20710);
      box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);
    }

    .play-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(229, 9, 20, 0.5);
    }

    .remove-btn {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
    }

    .remove-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }

    .card-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: linear-gradient(135deg, #e50914, #b20710);
      color: #ffffff;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
      z-index: 3;
    }

    .card-content {
      padding: 1.5rem;
    }

    .card-link {
      text-decoration: none;
      color: inherit;
    }

    .movie-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 0.75rem;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .movie-meta {
      margin-bottom: 1rem;
    }

    .meta-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.7);
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #ffd700;
    }

    .genres {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .genre {
      padding: 0.25rem 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.8);
    }

    .movie-plot {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.6);
      line-height: 1.4;
      margin-bottom: 1rem;
    }

    .card-actions {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.3s ease;
      flex: 1;
      justify-content: center;
    }

    .action-btn:hover {
      background: rgba(229, 9, 20, 0.2);
      border-color: #e50914;
      color: #ffffff;
    }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 6rem 2rem;
      text-align: center;
    }

    .empty-icon {
      margin-bottom: 1.5rem;
      color: rgba(255, 255, 255, 0.3);
    }

    .empty-title {
      font-size: 1.8rem;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 0.5rem;
    }

    .empty-message {
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 2rem;
      max-width: 400px;
    }

    .empty-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .browse-btn, .recommendations-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 2rem;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);
    }

    .browse-btn {
      background: linear-gradient(135deg, #e50914, #b20710);
      color: #ffffff;
    }

    .browse-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(229, 9, 20, 0.5);
    }

    .recommendations-btn {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.3);
      color: #ffffff;
    }

    .recommendations-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-3px);
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .movies-grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 1.5rem;
      }

      .watchlist-stats {
        gap: 1rem;
      }

      .stat-card {
        min-width: 140px;
      }
    }

    @media (max-width: 768px) {
      .watchlist-header {
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

      .watchlist-main {
        padding: 1rem;
      }

      .hero-content {
        padding: 3rem 2rem;
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .hero-subtitle {
        font-size: 1rem;
      }

      .watchlist-stats {
        flex-direction: column;
        align-items: center;
      }

      .stat-card {
        width: 100%;
        max-width: 300px;
      }

      .grid-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .grid-title {
        font-size: 1.5rem;
      }

      .movies-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
      }

      .empty-actions {
        flex-direction: column;
        align-items: center;
      }
    }

    @media (max-width: 480px) {
      .watchlist-header {
        padding: 1rem;
      }

      .hero-content {
        padding: 2rem 1rem;
      }

      .hero-title {
        font-size: 2rem;
      }

      .movies-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class WatchlistComponent {
  private readonly auth = inject(AuthService);
  private readonly watchlistService = inject(WatchlistService);
  private readonly toastService = inject(ToastService);
  private readonly movieService = inject(MovieService);

  movies = signal<WatchlistMovie[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  sortOrder = signal<'date' | 'title'>('date');

  // Video player signals
  videoPlayerVisible = signal(false);
  currentTrailerUrl = signal<string | undefined>(undefined);
  currentTrailerTitle = signal<string>('');

  particles: number[] = new Array(10).fill(0);

  constructor() {
    this.loadWatchlist();
  }

  loadWatchlist() {
    const user = this.auth.currentUserValue;
    if (!user) {
      this.toastService.show('You must be logged in to view your watchlist.', 'error');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.watchlistService.getWatchlist(user.id).subscribe({
      next: (movies: WatchlistMovie[]) => {
        this.movies.set(movies);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('[Watchlist] Error:', err);
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Failed to load watchlist');
      }
    });
  }

  sortedMovies() {
    const movies = this.movies();
    return [...movies].sort((a, b) => {
      if (this.sortOrder() === 'title') {
        return a.title.localeCompare(b.title);
      } else {
        // Sort by date added (assuming newer items have higher IDs or we can use index)
        return 0; // For now, keep original order
      }
    });
  }

  toggleSort() {
    this.sortOrder.set(this.sortOrder() === 'date' ? 'title' : 'date');
  }

  remove(movieId: string) {
    const user = this.auth.currentUserValue;
    if (!user) return;

    this.watchlistService.remove(user.id, movieId).subscribe({
      next: () => {
        this.movies.set(this.movies().filter(m => m.movieId !== movieId));
        this.toastService.show('Removed from watchlist!', 'success');
      },
      error: err => {
        this.toastService.show(err?.error?.message || 'Failed to remove from watchlist.', 'error');
      }
    });
  }

  playTrailer(movie: WatchlistMovie) {
    // Try to open trailer: fetch full movie details to get trailerUrl
    this.movieService.getById(movie.movieId).subscribe({
      next: m => {
        const url = (m?.trailerUrl || '').trim();
        if (!url) {
          this.toastService.show('No trailer available for this movie.', 'info');
          return;
        }
        this.currentTrailerUrl.set(url);
        this.currentTrailerTitle.set(m.title || movie.title || '');
        this.videoPlayerVisible.set(true);
      },
      error: err => {
        console.error('[Watchlist] Failed to load movie details for trailer:', err);
        this.toastService.show('Failed to load trailer.', 'error');
      }
    });
  }

  rateMovie(movie: WatchlistMovie) {
    // Parameter is intentionally unused - placeholder for future rating feature
    console.log('Rating requested for:', movie.title);
    this.toastService.show('Rating feature available on movie details page!', 'info');
  }

  shareMovie(movie: WatchlistMovie) {
    const shareUrl = `${globalThis.location.origin}/share/${movie.movieId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      this.toastService.show('Share link copied to clipboard!', 'success');
    }).catch(() => {
      this.toastService.show('Failed to copy share link.', 'error');
    });
  }

  closeTrailer() {
    this.videoPlayerVisible.set(false);
    this.currentTrailerUrl.set(undefined);
    this.currentTrailerTitle.set('');
  }

  trackByMovieId(index: number, item: WatchlistMovie): string {
    return item.movieId;
  }

  getYear(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    return date.getFullYear().toString();
  }

  getTotalWatchTime(): string {
    // Mock calculation - in real app, this would be based on movie durations
    const count = this.movies().length;
    const avgDuration = 120; // minutes
    const totalMinutes = count * avgDuration;
    const hours = Math.floor(totalMinutes / 60);
    return `${hours}h`;
  }

  getAverageRating(): string {
    const movies = this.movies();
    if (movies.length === 0) return '0.0';

    const totalRating = movies.reduce((sum, movie) => sum + (movie.averageRating || 0), 0);
    const avgRating = totalRating / movies.length;
    return avgRating.toFixed(1);
  }
}
