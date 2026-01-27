import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RatingService } from '../../services/ratings';
import { AuthService } from '../../services/auth';
import { Rating } from '../../models/movie.model';
import { ToastService } from '../../services/toast.service';
import {User} from '../../models/auth.model';

@Component({
  selector: 'app-ratings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="ratings-page">
      <!-- Hero Header -->
      <header class="hero-header">
        <div class="hero-backdrop">
          <div class="hero-overlay"></div>
        </div>

        <nav class="nav-header">
          <div class="nav-left">
            <button class="nav-btn back-btn" routerLink="/">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <div class="nav-logo">
              <span>NEO4FLIX</span>
            </div>
          </div>

          <div class="nav-center">
            <h1 class="page-title">My Ratings</h1>
            <p class="page-subtitle">Your personal movie reviews and ratings</p>
          </div>

          <div class="nav-right">
            <button class="nav-btn search-btn" routerLink="/search">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>
        </nav>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Stats Section -->
        <section class="stats-section" *ngIf="!loading() && ratings().length > 0">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ ratings().length }}</div>
                <div class="stat-label">Movies Rated</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ getAverageRating() | number:'1.1-1' }}</div>
                <div class="stat-label">Average Rating</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ getReviewsCount() }}</div>
                <div class="stat-label">Reviews Written</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Ratings Grid -->
        <section class="ratings-section">
          <!-- Loading State -->
          <div class="loading-state" *ngIf="loading()">
            <div class="loading-spinner">
              <div class="spinner-ring"></div>
            </div>
            <h3>Loading your ratings...</h3>
            <p>Fetching your movie reviews</p>
          </div>

          <!-- Error State -->
          <div class="error-state" *ngIf="error()">
            <div class="error-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h3>Oops! Something went wrong</h3>
            <p>{{ error() }}</p>
            <button class="btn-retry" (click)="refresh()">Try Again</button>
          </div>

          <!-- Empty State -->
          <div class="empty-state" *ngIf="!loading() && !error() && ratings().length === 0">
            <div class="empty-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
            </div>
            <h3>No ratings yet</h3>
            <p>You haven't rated any movies. Start watching and sharing your opinions!</p>
            <button class="btn-explore" routerLink="/">Explore Movies</button>
          </div>

          <!-- Ratings Grid -->
          <div class="ratings-grid" *ngIf="!loading() && !error() && ratings().length > 0">
            <div class="rating-card" *ngFor="let rating of ratings(); trackBy: trackByMovieId">
              <!-- Movie Poster -->
              <div class="movie-poster-section">
                <a [routerLink]="['/movie', rating.movieId]" class="poster-link">
                  <img [src]="rating.moviePoster" [alt]="rating.movieTitle" class="movie-poster" *ngIf="rating.moviePoster">
                  <div class="poster-placeholder" *ngIf="!rating.moviePoster">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                      <rect x="2" y="2" width="20" height="20" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21,15 16,10 5,21"/>
                    </svg>
                  </div>
                </a>
                <div class="rating-badge">
                  <div class="rating-stars">
                    <svg *ngFor="let star of getStarsArray(rating.rating || 0)"
                         [class.filled]="star.filled"
                         width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                    </svg>
                  </div>
                  <span class="rating-number">{{ rating.rating }}</span>
                </div>
              </div>

              <!-- Movie Info -->
              <div class="movie-info-section">
                <div class="movie-header">
                  <h3 class="movie-title">
                    <a [routerLink]="['/movie', rating.movieId]">{{ rating.movieTitle || 'Unknown Movie' }}</a>
                  </h3>
                  <div class="movie-meta">
                    <span class="rating-date">{{ formatDate(rating.createdAt) }}</span>
                  </div>
                </div>

                <div class="rating-content">
                  <div class="user-rating-display">
                    <div class="rating-label">Your Rating</div>
                    <div class="rating-stars-large">
                      <svg *ngFor="let star of getStarsArray(rating.rating || 0)"
                           [class.filled]="star.filled"
                           width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                      </svg>
                      <span class="rating-text">{{ rating.rating }}/5</span>
                    </div>
                  </div>

                  <div class="review-section" *ngIf="rating.review">
                    <div class="review-label">Your Review</div>
                    <div class="review-content">{{ rating.review }}</div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="card-actions">
                  <button class="btn-secondary" (click)="startEdit(rating)" [disabled]="busy()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit Rating
                  </button>
                  <button class="btn-danger" (click)="delete(rating)" [disabled]="busy()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>

              <!-- Edit Form Overlay -->
              <div class="edit-overlay" *ngIf="editingMovieId() === rating.movieId">
                <div class="edit-form">
                  <div class="edit-header">
                    <h4>Edit Your Rating</h4>
                    <button class="btn-close" (click)="cancelEdit()" [disabled]="busy()">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>

                  <div class="rating-input-section">
                    <label>Your Rating</label>
                    <div class="star-rating-input">
                      <button
                        *ngFor="let star of [1,2,3,4,5]"
                        class="star-btn"
                        [class.selected]="editRating() >= star"
                        (click)="editRating.set(star)"
                        type="button">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                        </svg>
                      </button>
                      <span class="rating-value">{{ editRating() }}/5</span>
                    </div>
                  </div>

                  <div class="review-input-section">
                    <label>Your Review (Optional)</label>
                    <textarea
                      [(ngModel)]="editReview"
                      placeholder="Share your thoughts about this movie..."
                      rows="3"
                      maxlength="500"
                      class="review-textarea"></textarea>
                    <div class="char-count">{{ editReview().length }}/500</div>
                  </div>

                  <div class="edit-actions">
                    <button class="btn-cancel" (click)="cancelEdit()" [disabled]="busy()">Cancel</button>
                    <button class="btn-save" (click)="save(rating)" [disabled]="busy() || editRating() === 0">
                      <svg *ngIf="busy()" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinner">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" stroke-dasharray="31.416" stroke-dashoffset="31.416" class="spinner-circle"/>
                      </svg>
                      {{ busy() ? 'Saving...' : 'Save Changes' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        background: #000000;
        min-height: 100vh;
        color: var(--text-color, #ffffff);
      }

      .ratings-page {
        position: relative;
        min-height: 100vh;
      }

      /* Hero Header */
      .hero-header {
        position: relative;
        height: 300px;
        overflow: hidden;
      }

      .hero-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #141E30 0%, #243B55 25%, #141E30 50%, #0F1419 100%);
        background-size: 400% 400%;
        animation: gradientShift 15s ease infinite;
      }

      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      .hero-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(20, 30, 48, 0.7);
        backdrop-filter: blur(3px);
      }

      .hero-overlay::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at 30% 40%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 70% 80%, rgba(255, 119, 198, 0.05) 0%, transparent 50%);
        animation: particleFloat 20s ease-in-out infinite;
      }

      @keyframes particleFloat {
        0%, 100% { opacity: 0.3; transform: translateY(0px) rotate(0deg); }
        25% { opacity: 0.6; transform: translateY(-10px) rotate(90deg); }
        50% { opacity: 0.4; transform: translateY(-20px) rotate(180deg); }
        75% { opacity: 0.5; transform: translateY(-10px) rotate(270deg); }
      }

      .nav-header {
        position: relative;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 2rem 3rem;
        height: 100%;
      }

      .nav-left, .nav-right {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .nav-logo {
        font-size: 2rem;
        font-weight: 700;
        color: #e50914;
        letter-spacing: 3px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        background: linear-gradient(45deg, #e50914, #b20710);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .nav-center {
        text-align: center;
        flex: 1;
      }

      .page-title {
        font-size: 3rem;
        font-weight: 700;
        color: #ffffff;
        margin: 0;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        background: linear-gradient(45deg, #ffffff, #e0e7ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .page-subtitle {
        font-size: 1.1rem;
        color: rgba(255, 255, 255, 0.8);
        margin: 0.5rem 0 0 0;
        font-weight: 300;
      }

      .nav-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #ffffff;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      }

      .nav-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.4);
        transform: scale(1.05);
      }

      .nav-btn svg {
        width: 24px;
        height: 24px;
      }

      /* Main Content */
      .main-content {
        position: relative;
        z-index: 5;
        padding: 2rem 3rem;
        max-width: 1400px;
        margin: -100px auto 0;
      }

      /* Stats Section */
      .stats-section {
        margin-bottom: 3rem;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
      }

      .stat-card {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 2rem;
        display: flex;
        align-items: center;
        gap: 1.5rem;
        transition: all 0.3s ease;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      }

      .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
        background: rgba(255, 255, 255, 0.08);
      }

      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea, #764ba2);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      }

      .stat-content {
        flex: 1;
      }

      .stat-number {
        font-size: 2.5rem;
        font-weight: 700;
        color: #ffffff;
        margin: 0;
        background: linear-gradient(45deg, #ffffff, #e0e7ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .stat-label {
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.7);
        margin: 0.25rem 0 0 0;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      /* States */
      .loading-state, .error-state, .empty-state {
        text-align: center;
        padding: 6rem 2rem;
        background: rgba(255, 255, 255, 0.02);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 20px;
        margin: 2rem 0;
      }

      .loading-spinner {
        margin-bottom: 2rem;
      }

      .spinner-ring {
        width: 60px;
        height: 60px;
        border: 4px solid rgba(255, 255, 255, 0.1);
        border-top: 4px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .loading-state h3, .error-state h3, .empty-state h3 {
        font-size: 1.8rem;
        color: #ffffff;
        margin: 0 0 1rem 0;
      }

      .loading-state p, .error-state p, .empty-state p {
        color: rgba(255, 255, 255, 0.6);
        font-size: 1rem;
        margin: 0;
      }

      .error-icon, .empty-icon {
        margin-bottom: 2rem;
        color: #667eea;
      }

      .btn-retry, .btn-explore {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: #ffffff;
        border: none;
        padding: 1rem 2rem;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 1.5rem;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      }

      .btn-retry:hover, .btn-explore:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
      }

      /* Ratings Grid */
      .ratings-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        gap: 2rem;
      }

      .rating-card {
        position: relative;
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        overflow: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        animation: cardFadeIn 0.6s ease-out forwards;
        opacity: 0;
        transform: translateY(20px);
      }

      .rating-card:nth-child(1) { animation-delay: 0.1s; }
      .rating-card:nth-child(2) { animation-delay: 0.2s; }
      .rating-card:nth-child(3) { animation-delay: 0.3s; }
      .rating-card:nth-child(4) { animation-delay: 0.4s; }
      .rating-card:nth-child(5) { animation-delay: 0.5s; }
      .rating-card:nth-child(n+6) { animation-delay: 0.6s; }

      @keyframes cardFadeIn {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Movie Poster Section */
      .movie-poster-section {
        position: relative;
        height: 200px;
        overflow: hidden;
      }

      .poster-link {
        display: block;
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
      }

      .movie-poster {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .poster-link:hover .movie-poster {
        transform: scale(1.05);
      }

      .poster-placeholder {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #2a2a40, #1a1a2e);
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255, 255, 255, 0.3);
      }

      .rating-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 50px;
        padding: 0.5rem 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      }

      .rating-stars {
        display: flex;
        gap: 2px;
      }

      .rating-stars svg {
        width: 12px;
        height: 12px;
        color: #ffd700;
        fill: currentColor;
      }

      .rating-stars svg:not(.filled) {
        color: rgba(255, 255, 255, 0.3);
        fill: none;
      }

      .rating-number {
        color: #ffffff;
        font-weight: 600;
        font-size: 0.9rem;
      }

      /* Movie Info Section */
      .movie-info-section {
        padding: 2rem;
      }

      .movie-header {
        margin-bottom: 1.5rem;
      }

      .movie-title {
        margin: 0 0 0.5rem 0;
      }

      .movie-title a {
        color: #ffffff;
        text-decoration: none;
        font-size: 1.4rem;
        font-weight: 600;
        transition: color 0.3s ease;
      }

      .movie-title a:hover {
        color: #667eea;
      }

      .movie-meta {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .rating-date {
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.9rem;
      }

      .rating-content {
        margin-bottom: 2rem;
      }

      .user-rating-display {
        margin-bottom: 1.5rem;
      }

      .rating-label {
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.9rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .rating-stars-large {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .rating-stars-large svg {
        width: 20px;
        height: 20px;
        color: #ffd700;
        fill: currentColor;
      }

      .rating-stars-large svg:not(.filled) {
        color: rgba(255, 255, 255, 0.2);
        fill: none;
      }

      .rating-text {
        margin-left: 0.5rem;
        color: #ffffff;
        font-weight: 600;
        font-size: 1rem;
      }

      .review-section {
        margin-top: 1.5rem;
      }

      .review-content {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 1rem;
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.6;
        font-style: italic;
        position: relative;
      }

      .review-content:before {
        content: '"';
        position: absolute;
        top: -10px;
        left: 1rem;
        font-size: 3rem;
        color: rgba(255, 255, 255, 0.2);
        font-family: serif;
      }

      /* Card Actions */
      .card-actions {
        display: flex;
        gap: 1rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      .btn-secondary, .btn-danger {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        border-radius: 50px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.05);
        color: #ffffff;
      }

      .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.4);
        transform: translateY(-2px);
      }

      .btn-danger {
        background: rgba(239, 68, 68, 0.1);
        border-color: rgba(239, 68, 68, 0.3);
        color: #fca5a5;
      }

      .btn-danger:hover {
        background: rgba(239, 68, 68, 0.2);
        border-color: rgba(239, 68, 68, 0.5);
        color: #ffffff;
      }

      /* Edit Overlay */
      .edit-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        animation: fadeIn 0.3s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .edit-form {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 2rem;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      }

      .edit-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2rem;
      }

      .edit-header h4 {
        color: #ffffff;
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0;
      }

      .btn-close {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.6);
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: all 0.3s ease;
      }

      .btn-close:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
      }

      .rating-input-section, .review-input-section {
        margin-bottom: 2rem;
      }

      .rating-input-section label, .review-input-section label {
        display: block;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
        margin-bottom: 1rem;
      }

      .star-rating-input {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .star-btn {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 0.25rem;
        border-radius: 50%;
      }

      .star-btn.selected, .star-btn:hover {
        color: #ffd700;
        transform: scale(1.2);
      }

      .star-btn:hover ~ .star-btn {
        color: rgba(255, 255, 255, 0.3);
      }

      .rating-value {
        margin-left: 1rem;
        color: #ffffff;
        font-weight: 600;
        font-size: 1.1rem;
      }

      .review-textarea {
        width: 100%;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        color: #ffffff;
        padding: 1rem;
        font-family: inherit;
        resize: vertical;
        transition: all 0.3s ease;
      }

      .review-textarea:focus {
        outline: none;
        border-color: #667eea;
        background: rgba(255, 255, 255, 0.08);
      }

      .char-count {
        text-align: right;
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.5);
        margin-top: 0.25rem;
      }

      .edit-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
      }

      .btn-cancel, .btn-save {
        padding: 0.75rem 1.5rem;
        border-radius: 50px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .btn-cancel {
        background: rgba(255, 255, 255, 0.05);
        color: #ffffff;
      }

      .btn-cancel:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.4);
      }

      .btn-save {
        background: linear-gradient(135deg, #e50914, #b20710);
        color: #ffffff;
        border: none;
        box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);
      }

      .btn-save:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(229, 9, 20, 0.4);
        background: linear-gradient(135deg, #f40612, #d01018);
      }

      .btn-save:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .spinner {
        animation: spin 1s linear infinite;
      }

      .spinner-circle {
        animation: spinner-dash 1.5s ease-in-out infinite;
      }

      @keyframes spinner-dash {
        0% { stroke-dashoffset: 31.416; }
        50% { stroke-dashoffset: 15.708; }
        100% { stroke-dashoffset: 31.416; }
      }

      /* Responsive */
      @media (max-width: 768px) {
        .nav-header {
          padding: 1rem;
        }

        .page-title {
          font-size: 2rem;
        }

        .page-subtitle {
          font-size: 1rem;
        }

        .main-content {
          padding: 1rem;
          margin-top: -50px;
        }

        .stats-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .ratings-grid {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        .rating-card {
          margin: 0;
        }

        .movie-info-section {
          padding: 1.5rem;
        }

        .card-actions {
          flex-direction: column;
          gap: 0.5rem;
        }

        .edit-form {
          padding: 1.5rem;
          margin: 1rem;
        }

        .star-rating-input {
          justify-content: center;
        }
      }
    `
  ]
})
export class RatingsComponent {
  private readonly auth = inject(AuthService);
  private readonly ratingsApi = inject(RatingService);
  private readonly toastService = inject(ToastService);

  ratings = signal<Rating[]>([]);
  loading = signal(false);
  busy = signal(false);
  error = signal<string | null>(null);

  editingMovieId = signal<string | null>(null);
  editRating = signal<number>(4);
  editReview = signal<string>('');

  private get userId(): string | null {
    return this.auth.currentUserValue?.id ?? null;
  }

  constructor() {
    this.refresh();
  }

  refresh() {
    const userId = this.userId;
    if (!userId) {
      this.error.set('You must be logged in.');
      return;
    }

    this.loading.set(true);
    this.ratingsApi.getUserRatings(userId).subscribe({
      next: list => {
        this.ratings.set(list || []);
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Failed to load ratings');
      }
    });
  }

  startEdit(r: Rating) {
    this.editingMovieId.set(r.movieId);
    this.editRating.set(r.rating ?? 0);
    this.editReview.set(r.review ?? '');
  }

  cancelEdit() {
    this.editingMovieId.set(null);
    this.editRating.set(4);
    this.editReview.set('');
  }

  save(r: Rating) {
    const userId = this.userId;
    if (!userId) return;

    this.busy.set(true);
    this.ratingsApi.update(userId, r.movieId, { rating: this.editRating(), review: this.editReview() || undefined }).subscribe({
      next: updated => {
        this.busy.set(false);
        this.ratings.set(this.ratings().map(x => (x.movieId === r.movieId ? { ...x, ...updated, rating: this.editRating(), review: this.editReview() } : x)));
        this.editingMovieId.set(null);
        this.editRating.set(4);
        this.editReview.set('');
        this.toastService.show('Rating updated!', 'success');
      },
      error: err => {
        this.busy.set(false);
        this.error.set(err?.error?.message || 'Failed to update rating');
        this.toastService.show(err?.error?.message || 'Failed to update rating', 'error');
      }
    });
  }

  delete(r: Rating) {
    const userId = this.userId;
    if (!userId) return;

    this.busy.set(true);
    this.ratingsApi.remove(userId, r.movieId).subscribe({
      next: () => {
        this.busy.set(false);
        this.ratings.set(this.ratings().filter(x => x.movieId !== r.movieId));
        this.editingMovieId.set(null);
        this.toastService.show('Rating deleted.', 'info');
      },
      error: err => {
        this.busy.set(false);
        this.error.set(err?.error?.message || 'Failed to delete rating');
        this.toastService.show(err?.error?.message || 'Failed to delete rating', 'error');
      }
    });
  }

  getAverageRating(): number {
    const ratings = this.ratings();
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + (r.rating || 0), 0);
    return sum / ratings.length;
  }

  getReviewsCount(): number {
    return this.ratings().filter(r => r.review && r.review.trim().length > 0).length;
  }

  getStarsArray(rating: number): { filled: boolean }[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push({ filled: i <= rating });
    }
    return stars;
  }

  formatDate(date?: Date | string): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  trackByMovieId(index: number, rating: Rating): string {
    return rating.movieId;
  }
}






