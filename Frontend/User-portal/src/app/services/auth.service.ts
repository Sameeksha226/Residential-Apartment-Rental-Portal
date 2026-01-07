import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API = environment.apiUrl + '/auth';

  // ✅ TIMER IS A CLASS PROPERTY
  private logoutTimer: any = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /* =======================
     REGISTER
  ======================= */
  register(data: any): Observable<any> {
    return this.http.post(`${this.API}/register`, data);
  }

  /* =======================
     LOGIN
  ======================= */
  login(data: { email: string; password: string }) {
    return this.http.post<any>(`${this.API}/login`, data).pipe(
      tap(res => {
        // ✅ STORE TOKEN & USER
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('user', JSON.stringify(res.user));

        // ✅ DECODE JWT EXPIRY
        const payload = JSON.parse(atob(res.access_token.split('.')[1]));
        localStorage.setItem('token_expiry', payload.exp.toString());

        // ✅ START SESSION TIMER
        this.startSessionTimer();
      })
    );
  }

  /* =======================
     SESSION HANDLING
  ======================= */
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

  /* =======================
     LOGOUT
  ======================= */
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('token_expiry');

    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }

    this.router.navigate(['/login']);
  }

  /* =======================
     HELPERS
  ======================= */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }
}
