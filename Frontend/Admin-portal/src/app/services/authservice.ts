import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Authservice {

  private API_URL = environment.apiUrl;

  // ✅ timer MUST be a class property (NOT constructor param)
  private logoutTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /* ================= LOGIN ================= */

  login(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/login`, data).pipe(
      tap((res: any) => {
        console.log('LOGIN RESPONSE:', res);

        // ⚠️ keep naming consistent
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('role', res.user.role);
        localStorage.setItem('userId', res.user.id);

        // ✅ decode JWT expiry
        const payload = JSON.parse(atob(res.access_token.split('.')[1]));
        localStorage.setItem('token_expiry', payload.exp.toString());

        // ✅ start expiry timer
        this.startSessionTimer();
      })
    );
  }

  /* ================= SESSION EXPIRY ================= */

  startSessionTimer() {
    const expiry = localStorage.getItem('token_expiry');
    if (!expiry) return;

    const expiresAt = Number(expiry) * 1000;
    const timeout = expiresAt - Date.now();

    if (timeout <= 0) {
      this.logout();
      return;
    }

    this.logoutTimer = setTimeout(() => {
      alert('Session expired. Please login again.');
      this.logout();
    }, timeout);
  }

  isTokenExpired(): boolean {
    const expiry = localStorage.getItem('token_expiry');
    if (!expiry) return true;
    return Date.now() > Number(expiry) * 1000;
  }

  /* ================= LOGOUT ================= */

  logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
  localStorage.removeItem('token_expiry');

  if (this.logoutTimer) {
    clearTimeout(this.logoutTimer);
  }

  this.router.navigate(['/login']);
}


  /* ================= HELPERS ================= */

  isLoggedIn(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'admin';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
