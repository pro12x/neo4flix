import { Component, inject, signal, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieService } from '../../services/movies';
import { Movie } from '../../models/movie.model';
import { AuthService } from '../../services/auth';
import { WatchlistService } from '../../services/watchlist';
import { ToastService } from '../../services/toast.service';
import { VideoPlayerComponent } from '../share/video-player';
import { MovieCardComponent } from '../share/movie-card';

type BrowseSectionKey = 'trending' | 'topRated' | 'action' | 'comedy' | 'drama' | 'sciFi' | 'horror' | 'romance';

interface BrowseSection {
  key: BrowseSectionKey;
  title: string;
  query: { genre?: string; sort?: 'rating' | 'date'; minRating?: number };
  items: ReturnType<typeof signal<Movie[]>>;
  loading: ReturnType<typeof signal<boolean>>;
  error: ReturnType<typeof signal<string | null>>;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, VideoPlayerComponent, MovieCardComponent],
  template: `
    <div class="page-container">
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

      <header class="main-header" [class.scrolled]="isScrolled()">
        <div class="logo" routerLink="/">
          <span class="logo-text">NEO4FLIX</span>
          <div class="logo-glow"></div>
        </div>
        <nav class="main-nav" [class.open]="menuOpen()">
          <a routerLink="/recommendations" (click)="closeMenu()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
            </svg>
            Recommendations
          </a>
          <a routerLink="/ratings" (click)="closeMenu()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
            </svg>
            My Ratings
          </a>
          <a routerLink="/watchlist" (click)="closeMenu()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2M7 7h10"/>
            </svg>
            Watchlist
          </a>
          <a routerLink="/profile" (click)="closeMenu()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Profile
          </a>
        </nav>
        <div class="user-actions">
          <a routerLink="/search" class="search-icon" (click)="closeMenu()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </a>
          <button class="logout-button" (click)="logout()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
        <button class="hamburger" (click)="toggleMenu()" [class.open]="menuOpen()">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      <main class="content">
        <!-- Hero Section Immersive -->
        <section class="hero-section" *ngIf="featuredMovie() as fm">
          <div class="hero-background-container">
            <img [src]="fm.poster" alt="Featured movie poster" class="hero-background">
            <div class="hero-gradient"></div>
            <div class="hero-particles">
              <div class="hero-particle" *ngFor="let _ of heroParticles"></div>
            </div>
          </div>

          <div class="hero-content">
            <div class="hero-badge">
              <span class="badge-text">Featured Movie</span>
              <div class="badge-glow"></div>
            </div>

            <h1 class="hero-title">{{ fm.title }}</h1>
            <p class="hero-plot">{{ fm.plot }}</p>

            <div class="hero-meta">
              <div class="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                <span>{{ getYear(fm.releaseDate) }}</span>
              </div>
              <div class="meta-item" *ngIf="fm.genres.length">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
                <span>{{ fm.genres.join(', ') }}</span>
              </div>
              <div class="meta-item" *ngIf="fm.averageRating">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
                <span>{{ fm.averageRating.toFixed(1) }}</span>
              </div>
            </div>

            <div class="hero-actions">
              <button type="button" class="btn btn-primary" (click)="playTrailer(fm); $event.stopPropagation()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"></path>
                </svg>
                <span>Play Trailer</span>
                <div class="btn-ripple"></div>
              </button>
              <a [routerLink]="['/movie', fm.id]" class="btn btn-secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
                <span>More Info</span>
              </a>
              <button type="button" class="btn-watchlist" (click)="addToWatchlist(fm.id); $event.stopPropagation()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10"/>
                </svg>
              </button>
            </div>
          </div>
        </section>

        <!-- Movie Carousels -->
        <section class="movie-carousel" *ngFor="let section of sections">
          <div class="carousel-header">
            <h2 class="carousel-title">{{ section.title }}</h2>
            <div class="carousel-status" *ngIf="section.loading()">
              <div class="loading-spinner"></div>
              <span>Loading...</span>
            </div>
            <div class="carousel-status error" *ngIf="section.error()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <span>{{ section.error() }}</span>
            </div>
          </div>

          <div class="carousel-wrapper">
            <button class="nav-btn nav-left" type="button" (click)="scrollCarousel(section.key, -1)" aria-label="Scroll left">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>

            <div class="carousel-container" [attr.data-carousel]="section.key">
              <app-movie-card
                *ngFor="let m of section.items()"
                [movie]="m"
                [isInWatchlist]="isInWatchlist(m.id)"
                (played)="playTrailer(m)"
                (watchlistAdd)="addToWatchlist(m.id)"
                (watchlistRemove)="removeFromWatchlist(m.id)">
              </app-movie-card>

              <div class="skeleton" *ngIf="section.loading() && section.items().length === 0">
                <div class="skeleton-card" *ngFor="let _ of skeletonItems"></div>
              </div>
            </div>

            <button class="nav-btn nav-right" type="button" (click)="scrollCarousel(section.key, 1)" aria-label="Scroll right">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        </section>
      </main>

      <app-video-player
        *ngIf="videoPlayerVisible()"
        [videoUrl]="currentTrailerUrl() || undefined"
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

    .page-container {
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
    .main-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      padding: 1.5rem 4rem;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
    }

    .main-header.scrolled {
      background: rgba(0, 0, 0, 0.95);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .logo {
      position: relative;
      font-size: 2rem;
      font-weight: 700;
      color: #e50914;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-right: 3rem;
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

    .main-nav {
      display: flex;
      gap: 2rem;
      flex-grow: 1;
      align-items: center;
    }

    .main-nav a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      transition: all 0.3s ease;
      position: relative;
    }

    .main-nav a:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.1);
    }

    .main-nav a svg {
      width: 18px;
      height: 18px;
    }

    .user-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .search-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      color: #ffffff;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .search-icon:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }

    .logout-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, #e50914, #b20710);
      color: #ffffff;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 10px rgba(229, 9, 20, 0.3);
    }

    .logout-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(229, 9, 20, 0.4);
    }

    .hamburger {
      display: none;
      flex-direction: column;
      gap: 4px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
    }

    .hamburger span {
      width: 24px;
      height: 2px;
      background: #ffffff;
      transition: all 0.3s ease;
    }

    .hamburger.open span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .hamburger.open span:nth-child(2) {
      opacity: 0;
    }

    .hamburger.open span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }

    /* Content */
    .content {
      padding-top: 80px;
      position: relative;
      z-index: 5;
    }

    /* Hero Section */
    .hero-section {
      position: relative;
      padding-top: 7vh;
      height: 93vh;
      display: flex;
      justify-content: center;
      overflow: hidden;
    }

    .hero-background-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    .hero-background {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(0.4) blur(2px);
      transform: scale(1.1);
      transition: transform 0.5s ease;
    }

    .hero-gradient {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        135deg,
        rgba(0, 0, 0, 0.7) 0%,
        rgba(20, 20, 40, 0.5) 50%,
        rgba(0, 0, 0, 0.8) 100%
      );
    }

    .hero-particles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .hero-particle {
      position: absolute;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      animation: heroParticleFloat 20s infinite linear;
    }

    .hero-particle:nth-child(1) { width: 6px; height: 6px; left: 20%; animation-delay: 0s; }
    .hero-particle:nth-child(2) { width: 4px; height: 4px; left: 40%; animation-delay: 5s; }
    .hero-particle:nth-child(3) { width: 8px; height: 8px; left: 60%; animation-delay: 10s; }
    .hero-particle:nth-child(4) { width: 5px; height: 5px; left: 80%; animation-delay: 15s; }

    @keyframes heroParticleFloat {
      0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 0.8;
      }
      90% {
        opacity: 0.8;
      }
      100% {
        transform: translateY(-100px) rotate(360deg);
        opacity: 0;
      }
    }

    .hero-content {
      position: relative;
      z-index: 3;
      max-width: 800px;
      text-align: center;
      color: #ffffff;
      animation: heroFadeIn 1.5s ease-out 0.5s both;
    }

    @keyframes heroFadeIn {
      from {
        transform: translateY(50px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .hero-badge {
      position: relative;
      display: inline-block;
      margin-bottom: 1rem;
    }

    .badge-text {
      background: linear-gradient(45deg, #e50914, #b20710);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .badge-glow {
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, #e50914, #b20710);
      border-radius: 4px;
      opacity: 0.3;
      z-index: -1;
      filter: blur(6px);
    }

    .hero-title {
      font-size: clamp(3rem, 8vw, 5rem);
      font-weight: 900;
      margin-bottom: 1rem;
      line-height: 1.1;
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

    .hero-plot {
      font-size: clamp(1.1rem, 2.5vw, 1.4rem);
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 2rem;
      line-height: 1.6;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .hero-meta {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 3rem;
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.95rem;
      font-weight: 500;
    }

    .meta-item svg {
      color: #e50914;
    }

    .hero-actions {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 2rem;
      border-radius: 12px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      position: relative;
      overflow: hidden;
      border: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #e50914, #b20710);
      color: #ffffff;
      box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(229, 9, 20, 0.5);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
      border: 2px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
    }

    .btn-watchlist {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
      border: 2px solid rgba(255, 255, 255, 0.3);
      padding: 1rem;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    .btn-watchlist:hover {
      background: rgba(229, 9, 20, 0.2);
      border-color: #e50914;
      transform: scale(1.1);
    }

    .btn-ripple {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .btn:active .btn-ripple {
      width: 300px;
      height: 300px;
    }

    .hero-scroll {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255, 255, 255, 0.6);
      animation: bounce 2s infinite;
      z-index: 4;
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateX(-50%) translateY(0);
      }
      40% {
        transform: translateX(-50%) translateY(-10px);
      }
      60% {
        transform: translateX(-50%) translateY(-5px);
      }
    }

    .scroll-mouse {
      width: 24px;
      height: 36px;
      border: 2px solid rgba(255, 255, 255, 0.6);
      border-radius: 12px;
      position: relative;
    }

    .scroll-wheel {
      width: 4px;
      height: 8px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 2px;
      position: absolute;
      top: 6px;
      left: 50%;
      transform: translateX(-50%);
      animation: scrollWheel 2s infinite;
    }

    @keyframes scrollWheel {
      0% {
        transform: translateX(-50%) translateY(0);
        opacity: 0;
      }
      50% {
        transform: translateX(-50%) translateY(8px);
        opacity: 1;
      }
      100% {
        transform: translateX(-50%) translateY(16px);
        opacity: 0;
      }
    }

    .hero-scroll span {
      font-size: 0.8rem;
      font-weight: 300;
    }

    /* Movie Carousels */
    .movie-carousel {
      padding: 4rem 0;
      animation: carouselFadeIn 1s ease-out both;
    }

    .movie-carousel:nth-child(2) { animation-delay: 0.2s; }
    .movie-carousel:nth-child(3) { animation-delay: 0.4s; }
    .movie-carousel:nth-child(4) { animation-delay: 0.6s; }
    .movie-carousel:nth-child(5) { animation-delay: 0.8s; }
    .movie-carousel:nth-child(6) { animation-delay: 1s; }
    .movie-carousel:nth-child(7) { animation-delay: 1.2s; }
    .movie-carousel:nth-child(8) { animation-delay: 1.4s; }
    .movie-carousel:nth-child(9) { animation-delay: 1.6s; }

    @keyframes carouselFadeIn {
      from {
        transform: translateY(30px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .carousel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding: 0 4rem;
    }

    .carousel-title {
      font-size: 2rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
      background: linear-gradient(45deg, #ffffff, #e0e7ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .carousel-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
    }

    .carousel-status.error {
      color: #ff6b6b;
    }

    .loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: #e50914;
      animation: spin 1s linear infinite;
    }

    .carousel-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
      width: 50px;
      height: 50px;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      color: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      opacity: 0;
    }

    .carousel-wrapper:hover .nav-btn {
      opacity: 1;
    }

    .nav-btn:hover {
      background: rgba(229, 9, 20, 0.2);
      border-color: #e50914;
      transform: translateY(-50%) scale(1.1);
    }

    .nav-left {
      left: 1rem;
    }

    .nav-right {
      right: 1rem;
    }

    .carousel-container {
      display: flex;
      width: 100%;
      gap: 1rem;
      padding: 0 4rem;
      overflow-x: auto;
      scroll-behavior: smooth;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .carousel-container::-webkit-scrollbar {
      display: none;
    }

    .skeleton {
      display: flex;
      gap: 1rem;
    }

    .skeleton-card {
      width: 200px;
      height: 300px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      animation: skeletonPulse 1.5s ease-in-out infinite;
    }

    @keyframes skeletonPulse {
      0%, 100% {
        opacity: 0.5;
      }
      50% {
        opacity: 0.8;
      }
    }

    /* Mobile Responsive */
    @media (max-width: 1024px) {
      .hero-meta {
        gap: 1rem;
      }

      .hero-actions {
        gap: 0.75rem;
      }

      .btn {
        padding: 0.875rem 1.5rem;
        font-size: 1rem;
      }
    }

    @media (max-width: 768px) {
      .main-header {
        padding: 1rem 2rem;
      }

      .logo {
        font-size: 1.5rem;
        margin-right: 1rem;
      }

      .main-nav {
        display: none;
      }

      .main-nav.open {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(20px);
        flex-direction: column;
        padding: 2rem;
        gap: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
      }

      .hamburger {
        display: flex;
      }

      .content {
        padding-top: 70px;
      }

      .hero-section {
        height: 90vh;
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .hero-plot {
        font-size: 1rem;
      }

      .hero-meta {
        flex-direction: column;
        gap: 0.5rem;
      }

      .hero-actions {
        flex-direction: column;
        gap: 0.75rem;
      }

      .carousel-header {
        padding: 0 2rem;
      }

      .carousel-title {
        font-size: 1.5rem;
      }

      .carousel-container {
        padding: 0 2rem;
      }

      .nav-btn {
        width: 40px;
        height: 40px;
      }

      .nav-btn svg {
        width: 20px;
        height: 20px;
      }
    }

    @media (max-width: 480px) {
      .main-header {
        padding: 1rem;
      }

      .hero-content {
        padding: 0 1rem;
      }

      .hero-title {
        font-size: 2rem;
      }

      .hero-plot {
        font-size: 0.95rem;
      }

      .carousel-header {
        padding: 0 1rem;
      }

      .carousel-container {
        padding: 0 1rem;
      }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly movieService = inject(MovieService);
  private readonly auth = inject(AuthService);
  private readonly watchlistService = inject(WatchlistService);
  private readonly toastService = inject(ToastService);

  featuredMovie = signal<Movie | null>(null);
  isScrolled = signal(false);
  menuOpen = signal(false);

  // UI helpers
  skeletonItems = Array.from({ length: 10 }, (_, i) => i);

  // Netflix-like dynamic sections
  sections: BrowseSection[] = [
    { key: 'trending', title: 'Trending Now', query: { sort: 'date' }, items: signal<Movie[]>([]), loading: signal(false), error: signal(null) },
    { key: 'topRated', title: 'Top Rated', query: { sort: 'rating' }, items: signal<Movie[]>([]), loading: signal(false), error: signal(null) },
    { key: 'action', title: 'Action', query: { genre: 'Action', sort: 'rating' }, items: signal<Movie[]>([]), loading: signal(false), error: signal(null) },
    { key: 'comedy', title: 'Comedy', query: { genre: 'Comedy', sort: 'rating' }, items: signal<Movie[]>([]), loading: signal(false), error: signal(null) },
    { key: 'drama', title: 'Drama', query: { genre: 'Drama', sort: 'rating' }, items: signal<Movie[]>([]), loading: signal(false), error: signal(null) },
    { key: 'sciFi', title: 'Sci-Fi', query: { genre: 'Science Fiction', sort: 'rating' }, items: signal<Movie[]>([]), loading: signal(false), error: signal(null) },
    { key: 'horror', title: 'Horror', query: { genre: 'Horror', sort: 'rating' }, items: signal<Movie[]>([]), loading: signal(false), error: signal(null) },
    { key: 'romance', title: 'Romance', query: { genre: 'Romance', sort: 'rating' }, items: signal<Movie[]>([]), loading: signal(false), error: signal(null) },
  ];

  videoPlayerVisible = signal(false);
  currentTrailerUrl = signal<string | undefined>(undefined);
  currentTrailerTitle = signal<string>('');

  particles: number[] = new Array(10).fill(0);
  heroParticles: number[] = new Array(4).fill(0);

  // Track watchlist movie IDs
  watchlistMovieIds = signal<Set<string>>(new Set());

  constructor() {
    this.loadAllSections();
    window.addEventListener('scroll', this.onWindowScroll, true);
  }

  ngOnInit(): void {
    this.loadWatchlist();
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onWindowScroll, true);
  }

  onWindowScroll = () => {
    this.isScrolled.set(window.scrollY > 10);
  }

  private loadAllSections() {
    for (const section of this.sections) {
      this.loadSection(section);
    }
  }

  private loadSection(section: BrowseSection) {
    section.loading.set(true);
    section.error.set(null);

    console.log(`[Home] Loading section "${section.title}" with query:`, section.query);

    this.movieService.searchPaged({
      title: undefined,
      genre: section.query.genre,
      minRating: section.query.minRating,
      sort: section.query.sort,
      page: 0,
      size: 20,
    }).subscribe({
      next: res => {
        const items = res?.items || [];
        const withTrailers = items.filter(m => m.trailerUrl?.trim()).length;
        console.log(`[Home] Section "${section.title}" loaded ${items.length} movies (${withTrailers} with trailers)`);

        if (items.length > 0 && withTrailers === 0) {
          console.warn(`[Home] ⚠️  Section "${section.title}" has ${items.length} movies but NONE have trailerUrl!`);
        }

        section.items.set(items);
        section.loading.set(false);

        // Choose featured movie from trending section if possible
        if (section.key === 'trending' && items.length > 0 && !this.featuredMovie()) {
          const pick = items[Math.floor(Math.random() * Math.min(items.length, 6))];
          this.featuredMovie.set(pick);
        }
      },
      error: err => {
        console.error(`[Home] Error loading section "${section.title}":`, err);
        section.loading.set(false);
        section.error.set(err?.error?.message || `Failed to load ${section.title}`);
      }
    });
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

  scrollCarousel(key: BrowseSectionKey, direction: -1 | 1) {
    const container = document.querySelector(`[data-carousel="${key}"]`) as HTMLElement;
    if (!container) return;

    // Calculate 90% of the visible width of the container
    const scrollAmount = Math.round(container.clientWidth * 0.9);
    container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
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

  logout() {
    this.auth.logout();
  }

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  getYear(date: string | Date): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (Number.isNaN(dateObj.getTime())) return '';
    return dateObj.getFullYear().toString();
  }

  isInWatchlist(movieId: string): boolean {
    return this.watchlistMovieIds().has(movieId);
  }
}
