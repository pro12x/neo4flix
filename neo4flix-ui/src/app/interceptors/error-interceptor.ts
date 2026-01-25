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
        // Redirecting here hides the root cause and creates confusing UX loops.
        console.warn('Forbidden (403) for request:', req.url);
      }

      const errorMessage = error.error?.message || error.message || 'An error occurred';
      console.error('HTTP Error:', errorMessage);
      return throwError(() => error);
    })
  );
};
