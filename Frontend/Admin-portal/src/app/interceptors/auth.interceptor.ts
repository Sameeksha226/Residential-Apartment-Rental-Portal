import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Authservice } from '../services/authservice';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  console.log('🚀 INTERCEPTOR HIT:', req.url);

  const auth = inject(Authservice);
  const router = inject(Router);

  const token = auth.getToken();

  console.log('🔑 TOKEN IN INTERCEPTOR:', token);

  // ✅ CHECK EXPIRY BEFORE SENDING REQUEST
  if (token && auth.isTokenExpired()) {
    console.warn('⏰ TOKEN EXPIRED — LOGGING OUT');
    auth.logout();
    router.navigate(['/login']);
    return throwError(() => new Error('Session expired'));
  }

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ AUTH HEADER ADDED');
  } else {
    console.log('❌ NO TOKEN — HEADER NOT ADDED');
  }

  return next(req).pipe(
    catchError(err => {
      if (err.status === 401 && auth.getToken()) {
  console.error('🚨 401 UNAUTHORIZED — AUTO LOGOUT');
  auth.logout();
}

      return throwError(() => err);
    })
  );
};
