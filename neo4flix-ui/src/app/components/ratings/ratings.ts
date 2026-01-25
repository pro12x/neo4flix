import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RatingService } from '../../services/ratings';
import { AuthService } from '../../services/auth';
import { Rating } from '../../models/movie.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-ratings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container">
      <header class="main-header">
        <div class="logo">NEO4FLIX</div>
        <nav class="main-nav">
          <a routerLink="/">Home</a>
          <a routerLink="/recommendations">Recommendations</a>
          <a routerLink="/watchlist">Watchlist</a>
          <a routerLink="/search">Search</a>
        </nav>
      </header>

      <main class="content">
        <h2 class="page-title">My Ratings</h2>

        <section *ngIf="loading()" class="status-indicator">Loading...</section>
        <section *ngIf="error()" class="status-indicator error">{{ error() }}</section>

        <div class="ratings-list" *ngIf="!loading() && ratings().length > 0">
          <div class="rating-item" *ngFor="let r of ratings()">
            <div class="movie-details">
              <a [routerLink]="['/movies', r.movieId]">
                <img [src]="r.moviePoster" [alt]="r.movieTitle" class="movie-poster-small" *ngIf="r.moviePoster">
              </a>
              <div>
                <a class="movie-title-link" [routerLink]="['/movies', r.movieId]">{{ r.movieTitle || 'Unknown Movie' }}</a>
                <div class="my-rating">You rated: ★ {{ r.rating }}</div>
                <p class="my-review" *ngIf="r.review">{{ r.review }}</p>
              </div>
            </div>

            <div class="rating-actions">
              <button class="btn-edit" (click)="startEdit(r)">Edit</button>
              <button class="btn-delete" (click)="delete(r)" [disabled]="busy()">Delete</button>
            </div>

            <div class="edit-form" *ngIf="editingMovieId() === r.movieId">
              <input type="number" min="0" max="5" step="0.5" [value]="editRating()" (input)="onEditRatingInput($any($event.target).value)" />
              <input type="text" placeholder="Update your review" [value]="editReview()" (input)="editReview.set($any($event.target).value)" />
              <button class="btn-save" (click)="save(r)" [disabled]="busy()">Save</button>
              <button class="btn-cancel" (click)="cancelEdit()" [disabled]="busy()">Cancel</button>
            </div>
          </div>
        </div>

        <section class="no-results" *ngIf="!loading() && ratings().length === 0">
          <h2>You haven't rated any movies yet</h2>
          <p>Your ratings will appear here.</p>
        </section>
      </main>
    </div>
  `,
  styles: [
    `
      .page-container { padding-top: 80px; }
      .main-header { display: flex; align-items: center; padding: 1rem 3rem; background-color: var(--header-background); position: fixed; top: 0; left: 0; right: 0; z-index: 1000; }
      .logo { font-size: 1.8rem; font-weight: 700; color: var(--primary-color); margin-right: 2rem; }
      .main-nav { display: flex; gap: 1.5rem; flex-grow: 1; }
      .main-nav a { color: var(--text-color-secondary); font-weight: 500; transition: color 0.3s; }
      .main-nav a:hover, .main-nav a.active { color: var(--text-color); }
      .content { padding: 2rem 3rem; max-width: 1200px; margin: 0 auto; }
      .page-title { font-size: 2rem; font-weight: 700; margin-bottom: 2rem; }
      .status-indicator { text-align: center; padding: 4rem; font-size: 1.2rem; color: var(--text-color-secondary); }
      .status-indicator.error { color: var(--primary-color); }

      .ratings-list { display: flex; flex-direction: column; gap: 1.5rem; }
      .rating-item { background-color: var(--card-background); border-radius: 8px; padding: 1.5rem; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; }
      .movie-details { display: flex; align-items: flex-start; gap: 1.5rem; flex-grow: 1; }
      .movie-poster-small { width: 80px; border-radius: 4px; }
      .movie-title-link { font-size: 1.2rem; font-weight: 700; text-decoration: none; color: var(--text-color); }
      .movie-title-link:hover { text-decoration: underline; }
      .my-rating { font-size: 1rem; color: #4ade80; margin: 0.5rem 0; }
      .my-review { font-style: italic; color: var(--text-color-secondary); }

      .rating-actions { display: flex; gap: 1rem; }
      .btn-edit, .btn-delete, .btn-save, .btn-cancel { background: none; border: 1px solid #555; color: var(--text-color-secondary); padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; transition: all 0.3s; }
      .btn-edit:hover, .btn-save:hover { background-color: #4ade80; color: var(--background-color); border-color: #4ade80; }
      .btn-delete:hover { background-color: var(--primary-color); color: var(--text-color); border-color: var(--primary-color); }
      .btn-cancel:hover { background-color: #555; }

      .edit-form { width: 100%; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #333; display: flex; gap: 1rem; }
      .edit-form input { background-color: #333; border: 1px solid #555; color: var(--text-color); padding: 0.8rem; border-radius: 4px; flex-grow: 1; }

      .no-results { text-align: center; padding: 5rem 2rem; }
      .no-results h2 { font-size: 1.8rem; margin-bottom: 0.5rem; }
      .no-results p { color: var(--text-color-secondary); }
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
  }

  onEditRatingInput(value: string) {
    const n = Number((value || '').trim());
    this.editRating.set(Number.isFinite(n) ? n : 0);
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
        this.toastService.show('Rating deleted.', 'info');
      },
      error: err => {
        this.busy.set(false);
        this.error.set(err?.error?.message || 'Failed to delete rating');
        this.toastService.show(err?.error?.message || 'Failed to delete rating', 'error');
      }
    });
  }
}
