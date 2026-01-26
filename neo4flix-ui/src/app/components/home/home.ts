import { Component, inject, signal, OnDestroy } from '@angular/core';
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
      <header class="main-header" [class.scrolled]="isScrolled()">
        <div class="logo">NEO4FLIX</div>
        <nav class="main-nav">
          <a routerLink="/recommendations">Recommendations</a>
          <a routerLink="/ratings">My Ratings</a>
          <a routerLink="/watchlist">Watchlist</a>
          <a routerLink="/profile">Profile</a>
        </nav>
        <div class="user-actions">
          <a routerLink="/search" class="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </a>
          <button class="logout-button" (click)="logout()">Logout</button>
        </div>
      </header>

      <main class="content">
        <section class="hero-section" *ngIf="featuredMovie() as fm">
          <img [src]="fm.poster" alt="Featured movie poster" class="hero-background">
          <div class="hero-content">
            <h2 class="hero-title">{{ fm.title }}</h2>
            <p class="hero-plot">{{ fm.plot }}</p>
            <div class="hero-actions">
              <button type="button" class="btn btn-primary" (click)="playTrailer(fm); $event.stopPropagation()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
                Play
              </button>
              <a [routerLink]="['/movie', fm.id]" class="btn btn-secondary">More Info</a>
            </div>
          </div>
        </section>

        <section class="movie-carousel" *ngFor="let section of sections">
          <div class="carousel-header">
            <h3>{{ section.title }}</h3>
            <div class="carousel-status" *ngIf="section.loading()">Loading…</div>
            <div class="carousel-status error" *ngIf="section.error()">{{ section.error() }}</div>
          </div>

          <div class="carousel-wrapper">
            <button class="nav-btn nav-left" type="button" (click)="scrollCarousel(section.key, -1)" aria-label="Scroll left">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>
            </button>

            <div class="carousel-container" [attr.data-carousel]="section.key">
              <app-movie-card
                *ngFor="let m of section.items()"
                [movie]="m"
                (played)="playTrailer(m)"
                (watchlistAdd)="addToWatchlist(m.id)">
              </app-movie-card>

              <div class="skeleton" *ngIf="section.loading() && section.items().length === 0">
                <div class="skeleton-card" *ngFor="let _ of skeletonItems"></div>
              </div>
            </div>

            <button class="nav-btn nav-right" type="button" (click)="scrollCarousel(section.key, 1)" aria-label="Scroll right">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
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
  styles: [
    `
      :host {
        display: block;
      }
      .page-container {
        background-color: var(--background-color);
        color: var(--text-color);
      }

      /* Ensure fixed header doesn't cover the page content */
      .content {
        padding-top: 72px;
      }

      .main-header {
        display: flex;
        align-items: center;
        padding: 1rem 3rem;
        background-color: transparent;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        transition: background-color 0.3s;
      }
      .main-header.scrolled {
        background-color: var(--header-background);
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
      .user-actions {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }
      .search-icon svg {
        stroke: var(--text-color);
      }
      .logout-button {
        background: var(--primary-color);
        color: var(--text-color);
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
      }
      .hero-section {
        position: relative;
        height: 80vh;
        display: flex;
        align-items: flex-end;
        padding: 4rem;
      }
      .hero-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 1;
        opacity: 0.4;
        mask-image: linear-gradient(to top, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%);
      }
      .hero-content {
        position: relative;
        z-index: 2;
        max-width: 50%;
      }
      .hero-title {
        font-size: 3.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
      }
      .hero-plot {
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 2rem;
        color: var(--text-color-secondary);
      }
      .hero-actions {
        display: flex;
        gap: 1rem;
      }
      .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.8rem 2rem;
        border-radius: 4px;
        font-weight: 700;
        font-size: 1.1rem;
        border: none;
        cursor: pointer;
      }
      .btn-primary {
        background-color: var(--text-color);
        color: var(--background-color);
      }
      .btn-secondary {
        background-color: rgba(109, 109, 110, 0.7);
        color: var(--text-color);
      }
      .movie-carousel {
        /* Smaller cards on Home */
        --card-w: 150px;
        --card-h: 225px;

        padding: 2rem 0;
        position: relative;
        z-index: 10;
      }

      /* Scope carousel title padding to the carousel header only */
      .carousel-header h3 {
        font-size: 1.6rem;
        margin-bottom: 1rem;
        padding: 0 3rem;
      }

      .carousel-wrapper {
        position: relative;
      }

      .carousel-container {
        display: flex;
        gap: 0.75rem;
        padding: 0 3rem 1rem;
        overflow-x: auto;
        overflow-y: visible;
        scroll-behavior: smooth;
        scrollbar-width: none; /* Firefox */
        scroll-padding-left: 3rem;
        scroll-padding-right: 3rem;
      }
      .carousel-container::-webkit-scrollbar {
        display: none;
      }

      /* Skeleton placeholders match the smaller card size */
      .skeleton {
        display: flex;
        gap: 0.75rem;
        padding-bottom: 1rem;
      }
      .skeleton-card {
        flex: 0 0 var(--card-w);
        height: var(--card-h);
        border-radius: 4px;
        background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 37%, rgba(255,255,255,0.06) 63%);
        background-size: 400% 100%;
        animation: shimmer 1.2s ease-in-out infinite;
      }

      @media (max-width: 640px) {
        .movie-carousel {
          --card-w: 120px;
          --card-h: 180px;
        }
        .carousel-header h3 {
          padding: 0 1rem;
          font-size: 1.25rem;
        }
        .carousel-container {
          padding: 0 1rem 0.75rem;
          gap: 0.5rem;
          scroll-padding-left: 1rem;
          scroll-padding-right: 1rem;
        }
        .nav-btn {
          width: 38px;
          height: 38px;
        }
        .nav-left { left: 0.35rem; }
        .nav-right { right: 0.35rem; }
      }

      /* Keep existing styles below (nav buttons etc.) */
      .nav-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 44px;
        height: 44px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.25);
        background: rgba(0,0,0,0.65);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 30;
        opacity: 0;
        transition: opacity 0.2s ease;
      }
      .carousel-wrapper:hover .nav-btn {
        opacity: 1;
      }
      .nav-left { left: 1rem; }
      .nav-right { right: 1rem; }

      @keyframes shimmer {
        0% { background-position: 100% 0; }
        100% { background-position: -100% 0; }
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
    `
  ]
})
export class HomeComponent implements OnDestroy {
  private readonly movieService = inject(MovieService);
  private readonly auth = inject(AuthService);
  private readonly watchlistService = inject(WatchlistService);
  private readonly toastService = inject(ToastService);

  featuredMovie = signal<Movie | null>(null);
  isScrolled = signal(false);

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
  currentTrailerUrl = signal<string | null>(null);
  currentTrailerTitle = signal<string>('');

  constructor() {
    this.loadAllSections();
    window.addEventListener('scroll', this.onWindowScroll, true);
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
        const withTrailers = items.filter(m => m.trailerUrl && m.trailerUrl.trim()).length;
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

  scrollCarousel(key: BrowseSectionKey, direction: -1 | 1) {
    const container = document.querySelector(`[data-carousel="${key}"]`) as HTMLElement | null;
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
        this.toastService.show('Added to your watchlist!', 'success');
      },
      error: err => {
        this.toastService.show(err?.error?.message || 'Failed to add to watchlist.', 'error');
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
    this.currentTrailerUrl.set(null);
    this.currentTrailerTitle.set('');
  }

  logout() {
    this.auth.logout();
  }
}
