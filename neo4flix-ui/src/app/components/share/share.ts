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
    <div class="share-container">
      <div class="share-backdrop">
        <img [src]="movie()?.poster" alt="Movie backdrop" class="backdrop-img" *ngIf="movie()?.poster">
      </div>
      <div class="share-content">
        <div class="share-header">
          <a routerLink="/" class="back-link">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Neo4Flix
          </a>
        </div>

        <div class="movie-showcase" *ngIf="movie() as m">
          <div class="movie-poster-large">
            <img [src]="m.poster" [alt]="m.title" class="poster-img">
          </div>
          <div class="movie-details">
            <div class="movie-meta">
              <h1 class="movie-title">{{ m.title }}</h1>
              <div class="movie-info">
                <span class="year">{{ getYear(m.releaseDate) }}</span>
                <span class="separator">•</span>
                <span class="genres" *ngIf="m.genres.length">{{ m.genres.join(', ') }}</span>
                <span class="separator">•</span>
                <span class="rating" *ngIf="m.averageRating !== undefined">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                  {{ m.averageRating.toFixed(1) }}
                </span>
              </div>
            </div>
            <div class="movie-plot">
              <p>{{ m.plot }}</p>
            </div>
            <div class="share-actions">
              <a class="btn-primary" [routerLink]="['/movies', m.id]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Watch on Neo4Flix
              </a>
              <button class="btn-share" (click)="shareMovie()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                  <polyline points="16,6 12,2 8,6"/>
                  <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
                Share Movie
              </button>
            </div>
          </div>
        </div>

        <div class="share-footer">
          <p>Shared from Neo4Flix - Your ultimate movie streaming platform</p>
          <div class="social-links">
            <a href="#" class="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" class="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
              </svg>
            </a>
            <a href="#" class="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-4.4869 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div class="loading-state" *ngIf="loading()">
        <div class="spinner"></div>
        <p>Loading shared movie...</p>
      </div>

      <div class="error-state" *ngIf="error()">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        <h2>Shared movie not found</h2>
        <p>{{ error() }}</p>
        <a routerLink="/" class="btn-primary">Go to Neo4Flix</a>
      </div>
    </div>
  `,
  styles: [
    `
      .share-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #141414 0%, #1a1a1a 100%);
        color: white;
        position: relative;
        overflow: hidden;
      }
      .share-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        overflow: hidden;
      }
      .backdrop-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.3;
        filter: blur(2px);
      }
      .share-content {
        position: relative;
        z-index: 2;
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }
      .share-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
      }
      .back-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        color: #fff;
        font-weight: 500;
        transition: color 0.3s;
      }
      .back-link:hover {
        color: #e50914;
      }
      .movie-showcase {
        display: flex;
        gap: 3rem;
        align-items: flex-start;
        margin: 3rem 0;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 16px;
        padding: 2rem;
        backdrop-filter: blur(10px);
      }
      .movie-poster-large {
        flex: 0 0 280px;
        position: relative;
      }
      .poster-img {
        width: 100%;
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        transition: transform 0.3s ease;
      }
      .poster-img:hover {
        transform: scale(1.05);
      }
      .movie-details {
        flex: 1;
      }
      .movie-meta {
        margin-bottom: 1.5rem;
      }
      .movie-title {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0 0 1rem 0;
        color: #fff;
        line-height: 1.2;
      }
      .movie-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }
      .year, .genres, .rating {
        font-size: 1rem;
        color: #ccc;
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
      .separator {
        color: #666;
        font-weight: bold;
      }
      .rating svg {
        fill: #ffd700;
        stroke: #ffd700;
      }
      .movie-plot {
        margin: 1.5rem 0;
        line-height: 1.6;
        color: #ddd;
        font-size: 1.1rem;
        max-width: 70ch;
      }
      .share-actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
      }
      .btn-primary, .btn-share {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.875rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        font-size: 1rem;
        text-decoration: none;
        transition: all 0.3s ease;
        cursor: pointer;
        border: none;
      }
      .btn-primary {
        background: #e50914;
        color: #fff;
      }
      .btn-primary:hover {
        background: #f40612;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(229, 9, 20, 0.3);
      }
      .btn-share {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
      .btn-share:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.5);
        transform: translateY(-2px);
      }
      .share-footer {
        margin-top: 3rem;
        padding: 2rem 0;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        text-align: center;
      }
      .share-footer p {
        color: #aaa;
        margin-bottom: 1rem;
        font-size: 0.9rem;
      }
      .social-links {
        display: flex;
        justify-content: center;
        gap: 1rem;
      }
      .social-link {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        text-decoration: none;
        transition: all 0.3s ease;
      }
      .social-link:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
      }
      .loading-state, .error-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 60vh;
        text-align: center;
        padding: 2rem;
      }
      .loading-state .spinner {
        width: 48px;
        height: 48px;
        border: 4px solid rgba(255, 255, 255, 0.1);
        border-top: 4px solid #e50914;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
      }
      .error-state svg {
        color: #e50914;
        margin-bottom: 1rem;
      }
      .error-state h2 {
        color: #fff;
        margin-bottom: 0.5rem;
      }
      .error-state p {
        color: #ccc;
        margin-bottom: 2rem;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @media (max-width: 768px) {
        .share-content {
          padding: 1rem;
        }
        .share-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }
        .movie-showcase {
          flex-direction: column;
          gap: 2rem;
          padding: 1.5rem;
          margin: 2rem 0;
        }
        .movie-poster-large {
          flex: none;
          align-self: center;
          max-width: 250px;
        }
        .movie-title {
          font-size: 2rem;
          text-align: center;
        }
        .movie-info {
          justify-content: center;
          gap: 0.75rem;
        }
        .movie-plot {
          text-align: center;
          max-width: none;
          font-size: 1rem;
        }
        .share-actions {
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }
        .btn-primary, .btn-share {
          width: 100%;
          justify-content: center;
        }
        .social-links {
          gap: 0.75rem;
        }
        .social-link {
          width: 44px;
          height: 44px;
        }
      }

      @media (max-width: 480px) {
        .movie-title {
          font-size: 1.75rem;
        }
        .movie-info {
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
        }
        .separator {
          display: none;
        }
        .share-footer {
          margin-top: 2rem;
          padding: 1.5rem 0;
        }
      }
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

  getYear(releaseDate: string | Date): number {
    if (!releaseDate) return 0;
    const date = typeof releaseDate === 'string' ? new Date(releaseDate) : releaseDate;
    if (Number.isNaN(date.getTime())) return 0;
    return date.getFullYear();
  }

  shareMovie() {
    const movie = this.movie();
    if (!movie) return;

    const shareUrl = `${globalThis.location.origin}/share?movieId=${movie.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Shareable link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy link: ', err);
    });
  }
}
