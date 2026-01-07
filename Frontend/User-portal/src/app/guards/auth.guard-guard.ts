import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {

    const token = localStorage.getItem('access_token');
    const expiry = localStorage.getItem('token_expiry');

    // ✅ Token missing OR expiry missing OR expired
    if (!token || !expiry || Date.now() > Number(expiry) * 1000) {
      console.warn('⛔ Session expired or token missing');
      this.auth.logout();
      this.router.navigate(['/login']);
      return false;
    }

    // ✅ Extra safety (kept your feature)
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
