import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecommendationService } from '../../services/recommendations';
import { AuthService } from '../../services/auth';
import { MovieRecommendation } from '../../models/movie.model';
import { ToastService } from '../../services/toast.service';
import { VideoPlayerComponent } from '../share/video-player';
import { MovieService } from '../../services/movies';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule, RouterModule, VideoPlayerComponent],
  template: `
    <div class="recommendations-container">
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
      <header class="recommendations-header">
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
      <main class="recommendations-main">
        <!-- Hero Section -->
        <section class="recommendations-hero">
          <div class="hero-background">
            <div class="hero-gradient"></div>
            <div class="hero-pattern"></div>
          </div>

          <div class="hero-content">
            <div class="hero-title-section">
              <h1 class="hero-title">
                <span class="title-text">Personalized</span>
                <span class="title-highlight">Recommendations</span>
              </h1>
              <p class="hero-subtitle">Discover movies tailored just for you based on your ratings and preferences</p>
            </div>

            <!-- Recommendation Modes -->
            <div class="recommendation-modes">
              <div class="mode-tabs">
                <button
                  class="mode-tab"
                  [class.active]="activeMode() === 'mixed'"
                  (click)="load('mixed')"
                  [disabled]="loading()"
                >
                  <div class="tab-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
                    </svg>
                  </div>
                  <div class="tab-content">
                    <div class="tab-title">For You</div>
                    <div class="tab-description">Mixed recommendations</div>
                  </div>
                </button>

                <button
                  class="mode-tab"
                  [class.active]="activeMode() === 'trending'"
                  (click)="load('trending')"
                  [disabled]="loading()"
                >
                  <div class="tab-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                  </div>
                  <div class="tab-content">
                    <div class="tab-title">Trending</div>
                    <div class="tab-description">Popular right now</div>
                  </div>
                </button>

                <button
                  class="mode-tab"
                  [class.active]="activeMode() === 'collaborative'"
                  (click)="load('collaborative')"
                  [disabled]="loading()"
                >
                  <div class="tab-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <div class="tab-content">
                    <div class="tab-title">Similar Users</div>
                    <div class="tab-description">What others liked</div>
                  </div>
                </button>

                <button
                  class="mode-tab"
                  [class.active]="activeMode() === 'content'"
                  (click)="load('content')"
                  [disabled]="loading()"
                >
                  <div class="tab-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                    </svg>
                  </div>
                  <div class="tab-content">
                    <div class="tab-title">Similar Movies</div>
                    <div class="tab-description">Based on your ratings</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Recommendations Results -->
        <section class="results-section">
          <!-- Loading State -->
          <div class="loading-state" *ngIf="loading()">
            <div class="loading-animation">
              <div class="loading-circle"></div>
              <div class="loading-circle"></div>
              <div class="loading-circle"></div>
            </div>
            <h3 class="loading-title">Finding your perfect matches...</h3>
            <p class="loading-subtitle">Analyzing your preferences to curate the best recommendations</p>
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
            <h3 class="error-title">Unable to load recommendations</h3>
            <p class="error-message">{{ error() }}</p>
            <button class="retry-button" (click)="load(activeMode())">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23,4 23,10 17,10"/>
                <polyline points="1,20 1,14 7,14"/>
                <path d="M20.49,9A9,9,0,0,0,5.64,5.64L1,10m22,4l-4.64,4.36A9,9,0,0,1,3.51,15"/>
              </svg>
              Try Again
            </button>
          </div>

          <!-- Results Grid -->
          <div class="recommendations-grid" *ngIf="!loading() && recos().length > 0">
            <div class="grid-header">
              <h2 class="grid-title">
                <span class="title-count">{{ recos().length }}</span>
                <span class="title-text">recommendations found</span>
              </h2>
              <div class="grid-info">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                <span>Updated just for you</span>
              </div>
            </div>

            <div class="movie-grid">
              <div class="movie-card" *ngFor="let r of recos(); trackBy: trackByMovieId">
                <div class="card-poster">
                  <a [routerLink]="['/movie', r.movie.id]">
                    <img [src]="r.movie.poster" [alt]="r.movie.title" class="poster-img">
                  </a>
                  <div class="poster-overlay">
                    <button class="play-btn" (click)="playTrailer(r.movie); $event.stopPropagation()">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="card-content">
                  <a [routerLink]="['/movie', r.movie.id]" class="card-link">
                    <h3 class="movie-title">{{ r.movie.title }}</h3>
                  </a>

                  <div class="movie-meta">
                    <div class="meta-row">
                      <span class="year" *ngIf="r.movie.releaseDate">{{ getYear(r.movie.releaseDate) }}</span>
                      <span class="rating" *ngIf="r.movie.averageRating">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                        </svg>
                        {{ r.movie.averageRating.toFixed(1) }}
                      </span>
                    </div>

                    <div class="genres" *ngIf="r.movie.genres.length">
                      <span class="genre" *ngFor="let genre of r.movie.genres.slice(0, 2)">{{ genre }}</span>
                    </div>
                  </div>

                  <div class="card-actions">
                    <button class="action-btn share-btn" (click)="copyShareLink(r.movie.id); $event.preventDefault(); $event.stopPropagation();">
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

          <!-- Video Player Modal -->
          <app-video-player
            *ngIf="videoPlayerVisible()"
            [videoUrl]="currentTrailerUrl()"
            [movieTitle]="currentTrailerTitle()"
            (closed)="closeTrailer()">
          </app-video-player>

          <!-- Empty State -->
          <div class="empty-state" *ngIf="!loading() && recos().length === 0 && !error()">
            <div class="empty-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
              </svg>
            </div>
            <h3 class="empty-title">No recommendations yet</h3>
            <p class="empty-message">Rate some movies to get personalized recommendations tailored just for you</p>
            <a routerLink="/ratings" class="rate-movies-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
              <span>Rate Movies</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      overflow-x: hidden;
      background: #000000;
    }

    .recommendations-container {
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
    .recommendations-header {
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
    .recommendations-main {
      position: relative;
      z-index: 5;
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Hero Section */
    .recommendations-hero {
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

    /* Recommendation Modes */
    .recommendation-modes {
      margin-top: 3rem;
    }

    .mode-tabs {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .mode-tab {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem 2rem;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 200px;
      text-align: left;
    }

    .mode-tab:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(229, 9, 20, 0.3);
      transform: translateY(-3px);
    }

    .mode-tab.active {
      background: linear-gradient(135deg, rgba(229, 9, 20, 0.2), rgba(178, 7, 16, 0.2));
      border-color: #e50914;
      color: #ffffff;
    }

    .mode-tab:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .tab-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #e50914, #b20710);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      flex-shrink: 0;
    }

    .tab-content {
      flex: 1;
    }

    .tab-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .tab-description {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.6);
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

    /* Loading State */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 6rem 2rem;
      text-align: center;
    }

    .loading-animation {
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
    .recommendations-grid {
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

    .grid-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
    }

    .movie-grid {
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
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .movie-card:hover .poster-overlay {
      opacity: 1;
    }

    .play-btn {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(135deg, #e50914, #b20710);
      color: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);
      transition: all 0.3s ease;
    }

    .play-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(229, 9, 20, 0.5);
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
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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

    .recommendation-reason {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: linear-gradient(135deg, rgba(229, 9, 20, 0.1), rgba(178, 7, 16, 0.1));
      border: 1px solid rgba(229, 9, 20, 0.2);
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .reason-icon {
      color: #e50914;
      flex-shrink: 0;
    }

    .reason-text {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.9);
      font-style: italic;
    }

    .movie-plot {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.6);
      line-height: 1.4;
      margin-bottom: 1rem;
    }

    .card-actions {
      display: flex;
      justify-content: flex-end;
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

    .rate-movies-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #e50914, #b20710);
      color: #ffffff;
      text-decoration: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);
    }

    .rate-movies-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(229, 9, 20, 0.5);
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .movie-grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 1.5rem;
      }

      .mode-tabs {
        gap: 0.75rem;
      }

      .mode-tab {
        min-width: 180px;
        padding: 1.25rem 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .recommendations-header {
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

      .recommendations-main {
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

      .mode-tabs {
        flex-direction: column;
        align-items: center;
      }

      .mode-tab {
        width: 100%;
        max-width: 400px;
      }

      .grid-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .grid-title {
        font-size: 1.5rem;
      }

      .movie-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
      }
    }

    @media (max-width: 480px) {
      .recommendations-header {
        padding: 1rem;
      }

      .hero-content {
        padding: 2rem 1rem;
      }

      .hero-title {
        font-size: 2rem;
      }

      .mode-tab {
        padding: 1rem;
        gap: 0.75rem;
      }

      .tab-icon {
        width: 40px;
        height: 40px;
      }

      .tab-title {
        font-size: 1rem;
      }

      .tab-description {
        font-size: 0.8rem;
      }

      .movie-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RecommendationsComponent {
  private readonly recService = inject(RecommendationService);
  private readonly auth = inject(AuthService);
  private readonly movieService = inject(MovieService);
  private readonly toastService = inject(ToastService);

  // Video player signals
  videoPlayerVisible = signal(false);
  currentTrailerUrl = signal<string | undefined>(undefined);
  currentTrailerTitle = signal<string>('');

  // active mode for tabs
  activeMode = signal<'mixed' | 'trending' | 'collaborative' | 'content'>('mixed');

  recos = signal<MovieRecommendation[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  particles: number[] = new Array(10).fill(0);

  constructor() {
    this.load('mixed');
  }

  load(mode: 'mixed' | 'trending' | 'collaborative' | 'content') {
    this.activeMode.set(mode);
    this.loading.set(true);
    this.error.set(null);
    const user = this.auth.currentUserValue;
    const uid = user?.id || '';
    this.recService.getRecommendations(uid, mode).subscribe({
      next: res => {
        this.recos.set(res || []);
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Failed to load recommendations');
      }
    });
  }

  trackByMovieId(index: number, item: MovieRecommendation) {
    return item.movie.id;
  }

  playTrailer(movie: any) {
    const rawUrl = (movie.trailerUrl || '').trim();
    if (rawUrl) {
      this.currentTrailerUrl.set(rawUrl);
      this.currentTrailerTitle.set(movie.title || '');
      this.videoPlayerVisible.set(true);
      return;
    }

    // If the recommendation's movie payload doesn't include trailerUrl, fetch full movie details
    const id = movie.id || movie.movieId || movie.movie?.id;
    if (!id) {
      this.toastService.show('No trailer available for this movie.', 'info');
      return;
    }

    this.movieService.getById(id).subscribe({
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
        // Removed console logging for privacy
        this.toastService.show('Failed to load trailer.', 'error');
      }
    });
  }

  closeTrailer() {
    this.videoPlayerVisible.set(false);
    this.currentTrailerUrl.set(undefined);
    this.currentTrailerTitle.set('');
  }

  copyShareLink(movieId: string) {
    const shareUrl = `${globalThis.location.origin}/share/${movieId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      this.toastService.show('Share link copied to clipboard!', 'success');
    }).catch(() => {
      this.toastService.show('Failed to copy share link.', 'error');
    });
  }

  getYear(date: string | Date): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (Number.isNaN(dateObj.getTime())) return '';
    return dateObj.getFullYear().toString();
  }
}
