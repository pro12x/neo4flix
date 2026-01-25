import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WatchlistMovie {
  movieId: string;
  title: string;
  genres?: string[];
  poster?: string;
  averageRating?: number;
  addedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class WatchlistService {
  private readonly API_URL = `${environment.apiBaseUrl}/api/v1/users`;

  constructor(private http: HttpClient) {}

  list(userId: string): Observable<WatchlistMovie[]> {
    return this.http.get<WatchlistMovie[]>(`${this.API_URL}/${encodeURIComponent(userId)}/watchlist`);
  }

  add(userId: string, movieId: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/${encodeURIComponent(userId)}/watchlist/${encodeURIComponent(movieId)}`, {});
  }

  remove(userId: string, movieId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${encodeURIComponent(userId)}/watchlist/${encodeURIComponent(movieId)}`);
  }

  isInWatchlist(userId: string, movieId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/${encodeURIComponent(userId)}/watchlist/${encodeURIComponent(movieId)}`);
  }
}
