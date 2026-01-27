import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MovieRecommendation } from '../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class RecommendationService {
  private readonly API_URL = `${environment.apiBaseUrl}/api/v1/recommendations`;

  constructor(private http: HttpClient) {}

  forUser(userId: string, limit = 10): Observable<MovieRecommendation[]> {
    const params = new HttpParams().set('limit', String(limit));
    return this.http.get<MovieRecommendation[]>(`${this.API_URL}/user/${encodeURIComponent(userId)}`, { params });
  }

  trending(userId: string, limit = 10): Observable<MovieRecommendation[]> {
    const params = new HttpParams().set('limit', String(limit));
    return this.http.get<MovieRecommendation[]>(`${this.API_URL}/user/${encodeURIComponent(userId)}/trending`, { params });
  }

  collaborative(userId: string, limit = 10): Observable<MovieRecommendation[]> {
    const params = new HttpParams().set('limit', String(limit));
    return this.http.get<MovieRecommendation[]>(`${this.API_URL}/user/${encodeURIComponent(userId)}/collaborative`, { params });
  }

  contentBased(userId: string, limit = 10): Observable<MovieRecommendation[]> {
    const params = new HttpParams().set('limit', String(limit));
    return this.http.get<MovieRecommendation[]>(`${this.API_URL}/user/${encodeURIComponent(userId)}/content-based`, { params });
  }

  byGenre(userId: string, genre: string, limit = 10): Observable<MovieRecommendation[]> {
    const params = new HttpParams().set('limit', String(limit));
    return this.http.get<MovieRecommendation[]>(`${this.API_URL}/user/${encodeURIComponent(userId)}/genre/${encodeURIComponent(genre)}`, { params });
  }

  similar(movieId: string, limit = 5): Observable<MovieRecommendation[]> {
    const params = new HttpParams().set('limit', String(limit));
    return this.http.get<MovieRecommendation[]>(`${this.API_URL}/movie/${encodeURIComponent(movieId)}/similar`, { params });
  }

  getRecommendations(userId: string, mode: 'mixed' | 'trending' | 'collaborative' | 'content', limit = 20): Observable<MovieRecommendation[]> {
    switch (mode) {
      case 'trending':
        return this.trending(userId, limit);
      case 'collaborative':
        return this.collaborative(userId, limit);
      case 'content':
        return this.contentBased(userId, limit);
      case 'mixed':
      default:
        return this.forUser(userId, limit);
    }
  }
}
