import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Movie } from '../models/movie.model';

export interface PagedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly API_URL = `${environment.apiBaseUrl}/api/v1/movies`;

  constructor(private http: HttpClient) {}

  getById(id: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.API_URL}/${encodeURIComponent(id)}`);
  }

  latest(limit = 10): Observable<Movie[]> {
    const params = new HttpParams().set('limit', String(limit));
    return this.http.get<Movie[]>(`${this.API_URL}/latest`, { params });
  }

  getTopRated(minRating = 7.5, limit = 12): Observable<Movie[]> {
    const params = new HttpParams()
      .set('minRating', String(minRating))
      .set('limit', String(limit));
    return this.http.get<Movie[]>(`${this.API_URL}/top-rated`, { params });
  }

  searchPaged(paramsIn: { title?: string; genre?: string; minRating?: number; sort?: 'rating' | 'date'; page?: number; size?: number }): Observable<PagedResponse<Movie>> {
    let params = new HttpParams();
    if (paramsIn.title) params = params.set('title', paramsIn.title);
    if (paramsIn.genre) params = params.set('genre', paramsIn.genre);
    if (paramsIn.minRating !== undefined && paramsIn.minRating !== null) {
      params = params.set('minRating', String(paramsIn.minRating));
    }
    if (paramsIn.sort) params = params.set('sort', paramsIn.sort);
    if (paramsIn.page !== undefined && paramsIn.page !== null) params = params.set('page', String(paramsIn.page));
    if (paramsIn.size !== undefined && paramsIn.size !== null) params = params.set('size', String(paramsIn.size));

    return this.http.get<PagedResponse<Movie>>(`${this.API_URL}/search-paged`, { params });
  }
}
