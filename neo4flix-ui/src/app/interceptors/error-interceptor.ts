import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Unauthorized - logout and redirect to login
        authService.logout();
      } else if (error.status === 403) {
        // Forbidden - keep the user on the same route; show a clear error.
        // No logging to console to avoid leaking request info
      }

      const errorMessage = error.error?.message || error.message || 'An error occurred';
      // Removed console logging for security/privacy
      return throwError(() => error);
    })
  );
};
