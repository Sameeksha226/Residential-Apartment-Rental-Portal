import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Authservice } from '../services/authservice';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('🚀 INTERCEPTOR HIT:', req.url);

  const auth = inject(Authservice);
  const token = auth.getToken();

  console.log('🔑 TOKEN IN INTERCEPTOR:', token);

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

  return next(req);
};
