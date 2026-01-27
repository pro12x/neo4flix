import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a class="movie-card"
       [routerLink]="['/movie', movie.id]"
       (mouseenter)="isHovered.set(true)"
       (mouseleave)="isHovered.set(false)"
       [class.hovered]="isHovered()">

      <img [src]="movie.poster" [alt]="movie.title" class="movie-poster">

      <div class="movie-info">
        <h4 class="movie-title">{{ movie.title }}</h4>
        <div class="movie-meta">
          <span class="rating" *ngIf="movie.averageRating">★ {{ movie.averageRating.toFixed(1) }}</span>
        </div>
        <div class="movie-actions" (click)="$event.preventDefault(); $event.stopPropagation()">
          <button class="btn-icon" type="button" (click)="played.emit()" aria-label="Play trailer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <button
            class="btn-icon watchlist-btn"
            type="button"
            (click)="toggleWatchlist()"
            [class.in-watchlist]="isInWatchlist"
            [disabled]="watchlistLoading()"
            aria-label="Toggle watchlist">
            <svg *ngIf="!isInWatchlist" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14m-7-7h14"/>
            </svg>
            <svg *ngIf="isInWatchlist" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <div *ngIf="watchlistLoading()" class="loading-spinner"></div>
          </button>
          <a [routerLink]="['/movie', movie.id]" class="btn-icon" aria-label="Details">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
          </a>
        </div>
      </div>
    </a>
  `,
  styles: [`
    :host {
      /* Allow parent containers (like Home carousels) to override sizing. */
      --card-w: 180px;
      --card-h: 270px;

      flex: 0 0 var(--card-w);
      height: var(--card-h);
      display: block;
    }

    .movie-card {
      width: 100%;
      height: 100%;
      transition: transform 0.3s ease, z-index 0.3s ease;
      position: relative;
      border-radius: 4px;
      overflow: hidden;
      cursor: pointer;
      background: #111;
      display: block;
      transform-origin: center;
    }

    .movie-card.hovered {
      transform: scale(1.15);
      z-index: 20;
    }

    /* On touch devices, avoid hover-driven scaling that can fight horizontal scrolling */
    @media (hover: none) {
      .movie-card.hovered {
        transform: none;
      }
      .movie-info {
        opacity: 1;
      }
    }

    .movie-poster {
      position: absolute;
      inset: 0;
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
      background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0) 100%);
      padding: 2rem 1rem 1rem;
      opacity: 0;
      transition: opacity 0.25s ease;
    }

    .movie-card.hovered .movie-info {
      opacity: 1;
    }

    .movie-title {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      line-height: 1.2;
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
      transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
    }

    .btn-icon:hover {
      background-color: rgba(255, 255, 255, 0.9);
      border-color: white;
      color: black;
      transform: scale(1.05);
    }

    .btn-icon:hover svg {
      stroke: black;
    }

    .watchlist-btn {
      position: relative;
      overflow: hidden;
    }

    .watchlist-btn.in-watchlist {
      background-color: rgba(239, 68, 68, 0.8);
      border-color: #ef4444;
    }

    .watchlist-btn.in-watchlist:hover {
      background-color: rgba(239, 68, 68, 1);
      border-color: #dc2626;
      color: white;
    }

    .watchlist-btn.in-watchlist:hover svg {
      stroke: white;
    }

    .loading-spinner {
      position: absolute;
      width: 24px;
      height: 24px;
      border: 3px solid rgba(255, 255, 255, 0.7);
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class MovieCardComponent {
  @Input({ required: true }) movie!: Movie;
  @Input() isInWatchlist: boolean = false;
  @Output() played = new EventEmitter<void>();
  @Output() watchlistAdd = new EventEmitter<void>();
  @Output() watchlistRemove = new EventEmitter<void>();

  isHovered = signal(false);
  watchlistLoading = signal(false);

  toggleWatchlist() {
    this.watchlistLoading.set(true);
    if (this.isInWatchlist) {
      this.watchlistRemove.emit();
    } else {
      this.watchlistAdd.emit();
    }
    // The parent will update isInWatchlist and set loading to false
  }
}
