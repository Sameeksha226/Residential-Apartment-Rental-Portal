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
  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.API}/login`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  /* =======================
     LOGOUT
  ======================= */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  /* =======================
     AUTH HELPERS
  ======================= */

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
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
