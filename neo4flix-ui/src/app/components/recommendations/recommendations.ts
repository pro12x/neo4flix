import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecommendationService } from '../../services/recommendations';
import { AuthService } from '../../services/auth';
import { MovieRecommendation } from '../../models/movie.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container">
      <header class="main-header">
        <div class="logo">NEO4FLIX</div>
        <nav class="main-nav">
          <a routerLink="/">Home</a>
          <a routerLink="/ratings">My Ratings</a>
          <a routerLink="/watchlist">Watchlist</a>
          <a routerLink="/search">Search</a>
        </nav>
      </header>

      <main class="content">
        <h2 class="page-title">Personalized Recommendations</h2>

        <div class="reco-toolbar">
          <button class="btn-filter" [class.active]="activeMode() === 'mixed'" (click)="load('mixed')" [disabled]="loading()">For You</button>
          <button class="btn-filter" [class.active]="activeMode() === 'trending'" (click)="load('trending')" [disabled]="loading()">Trending</button>
          <button class="btn-filter" [class.active]="activeMode() === 'collaborative'" (click)="load('collaborative')" [disabled]="loading()">Because You Watched...</button>
          <button class="btn-filter" [class.active]="activeMode() === 'content'" (click)="load('content')" [disabled]="loading()">Similar Movies</button>
        </div>

        <section *ngIf="loading()" class="status-indicator">Loading...</section>
        <section *ngIf="error()" class="status-indicator error">{{ error() }}</section>

        <section class="results-grid" *ngIf="!loading() && recos().length > 0">
          <div class="movie-card" *ngFor="let r of recos()">
            <a [routerLink]="['/movies', r.movie.id]">
              <img [src]="r.movie.poster" [alt]="r.movie.title" class="movie-poster">
            </a>
            <div class="reco-reason" *ngIf="r.reason">
              {{ r.reason }}
              <button class="btn-share" (click)="copyShareLink(r.movie.id); $event.preventDefault(); $event.stopPropagation();">
                Share
              </button>
            </div>
          </div>
        </section>

        <section class="no-results" *ngIf="!loading() && recos().length === 0">
          <h2>No recommendations for you yet</h2>
          <p>Rate some movies to get started.</p>
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
      .content { padding: 2rem 3rem; }
      .page-title { font-size: 2rem; font-weight: 700; margin-bottom: 1rem; }

      .reco-toolbar {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        border-bottom: 1px solid #333;
        padding-bottom: 1rem;
      }
      .btn-filter {
        background: none;
        border: none;
        color: var(--text-color-secondary);
        font-size: 1.1rem;
        padding: 0.5rem 0;
        cursor: pointer;
        position: relative;
      }
      .btn-filter.active {
        color: var(--text-color);
        font-weight: 700;
      }
      .btn-filter.active::after {
        content: '';
        position: absolute;
        bottom: -17px;
        left: 0;
        right: 0;
        height: 4px;
        background-color: var(--primary-color);
      }

      .status-indicator { text-align: center; padding: 4rem; font-size: 1.2rem; color: var(--text-color-secondary); }
      .status-indicator.error { color: var(--primary-color); }

      .results-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 1.5rem;
      }
      .movie-card {
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        cursor: pointer;
        transition: transform 0.3s;
      }
      .movie-card:hover {
        transform: scale(1.05);
      }
      .movie-poster {
        width: 100%;
        display: block;
      }
      .reco-reason {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%);
        padding: 1.5rem 1rem 1rem;
        font-size: 0.9rem;
        font-style: italic;
        color: var(--text-color-secondary);
        opacity: 0;
        transition: opacity 0.3s;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .movie-card:hover .reco-reason {
        opacity: 1;
      }

      .no-results { text-align: center; padding: 5rem 2rem; }
      .no-results h2 { font-size: 1.8rem; margin-bottom: 0.5rem; }
      .no-results p { color: var(--text-color-secondary); }

      .btn-share {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
      }
    `
  ]
})
export class RecommendationsComponent {
  private readonly auth = inject(AuthService);
  private readonly recosApi = inject(RecommendationService);
  private readonly toastService = inject(ToastService);

  recos = signal<MovieRecommendation[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  activeMode = signal<'mixed' | 'trending' | 'collaborative' | 'content'>('mixed');
  copiedId = signal<string | null>(null);

  constructor() {
    this.load('mixed');
  }

  load(mode: 'mixed' | 'trending' | 'collaborative' | 'content') {
    this.activeMode.set(mode);
    const user = this.auth.currentUserValue;
    if (!user) {
      this.error.set('You must be logged in.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    let obs;
    switch (mode) {
      case 'trending':
        obs = this.recosApi.trending(user.id);
        break;
      case 'collaborative':
        obs = this.recosApi.collaborative(user.id);
        break;
      case 'content':
        obs = this.recosApi.contentBased(user.id);
        break;
      default:
        obs = this.recosApi.forUser(user.id);
    }

    obs.subscribe({
      next: list => {
        this.recos.set(list || []);
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Failed to load recommendations');
        this.toastService.show(err?.error?.message || 'Failed to load recommendations', 'error');
      }
    });
  }

  copyShareLink(movieId: string) {
    const url = `${location.origin}/share?movieId=${encodeURIComponent(movieId)}`;
    navigator.clipboard?.writeText(url).then(
      () => {
        this.copiedId.set(movieId);
        this.toastService.show('Share link copied to clipboard!', 'success');
        setTimeout(() => this.copiedId.set(null), 1500);
      },
      () => {
        // fallback
        try {
          const ta = document.createElement('textarea');
          ta.value = url;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
          this.copiedId.set(movieId);
          this.toastService.show('Share link copied to clipboard!', 'success');
          setTimeout(() => this.copiedId.set(null), 1500);
        } catch {
          this.error.set('Could not copy share link');
          this.toastService.show('Could not copy share link', 'error');
        }
      }
    );
  }
}
