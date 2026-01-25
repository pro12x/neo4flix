import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
  imports: [CommonModule, RouterModule, VideoPlayerComponent],
  template: `
    <div class="page-container" *ngIf="movie() as m; else loadingOrError">
      <div class="backdrop">
        <img [src]="m.poster" alt="" class="backdrop-img">
      </div>
      <div class="header-nav">
        <a routerLink="/browse" class="back-link">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
          Back
        </a>
      </div>
      <div class="content">
        <div class="poster">
          <img [src]="m.poster" [alt]="m.title">
        </div>
        <div class="details">
          <h1 class="title">{{ m.title }}</h1>
          <div class="meta-info">
            <span>{{ getYear(m.releaseDate) }}</span>
            <span class="separator">|</span>
            <span *ngIf="m.genres.length > 0">{{ m.genres.join(', ') }}</span>
            <span class="separator">|</span>
            <span class="rating" *ngIf="avgRating() !== null">★ {{ avgRating()!.toFixed(1) }}</span>
          </div>
          <p class="plot">{{ m.plot }}</p>
          <div class="actions">
            <button class="btn btn-watchlist" (click)="toggleWatchlist()" [disabled]="watchlistBusy()">
              <svg *ngIf="!inWatchlist()" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14m-7-7h14"/></svg>
              <svg *ngIf="inWatchlist()" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>
              {{ inWatchlist() ? 'On my list' : 'Add to Watchlist' }}
            </button>
            <button class="btn btn-play" (click)="playVideo()">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Play
            </button>
          </div>
          <div class="rating-section">
            <h3>Rate this movie</h3>
            <div class="rating-input">
              <input type="number" min="0" max="5" step="0.5" [value]="myRating()" (input)="onRatingInput($any($event.target).value)" />
              <input type="text" placeholder="Review (optional)" [value]="myReview()" (input)="myReview.set($any($event.target).value)" />
              <button class="btn btn-submit" (click)="submitRating()" [disabled]="saving()">Submit</button>
            </div>
            <div class="save-status" *ngIf="saving()">Saving…</div>
            <div class="save-status success" *ngIf="savedMsg()">{{ savedMsg() }}</div>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loadingOrError>
      <div class="center-status">
        <div *ngIf="loading()">Loading...</div>
        <div *ngIf="error()" class="error-message">{{ error() }}</div>
      </div>
    </ng-template>

    <app-video-player
      *ngIf="videoPlayerVisible()"
      [videoUrl]="movie()?.trailerUrl"
      [movieTitle]="movie()?.title || ''"
      (closed)="videoPlayerVisible.set(false)">
    </app-video-player>
  `,
  styles: [
    `
      :host {
        display: block;
        background-color: var(--background-color);
        min-height: 100vh;
      }
      .page-container {
        position: relative;
        overflow: hidden;
      }
      .backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 70vh;
        z-index: 1;
      }
      .backdrop-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.2;
        mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%);
      }
      .header-nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding: 1rem 3rem;
        z-index: 10;
      }
      .back-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        color: var(--text-color-secondary);
        transition: color 0.3s;
      }
      .back-link:hover {
        color: var(--text-color);
      }
      .content {
        position: relative;
        z-index: 2;
        display: flex;
        gap: 3rem;
        padding: 8rem 4rem 4rem;
        max-width: 1400px;
        margin: 0 auto;
      }
      .poster {
        flex: 0 0 300px;
      }
      .poster img {
        width: 100%;
        border-radius: 8px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.4);
      }
      .details {
        flex: 1;
      }
      .title {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 1rem;
      }
      .meta-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        color: var(--text-color-secondary);
        margin-bottom: 1.5rem;
      }
      .rating {
        color: #4ade80;
        font-weight: 700;
      }
      .plot {
        font-size: 1.1rem;
        line-height: 1.7;
        max-width: 80ch;
        margin-bottom: 2rem;
      }
      .actions {
        margin-bottom: 2.5rem;
      }
      .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.8rem 1.5rem;
        border-radius: 4px;
        font-weight: 700;
        border: none;
        cursor: pointer;
      }
      .btn-watchlist {
        background-color: rgba(255, 255, 255, 0.1);
        color: var(--text-color);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
      .btn-watchlist:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
      .btn-play {
        background-color: var(--primary-color);
        color: var(--text-color);
      }
      .rating-section {
        background-color: rgba(0,0,0,0.3);
        padding: 1.5rem;
        border-radius: 8px;
      }
      .rating-section h3 {
        margin-bottom: 1rem;
      }
      .rating-input {
        display: flex;
        gap: 1rem;
      }
      .rating-input input {
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: var(--text-color);
        padding: 0.8rem;
        border-radius: 4px;
      }
      .rating-input input[type=text] {
        flex-grow: 1;
      }
      .btn-submit {
        background-color: var(--primary-color);
        color: var(--text-color);
      }
      .save-status {
        margin-top: 1rem;
        color: var(--text-color-secondary);
      }
      .save-status.success {
        color: #4ade80;
      }
      .center-status {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        font-size: 1.2rem;
      }
      .error-message {
        color: var(--primary-color);
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

  getYear(date?: Date): string {
    if (!date) return '';
    return new Date(date).getFullYear().toString();
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
  }

  onRatingInput(value: string) {
    const n = Number(value);
    this.myRating.set(Number.isFinite(n) ? n : 0);
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
}
