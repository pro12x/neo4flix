import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Rating } from '../models/movie.model';

export interface CreateRatingRequest {
  userId: string;
  movieId: string;
  rating: number;
  review?: string;
}

export interface UpdateRatingRequest {
  rating: number;
  review?: string;
}

export interface MovieAverageRatingResponse {
  movieId: string;
  averageRating: number | null;
  ratingCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  private readonly API_URL = `${environment.apiBaseUrl}/api/v1/ratings`;

  constructor(private http: HttpClient) {}

  create(request: CreateRatingRequest): Observable<Rating> {
    return this.http.post<Rating>(this.API_URL, request);
  }

  getUserRatings(userId: string): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.API_URL}/user/${encodeURIComponent(userId)}`);
  }

  getMovieAverage(movieId: string): Observable<number | null> {
    return this.http
      .get<MovieAverageRatingResponse>(`${this.API_URL}/movie/${encodeURIComponent(movieId)}/average`)
      .pipe(
        map((res) => {
          const v = res?.averageRating;
          return typeof v === 'number' && Number.isFinite(v) ? v : null;
        })
      );
  }

  update(userId: string, movieId: string, request: UpdateRatingRequest): Observable<Rating> {
    return this.http.put<Rating>(
      `${this.API_URL}/user/${encodeURIComponent(userId)}/movie/${encodeURIComponent(movieId)}`,
      request
    );
  }

  remove(userId: string, movieId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/user/${encodeURIComponent(userId)}/movie/${encodeURIComponent(movieId)}`);
  }
}
