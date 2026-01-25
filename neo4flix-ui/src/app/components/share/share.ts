import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MovieService } from '../../services/movies';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">
      <header class="header">
        <a routerLink="/" class="link">← Home</a>
        <h2>Shared movie</h2>
      </header>

      <section *ngIf="loading()" class="muted">Loading…</section>
      <section *ngIf="error()" class="error">{{ error() }}</section>

      <ng-container *ngIf="movie() as m">
        <h3>{{ m.title }}</h3>
        <div class="meta">
          <span *ngIf="m.genres.length">{{ m.genres.join(', ') }}</span>
          <span *ngIf="m.averageRating !== undefined">★ {{ m.averageRating }}</span>
        </div>
        <p class="muted" *ngIf="m.plot">{{ m.plot }}</p>

        <div class="actions">
          <a class="btn" [routerLink]="['/movies', m.id]">Open in Neo4flix</a>
        </div>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .page { max-width: 900px; margin: 0 auto; padding: 24px; }
      .header { display:flex; align-items:center; justify-content:space-between; gap: 12px; }
      .link { text-decoration:none; opacity: 0.8; }
      .meta { display:flex; justify-content:space-between; gap: 8px; font-size: 12px; opacity: 0.8; margin: 8px 0; }
      .actions { margin-top: 12px; }
      .btn { padding: 10px 12px; border-radius: 8px; border: 1px solid #2a2a2a; background:#1f1f1f; color:#fff; cursor:pointer; text-decoration:none; }
      .error { color: #ffb4b4; margin: 12px 0; }
      .muted { opacity: 0.75; }
    `
  ]
})
export class ShareComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly moviesApi = inject(MovieService);

  movie = signal<Movie | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    const movieId = this.route.snapshot.queryParamMap.get('movieId');
    if (!movieId) {
      this.error.set('Missing movieId in share link');
      return;
    }

    this.loading.set(true);
    this.moviesApi.getById(movieId).subscribe({
      next: m => {
        this.movie.set(m);
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Failed to load shared movie');
      }
    });
  }
}
