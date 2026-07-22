import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = (route.data['roles'] as UserRole[] | undefined) ?? [];
  const currentRole = authService.userRole();

  if (!authService.isLoggedIn() || !currentRole) {
    router.navigate(['/login']);
    return false;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
    router.navigate([authService.getRedirectUrl(currentRole)]);
    return false;
  }

  return true;
};
