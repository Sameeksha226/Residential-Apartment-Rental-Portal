import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Authservice {
  private API_URL = environment.apiUrl

  constructor(private http: HttpClient, private router: Router) {}

  login(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/login`, data).pipe(
      tap((res: any) => {
        console.log('LOGIN RESPONSE:', res);  // 👈 ADD THIS
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('role', res.user.role);
        localStorage.setItem('userId', res.user.id);
        console.log('TOKEN SAVED:', localStorage.getItem('token'));
      })
    );
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'admin';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
