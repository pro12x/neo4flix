import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log('[JWT Interceptor] URL:', req.url);
  console.log('[JWT Interceptor] Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');

  // Add authorization header with JWT token if available
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('[JWT Interceptor] Authorization header added');
  } else {
    console.warn('[JWT Interceptor] No token found in localStorage');
  }

  return next(req);
};
