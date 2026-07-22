import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';

/**
 * Adds `Authorization: Bearer <token>` to all API calls (except auth endpoints).
 * Your backend endpoints use `[Authorize]`, so dashboards must be authenticated.
 */
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const token = localStorage.getItem('travella.jwt');

  const isPublicAuth =
    req.url.includes('/api/auth/login') ||
    req.url.includes('/api/auth/register');

  if (!token || isPublicAuth) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  );
};

