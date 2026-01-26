import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/auth.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = `${environment.apiBaseUrl}/api/v1/auth`;
  private readonly TOKEN_KEY = 'neo4flix_token';
  private readonly REFRESH_TOKEN_KEY = 'neo4flix_refresh_token';
  private readonly USER_KEY = 'neo4flix_user';

  private readonly currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
    const storedUser = localStorage.getItem(this.USER_KEY);
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  /**
   * Get current user value
   */
  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Register new user
   */
  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, request).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  /**
   * Login user (2FA-aware). Backend may return either AuthResponse or {2fa_required: true, email: string}
   */
  login(request: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, request).pipe(
      tap((response) => {
        console.log('[AuthService] login response:', response);
        // If backend returned tokens directly (no 2FA), store them
        if (response && response.accessToken) {
          this.handleAuthResponse(response as AuthResponse);
        }
      })
    );
  }

  /**
   * 2FA: request setup (secret + otpauth uri)
   */
  setupTwoFactor(email: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/2fa/setup`, { email });
  }

  /**
   * 2FA: enable (verify initial code) - returns {enabled:true}
   */
  enableTwoFactor(email: string, code: number): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/2fa/enable`, { email, code });
  }

  /**
   * 2FA: verify during login - returns AuthResponse on success
   */
  verifyTwoFactor(email: string, code: number): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/verify-2fa`, { email, code }).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  /**
   * Disable 2FA for user
   */
  disableTwoFactor(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/2fa/disable`, { email });
  }

  /**
   * Logout user
   */
  logout(): void {
    // Clear local storage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    // Update current user
    this.currentUserSubject.next(null);

    // Navigate to login
    this.router.navigate(['/login']);
  }

  /**
   * Refresh access token
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<AuthResponse>(`${this.API_URL}/refresh`, { refreshToken }).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  /**
   * Get access token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Handle authentication response
   */
  private handleAuthResponse(response: AuthResponse): void {
    console.log('[AuthService] Handling auth response:', response);

    // Store tokens
    localStorage.setItem(this.TOKEN_KEY, response.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);

    console.log('[AuthService] Token stored:', response.accessToken?.substring(0, 20) + '...');
    console.log('[AuthService] Token from localStorage:', localStorage.getItem(this.TOKEN_KEY)?.substring(0, 20) + '...');

    // Store user
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));

    // Update current user
    this.currentUserSubject.next(response.user);
  }
}
