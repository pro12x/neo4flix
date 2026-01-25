import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { WatchlistService, WatchlistMovie } from '../../services/watchlist';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container">
      <header class="main-header">
        <div class="logo">NEO4FLIX</div>
        <nav class="main-nav">
          <a routerLink="/">Home</a>
          <a routerLink="/recommendations">Recommendations</a>
          <a routerLink="/ratings">My Ratings</a>
          <a routerLink="/search">Search</a>
        </nav>
      </header>

      <main class="content">
        <h2 class="page-title">My Watchlist</h2>

        <section *ngIf="loading()" class="status-indicator">Loading...</section>
        <section *ngIf="error()" class="status-indicator error">{{ error() }}</section>

        <section class="results-grid" *ngIf="!loading() && movies().length > 0">
          <div class="movie-card" *ngFor="let m of movies()">
            <img [src]="m.poster" [alt]="m.title" class="movie-poster">
            <div class="movie-info">
              <h4 class="movie-title">{{ m.title }}</h4>
              <div class="movie-meta">
                <span class="rating" *ngIf="m.averageRating">★ {{ m.averageRating.toFixed(1) }}</span>
              </div>
              <div class="movie-actions">
                <button class="btn-icon" (click)="remove(m.movieId)" title="Remove from Watchlist"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg></button>
                <a [routerLink]="['/movies', m.movieId]" class="btn-icon" title="More Info"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></a>
              </div>
            </div>
          </div>
        </section>

        <section class="no-results" *ngIf="!loading() && movies().length === 0">
          <h2>Your watchlist is empty</h2>
          <p>Add movies to your list to see them here.</p>
        </section>
      </main>
    </div>
  `,
  styles: [
    `
      /* Using styles from search.ts as they are very similar */
      .page-container {
        padding-top: 80px;
      }
      .main-header {
        display: flex;
        align-items: center;
        padding: 1rem 3rem;
        background-color: var(--header-background);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
      }
      .logo {
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--primary-color);
        margin-right: 2rem;
      }
      .main-nav {
        display: flex;
        gap: 1.5rem;
        flex-grow: 1;
      }
      .main-nav a {
        color: var(--text-color-secondary);
        font-weight: 500;
        transition: color 0.3s;
      }
      .main-nav a:hover, .main-nav a.active {
        color: var(--text-color);
      }
      .content {
        padding: 2rem 3rem;
      }
      .page-title {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 2rem;
      }
      .status-indicator {
        text-align: center;
        padding: 4rem;
        font-size: 1.2rem;
        color: var(--text-color-secondary);
      }
      .status-indicator.error {
        color: var(--primary-color);
      }
      .results-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 1.5rem;
      }
      .movie-card {
        transition: transform 0.3s ease, z-index 0.3s ease;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        cursor: pointer;
      }
      .movie-card:hover {
        transform: scale(1.1);
        z-index: 20;
      }
      .movie-poster {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .movie-info {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%);
        padding: 2rem 1rem 1rem;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .movie-card:hover .movie-info {
        opacity: 1;
      }
      .movie-title {
        font-size: 1rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
      .movie-meta {
        font-size: 0.8rem;
        color: #4ade80;
        margin-bottom: 0.75rem;
      }
      .movie-actions {
        display: flex;
        gap: 0.5rem;
      }
      .btn-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.7);
        background-color: rgba(42, 42, 42, 0.6);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background-color 0.3s, border-color 0.3s;
      }
      .btn-icon:hover {
        background-color: rgba(255, 255, 255, 0.9);
        border-color: white;
        color: black;
      }
      .btn-icon:hover svg {
        stroke: black;
      }
      .no-results {
        text-align: center;
        padding: 5rem 2rem;
      }
      .no-results h2 {
        font-size: 1.8rem;
        margin-bottom: 0.5rem;
      }
      .no-results p {
        color: var(--text-color-secondary);
      }
    `
  ]
})
export class WatchlistComponent {
  private readonly auth = inject(AuthService);
  private readonly watchlistApi = inject(WatchlistService);
  private readonly toastService = inject(ToastService);

  movies = signal<WatchlistMovie[]>([]);
  loading = signal(false);
  busy = signal(false);
  error = signal<string | null>(null);

  constructor() {
    this.refresh();
  }

  refresh() {
    const user = this.auth.currentUserValue;
    if (!user) {
      this.error.set('You must be logged in.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.watchlistApi.list(user.id).subscribe({
      next: list => {
        this.movies.set(list || []);
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Failed to load watchlist');
      }
    });
  }

  remove(movieId: string) {
    const user = this.auth.currentUserValue;
    if (!user) return;

    this.busy.set(true);
    this.watchlistApi.remove(user.id, movieId).subscribe({
      next: () => {
        this.busy.set(false);
        this.movies.set(this.movies().filter(m => m.movieId !== movieId));
        this.toastService.show('Removed from your watchlist.', 'info');
      },
      error: err => {
        this.busy.set(false);
        this.error.set(err?.error?.message || 'Failed to remove movie');
        this.toastService.show(err?.error?.message || 'Failed to remove movie', 'error');
      }
    });
  }
}
