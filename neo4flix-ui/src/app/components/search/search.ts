import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MovieService } from '../../services/movies';
import { Movie } from '../../models/movie.model';
import { WatchlistService } from '../../services/watchlist';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-search',
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
          <a routerLink="/watchlist">Watchlist</a>
        </nav>
      </header>

      <main class="content">
        <section class="search-bar">
          <input type="text" placeholder="Search by title, genre..."
                 [value]="title()"
                 (input)="title.set($any($event.target).value); runSearch(0)"
                 class="search-input" />
        </section>

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
                <button class="btn-icon" (click)="addToWatchlist(m.id)" title="Add to Watchlist"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14m-7-7h14"/></svg></button>
                <a [routerLink]="['/movie', m.id]" class="btn-icon" title="More Info"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></a>
              </div>
            </div>
          </div>
        </section>

        <section class="no-results" *ngIf="!loading() && movies().length === 0 && (title() || genre())">
          <h2>No results found for "{{ title() }}"</h2>
          <p>Try searching for something else.</p>
        </section>

        <section class="pagination" *ngIf="!loading() && totalPages() > 1">
          <button class="btn-page" (click)="prev()" [disabled]="page() === 0">‹ Prev</button>
          <span>Page {{ page() + 1 }} of {{ totalPages() }}</span>
          <button class="btn-page" (click)="next()" [disabled]="page() + 1 >= totalPages()">Next ›</button>
        </section>
      </main>
    </div>
  `,
  styles: [
    `
      .page-container {
        padding-top: 80px; /* Space for fixed header */
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
      .search-bar {
        margin-bottom: 2rem;
      }
      .search-input {
        width: 100%;
        padding: 1rem 1.5rem;
        background-color: var(--card-background);
        border: 1px solid #333;
        border-radius: 4px;
        color: var(--text-color);
        font-size: 1.2rem;
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
      /* Movie Card styles from HomeComponent */
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
      .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin-top: 3rem;
      }
      .btn-page {
        background: var(--card-background);
        border: 1px solid #333;
        color: var(--text-color);
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
      }
      .btn-page:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `
  ]
})
export class SearchComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly moviesApi = inject(MovieService);
  private readonly watchlistService = inject(WatchlistService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  title = signal('');
  genre = signal('');
  minRating = signal<number | null>(null);
  sort = signal<'rating' | 'date'>('rating');

  page = signal<number>(0);
  size = signal<number>(18);
  total = signal<number>(0);

  movies = signal<Movie[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  totalPages() {
    const t = this.total();
    const s = this.size();
    return Math.max(1, Math.ceil(t / s));
  }

  constructor() {
    const qp = this.route.snapshot.queryParamMap;
    this.title.set(qp.get('title') || '');
    this.genre.set(qp.get('genre') || '');
    const mr = qp.get('minRating');
    this.minRating.set(mr ? Number(mr) : null);

    const sort = (qp.get('sort') as 'rating' | 'date') || 'rating';
    this.sort.set(sort === 'date' ? 'date' : 'rating');

    const page = qp.get('page');
    this.page.set(page ? Math.max(0, Number(page)) : 0);

    const size = qp.get('size');
    this.size.set(size ? Math.min(Math.max(1, Number(size)), 50) : 18);

    this.runSearch(this.page());
  }

  onMinRatingInput(value: string) {
    const v = (value || '').trim();
    if (!v) {
      this.minRating.set(null);
      return;
    }
    const n = Number(v);
    this.minRating.set(Number.isFinite(n) ? n : null);
  }

  onSizeChange(v: string) {
    const n = Number(v);
    this.size.set(Number.isFinite(n) ? n : 18);
  }

  clear() {
    this.title.set('');
    this.genre.set('');
    this.minRating.set(null);
    this.sort.set('rating');
    this.page.set(0);
    this.size.set(18);
    this.total.set(0);
    this.movies.set([]);
    this.error.set(null);
    this.router.navigate([], { queryParams: {}, replaceUrl: true });
  }

  prev() {
    this.runSearch(Math.max(0, this.page() - 1));
  }

  next() {
    this.runSearch(this.page() + 1);
  }

  addToWatchlist(movieId: string) {
    const user = this.authService.currentUserValue;
    if (!user) {
      this.toastService.show('You must be logged in to add to watchlist.', 'error');
      return;
    }
    this.watchlistService.add(user.id, movieId).subscribe({
      next: () => {
        this.toastService.show('Added to your watchlist!', 'success');
      },
      error: err => {
        this.toastService.show(err?.error?.message || 'Failed to add to watchlist.', 'error');
      }
    });
  }

  runSearch(page: number) {
    this.page.set(Math.max(0, page));

    this.router.navigate([], {
      queryParams: {
        title: this.title() || undefined,
        genre: this.genre() || undefined,
        minRating: this.minRating() ?? undefined,
        sort: this.sort(),
        page: this.page(),
        size: this.size(),
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });

    this.loading.set(true);
    this.error.set(null);

    this.moviesApi.searchPaged({
      title: this.title() || undefined,
      genre: this.genre() || undefined,
      minRating: this.minRating() ?? undefined,
      sort: this.sort(),
      page: this.page(),
      size: this.size(),
    }).subscribe({
      next: resp => {
        this.movies.set(resp.items || []);
        this.total.set(resp.total || 0);
        this.page.set(resp.page ?? this.page());
        this.size.set(resp.size ?? this.size());
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Search failed');
      }
    });
  }
}
