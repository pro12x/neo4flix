import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    // Not logged in, allow access to guest pages
    return true;
  }

  // Already logged in, redirect to browse page
  router.navigate(['/browse']);
  return false;
};
