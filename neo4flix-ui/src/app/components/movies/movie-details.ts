import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movies';
import { RatingService } from '../../services/ratings';
import { AuthService } from '../../services/auth';
import { WatchlistService } from '../../services/watchlist';
import { Movie } from '../../models/movie.model';
import { ToastService } from '../../services/toast.service';
import { VideoPlayerComponent } from '../share/video-player';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterModule, VideoPlayerComponent, FormsModule],
  template: `
    <div class="movie-details-container">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-backdrop">
          <img [src]="movie()?.poster" alt="Movie backdrop" class="hero-backdrop-img" *ngIf="movie()?.poster">
          <div class="hero-overlay"></div>
        </div>

        <div class="hero-content">
          <div class="hero-main">
            <div class="movie-poster-large">
              <img [src]="movie()?.poster" [alt]="m.title" class="poster-img" *ngIf="movie() as m">
            </div>

            <div class="movie-info">
              <h1 class="movie-title" *ngIf="movie() as m">{{ m.title }}</h1>

              <div class="movie-meta">
                <div class="meta-row">
                  <span class="match-score">98% Match</span>
                  <span class="year" *ngIf="movie() as m">{{ getYear(m.releaseDate) }}</span>
                  <span class="maturity-rating">TV-MA</span>
                  <span class="duration">2h 15m</span>
                </div>

                <div class="genres-row" *ngIf="(movie() | json) !== 'null' && movie()?.genres?.length">
                  <span class="genre" *ngFor="let genre of movie()?.genres">{{ genre }}</span>
                </div>
              </div>

              <div class="movie-rating-display" *ngIf="avgRating() !== null">
                <div class="rating-stars">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                  <span class="rating-value">{{ avgRating()!.toFixed(1) }}</span>
                </div>
              </div>

              <div class="movie-synopsis" *ngIf="movie() as m">
                <p>{{ m.plot }}</p>
              </div>

              <div class="action-buttons">
                <button class="play-btn" (click)="playVideo()" *ngIf="movie()?.trailerUrl">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Play
                </button>

                <button class="my-list-btn" (click)="toggleWatchlist()" [disabled]="watchlistBusy()">
                  <svg *ngIf="!inWatchlist()" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14m-7-7h14"/>
                  </svg>
                  <svg *ngIf="inWatchlist()" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 13l4 4L19 7"/>
                  </svg>
                  {{ inWatchlist() ? 'My List' : '+ My List' }}
                </button>

                <button class="share-btn" (click)="shareMovie()">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                    <polyline points="16,6 12,2 8,6"/>
                    <line x1="12" y1="2" x2="12" y2="15"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Sections -->
      <div class="content-sections">
        <!-- Cast & Crew -->
        <section class="cast-section">
          <h2>Cast</h2>
          <div class="cast-list">
            <div class="cast-member" *ngFor="let actor of ['Actor 1', 'Actor 2', 'Actor 3', 'Actor 4', 'Actor 5']">
              <div class="cast-avatar">
                <span>{{ actor.split(' ')[0][0] }}{{ actor.split(' ')[1][0] }}</span>
              </div>
              <div class="cast-info">
                <div class="cast-name">{{ actor }}</div>
                <div class="cast-role">Character Name</div>
              </div>
            </div>
          </div>
        </section>

        <!-- More Like This -->
        <section class="similar-section">
          <h2>More Like This</h2>
          <div class="similar-movies">
            <div class="similar-movie" *ngFor="let similarMovie of similarMovies()" [routerLink]="['/movies', similarMovie.id]">
              <img [src]="similarMovie.poster" [alt]="similarMovie.title" class="similar-poster">
              <div class="similar-overlay">
                <button class="play-small-btn" (click)="playVideoForMovie(similarMovie); $event.stopPropagation()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
              <div class="similar-info">
                <h4 class="similar-title">{{ similarMovie.title }}</h4>
                <div class="similar-meta">
                  <span class="similar-year">{{ getYear(similarMovie.releaseDate) }}</span>
                  <span class="similar-rating" *ngIf="similarMovie.averageRating">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                    </svg>
                    {{ similarMovie.averageRating.toFixed(1) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Details -->
        <section class="details-section">
          <h2>About <span *ngIf="movie() as m">{{ m.title }}</span></h2>
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">Director:</span>
              <span class="detail-value">Director Name</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Writers:</span>
              <span class="detail-value">Writer 1, Writer 2</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Genres:</span>
              <span class="detail-value" *ngIf="movie() as m">{{ m.genres.join(', ') }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">This movie is:</span>
              <span class="detail-value">Exciting, Action-packed</span>
            </div>
          </div>
        </section>

        <!-- Rate & Review -->
        <section class="rating-section">
          <div class="rating-card">
            <h2>Rate this movie</h2>
            <div class="rating-form">
              <div class="rating-input-group">
                <label>Your Rating:</label>
                <select [(ngModel)]="myRating" class="rating-select">
                  <option [value]="0">Select rating...</option>
                  <option *ngFor="let r of [1,2,3,4,5,6,7,8,9,10]" [value]="r/2">{{ r/2 }} stars</option>
                </select>
              </div>
              <div class="review-input-group">
                <label>Your Review (optional):</label>
                <textarea [(ngModel)]="myReview" placeholder="Share your thoughts about this movie..." rows="4" class="review-textarea"></textarea>
              </div>
              <button class="submit-rating-btn" (click)="submitRating()" [disabled]="saving() || !myRating()">
                {{ saving() ? 'Submitting...' : 'Submit Rating' }}
              </button>
            </div>
            <div class="rating-status" *ngIf="savedMsg()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
              </svg>
              {{ savedMsg() }}
            </div>
          </div>
        </section>
      </div>

      <!-- Navigation Header -->
      <header class="nav-header">
        <div class="nav-left">
          <button class="nav-btn back-btn" (click)="goBack()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <button class="nav-btn home-btn" routerLink="/">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
          </button>
        </div>
        <div class="nav-logo">
          <span>NEO4FLIX</span>
        </div>
        <div class="nav-right">
          <button class="nav-btn search-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
        </div>
      </header>

      <!-- Loading & Error States -->
      <div class="loading-state" *ngIf="loading()">
        <div class="spinner"></div>
        <p>Loading movie details...</p>
      </div>

      <div class="error-state" *ngIf="error()">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        <h2>Movie not found</h2>
        <p>{{ error() }}</p>
        <button class="btn-primary" routerLink="/">Go to Home</button>
      </div>

      <!-- Video Player Modal -->
      <app-video-player
        *ngIf="videoPlayerVisible()"
        [videoUrl]="movie()?.trailerUrl"
        [movieTitle]="movie()?.title || ''"
        (closed)="videoPlayerVisible.set(false)">
      </app-video-player>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        background-color: var(--background-color);
        min-height: 100vh;
      }
      .movie-details-container {
        position: relative;
        overflow: hidden;
      }
      .hero-section {
        position: relative;
        height: 70vh;
        display: flex;
        align-items: flex-end;
        padding: 2rem;
        background-color: rgba(0, 0, 0, 0.8);
      }
      .hero-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 100%;
        z-index: 1;
      }
      .hero-backdrop-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.3;
      }
      .hero-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 2;
      }
      .hero-content {
        position: relative;
        z-index: 3;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .hero-main {
        display: flex;
        gap: 2rem;
        flex-direction: column;
      }
      .movie-poster-large {
        flex: 0 0 300px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 10px 20px rgba(0,0,0,0.4);
      }
      .poster-img {
        width: 100%;
        height: auto;
        display: block;
      }
      .movie-info {
        flex: 1;
      }
      .movie-title {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0;
        color: var(--text-color);
      }
      .movie-meta {
        margin-bottom: 1.5rem;
        color: var(--text-color-secondary);
      }
      .meta-row {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .match-score {
        background-color: #4ade80;
        color: #000;
        padding: 0.2rem 0.6rem;
        border-radius: 4px;
        font-weight: 600;
      }
      .year {
        font-weight: 500;
      }
      .maturity-rating,
      .duration {
        font-size: 0.9rem;
        color: var(--text-color-secondary);
      }
      .genres-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }
      .genre {
        background-color: rgba(255, 255, 255, 0.1);
        color: var(--text-color);
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.9rem;
      }
      .movie-rating-display {
        margin-top: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .rating-stars {
        display: flex;
        align-items: center;
        gap: 0.2rem;
        color: #4ade80;
        font-weight: 700;
      }
      .rating-value {
        font-size: 1.2rem;
        font-weight: 500;
        color: var(--text-color);
      }
      .movie-synopsis {
        margin-top: 1rem;
        color: var(--text-color);
        line-height: 1.6;
      }
      .action-buttons {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
      }
      .play-btn,
      .my-list-btn,
      .share-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.8rem 1.5rem;
        border-radius: 4px;
        font-weight: 700;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.3s;
      }
      .play-btn {
        background-color: var(--primary-color);
        color: var(--text-color);
      }
      .play-btn:hover {
        background-color: #4ade80;
      }
      .my-list-btn {
        background-color: rgba(255, 255, 255, 0.1);
        color: var(--text-color);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
      .my-list-btn:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
      .share-btn {
        background-color: transparent;
        color: var(--text-color);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
      .share-btn:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
      .content-sections {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        padding: 4rem 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }
      .cast-section,
      .similar-section,
      .details-section,
      .rating-section {
        background-color: rgba(0,0,0,0.3);
        padding: 2rem;
        border-radius: 8px;
      }
      h2 {
        margin-bottom: 1.5rem;
        color: var(--text-color);
        font-size: 1.8rem;
        position: relative;
      }
      h2:after {
        content: '';
        position: absolute;
        width: 100%;
        height: 2px;
        bottom: -0.5rem;
        left: 0;
        background: linear-gradient(to right, transparent, #4ade80, transparent);
      }
      .cast-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 1rem;
      }
      .cast-member {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .cast-avatar {
        width: 40px;
        height: 40px;
        background-color: #4ade80;
        color: #000;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        font-weight: 500;
      }
      .cast-info {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }
      .cast-name {
        font-weight: 500;
        color: var(--text-color);
      }
      .cast-role {
        font-size: 0.9rem;
        color: var(--text-color-secondary);
      }
      .similar-movies {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
      }
      .similar-movie {
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        transition: transform 0.3s;
        background-color: rgba(0,0,0,0.8);
      }
      .similar-movie:hover {
        transform: scale(1.05);
      }
      .similar-poster {
        width: 100%;
        height: auto;
        display: block;
        aspect-ratio: 2/3;
        object-fit: cover;
      }
      .similar-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.6);
        opacity: 0;
        transition: opacity 0.3s;
      }
      .similar-movie:hover .similar-overlay {
        opacity: 1;
      }
      .play-small-btn {
        background-color: var(--primary-color);
        color: var(--text-color);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: background-color 0.3s;
      }
      .play-small-btn:hover {
        background-color: #4ade80;
      }
      .similar-info {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 1rem;
        background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
        color: var(--text-color);
      }
      .similar-title {
        font-size: 0.9rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        line-height: 1.2;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .similar-meta {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.8rem;
        color: var(--text-color-secondary);
      }
      .similar-year {
        font-weight: 500;
      }
      .similar-rating {
        display: flex;
        align-items: center;
        gap: 0.2rem;
        color: #4ade80;
        font-weight: 600;
      }
      .details-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
      }
      .detail-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .detail-label {
        font-weight: 500;
        color: var(--text-color);
      }
      .detail-value {
        color: var(--text-color-secondary);
      }
      .rating-card {
        max-width: 600px;
        margin: 0 auto;
      }
      .rating-card h2 {
        margin-bottom: 1.5rem;
        color: var(--text-color);
      }
      .rating-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .rating-input-group,
      .review-input-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      label {
        font-weight: 500;
        color: var(--text-color);
      }
      .rating-select {
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: var(--text-color);
        padding: 0.8rem;
        border-radius: 4px;
        appearance: none;
        cursor: pointer;
      }
      .review-textarea {
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: var(--text-color);
        padding: 0.8rem;
        border-radius: 4px;
        resize: vertical;
      }
      .submit-rating-btn {
        background-color: var(--primary-color);
        color: var(--text-color);
        padding: 0.8rem 1.5rem;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s;
      }
      .submit-rating-btn:disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }
      .rating-status {
        margin-top: 1rem;
        color: var(--text-color-secondary);
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .spinner {
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top: 4px solid var(--primary-color);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .loading-state,
      .error-state {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 20;
        text-align: center;
        color: var(--text-color);
      }
      .error-state svg {
        margin-bottom: 1rem;
        color: var(--primary-color);
      }
      .btn-primary {
        background-color: var(--primary-color);
        color: var(--text-color);
        padding: 0.8rem 1.5rem;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s;
      }
      .btn-primary:hover {
        background-color: #4ade80;
      }
      .video-player {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 20;
        background-color: rgba(0, 0, 0, 0.8);
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      }
      .btn-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background-color: transparent;
        color: var(--text-color);
        border: none;
        cursor: pointer;
        font-size: 1.5rem;
      }
      .nav-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding: 1rem 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .nav-left,
      .nav-right {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .nav-logo {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary-color);
        letter-spacing: 2px;
      }
      .nav-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: var(--text-color);
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .nav-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.4);
        transform: scale(1.1);
      }
      .nav-btn svg {
        width: 20px;
        height: 20px;
      }

      @media (max-width: 768px) {
        .hero-section {
          padding: 1rem;
        }
        .hero-main {
          flex-direction: column;
          align-items: center;
        }
        .movie-poster-large {
          max-width: 250px;
        }
        .movie-title {
          font-size: 2rem;
        }
        .action-buttons {
          flex-direction: column;
          gap: 0.5rem;
        }
        .content-sections {
          padding: 2rem 1rem;
        }
        .cast-section,
        .similar-section,
        .details-section,
        .rating-section {
          padding: 1.5rem;
        }
        h2 {
          font-size: 1.5rem;
        }
        .rating-card {
          width: 100%;
          margin: 0;
        }
      }
    `
  ]
})
export class MovieDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly movieService = inject(MovieService);
  private readonly ratingService = inject(RatingService);
  private readonly authService = inject(AuthService);
  private readonly watchlistService = inject(WatchlistService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  movie = signal<Movie | null>(null);
  avgRating = signal<number | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  myRating = signal<number>(4);
  myReview = signal<string>('');
  saving = signal(false);
  savedMsg = signal<string | null>(null);

  inWatchlist = signal<boolean>(false);
  watchlistBusy = signal<boolean>(false);
  videoPlayerVisible = signal(false);
  similarMovies = signal<Movie[]>([]);

  getYear(date?: string | Date): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (Number.isNaN(dateObj.getTime())) return '';
    return dateObj.getFullYear().toString();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Missing movie id');
      return;
    }

    this.loading.set(true);
    this.movieService.getById(id).subscribe({
      next: m => {
        this.movie.set(m);
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Failed to load movie');
      }
    });

    this.ratingService.getMovieAverage(id).subscribe({
      next: avg => this.avgRating.set(avg),
      error: () => this.avgRating.set(null),
    });

    const user = this.authService.currentUserValue;
    if (user) {
      this.watchlistService.isInWatchlist(user.id, id).subscribe({
        next: v => this.inWatchlist.set(v),
        error: () => this.inWatchlist.set(false),
      });
    }

    // Fetch similar movies
    this.movieService.getSimilarMovies(id).subscribe({
      next: movies => this.similarMovies.set(movies),
      error: () => this.similarMovies.set([]),
    });
  }

  submitRating() {
    const user = this.authService.currentUserValue;
    const m = this.movie();
    if (!user || !m) {
      this.error.set('You must be logged in');
      return;
    }

    this.saving.set(true);
    this.savedMsg.set(null);

    this.ratingService
      .create({
        userId: user.id,
        movieId: m.id,
        rating: this.myRating(),
        review: this.myReview() || undefined,
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.savedMsg.set('Rating saved');
          this.toastService.show('Rating saved successfully!', 'success');
          // refresh avg
          this.ratingService.getMovieAverage(m.id).subscribe({
            next: avg => this.avgRating.set(avg),
            error: () => {},
          });
        },
        error: err => {
          this.saving.set(false);
          this.error.set(err?.error?.message || 'Failed to save rating');
          this.toastService.show(err?.error?.message || 'Failed to save rating', 'error');
        },
      });
  }

  toggleWatchlist() {
    const user = this.authService.currentUserValue;
    const m = this.movie();
    if (!user || !m) {
      this.error.set('You must be logged in');
      return;
    }

    this.watchlistBusy.set(true);

    const req = this.inWatchlist()
      ? this.watchlistService.remove(user.id, m.id)
      : this.watchlistService.add(user.id, m.id);

    req.subscribe({
      next: () => {
        const wasInWatchlist = this.inWatchlist();
        this.inWatchlist.set(!wasInWatchlist);
        this.watchlistBusy.set(false);
        if (wasInWatchlist) {
          this.toastService.show('Removed from your watchlist.', 'info');
        } else {
          this.toastService.show('Added to your watchlist!', 'success');
        }
      },
      error: err => {
        this.watchlistBusy.set(false);
        this.error.set(err?.error?.message || 'Watchlist update failed');
        this.toastService.show(err?.error?.message || 'Watchlist update failed', 'error');
      }
    });
  }

  playVideo() {
    const m = this.movie();
    if (!m) return;

    this.videoPlayerVisible.set(true);

    // Here you would typically navigate to a video player component or open a modal
    // For this example, we'll just log the action
    console.log(`Playing video for movie: ${m.title}`);
  }

  playVideoForMovie(movie: Movie) {
    if (!movie) return;

    this.videoPlayerVisible.set(true);

    // Log the action or handle video play for the specific movie
    console.log(`Playing video for movie: ${movie.title}`);
  }

  goBack() {
    this.router.navigate(['..']);
  }

  shareMovie() {
    const movie = this.movie();
    if (!movie) return;

    const shareUrl = `${globalThis.location.origin}/share?movieId=${movie.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      this.toastService.show('Shareable link copied to clipboard!', 'success');
    }).catch(err => {
      console.error('Failed to copy link: ', err);
      this.toastService.show('Failed to copy link', 'error');
    });
  }
}
